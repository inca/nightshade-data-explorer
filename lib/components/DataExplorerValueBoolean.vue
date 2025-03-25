<template>
    <span class="DataExplorerValue">
        {{ String(node.value) }}
    </span>
</template>

<script>
export default {

    props: {
        node: { required: true },
    },

};
</script>

<style scoped>
</style>
