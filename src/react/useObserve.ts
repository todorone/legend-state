import { observe, Selector, computeSelector } from '@legendapp/state';
import { useEffect, useRef } from 'react';

export function useObserve<T>(selector: Selector<T>, callback?: (value: T) => void): void {
    const ref = useRef<{ selector: Selector<T>; callback: (value: T) => void }>();
    ref.current = { selector, callback };

    useEffect(() => {
        let shouldCallback = false;
        return observe(() => {
            const value = computeSelector(ref.current.selector);
            if (shouldCallback) {
                ref.current.callback?.(value);
            }
            shouldCallback = !!callback;
        });
    }, []);
}
