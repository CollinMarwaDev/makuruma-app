import { forwardRef } from "react";
import {
    TextInputBasic,
    type TextInputBasicProps,
} from "~/global/components/form-controls/text-input-fields/text-input-basic";
import type { IconType } from "~/global/types";
import { cn } from "~/global/utils/cn";

export interface TextInputWithLeadingIconProps
    extends Omit<TextInputBasicProps, "prefix"> {
    _prefix?: IconType | string;
    _suffix?: IconType | string;
    prefixClassName?: string;
    suffixClassName?: string;
    containerClassName?: string;
}

export const TextInputWithPrefix = forwardRef<
    HTMLInputElement,
    TextInputWithLeadingIconProps
>(
    (
        {
            containerClassName,
            _prefix: Prefix,
            _suffix: Suffix,
            className,
            prefixClassName,
            suffixClassName,
            ...rest
        },
        ref
    ) => {
        const isPrefixString = typeof Prefix === "string";
        const isSuffixString = typeof Suffix === "string";

        return (
            // The outer div prevents layout issues when using this component within grid or flex containers
            <div>
                <div
                    className={cn("group relative h-auto", containerClassName)}
                >
                    <TextInputBasic
                        ref={ref}
                        className={cn({ "pl-9": !!Prefix }, className)}
                        {...rest}
                    />

                    <div
                        className={cn(
                            "center absolute inset-y-0 left-0 pl-2 text-muted-foreground",
                            { hidden: !Prefix }
                        )}
                    >
                        {!isPrefixString
                            ? Prefix && (
                                  <Prefix
                                      className={cn(
                                          "size-5",
                                          prefixClassName
                                      )}
                                  />
                              )
                            : Prefix && (
                                  <p className={prefixClassName}>{Prefix}</p>
                              )}
                    </div>
                    <div
                        className={cn(
                            "center absolute inset-y-0 right-0 pr-3 text-muted-foreground",
                            { hidden: !Suffix }
                        )}
                    >
                        {!isSuffixString
                            ? Suffix && (
                            <Suffix
                                className={cn("size-5 text-primary", suffixClassName)}
                            />
                        )
                            : Suffix && (
                            <p className={suffixClassName}>{Suffix}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }
);

TextInputWithPrefix.displayName = "TextInputWithPrefix";
