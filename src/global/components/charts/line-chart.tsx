import {
    type Axes,
    type ChartColor,
    createAxisScale,
    createGradient,
    type GradientColor,
} from "~/global/components/charts/common";
import { Chart, registerables, type TooltipItem } from "chart.js";
import type { FC } from "react";
import { hexToRgb } from "~/global/utils/hexToRbg";
import { Line } from "react-chartjs-2";

Chart.register(...registerables);

interface Point {
    style?: "circle" | "cross" | "rectRounded" | "triangle" | false;
    pointBackground?: ChartColor;
    pointBorder?: ChartColor;
    pointHoverBackground?: ChartColor;
    pointHoverBorder?: ChartColor;
    pointHoverBorderWidth?: number;
}

interface Dataset {
    barColor?: string;
    lineGradientColor?: {
        start?: GradientColor;
        stop?: GradientColor;
    };
    fill?: boolean;
    lineWidth?: number;
    lineColor?: ChartColor;
    data: number[];
    lineDescription?: string;
    point?: Point;
    smoothCorner?: boolean;
}

export interface LineChartProps {
    /**
     * `index`: hovering anywhere over the chart (not just on a point) shows every series for that
     * x position in one tooltip, with a vertical guide line. Default: Chart.js behaviour (on a point).
     */
    hoverMode?: "index";
    /** Shows the series names (`lineDescription`) above the chart. */
    showLegend?: boolean;
    /** Formats values in the tooltip, e.g. currency. */
    tooltipValue?: (value: number) => string;
    /** Extra tooltip lines for the hovered x position (e.g. a difference between series). */
    tooltipFooter?: (index: number) => string | string[];
    title?: string;
    labels: string[];
    titleColor?: string;
    xAxes?: Axes;
    yAxes?: Axes;
    dataset: Dataset[];
}

const LineChart: FC<LineChartProps> = ({
    dataset,
    labels,
    ...otherOptions
}) => {
    const datasets = {
        datasets: dataset.map((dataset) => buildDataSet(dataset)),
        labels: labels,
    };
    const options = buildOptions(otherOptions);
    return <Line data={datasets} options={options} plugins={otherOptions.hoverMode ? [hoverLine] : []} />;
};
export default LineChart;

////////////////////////////////////

/** Draws a vertical guide at the hovered x position when `hoverMode` is "index". */
const hoverLine = {
    afterDatasetsDraw(chart: Chart) {
        const active = chart.tooltip?.getActiveElements?.();
        if (!active?.length) return;
        const { ctx, chartArea } = chart;
        const x = active[0].element.x;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x, chartArea.top);
        ctx.lineTo(x, chartArea.bottom);
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(148, 163, 184, 0.6)";
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.restore();
    },
    id: "hoverLine",
};

function buildOptions({
    hoverMode,
    showLegend,
    title,
    titleColor,
    tooltipFooter,
    tooltipValue,
    xAxes,
    yAxes,
}: Omit<LineChartProps, "dataset" | "labels">) {
    return {
        aspectRatio: 1,
        maintainAspectRatio: false,
        ...(hoverMode && { interaction: { intersect: false, mode: hoverMode } }),
        plugins: {
            legend: {
                display: Boolean(showLegend),
                labels: { boxHeight: 8, boxWidth: 8, usePointStyle: true },
            },
            tooltip: {
                callbacks: {
                    ...(tooltipValue && {
                        label: (item: TooltipItem<"line">) => ` ${item.dataset.label ?? ""}: ${tooltipValue(item.parsed.y ?? 0)}`,
                    }),
                    ...(tooltipFooter && {
                        footer: (items: TooltipItem<"line">[]) => (items.length ? tooltipFooter(items[0].dataIndex) : ""),
                    }),
                },
                usePointStyle: true,
            },
            title: {
                color: titleColor,
                display: Boolean(title),
                text: title,
            },
        },
        responsive: true,
        scales: {
            x: createAxisScale(xAxes),
            y: createAxisScale(yAxes),
        },
    };
}

function buildDataSet(dataset: Dataset) {
    const {
        lineGradientColor,
        fill,
        lineWidth = 2,
        data,
        smoothCorner,
        lineDescription,
        lineColor = {
            color: "#000000",
            opacity: 0.5,
        },
        point = {
            pointHoverBorderWidth: 2,
            style: "circle",
        },
    } = dataset;

    return {
        borderColor: hexToRgb(lineColor?.color, lineColor?.opacity),
        borderWidth: lineWidth,
        data: data,
        label: lineDescription,
        pointHoverBorderWidth: point.pointHoverBorderWidth,
        pointStyle: point.style,
        ...(fill && { fill: "origin" }),

        ...(point?.pointBackground?.color && {
            pointBackgroundColor: hexToRgb(
                point.pointBackground.color,
                point.pointBackground?.opacity
            ),
        }),

        ...(point?.pointBorder?.color && {
            pointBorderColor: hexToRgb(
                point.pointBorder.color,
                point.pointBorder?.opacity
            ),
        }),

        ...(point?.pointHoverBorder?.color && {
            pointHoverBorderColor: hexToRgb(
                point.pointHoverBorder.color,
                point.pointHoverBorder?.opacity
            ),
        }),

        ...(point?.pointHoverBackground?.color && {
            pointHoverBackgroundColor: hexToRgb(
                point.pointHoverBackground.color,
                point.pointHoverBackground?.opacity
            ),
        }),

        backgroundColor: lineGradientColor
            ? (context: object) => createGradient(context, lineGradientColor)
            : hexToRgb(lineColor.color, lineColor.opacity),
        lineTension: smoothCorner ? 0.5 : 0,
        pointBorderWidth: 2,
    };
}
