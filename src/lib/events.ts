type Callback = () => void

export enum EventType {
    "newComment"
}

class Events {
    handlers: {[K: string]: Callback[] }
    constructor() {
        this.handlers = {}
    }
    fire(key: EventType) {
        if (!this.handlers[key]) return;

        for (let h of this.handlers[key]) {
            h();
        }
    }
    listen(key: EventType, handler: Callback) {
        if (!this.handlers[key]) this.handlers[key] = [];

        this.handlers[key].push(handler)
    }
}

export const BUS = new Events();
