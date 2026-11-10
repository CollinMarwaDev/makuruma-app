import type { Color } from "~/global/types";
import { hexToRgb } from "~/global/utils/hexToRbg";

export const DEFAULT_COLOR = "#2a7f88";

export interface GradientColor extends Color {
    offset?: number; // between 0-1
}

export interface Axes {
    gridLinesColor?: string;
    label?: string;
    labelColor?: string;
    show?: boolean;
    showGridLines?: boolean;
    showLabels?: boolean;
    showTicks?: boolean;
    drawBorder?: boolean;
    stacked?: boolean;
    /** Colour of the tick labels (defaults to a muted grey readable in light and dark). */
    tickColor?: string;
}

export interface ChartColor {
    color: string;
    opacity?: number;
}

type ICreateGradient = {
    start?: GradientColor;
    stop?: GradientColor;
};

/**
 * Creates a linear gradient for a given canvas context.
 *
 * @param {object} context - The canvas context object.
 * @param {ICreateGradient} [barGradientColor] - Optional gradient configuration.
 * @returns {CanvasGradient} - The created linear gradient.
 */
export const createGradient = (
    context: object,
    barGradientColor?: ICreateGradient
): CanvasGradient => {
    // @ts-expect-error property chart doesn't exist on a type ever
    const gradient = context.chart.canvas
        .getContext("2d")
        .createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(
        barGradientColor?.start?.offset ?? 0.5,
        hexToRgb(
            barGradientColor?.start?.color ?? DEFAULT_COLOR,
            barGradientColor?.start?.opacity
        )
    ); // Start color

    gradient.addColorStop(
        barGradientColor?.stop?.offset ?? 0,
        hexToRgb(
            barGradientColor?.stop?.color ?? "#7fc4cb",
            barGradientColor?.stop?.opacity
        )
    ); // Stop color

    return gradient;
};

/**
 * Creates an axis scale configuration object based on the given axis configuration.
 *
 * @param {Axes} [config] - The axis configuration object.
 * @returns {Object} - The axis scale configuration object.
 *
 * @example
 * const axesConfig = {
 *     show: true,
 *     showLabels: true,
 *     label: "X Axis",
 *     labelColor: "#187AE4",
 *     gridLinesColor: "#CCCCCC",
 *     showGridLines: true
 * };
 *
 * const axesScale = createAxisScale(axisConfig);
 * console.log(axisScale);
 * // Output:
 * // {
 * //     display: true,
 * //     title: {
 * //         display: true,
 * //         text: "X Axis",
 * //         color: "#187AE4"
 * //     },
 * //     grid: {
 * //         color: "#CCCCCC",
 * //         display: true
 * //     }
 * // }
 */
export const createAxisScale = (config?: Axes): object => ({
    border: {
        display: config?.drawBorder ?? true,
    },
    display: config?.show ?? true,
    grid: {
        color: config?.gridLinesColor,
        display: config?.showGridLines ?? true,
    },
    stacked: config?.stacked ?? false,
    ticks: {
        color: config?.tickColor ?? "#94a3b8",
        display: config?.showTicks ?? true, // Hides only the labels of the x-axis
    },
    title: {
        color: config?.labelColor ?? "#94a3b8",
        display: config?.showLabels || !!config?.label,
        text: config?.label,
    },
});

export const applyColor = (color?: Color, defaultColor?: string) => {
    if (color) {
        return hexToRgb(color.color, color.opacity);
    }
    return defaultColor;
};

export interface ChartBaseOptions {
    responsive: boolean;
    maintainAspectRatio: boolean;
    aspectRatio: number;
    plugins: {
        title: {
            display: boolean;
            text: string | undefined;
            color: string | undefined;
        };
        legend: {
            display: boolean;
        };
    };
    scales: {
        y: Axes;
        x: Axes;
    };
}
