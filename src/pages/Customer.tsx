"use client";

import { DataTable } from "../components/data-table/data-table";
import { useCustomers } from "../hooks/use-customer";
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

export default function CustomerPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: customers = [], isLoading } = useCustomers();

  const accessToken = getAccessToken();
  if (!accessToken) {
    navigate("/login");
  }

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "id",
      header: t("categories.id", "ID"),
    },
    {
      accessorKey: "firstName",
      header: t("products.firstName", "First Name"),
    },
    {
      accessorKey: "lastName",
      header: t("products.lastName", "Last Name"),
    },
    {
      accessorKey: "userName",
      header: t("products.username", "Username"),
    },
    {
      accessorKey: "phone",
      header: t("products.phone", "Phone"),
    },
    {
      accessorKey: "email",
      header: t("products.email", "Email"),
    },
  ];

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">{t("common.loading", "Loading...")}</div>;
  }

  return (
    <div className="p-6">
      <div className="py-2 flex mb-4 justify-between items-center">
        <h1 className="text-xl font-bold">{t("sidebar.customers", "Customers")}</h1>
      </div>
      <DataTable columns={columns} data={customers} />
    </div>
  );
}
