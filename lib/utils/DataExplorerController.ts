import escapeHtml from 'escape-html';

import { DataType, getType, removeUndefined } from './data.js';

const TypedArray = Object.getPrototypeOf(Uint8Array);

export class DataExplorerController {

    root!: DataExplorerNode;
    expandedPaths = new Set<string>();

    constructor(
        value: any
    ) {
        this.setRoot(value);
    }

    setRoot(value: any) {
        this.root = new DataExplorerNode(this, null, value, '');
    }

    abbreviateValue(value: any, length = 100) {
        switch (getType(value)) {
            case 'object':
                return `{…}`;
            case 'array':
                return `[…]`;
            case 'string': {
                return abbreviate(value, length);
            }
            case 'null':
            default:
                return String(value);
        }
    }

}

export class DataExplorerNode {

    path: string[];
    strPath: string;
    isRoot: boolean;
    type: DataType;

    constructor(
        readonly ctl: DataExplorerController,
        readonly parent: DataExplorerNode | null,
        readonly value: any,
        readonly key: string,
    ) {
        this.path = parent ? [...parent.path, key] : [];
        this.strPath = this.path.join('/');
        this.isRoot = this.parent == null;
        this.type = getType(value);
    }

    get isError() {
        return this.value instanceof Error;
    }

    get isTypedArray() {
        return this.value instanceof TypedArray;
    }

    get hasEntries() {
        return ['object', 'array'].includes(this.type) && !this.isTypedArray;
    }

    get ownKeysCount() {
        return Object.keys(this.value ?? {}).length;
    }

    get canExpand() {
        return this.hasEntries && this.ownKeysCount > 0;
    }

    isExpanded() {
        return this.canExpand && this.ctl.expandedPaths.has(this.strPath);
    }

    toggleExpanded() {
        if (this.ctl.expandedPaths.has(this.strPath)) {
            this.ctl.expandedPaths.delete(this.strPath);
        } else {
            this.ctl.expandedPaths.add(this.strPath);
        }
    }

    getValueEntries(limit = 100) {
        if (!this.hasEntries) {
            return {};
        }
        if (this.isError) {
            return removeUndefined({
                name: this.value.name,
                status: this.value.status,
                code: this.value.code,
                message: this.value.message,
                details: this.value.details,
                cause: this.value.cause,
            });
        }
        if (this.type === 'array') {
            return this.value.slice(0, limit);
        }
        return this.value;
    }

    isImageData() {
        return this.value instanceof ImageData;
    }

    openPopup() {
        const value = ['object', 'array'].includes(this.type) ?
            JSON.stringify(this.value, null, 2) :
            this.value;
        const tab = window.open('about:blank', '_blank', 'popup=true,height=480');
        tab?.document.write(`<div style="white-space: pre; font-family: monospace">${escapeHtml(value)}</div>`);
        tab?.document.close();
    }

}

function abbreviate(str: string, maxLength = 100) {
    if (str.length <= maxLength) {
        return str;
    }
    return str.substring(0, maxLength - 1) + '…';
}
