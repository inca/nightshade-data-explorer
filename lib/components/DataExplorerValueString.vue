<template>
    <div class="DataExplorerValue">
        <div class="Value">
            {{ node.ctl.abbreviateValue(node.value, maxLength) }}
        </div>
        <i
            ref="showBtn"
            class="ShowBtn"
            :class="iconShow"
            title="Show full value in popup"
            @click="popupShown = true" />
        <DataExplorerFullValuePopup
            v-if="popupShown"
            :popupText="node.value"
            anchorRef="showBtn"
            @hide="popupShown = false" />
    </div>
</template>

<script>
import DataExplorerFullValuePopup from './DataExplorerFullValuePopup.vue';

export default {

    components: {
        DataExplorerFullValuePopup
    },

    props: {
        node: { required: true },
    },

    data() {
        return {
            maxLength: 100,
            popupShown: false,
        };
    },

    computed: {

        iconShow() {
            return this.icons?.show ?? 'fas fa-eye';
        },

    }

};
</script>

<style scoped>
.ShowBtn {
    color: var(--color-text-0);
    cursor: pointer;
    margin-left: var(--sp);
    opacity: 0;
    font-size: 10px;
    z-index: 100;
}

.DataExplorerValue {
    display: flex;
    align-items: center;
}

.Value {
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>

<style>
.DataExplorerNode .Line:hover .ShowBtn {
    opacity: .75;
}
</style>
