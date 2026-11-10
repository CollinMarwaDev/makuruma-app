import { Switch as SwitchPrimitive } from "radix-ui";
import type { FC, HTMLAttributes } from "react";
import {
    createContext,
    type ReactNode,
    useContext,
    useId,
    useState,
} from "react";
import Label from "~/global/components/form-controls/label";
import { Hide } from "~/global/components/hide";
import { cn } from "~/global/utils/cn";

/**
 * Switch context interface defining the shape of the context value
 */
interface SwitchContextValue {
    /**
     * Whether the switch is checked
     */
    checked: boolean;
    /**
     * Function to handle checked state changes
     */
    onChange: (checked: boolean) => void;
    /**
     * Unique ID for the switch
     */
    id: string;
}

/**
 * SwitchContext holds the state for the Switch component
 */
const SwitchContext = createContext<SwitchContextValue | undefined>(undefined);

/**
 * Provider props interface for the Switch component
 */
interface SwitchProps {
    /**
     * Controlled checked state
     */
    checked?: boolean;
    /**
     * Children components
     */
    children: ReactNode;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Initially checked state
     */
    defaultChecked?: boolean;
    /**
     * Optional custom ID for the switch
     */
    id?: string;
    /**
     * Callback for when the checked state changes
     */
    onCheckedChange?: (checked: boolean) => void;
}

/**
 * Custom hook to access the Switch context
 * @returns The SwitchContext value
 * @throws Error if used outside of SwitchContext provider
 */
const useSwitchContext = (): SwitchContextValue => {
    const context = useContext(SwitchContext);

    if (context === undefined) {
        throw new Error(
            "useSwitchContext must be used within a Switch component"
        );
    }

    return context;
};

/**
 * Main Switch component that provides context to its children
 */
export const Switch = ({
    defaultChecked = false,
    checked: controlledChecked,
    onCheckedChange,
    id: providedId,
    className,
    children,
    ...otherProps
}: SwitchProps & HTMLAttributes<HTMLDivElement>) => {
    const generatedId = useId();
    const id = providedId || generatedId;

    const [uncontrolledChecked, setUncontrolledChecked] =
        useState(defaultChecked);

    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : uncontrolledChecked;

    const onChange = (newChecked: boolean) => {
        if (!isControlled) {
            setUncontrolledChecked(newChecked);
        }

        onCheckedChange?.(newChecked);
    };

    return (
        <SwitchContext.Provider value={{ checked, id, onChange }}>
            <div
                {...otherProps}
                className={cn("flex items-center gap-3", className)}
            >
                {children}
            </div>
        </SwitchContext.Provider>
    );
};

interface SwitcherProps {
    /** Accessible name for the switch control */
    "aria-label"?: string;
    /** Custom className to apply to the switch container */
    containerClassName?: string;
    /** Whether the switch is disabled */
    disabled?: boolean;
    /** Label text to display when the switch is off */
    offLabel?: string;
    /** Label text to display when the switch is on */
    onLabel?: string;
    /** Custom className to apply to the switch thumb/handle */
    thumbClassName?: string;
}

/**
 * Switcher component that renders the actual switch UI
 */
const Switcher: FC<SwitcherProps> = ({
    "aria-label": ariaLabel,
    containerClassName,
    disabled,
    offLabel,
    onLabel,
    thumbClassName,
}) => {
    const { checked, onChange, id } = useSwitchContext();

    return (
        <SwitchPrimitive.Root
            aria-label={ariaLabel}
            disabled={disabled}
            className={cn(
                "bg-blackA6 group relative rounded-full",
                "bg-primary-shades-100 group h-5.5 w-10.5",
                "relative cursor-default outline-none",
                "data-[state=checked]:bg-primary",
                containerClassName
            )}
            id={id}
            checked={checked}
            onCheckedChange={onChange}
        >
            <Hide condition={!(offLabel && onLabel)}>
                <p
                    className={cn(
                        "text-primary-50 group:hover:bg-primary-950 absolute inset-y-0 left-1.5 flex items-center pt-0.5 text-[8.5px]",
                        { "text-neutral-550 right-1.5 left-auto": !checked }
                    )}
                >
                    {checked ? onLabel : offLabel}
                </p>
            </Hide>
            <SwitchPrimitive.Thumb
                className={cn(
                    "block rounded-full bg-surface",
                    "size-4 translate-x-0.5",
                    "transition-transform duration-100 will-change-transform",
                    "data-[state=checked]:translate-x-6",
                    thumbClassName
                )}
            />
        </SwitchPrimitive.Root>
    );
};

/**
 * Custom Label component specifically for Switch
 */
const SwitchLabel = ({ children, ...props }: Parameters<typeof Label>[0]) => {
    const { id } = useSwitchContext();

    return (
        <Label htmlFor={id} {...props}>
            {children}
        </Label>
    );
};

Switch.Label = SwitchLabel;
Switch.Switcher = Switcher;
