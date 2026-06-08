"use client";

import { DataTable } from "../components/data-table/data-table";
import { useOrders } from "../hooks/useOrder";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import { getAccessToken } from "@/utils/tokenStorage";
import { useNavigate } from "react-router-dom";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  phone: string;
  email: string;
}

interface OrderDetail {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  qty: number;
  amount: number;
}

interface Order {
  id: number;
  customerId: number;
  orderNumber: string;
  total: string | number;
  discount: string | number;
  orderDate: string;
  customer?: Customer | null;
  orderDetails?: OrderDetail[];
}

export default function OrdersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: orders = [], isLoading } = useOrders();

  const accessToken = getAccessToken();
  if (!accessToken) {
    navigate("/login");
  }

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: t("categories.id", "ID"),
    },
    {
      accessorKey: "orderNumber",
      header: t("orders.orderNumber", "Order Number"),
    },
    {
      accessorKey: "orderDate",
      header: t("orders.date", "Date"),
      cell: ({ row }) => {
        const dateStr = row.original.orderDate;
        if (!dateStr) return "—";
        return new Date(dateStr).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      id: "customerName",
      header: t("orders.customer", "Customer"),
      cell: ({ row }) => {
        const customer = row.original.customer;
        if (customer) {
          return `${customer.firstName} ${customer.lastName}`;
        }
        return row.original.customerId === 0 ? t("orders.guest", "Guest") : "N/A";
      },
    },
    {
      id: "itemsCount",
      header: t("orders.itemsCount", "Items Count"),
      cell: ({ row }) => {
        const count = row.original.orderDetails?.length ?? 0;
        return t("dashboard.itemCount", { count });
      },
    },
    {
      accessorKey: "discount",
      header: t("dashboard.discount", "Discount"),
      cell: ({ row }) => {
        const val = parseFloat(String(row.original.discount || 0));
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
      },
    },
    {
      accessorKey: "total",
      header: t("dashboard.total", "Total"),
      cell: ({ row }) => {
        const val = parseFloat(String(row.original.total || 0));
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
      },
    },
    {
      id: "status",
      header: t("dashboard.status", "Status"),
      cell: ({ row }) => {
        const total = parseFloat(String(row.original.total || 0));
        const isPaid = total > 0;
        return (
          <span className={`order-status-badge ${isPaid ? "status-paid" : "status-pending"}`}>
            {isPaid ? t("dashboard.statusCompleted", "Completed") : t("dashboard.statusPending", "Pending")}
          </span>
        );
      },
    },
  ];

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">{t("common.loading", "Loading...")}</div>;
  }

  return (
    <div className="p-6">
      <div className="py-2 flex mb-4 justify-between items-center">
        <h1 className="text-xl font-bold">{t("sidebar.orders", "Orders")}</h1>
      </div>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
