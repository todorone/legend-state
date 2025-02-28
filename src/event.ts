import { symbolIsObservable } from './globals';
import { observable } from './observable';
import type { ObservableEvent } from './observableInterfaces';

export function event(): ObservableEvent {
    // observableEvent simply wraps around a number observable
    // which increments its value to dispatch change events
    const obs = observable(0);
    return {
        dispatch: function () {
            // Notify increments the value so that the observable changes
            obs.set((v) => v + 1);
        },
        on: function (cb) {
            return obs.onChange(cb);
        },
        get: () => obs.get(),
        // @ts-ignore
        [symbolIsObservable]: true,
    };
}
