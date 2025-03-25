export type DataType = 'string' | 'boolean' | 'number' | 'object' | 'array' | 'any' | 'null';

export function getType(value: unknown): DataType {
    if (value == null) {
        return 'null';
    }
    if (Array.isArray(value)) {
        return 'array';
    }
    const type = typeof value;
    if (type === 'object' || type === 'number' || type === 'string' || type === 'boolean') {
        return type;
    }
    return 'any';
}

export function removeUndefined<T extends object>(obj: T): T {
    const keys = Object.keys(obj);
    for (const key of keys) {
        if ((obj as any)[key] === undefined) {
            delete (obj as any)[key];
        }
    }
    return obj;
}
