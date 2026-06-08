import { useQuery } from "@tanstack/react-query";
import { getCustomers } from "@/services/customer.service";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customersList"],
    queryFn: async () => {
      const response = await getCustomers();
      return response.data ?? [];
    },
  });
};
