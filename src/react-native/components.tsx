import { createElement, forwardRef, ForwardRefExoticComponent, LegacyRef, useCallback } from 'react';
import { isFunction } from '@legendapp/state';
import {
    NativeSyntheticEvent,
    StyleProp,
    Switch as RNSwitch,
    SwitchChangeEvent,
    SwitchProps,
    TextInput as RNTextInput,
    TextInputChangeEventData,
    TextInputProps,
    TextStyle,
    ViewStyle,
} from 'react-native';
import { ObservableChild, Primitive } from '../observableInterfaces';
import { observer } from '../react/observer';

type Props<T, TStyle, TProps> = Omit<TProps, 'style'> & {
    bind?: ObservableChild<T>;
    style?: StyleProp<TStyle> | ((value: T) => StyleProp<TStyle>);
};

export const Binder = function <
    TBind extends Primitive,
    TElement,
    TStyle,
    TProps extends { onChange?: any; style?: StyleProp<any> }
>(Component: TElement, getValue: (p: any) => TBind) {
    return observer(
        forwardRef(function Bound(
            { bind, onChange, style, ...props }: Props<TBind, TStyle, TProps>,
            ref: LegacyRef<TElement>
        ) {
            if (bind) {
                const _onChange = useCallback((e) => {
                    bind.set(getValue(e));
                    onChange?.(e);
                }, []);

                const value = bind.get();

                if (isFunction(style)) {
                    style = style(value);
                }

                return createElement(
                    Component as any,
                    Object.assign({}, props, { onChange: _onChange, value, style, ref })
                );
            } else {
                return createElement(Component as any, ref ? { ...props, ref } : props);
            }
        })
    ) as any as ForwardRefExoticComponent<Props<TBind, TStyle, TProps>>;
};

export namespace LS {
    export const TextInput = Binder<Primitive, typeof RNTextInput, TextStyle, TextInputProps>(
        RNTextInput,
        (e: NativeSyntheticEvent<TextInputChangeEventData>) => e.nativeEvent.text
    );
    export const Switch = Binder<Primitive, typeof RNSwitch, ViewStyle, SwitchProps>(
        RNSwitch,
        (e: SwitchChangeEvent) => e.value
    );
}
