<template>
    <span class="DataExplorerValue">

        <template v-if="!node.isExpanded()">
            <span class="Size">
                {{ node.ownKeysCount }}
            </span>
            <span class="Preview">
                [
                <span
                    v-for="v, i of slice"
                    :key="i"
                    class="Item"
                    :title="String(v)">
                    {{ node.ctl.abbreviateValue(v, 20) }}
                </span>
                <span
                    v-if="slice.length < node.ownKeysCount"
                    class="Item">
                    &hellip;
                </span>
                ]
            </span>
        </template>

        <template v-else>
            [{{ node.ownKeysCount }} item{{ node.ownKeysCount === 1 ? '' : 's' }}]
        </template>

    </span>
</template>

<script>

export default {

    props: {
        node: { required: true },
    },

    computed: {

        slice() {
            return this.node.value.slice(0, 10);
        },

    }

};
</script>

<style scoped>
.DataExplorerValue {
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.Size {
    display: inline-block;
    padding: 0 4px;
    background: var(--color-text-3);
    color: var(--color-base-0);
    border-radius: 2px;
}

.Item + .Item::before {
    content: ', ';
}

.Preview {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
