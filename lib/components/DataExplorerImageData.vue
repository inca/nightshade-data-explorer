<template>
    <div class="DataExplorerImageData">
        <canvas
            ref="canvas"
            :style="{
                'width': `${width}px`,
                'height': `${height}px`,
            }" />
    </div>
</template>

<script>
export default {

    props: {
        node: { required: true },
    },

    computed: {

        width() {
            return this.node.value.width * .5;
        },

        height() {
            return this.node.value.height * .5;
        },

    },

    watch: {
        'node.value': {
            handler(value) {
                this.drawImage(value);
            },
            immediate: true,
            flush: 'post',
        }
    },

    mounted() {
        this.drawImage(this.node.value);
    },

    methods: {

        drawImage(value) {
            const canvas = this.$refs.canvas;
            if (!canvas || !(value instanceof ImageData)) {
                return;
            }
            canvas.width = value.width;
            canvas.height = value.height;
            canvas.getContext('2d').putImageData(value, 0, 0);
        },

    }

};
</script>

<style scoped>
.DataExplorerImageData {
    display: flex;

}

canvas {
    flex: 1;
}
</style>
