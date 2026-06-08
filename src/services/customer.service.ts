import api from "./lib/axios";

export const getCustomers = async () => {
  return await api.get("/api/v1/customer");
};
