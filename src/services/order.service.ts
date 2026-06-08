import api from "./lib/axios";

export interface OrderPayload{
  discount: number;
  items: {
    productId: number;
    qty: number;
  }[]
}

export const createOrder = async (request: OrderPayload) => {
  return await api.post("/api/v1/order", request)
};

export const getOrders = async () => {
  return await api.get("/api/v1/order");
};