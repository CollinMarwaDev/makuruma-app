import {
    applyColor,
    type Axes,
    type ChartColor,
    createAxisScale,
    createGradient,
    DEFAULT_COLOR,
    type GradientColor,
} from "~/global/components/charts/common";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import { type Color } from "~/global/types";
import type { FC } from "react";
import { cn } from "~/global/utils/cn";

Chart.register(...registerables);

interface BorderWidth {
    top?: number;
    left?: number;
    right?: number;
}

interface Dataset {
    data: number[];
    stack?: string;
    label: string;
    borderRadius?: number;
    barColor?: Color;
    barGradientColor?: {
        start?: GradientColor;
        stop?: GradientColor;
    };
    hoverBackgroundColor?: Color;
    borderWidth?: number | BorderWidth;
    borderColor?: ChartColor;
}

export interface BarChartProps {
    datasets: Dataset[] | Dataset;
    wrapperClassName?: string;
    legendDescription?: string;
    title?: string;
    barWidth?: number;
    titleColor?: string;
    type?: "bar" | "column";
    xAxes?: Axes;
    yAxes?: Axes;
    categoryPercentage?: number;
    barPercentage?: number;
    labels: string[];
}

const BarChart: FC<BarChartProps> = ({
    wrapperClassName,
    labels,
    title,
    titleColor,
    type = "bar",
    xAxes,
    yAxes,
    datasets,
    barPercentage = 0.9,
    categoryPercentage = 0.8,
}) => {
    const _datasets = Array.isArray(datasets) ? datasets : [datasets];
    const dataSets = {
        datasets: _datasets.map((data) => ({
            backgroundColor: data.barGradientColor
                ? (context: object) =>
                      createGradient(context, data.barGradientColor)
                : applyColor(data.barColor, DEFAULT_COLOR),

            borderColor: data.borderColor && applyColor(data.borderColor),
            borderRadius: data.borderRadius,
            borderSkipped: false,
            borderWidth: data.borderWidth,
            data: data.data,
            hoverBackgroundColor: applyColor(
                data?.hoverBackgroundColor,
                "#568936"
            ),
            label: data.label,
            ...(data.stack && { stack: data.stack }),
        })),
        labels: labels,
    };

    const options = {
        aspectRatio: 1,
        barPercentage,
        categoryPercentage,
        indexAxis: type === "bar" ? "x" : "y",
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                color: titleColor,
                display: !!title,
                text: title,
            },
        },
        responsive: true,
        scales: {
            x: createAxisScale(xAxes),
            y: createAxisScale(yAxes),
        },
    };
    return (
        <div className={cn("h-full w-full", wrapperClassName)}>
            {/*@ts-expect-error Types of property indexAxis are incompatible.*/}
            <Bar data={dataSets} options={options} />
        </div>
    );
};

export default BarChart;
