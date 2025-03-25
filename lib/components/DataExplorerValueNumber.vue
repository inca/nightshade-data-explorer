<template>
    <span class="DataExplorerValue">
        <span
            v-if="looksLikeTimestamp && showTs"
            class="Timestamp"
            :title="isoDate">
            {{ isoDate }}
        </span>
        <span v-else>
            {{ String(node.value) }}
        </span>
        <i
            v-if="looksLikeTimestamp"
            class="TimestampBtn far fa-clock"
            :class="{
                'TimestampBtn-Active': showTs
            }"
            title="Display as timestamp"
            @click="showTs = !showTs" />
    </span>
</template>

<script>
const TEN_YEARS = 10 * 365 * 24 * 60 * 60 * 1000;

export default {

    props: {
        node: { required: true },
    },

    data() {
        return {
            showTs: false,
        };
    },

    computed: {

        looksLikeTimestamp() {
            const value = this.node.value ?? 0;
            const now = Date.now();
            return value > (now - TEN_YEARS) && value <= (now + TEN_YEARS);
        },

        isoDate() {
            return new Date(this.node.value).toISOString();
        },

    },

};
</script>

<style scoped>
.TimestampBtn {
    color: var(--color-text-2);
    cursor: pointer;
    margin-left: var(--sp0-5);
}

.TimestampBtn-Active {
    color: var(--color-primary);
}
</style>
