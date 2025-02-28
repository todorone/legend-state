import type { ObservablePersistLocal } from '../observableInterfaces';

export class ObservablePersistLocalStorage implements ObservablePersistLocal {
    private data: Record<string, any> = {};

    public get(id: string) {
        if (typeof localStorage === 'undefined') return undefined;
        if (this.data[id] === undefined) {
            try {
                const value = localStorage.getItem(id);
                return value ? JSON.parse(value) : undefined;
            } catch {
                console.error('[legend-state]: ObservablePersistLocalStorage failed to parse', id);
            }
        }
        return this.data[id];
    }
    public async set(id: string, value: any) {
        this.data[id] = value;
        this.save(id);
    }
    public async delete(id: string) {
        delete this.data[id];
        localStorage.removeItem(id);
    }
    private save(id: string) {
        if (typeof localStorage === 'undefined') return;

        const v = this.data[id];

        if (v !== undefined && v !== null) {
            localStorage.setItem(id, JSON.stringify(v));
        } else {
            localStorage.removeItem(id);
        }
    }
}
