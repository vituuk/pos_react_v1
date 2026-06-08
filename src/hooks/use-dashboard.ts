import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchRecentOrders } from "@/services/dashboard.service";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useRecentOrders = (limit = 10) => {
  return useQuery({
    queryKey: ["dashboard-recent-orders", limit],
    queryFn: () => fetchRecentOrders(limit),
    staleTime: 1000 * 60 * 2,
  });
};
