<template>
    <div
        class="DataExplorer"
        @contextmenu.stop>
        <DataExplorerNode
            :node="ctl.root"
            @linemenu="$emit('linemenu', $event)">
            <template #controls="{ node }">
                <slot
                    name="controls"
                    :node="node" />
            </template>
        </DataExplorerNode>
    </div>
</template>

<script>
import { DataExplorerController } from '../utils/DataExplorerController.js';
import DataExplorerNode from './DataExplorerNode.vue';

export default {

    components: {
        DataExplorerNode
    },

    props: {
        value: {},
    },

    emits: [
        'linemenu',
    ],

    data() {
        return {
            ctl: new DataExplorerController(this.value),
        };
    },

    watch: {

        value(newValue) {
            this.ctl.setRoot(newValue);
        },

    },

};
</script>

<style scoped>
:root {

}
</style>

<style scoped>
.DataExplorer {
    font-family: var(--font-monospace);
    font-variant-ligatures: none;
    font-size: 12px;
}
</style>
