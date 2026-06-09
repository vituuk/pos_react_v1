import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
import { useChartStats } from "@/hooks/use-dashboard";
import { formatDateLabel } from "@/utils/date";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-2.5 shadow-md text-xs min-w-[110px]">
        <p className="font-semibold text-foreground mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 py-0.5">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-xs inline-block"
                style={{ backgroundColor: entry.stroke }}
              />
              <span className="text-muted-foreground text-[11px]">{entry.name}</span>
            </div>
            <span className="font-bold text-foreground">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TotalVisitorsChart() {
  const { t, i18n } = useTranslation();
  const [range, setRange] = useState<"3months" | "30days" | "7days">("30days");

  const { data: chartDataResponse, isLoading } = useChartStats(range);
  const chartDataRaw = chartDataResponse?.data ?? [];

  // Map dates dynamically to translate the months based on the current active language
  const chartData = chartDataRaw.map((item: any) => {
    if (!item.dateKey) return item;
    try {
      const formattedName = formatDateLabel(item.dateKey, i18n.language, false);
      return {
        ...item,
        name: formattedName,
      };
    } catch (e) {
      return item;
    }
  });

  return (
    <div className="chart-card flex flex-col w-full">
      <div className="chart-card-header flex items-start justify-between w-full mb-4">
        <div>
          <h2 className="chart-title text-base font-bold text-foreground">
            {t("dashboard.totalVisitors", "Total Visitors")}
          </h2>
          <p className="chart-sub text-xs text-blue-500 dark:text-blue-400">
            {range === "3months" && t("dashboard.totalLast3Months", "Total for the last 3 months")}
            {range === "30days" && t("dashboard.totalLast30Days", "Total for the last 30 days")}
            {range === "7days" && t("dashboard.totalLast7Days", "Total for the last 7 days")}
          </p>
        </div>

        <div className="chart-range-btns flex bg-muted p-0.5 rounded-lg border border-border/50">
          <button
            onClick={() => setRange("3months")}
            className={`chart-range-btn px-3 py-1 text-xs rounded-md transition-all ${
              range === "3months"
                ? "active bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("dashboard.range3Months", "Last 3 months")}
          </button>
          <button
            onClick={() => setRange("30days")}
            className={`chart-range-btn px-3 py-1 text-xs rounded-md transition-all ${
              range === "30days"
                ? "active bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("dashboard.range30Days", "Last 30 days")}
          </button>
          <button
            onClick={() => setRange("7days")}
            className={`chart-range-btn px-3 py-1 text-xs rounded-md transition-all ${
              range === "7days"
                ? "active bg-card text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("dashboard.range7Days", "Last 7 days")}
          </button>
        </div>
      </div>

      <div className="w-full h-[320px] mt-2 relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/60 backdrop-blur-[1px] rounded-lg">
            <span className="text-sm text-muted-foreground font-semibold">{t("common.loading", "Loading...")}</span>
          </div>
        )}
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.08} />
                <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.6} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              dy={15}
              style={{ fontSize: "11px", fill: "var(--muted-foreground)" }}
            />
            <YAxis
              hide={true}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeWidth: 1, strokeOpacity: 0.6 }} />
            <Area
              name={t("dashboard.totalVisitors", "Total Visitors")}
              type="monotone"
              dataKey="Mobile"
              stroke="var(--foreground)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorMobile)"
              activeDot={{ r: 4, stroke: "var(--card)", strokeWidth: 2, fill: "var(--foreground)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
