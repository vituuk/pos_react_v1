import api from "./lib/axios";

export const fetchDashboardStats = async () => {
  return await api.get("/api/v1/dashboard/stats");
};

export const fetchRecentOrders = async (limit = 10) => {
  return await api.get("/api/v1/dashboard/recent-orders", {
    params: { limit },
  });
};
