<template>
    <div
        class="DataExplorerNode"
        :class="[
            `Type-${node.type}`,
        ]">

        <div
            class="Line"
            :class="{
                'Error': node.isError,
            }"
            @click="node.toggleExpanded()"
            @contextmenu.stop.prevent="onLineMenu()">

            <div
                v-if="!node.isRoot || node.canExpand"
                class="Expand">
                <template v-if="node.canExpand">
                    <i
                        v-if="!node.isExpanded()"
                        :class="iconCollapsed"
                        title="Show more" />
                    <i
                        v-if="node.isExpanded()"
                        :class="iconExpanded"
                        title="Show less" />
                </template>
            </div>

            <div
                v-if="!node.isRoot"
                class="Key"
                :class="{
                    'ArrayKey': node.parent?.type === 'array',
                }"
                :title="node.key">
                {{ node.key }}:&nbsp;
            </div>

            <component
                :is="valueComponent"
                class="Value"
                :node="node" />

            <div class="Controls">

                <div v-if="node.isError">
                    <i
                        ref="errorPopupToggle"
                        class="ErrorPopupToggle"
                        :class="iconShow"
                        title="Show full value in popup"
                        @click="popupShown = true"
                        @click.stop.prevent />
                    <DataExplorerFullValuePopup
                        v-if="popupShown"
                        :popupText="node.value.message"
                        anchorRef="errorPopupToggle"
                        @hide="popupShown = false" />
                </div>
                <Btn
                    v-if="clipboardSupported"
                    size="small"
                    square
                    :icon="justCopied ? iconCheck : iconCopyClipboard"
                    title="Copy to clipboard"
                    @click.stop="copyToClipboard()" />

                <slot
                    name="controls"
                    :node="node" />
            </div>
        </div>

        <div
            v-if="node.isExpanded()"
            class="Body">

            <DataExplorerImageData
                v-if="node.isImageData()"
                :node="node" />

            <template v-else>

                <div
                    class="Gutter"
                    :title="`Collapse ${node.key || node.type}`"
                    @click.stop="node.toggleExpanded()" />

                <DataExplorerNode
                    v-for="child, i of children"
                    :key="i"
                    :node="child">
                    <template #controls="{ node }">
                        <slot
                            name="controls"
                            :node="node" />
                    </template>
                </DataExplorerNode>

                <div
                    v-if="hasMore"
                    class="More"
                    @click="showMore()">
                    Show more
                </div>
            </template>

        </div>
    </div>
</template>

<script>
import { DataExplorerNode } from '../utils/DataExplorerController';
import DataExplorerFullValuePopup from './DataExplorerFullValuePopup.vue';
import DataExplorerImageData from './DataExplorerImageData.vue';
import DataExplorerValueArray from './DataExplorerValueArray.vue';
import DataExplorerValueBoolean from './DataExplorerValueBoolean.vue';
import DataExplorerValueNull from './DataExplorerValueNull.vue';
import DataExplorerValueNumber from './DataExplorerValueNumber.vue';
import DataExplorerValueObject from './DataExplorerValueObject.vue';
import DataExplorerValueString from './DataExplorerValueString.vue';

export default {

    name: 'DataExplorerNode',

    components: {
        DataExplorerImageData,
        DataExplorerValueArray,
        DataExplorerValueBoolean,
        DataExplorerValueNull,
        DataExplorerValueNumber,
        DataExplorerValueObject,
        DataExplorerValueString,
        DataExplorerFullValuePopup
    },

    props: {
        node: { required: true },
    },

    emits: [
        'linemenu',
    ],

    data() {
        return {
            justCopied: false,
            clipboardSupported: !!navigator.clipboard,
            popupShown: false,
            childrenLimit: 100,
        };
    },

    computed: {

        valueComponent() {
            return 'DataExplorerValue' + capitalize(this.node.type);
        },

        hasMore() {
            return (this.node.value?.length ?? 0) > this.childrenLimit;
        },

        children() {
            const { node } = this;
            const children = [];
            for (const [key, value] of Object.entries(node.getValueEntries(this.childrenLimit))) {
                const child = new DataExplorerNode(node.ctl, node, value, key);
                children.push(child);
            }
            return children;
        },

        iconCopyClipboard() {
            return this.icons?.copyClipboard ?? 'fas fa-clipboard';
        },

        iconCheck() {
            return this.icons?.check ?? 'fas fa-check';
        },

        iconExpanded() {
            return this.icons?.expanded ?? 'fas fa-angle-down';
        },

        iconCollapsed() {
            return this.icons?.collapsed ?? 'fas fa-angle-right';
        },

        iconShow() {
            return this.icons?.show ?? 'fas fa-eye';
        },

    },

    methods: {

        showMore() {
            this.childrenLimit += 100;
        },

        copyToClipboard() {
            if (!this.clipboardSupported) {
                return;
            }
            const value = this.node.value;
            const text = typeof value === 'string' ?
                value :
                JSON.stringify(value, null, 2) ?? String(value);
            navigator.clipboard.writeText(text)
                .then(() => {
                    this.justCopied = true;
                    setTimeout(() => {
                        this.justCopied = false;
                    }, 500);
                });
        },

        onLineMenu() {
            this.$emit('linemenu', {
                node: this.node,
            });
        },

    },

};

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
</script>

<style scoped>
.Line {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    padding: 0 var(--sp0-5);
    height: var(--sp3);
    border-radius: var(--border-radius);
    gap: var(--sp0-5);
    white-space: nowrap;

    line-height: var(--sp2);
    cursor: pointer;
}

.Line:hover {
    background-color: var(--color-base-2);
}

.Expand {
    flex: 0 0 var(--sp2);
    width: var(--sp2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
    color: var(--color-text-2);
}

.Key {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 80px;
    max-width: 160px;
}

.ArrayKey {
    min-width: 40px;
}

.Value {
    min-width: 0;
    color: var(--DataExplorer-value-color);
    overflow: hidden;
    text-overflow: ellipsis
}

.Type-number { --DataExplorer-value-color: var(--color-type-number-alt) }
.Type-string { --DataExplorer-value-color: var(--color-type-string-alt) }
.Type-boolean { --DataExplorer-value-color: var(--color-type-boolean-alt) }
.Type-object { --DataExplorer-value-color: var(--color-type-object-alt) }
.Type-array { --DataExplorer-value-color: var(--color-type-array-alt) }
.Type-any { --DataExplorer-value-color: var(--color-type-any-alt) }
.Type-null { --DataExplorer-value-color: var(--color-type-null-alt) }

.Error {
    --DataExplorer-value-color: var(--color-error)
}

.Body {
    position: relative;
    padding-left: var(--sp3);
}

.Gutter {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: var(--sp3);
    border-radius: 2px;
    cursor: n-resize;
}

.Gutter::after {
    content: '';
    position: absolute;
    z-index: 0;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    margin-left: -1px;
    border-radius: 4px;
    background-color: var(--color-base-2);
}

.Gutter:hover::after {
    background-color: var(--color-base-3);
}

.Controls {
    display: flex;
    align-items: center;
    opacity: 0;
}

.Line:hover .Controls {
    opacity: .75;
}

.ErrorPopupToggle {
    color: var(--color-text-0);
    cursor: pointer;
    margin-left: var(--sp);
    font-size: 10px;
    z-index: 100;
}

.More {
    color: var(--color-primary);
    padding-left: var(--sp3);
    cursor: pointer;
    line-height: var(--sp3);
}
</style>
