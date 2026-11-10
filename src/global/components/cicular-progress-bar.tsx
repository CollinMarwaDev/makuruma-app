import React, { type ReactNode } from "react";
import { cn } from "~/global/utils/cn";

export interface CircleProgressProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    circleColor?: string;
    progressColor?: string;
    children?: ReactNode;
    className?: string;
}

const CircleProgress: React.FC<CircleProgressProps> = ({
    progress,
    size = 100,
    strokeWidth = 8,
    circleColor = "text-surface-container",
    progressColor = "text-primary-500",
    children,
    className,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div
            className={cn("relative", className)}
            style={{ height: size, width: size }}
        >
            <svg className="h-full w-full" viewBox={`0 0 ${size} ${size}`}>
                <circle
                    className={`${circleColor} stroke-current`}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={`${progressColor} stroke-current`}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset,
                        transform: "rotate(-90deg)",
                        transformOrigin: "50% 50%",
                    }}
                />
            </svg>
            <div className="center absolute inset-0 flex-col text-xl">
                {children}
            </div>
        </div>
    );
};

export default CircleProgress;
