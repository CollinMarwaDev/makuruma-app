import type { FC } from "react";
import { cn } from "~/global/utils/cn";

export interface LegendItemProps {
    name: string;
    value: number | string;
    color: string;
    lineHeight?: number;
    lineWidth?: number;
    curveRadius?: number;
    finalRiseHeight?: number;
    side: "left" | "right" | "center" | string;
}

export const PieChartLegend: FC<LegendItemProps> = ({
    name,
    value,
    color,
    lineHeight = 16,
    lineWidth = 22,
    curveRadius = 16,
    finalRiseHeight = 20,
    side,
}) => {
    const strokeW = 2;

    // --- Center: simple vertical line ---
    if (side === "center") {
        const svgW = 8;
        const svgH = lineHeight + finalRiseHeight + 4;
        const dotX = svgW / 2;
        const dotY = svgH - 2;

        return (
            <div className="flex min-w-16 flex-col items-center gap-0">
                <svg
                    width={svgW}
                    height={svgH}
                    className="flex overflow-visible"
                >
                    <line
                        x1={dotX}
                        y1={dotY - 6}
                        x2={dotX}
                        y2={2}
                        stroke={color}
                        strokeWidth={strokeW}
                        strokeLinecap="round"
                    />
                    <circle cx={dotX} cy={dotY - 2} r={4} fill={color} />
                </svg>
                <p className="mt-1 text-sm">{name}</p>
                <p className="text-primary-950 text-sm font-bold">{value}</p>
            </div>
        );
    }

    // --- Left / Right: curved path ---
    const svgW = lineWidth + curveRadius + 4;
    const svgH = lineHeight + finalRiseHeight + 4;

    const dotX = side === "right" ? svgW - 2 : 2;
    const dotY = svgH - 2;

    const firstElbowTopY = dotY - lineHeight;
    const firstElbowY = firstElbowTopY + curveRadius;
    const qCtrlX = dotX;
    const qCtrlY = firstElbowTopY;
    const qEndX = side === "right" ? dotX - curveRadius : dotX + curveRadius;
    const qEndY = firstElbowTopY;

    const armEndX = side === "right" ? 2 + curveRadius : svgW - 2 - curveRadius;

    const secondElbowCtrlX = side === "right" ? 2 : svgW - 2;
    const secondElbowCtrlY = qEndY;
    const secondElbowEndX = side === "right" ? 2 : svgW - 2;
    const secondElbowEndY = qEndY - curveRadius;

    const path = `
        M ${dotX} ${dotY - 6}
        V ${firstElbowY}
        Q ${qCtrlX} ${qCtrlY} ${qEndX} ${qEndY}
        H ${armEndX}
        Q ${secondElbowCtrlX} ${secondElbowCtrlY} ${secondElbowEndX} ${secondElbowEndY}
        V ${2}
    `;

    return (
        <div className="flex min-w-16 flex-col items-center gap-0">
            <svg
                width={svgW}
                height={svgH}
                className={cn(
                    "flex overflow-visible",
                    { "translate-x-1/2": side === "left" },
                    { "-translate-x-1/2": side === "right" }
                )}
            >
                <path
                    d={path}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeW}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <circle cx={dotX} cy={dotY - 2} r={4} fill={color} />
            </svg>
            <p className="mt-1 text-sm">{name}</p>
            <p className="text-primary-950 text-sm font-bold">
                {value.toLocaleString()}
            </p>
        </div>
    );
};
