import { PieChartLegend } from "~/global/components/charts/pie-chart-legend";
import { DEFAULT_COLOR } from "~/global/components/charts/common";
import { Chart, registerables } from "chart.js";
import { type ReactNode, useMemo } from "react";
import { hexToRgb } from "~/global/utils/hexToRbg";
import { Doughnut } from "react-chartjs-2";
import type { Color } from "~/global/types";
import { cn } from "~/global/utils/cn";

Chart.register(...registerables);

const DEFAULT_OPACITY = 1;

interface PieChartProps {
    data: number[];
    labels: string[];
    backgroundColors?: Color[];
    legendDescription?: string;
    title?: string;
    titleColor?: string;
    innerCircleWidth?: number;
    borderWidth?: number;
    showLegend?: boolean;
    className?: string;
    children?: ReactNode;
}

const generateBackgroundColors = (
    backgroundColors?: Color[],
    defaultColor = DEFAULT_COLOR
) =>
    backgroundColors
        ? backgroundColors.map(({ color, opacity }) =>
              hexToRgb(color, opacity ?? DEFAULT_OPACITY)
          )
        : hexToRgb(defaultColor, DEFAULT_OPACITY);

const generateChartData = (
    data: number[],
    labels: string[],
    backgroundColors?: Color[],
    legendDescription?: string
) => ({
    datasets: [
        {
            backgroundColor: generateBackgroundColors(backgroundColors),
            data,
            hoverOffset: 4,
            label: legendDescription,
        },
    ],
    labels,
});

const generateChartOptions = (
    title?: string,
    titleColor?: string,
    innerCircleWidth = 0,
    borderWidth = 0.2,
    showLegend = false
) => ({
    aspectRatio: 1,
    borderWidth,
    cutout: innerCircleWidth,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: showLegend,
        },
        title: {
            color: titleColor,
            display: !!title,
            text: title,
        },
        tooltip: {
            backgroundColor: "rgba(17, 24, 39, 0.96)",
            bodyColor: "#F9FAFB",
            bodyFont: {
                family: "Plus Jakarta Sans",
                size: 12,
                weight: 500,
            },
            borderColor: "rgba(42, 127, 136, 0.45)",
            borderWidth: 1,
            boxPadding: 4,
            caretPadding: 8,
            cornerRadius: 12,
            displayColors: true,
            padding: 12,
            titleColor: "#f8a13f",
            titleFont: {
                family: "Plus Jakarta Sans",
                size: 12,
                weight: 700,
            },
            titleMarginBottom: 6,
        },
    },
    responsive: true,
});

const PieChart = ({
    backgroundColors,
    data,
    labels,
    legendDescription,
    title,
    titleColor,
    innerCircleWidth = 0,
    borderWidth = 0.2,
    showLegend = false,
    className,
    children,
}: PieChartProps) => {
    const chartData = useMemo(
        () =>
            generateChartData(
                data,
                labels,
                backgroundColors,
                legendDescription
            ),
        [data, labels, backgroundColors, legendDescription]
    );

    const chartOptions = useMemo(
        () =>
            generateChartOptions(
                title,
                titleColor,
                innerCircleWidth,
                borderWidth,
                showLegend
            ),
        [title, titleColor, innerCircleWidth, borderWidth, showLegend]
    );

    return (
        <div className={cn("relative z-20 h-full w-full", className)}>
            <div className="relative z-10 h-full w-full">
                <Doughnut data={chartData} options={chartOptions} />
            </div>
            {children && (
                <div className={"center pointer-events-none absolute inset-0"}>
                    {children}
                </div>
            )}
        </div>
    );
};

PieChart.Legends = PieChartLegend;
export default PieChart;
