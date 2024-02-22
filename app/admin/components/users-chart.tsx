"use client";
import Chart from "react-apexcharts";
interface CurrentYearUser {
    createdAt: string;
    username: string;
  }
interface UserChartProps {
  data: CurrentYearUser[];
}
export default function UserChart({ data }: UserChartProps) {
  const monthCounts = Array.from({ length: 12 }, () => 0);

  data.forEach((user) => {
    const monthIndex = new Date(parseInt(user.createdAt)).getMonth();
    monthCounts[monthIndex]++;
  });

  const months = [
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
  ];

  const seriesData = months.map((month, index) => {
    return {
      month,
      data: monthCounts[index],
    };
  });

  const options = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: months,
    },
  };

  const series = [
    {
      name: "New User",
      data: seriesData.map((entry) => entry.data),
    },
  ];

  return (
    <Chart options={options as any} series={series} type="area" height={300} />
  );
}
