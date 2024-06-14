const { EventEmitter } = require("events");

const eventEmitter = new EventEmitter();

interface EventBus {
  on: (event: string, listener: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  off: (event: string) => void;
}

const eventBus: EventBus = {
  on(eventName: string, callback: Function) {
    eventEmitter.addListener(eventName, (data: any) => {
      callback(data);
    });
  },
  emit(eventName: string, data: any) {
    eventEmitter.emit(eventName, data);
  },

  off(eventName: string) {
    eventEmitter.removeListener(eventName);
  }

};

export default eventBus;