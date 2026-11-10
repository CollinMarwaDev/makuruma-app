import type { BarChartProps } from "~/global/components/charts/bar-chart";
import type { LineChartProps } from "~/global/components/charts/line-chart";
import { globalColors } from "~/global/constants/global-colors";
import { BarChart, LineChart } from "~/global/components/charts";

const ChartComponents = () => {
    const chartData: BarChartProps = {
        datasets: [
            {
                barColor: { color: globalColors.surfaceContainer },
                borderRadius: 6,
                data: [120, 40, 70, 20, 120, 30, 50, 80, 40, 90, 60, 110],
                hoverBackgroundColor: { color: globalColors.primary },
                label: "Mouth",
            },
        ],
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
    };

    const lineChartData = {
        data: [
            90_000, 94_000, 95_000, 99_000, 98_000, 103_000, 99_000, 96_000,
            95_000, 99_000, 97_000, 103_000,
        ],
    };
    const lineChartData2 = {
        data: [
            92_000, 94_000, 110_000, 110_000, 102_000, 99_000, 110_000, 112_000,
            104_000, 110_000, 105_000, 104_000,
        ],
    };

    const chartDataWithGradients: LineChartProps = {
        dataset: [
            {
                fill: true,
                smoothCorner: true,
                ...lineChartData,
                lineColor: { color: globalColors.accent },
                lineDescription: "Seed Capital",
                lineGradientColor: {
                    start: { color: globalColors.accent, opacity: 0.1 },
                    stop: { color: globalColors.accent, opacity: 0.6 },
                },
                point: {
                    pointBackground: { color: "#FFFFFF", opacity: 0 },
                    pointBorder: { color: "#FFFFFF", opacity: 0 },
                },
            },
            {
                fill: true,
                smoothCorner: false,
                ...lineChartData2,
                lineColor: { color: globalColors.primary },
                lineDescription: "Funds",
                lineGradientColor: {
                    start: {
                        color: globalColors.primary,
                        opacity: 0.1,
                    },
                    stop: {
                        color: globalColors.primary,
                        opacity: 0.5,
                    },
                },
                point: {
                    pointBackground: { color: "#FFFFFF", opacity: 0 },
                    pointBorder: { color: "#FFFFFF", opacity: 0 },
                },
            },
        ],
        labels: chartData.labels,
    };

    return (
        <div className={"flex flex-col gap-4 p-4"}>
            <div
                className={"grid grid-cols-1 items-center gap-6 md:grid-cols-2"}
            >
                <div className={"h-60 flex-1"}>
                    <BarChart
                        barWidth={10}
                        xAxes={{ drawBorder: false, showGridLines: false }}
                        yAxes={{ show: false }}
                        {...chartData}
                    />
                </div>

                <div
                    className={
                        "bg-opacity-50 relative mx-auto h-[20rem] w-full p-2"
                    }
                >
                    <LineChart {...chartDataWithGradients} />
                </div>
            </div>
        </div>
    );
};

export default ChartComponents;
