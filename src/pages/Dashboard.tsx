import { TrendingUp, TrendingDown, ShoppingCart, Package, Tag, DollarSign } from "lucide-react";
import { useDashboardStats, useRecentOrders } from "@/hooks/use-dashboard";
import { useTranslation } from "react-i18next";

// ─── helpers ─────────────────────────────────────────────────────────────────
function fmtUSD(val?: number) {
  if (val === undefined || val === null) return "$0.00";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
}
function fmtNum(val?: number) {
  if (val === undefined || val === null) return "0";
  return new Intl.NumberFormat("en-US").format(val);
}
function fmtDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}
function changePill(change: number, suffix = "%") {
  const positive = change >= 0;
  return (
    <span className={`stat-badge ${positive ? "stat-badge-up" : "stat-badge-down"}`}>
      {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {positive ? "+" : ""}
      {change}
      {suffix}
    </span>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`db-skeleton ${className}`} />;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  subDesc: string;
  loading?: boolean;
}
function KpiCard({ title, value, change, icon, subDesc, loading }: KpiCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {loading ? <Skeleton className="w-16 h-5 rounded-full" /> : changePill(change)}
      </div>
      <div className="stat-card-icon-row">
        <div className="stat-card-icon">{icon}</div>
        <div className="stat-card-value">{loading ? <Skeleton className="w-28 h-8" /> : value}</div>
      </div>
      <div className="stat-card-sub">
        <span className="stat-sub-desc">{subDesc}</span>
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ total, labels }: { total: number; labels: { completed: string; pending: string } }) {
  const isPaid = total > 0;
  return (
    <span className={`order-status-badge ${isPaid ? "status-paid" : "status-pending"}`}>
      {isPaid ? labels.completed : labels.pending}
    </span>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { t } = useTranslation();
  const { data: statsData, isLoading: statsLoading } = useDashboardStats();
  const { data: ordersData, isLoading: ordersLoading } = useRecentOrders(8);

  const stats = statsData?.data;
  const orders: any[] = ordersData?.data ?? [];

  const kpis: KpiCardProps[] = [
    {
      title: t("dashboard.totalRevenue"),
      value: fmtUSD(stats?.totalRevenue),
      change: stats?.revenueChange ?? 0,
      icon: <DollarSign size={18} />,
      subDesc: t("dashboard.totalRevenueSub"),
      loading: statsLoading,
    },
    {
      title: t("dashboard.totalOrders"),
      value: fmtNum(stats?.totalOrders),
      change: stats?.ordersChange ?? 0,
      icon: <ShoppingCart size={18} />,
      subDesc: t("dashboard.totalOrdersSub"),
      loading: statsLoading,
    },
    {
      title: t("dashboard.totalProducts"),
      value: fmtNum(stats?.totalProducts),
      change: 0,
      icon: <Package size={18} />,
      subDesc: t("dashboard.totalProductsSub"),
      loading: statsLoading,
    },
    {
      title: t("dashboard.categories"),
      value: fmtNum(stats?.totalCategories),
      change: 0,
      icon: <Tag size={18} />,
      subDesc: t("dashboard.categoriesSub"),
      loading: statsLoading,
    },
  ];

  const statusLabels = {
    completed: t("dashboard.statusCompleted"),
    pending: t("dashboard.statusPending"),
  };

  return (
    <div className="dashboard-page">
      {/* ── KPI Grid ── */}
      <div className="stat-grid">
        {kpis.map((k) => (
          <KpiCard key={k.title} {...k} />
        ))}
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="chart-card">
        <div className="chart-card-header" style={{ marginBottom: "1rem" }}>
          <div>
            <h2 className="chart-title">{t("dashboard.recentOrders")}</h2>
            <p className="chart-sub">{t("dashboard.recentOrdersSub")}</p>
          </div>
          <span className="db-orders-count">
            {ordersLoading ? "…" : t("dashboard.ordersCount", { count: orders.length })}
          </span>
        </div>

        <div className="db-table-wrapper">
          <table className="db-table">
            <thead>
              <tr>
                <th>{t("dashboard.orderNumber")}</th>
                <th>{t("dashboard.date")}</th>
                <th>{t("dashboard.items")}</th>
                <th>{t("dashboard.discount")}</th>
                <th>{t("dashboard.total")}</th>
                <th>{t("dashboard.status")}</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j}><Skeleton className="w-full h-4" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="db-table-empty">{t("dashboard.noOrders")}</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="db-table-row">
                    <td>
                      <span className="db-order-number">{order.orderNumber}</span>
                    </td>
                    <td className="db-table-muted">{fmtDate(order.createdAt)}</td>
                    <td className="db-table-muted">
                      {t("dashboard.itemCount", { count: order.orderDetails?.length ?? 0 })}
                    </td>
                    <td className="db-table-muted">
                      {fmtUSD(parseFloat(order.discount ?? "0"))}
                    </td>
                    <td className="db-table-bold">
                      {fmtUSD(parseFloat(order.total ?? "0"))}
                    </td>
                    <td>
                      <StatusBadge total={parseFloat(order.total ?? "0")} labels={statusLabels} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
