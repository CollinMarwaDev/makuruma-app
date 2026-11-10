import { passwordConstraints } from "~/global/utils/string-utils";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CheckRead } from "@solar-icons/react/ssr";
import { type FC } from "react";
import { cn } from "~/global/utils/cn";

const PasswordConstraints: FC<{ password: string; hasError?: boolean }> = ({
    password,
    hasError,
}) => {
    return (
        <div
            className={cn(
                "bg-secondary-50 grid grid-cols-2 gap-y-1 rounded-xl p-2",
                { "bg-status-red-bg": hasError }
            )}
        >
            {passwordConstraints(password).map(({ name, isValid }) => (
                <div
                    key={name}
                    className={"flex items-center space-x-2 text-xs"}
                >
                    {isValid ? (
                        <CheckRead className={"text-primary h-5 w-5"} />
                    ) : (
                        <XMarkIcon
                            className={cn("text-secondary-300 h-5 w-5", {
                                "text-status-red-pc": hasError,
                            })}
                        />
                    )}
                    <p className={"text-secondary-500"}>{name}</p>
                </div>
            ))}
        </div>
    );
};

export default PasswordConstraints;
