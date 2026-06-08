import { checkTransaction, createPayment, getPayments } from "@/services/payment.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await getPayments();
      return response.data ?? [];
    },
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to create payment");
      console.log("Failed to create payment", error);
    },
  });
};

export const useCheckTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkTransaction,
    onSuccess: () => {
      toast.success("Transaction checked successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
    onError: (error: Error) => {
      toast.error("Failed to check transaction");
      console.log("Failed to check transaction", error);
    },
  });
};
