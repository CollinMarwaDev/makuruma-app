import {
    createContext as reactCreateContext,
    type FC,
    useMemo,
    useContext as useReactContext,
    type ReactNode,
} from "react";

export const createContext = <ContextValueType extends object | null>(
    rootComponentName: string,
    defaultContext?: ContextValueType
) => {
    const Context = reactCreateContext<ContextValueType | undefined>(
        defaultContext
    );

    const Provider: FC<ContextValueType & { children: ReactNode }> = (
        props
    ) => {
        const { children, ...context } = props;
        // Only re-memoize when prop values change

        const value = useMemo(
            () => context,
            Object.values(context)
        ) as ContextValueType;

        return <Context.Provider value={value}> {children} </Context.Provider>;
    };

    Provider.displayName = rootComponentName + "Provider";

    function useContext(consumerName: string) {
        const context = useReactContext(Context);
        if (context) return context;
        if (defaultContext !== undefined) return defaultContext;
        // if a defaultContext wasn't specified, it's a required context.
        throw new Error(
            `\`${consumerName}\` must be used within \`${rootComponentName}\``
        );
    }

    return [Provider, useContext] as const;
};
