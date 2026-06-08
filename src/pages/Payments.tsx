"use client";

import { DataTable } from "../components/data-table/data-table";
import { usePayments } from "../hooks/usePayment";
import { useTranslation } from "react-i18next";
import type { ColumnDef } from "@tanstack/react-table";
import { getAccessToken } from "@/utils/tokenStorage";
import { useNavigate } from "react-router-dom";

interface Order {
  id: number;
  orderNumber: string;
}

interface Payment {
  id: number;
  orderId: number;
  paywayTranId: string;
  method: string;
  status: string;
  paidAt: string | null;
  remark: string | null;
  amount: string | number;
  order?: Order | null;
}

function PaymentStatusBadge({ status, t }: { status: string; t: any }) {
  let badgeClass = "";
  let statusText = status;

  if (status === "PAID" || status === "APPROVED") {
    badgeClass = "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50";
    statusText = t("payments.statusPaid", "Paid");
  } else if (status === "PENDING") {
    badgeClass = "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800/50";
    statusText = t("payments.statusPending", "Pending");
  } else {
    badgeClass = "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200 dark:border-rose-800/50";
    statusText = t("payments.statusFailed", "Failed");
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${badgeClass}`}>
      {statusText}
    </span>
  );
}

export default function PaymentsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: payments = [], isLoading } = usePayments();

  const accessToken = getAccessToken();
  if (!accessToken) {
    navigate("/login");
  }

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: t("categories.id", "ID"),
    },
    {
      accessorKey: "paywayTranId",
      header: t("payments.transactionId", "Transaction ID"),
    },
    {
      id: "orderNumber",
      header: t("orders.orderNumber", "Order Number"),
      cell: ({ row }) => {
        return row.original.order?.orderNumber ?? `Order #${row.original.orderId}`;
      },
    },
    {
      accessorKey: "method",
      header: t("payments.method", "Method"),
    },
    {
      accessorKey: "amount",
      header: t("dashboard.total", "Amount"),
      cell: ({ row }) => {
        const val = parseFloat(String(row.original.amount || 0));
        return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
      },
    },
    {
      accessorKey: "paidAt",
      header: t("payments.paidAt", "Paid Date"),
      cell: ({ row }) => {
        const dateStr = row.original.paidAt;
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
      accessorKey: "status",
      header: t("dashboard.status", "Status"),
      cell: ({ row }) => {
        return <PaymentStatusBadge status={row.original.status} t={t} />;
      },
    },
  ];

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">{t("common.loading", "Loading...")}</div>;
  }

  return (
    <div className="p-6">
      <div className="py-2 flex mb-4 justify-between items-center">
        <h1 className="text-xl font-bold">{t("sidebar.payments", "Payments")}</h1>
      </div>
      <DataTable columns={columns} data={payments} />
    </div>
  );
}
