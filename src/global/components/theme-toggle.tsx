import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useTheme } from "~/global/providers/theme-provider";
import { cn } from "~/global/utils/cn";

interface ThemeToggleProps {
    className?: string;
    /** Show the "Light mode"/"Dark mode" text next to the icon. */
    showLabel?: boolean;
}

/** Switches between the light and dark Makuruma themes. */
export const ThemeToggle: FC<ThemeToggleProps> = ({ className, showLabel = false }) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === "dark";
    const label = isDark ? "Light mode" : "Dark mode";
    const Icon = isDark ? SunIcon : MoonIcon;

    return (
        <button
            type="button"
            onClick={toggleTheme}
            title={label}
            aria-label={`Switch to ${label.toLowerCase()}`}
            className={cn(
                "text-muted-foreground hover:bg-surface hover:text-foreground flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                className
            )}
        >
            <Icon className="size-4 shrink-0" />
            {showLabel && <span>{label}</span>}
        </button>
    );
};
