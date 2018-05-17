import { EventEmitter } from 'events';
const emitter = new EventEmitter();

const events = {
    subscribe: (type, fn) => emitter.on(type, fn),
    unsubscribe: (type, fn) => emitter.removeListener(type, fn),
    fire: (type, data) => emitter.emit(type, data)
};

export default events;