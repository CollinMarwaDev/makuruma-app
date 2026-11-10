import {
    type Axes,
    type ChartColor,
    createAxisScale,
    createGradient,
    type GradientColor,
} from "~/global/components/charts/common";
import { Chart, registerables } from "chart.js";
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
    return <Line data={datasets} options={options} />;
};
export default LineChart;

////////////////////////////////////

function buildOptions({
    title,
    titleColor,
    xAxes,
    yAxes,
}: Omit<LineChartProps, "dataset" | "labels">) {
    return {
        aspectRatio: 1,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
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
