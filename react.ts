export * from './src/react/createObservableHook';
export * from './src/react/enableLegendStateReact';
export * from './src/react/flow';
export * from './src/react/reactive-observer';
export * from './src/react/useComputed';
export * from './src/react/useObservable';
export * from './src/react/useObservableReducer';
export * from './src/react/useObserve';
export * from './src/react/useSelector';

import type { ReactFragment } from 'react';
import { enableLegendStateReact } from './src/react/enableLegendStateReact';

enableLegendStateReact();

declare module '@legendapp/state' {
    export interface ObservableBaseFns<T> extends ReactFragment {}
}
