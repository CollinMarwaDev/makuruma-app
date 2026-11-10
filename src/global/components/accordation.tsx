import { Accordion as AccordionPrimitive } from "radix-ui";
import {
    type ComponentPropsWithoutRef,
    type ComponentRef,
    forwardRef,
    type ForwardRefExoticComponent,
    type RefAttributes,
} from "react";
import { cn } from "~/global/utils/cn";

type AccordionProps = ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

type AccordionComponentProps = ForwardRefExoticComponent<
    AccordionProps & RefAttributes<ComponentRef<typeof AccordionPrimitive.Root>>
> & {
    Item: typeof AccordionItem;
    Trigger: typeof AccordionTrigger;
    Content: typeof AccordionContent;
};

export const Accordion = forwardRef<
    ComponentRef<typeof AccordionPrimitive.Root>,
    AccordionProps
>((props, ref) => {
    return <AccordionPrimitive.Root ref={ref} {...props} />;
}) as AccordionComponentProps;

Accordion.displayName = AccordionPrimitive.Root.displayName;

const AccordionItem = forwardRef<
    ComponentRef<typeof AccordionPrimitive.Item>,
    ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn("border-primary-shades-100 border-b", className)}
        {...props}
    />
));

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = forwardRef<
    ComponentRef<typeof AccordionPrimitive.Trigger>,
    ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "flex flex-1 items-center justify-between text-left text-sm font-medium transition-all hover:underline",
                className
            )}
            {...props}
        >
            {children}
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
));

AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = forwardRef<
    ComponentRef<typeof AccordionPrimitive.Content>,
    ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className={cn(
            "overflow-hidden text-sm",
            "data-[state=closed]:animate-accordion-up",
            "data-[state=open]:animate-accordion-down",
            className
        )}
        {...props}
    >
        {children}
    </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

Accordion.Item = AccordionItem;
Accordion.Trigger = AccordionTrigger;
Accordion.Content = AccordionContent;
