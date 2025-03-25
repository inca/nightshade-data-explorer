<template>
    <ContextPopup
        :anchorRef="anchorRef">
        <div class="Popup">
            <HGroup class="Controls">
                <Btn
                    size="small"
                    :label="wrapping ? 'Wrap: on' : 'Wrap: off'"
                    :kind="wrapping ? 'primary-text' : ''"
                    title="Toggle wrapping"
                    @click="wrapping = !wrapping" />
                <Btn
                    v-if="clipboardSupported"
                    size="small"
                    square
                    :icon="justCopied ? iconCheck : iconCopyClipboard"
                    title="Copy to clipboard"
                    @click.stop="copyToClipboard()" />
            </HGroup>
            <div
                class="FullValue"
                :class="{ 'Wrapping': wrapping }"
                v-text="popupText" />
        </div>
    </ContextPopup>
</template>

<script>
export default {

    props: {
        popupText: { required: true },
        anchorRef: { required: true }
    },

    data() {
        return {
            wrapping: true,
            justCopied: false,
            clipboardSupported: !!navigator.clipboard,
        };
    },

    computed: {

        iconCheck() {
            return this.icons?.check ?? 'fas fa-check';
        },

        iconCopyClipboard() {
            return this.icons?.copyClipboard ?? 'fas fa-clipboard';
        },

    },

    methods: {
        copyToClipboard() {
            if (!this.clipboardSupported) {
                return;
            }
            const value = this.popupText;
            navigator.clipboard.writeText(value)
                .then(() => {
                    this.justCopied = true;
                    setTimeout(() => {
                        this.justCopied = false;
                    }, 500);
                });
        },

    }

};
</script>

<style scoped>
.Popup {
    display: flex;
    flex-flow: column nowrap;
    gap: var(--sp);
    padding: var(--sp);
    min-width: 320px;
    max-width: 50vw;
    min-height: 200px;
    max-height: 50vh;
}

.Controls {
    align-self: flex-end;
}

.FullValue {
    flex: 1;
    overflow: auto;
    background: var(--color-base-1);
    padding: var(--sp);
    font: 12px/1.25 var(--font-monospace);
    white-space: pre;
}

.FullValue.Wrapping {
    white-space: pre-wrap;
}
</style>

<style>
.DataExplorerNode .Line:hover .ShowBtn {
    opacity: .75;
}
</style>
