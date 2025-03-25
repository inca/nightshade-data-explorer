<template>
    <span class="DataExplorerValue">

        <template v-if="node.isError">
            <span class="ClassName">
                {{ value.name }}
            </span>
            <span class="Message">
                {{ node.ctl.abbreviateValue(value.message) }}
            </span>
        </template>

        <template v-else-if="node.isTypedArray">
            <span class="ClassName">
                {{ className }}
            </span>
            <span>
                {{ value.byteLength }} bytes
            </span>
        </template>

        <template v-else-if="isFileSystemHandle">
            <i
                v-if="value.kind === 'directory'"
                :class="iconFolder" />
            <i
                v-if="value.kind === 'file'"
                :class="iconFile" />
            <span>
                {{ value.name }}
            </span>
        </template>

        <template v-else-if="isCustomClass">
            <span class="ClassName">
                {{ className }}
            </span>
            <template v-if="hasCustomToString">
                {{ node.ctl.abbreviateValue(value.toString()) }}
            </template>
        </template>

        <template v-else-if="!isExpanded">
            <span class="Preview">
                {
                <span
                    v-for="v, k of valueEntries"
                    :key="k"
                    class="Item"
                    :title="String(v)">
                    {{ k }}: {{ node.ctl.abbreviateValue(v, 20) }}
                </span>
                }
            </span>
        </template>

        <template v-else>
            { {{ node.ownKeysCount }} key{{ node.ownKeysCount === 1 ? '' : 's' }} }
        </template>

    </span>
</template>

<script>
export default {

    props: {
        node: { required: true },
    },

    computed: {

        value() {
            return this.node.value;
        },

        isExpanded() {
            return this.node.isExpanded();
        },

        className() {
            return this.value.constructor.name ?? 'Object';
        },

        isCustomClass() {
            return this.className !== 'Object';
        },

        isFileSystemHandle() {
            // eslint-disable-next-line no-undef
            return this.value instanceof FileSystemHandle;
        },

        hasCustomToString() {
            return this.value.toString !== Object.prototype.toString;
        },

        valueEntries() {
            return this.node.getValueEntries(10);
        },

        iconFolder() {
            return this.icons?.folder ?? 'fas fa-folder';
        },

        iconFile() {
            return this.icons?.file ?? 'fas fa-file';
        },

    },

    methods: {},

};
</script>

<style scoped>
.DataExplorerValue {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.ClassName {
    font-weight: var(--font-weight-bold);
}

.Item + .Item::before {
    content: ', ';
}

.Message {
    overflow: hidden;
    text-overflow: ellipsis;
}

.Preview {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
