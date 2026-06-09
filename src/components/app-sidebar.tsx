"use client"

import * as React from "react"
import {
  ScanQrCode,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  Users,
  ShoppingBag as Orders,
  DollarSign
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { NavMain } from "@/components/nav-main";
import { useCustomers } from "@/hooks/use-customer";
import { useOrders } from "@/hooks/useOrder";
import { usePayments } from "@/hooks/usePayment";
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  const { t } = useTranslation();
  const { data: customers = [] } = useCustomers();
  const { data: orders = [] } = useOrders();
  const { data: payments = [] } = usePayments();

  // Nav items built inside component so translations are reactive
  const navMain = [
    {
      title: t("sidebar.dashboard"),
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: t("sidebar.pos"),
      url: "/admin/pos",
      icon: ScanQrCode,
    },
    {
      title: t("sidebar.products"),
      url: "#",
      icon: SquareTerminal,
      items: [
        { title: t("sidebar.productList"), url: "/admin/products" },
      ],
    },
    {
      title: t("sidebar.categories"),
      url: "#",
      icon: Settings2,
      items: [
        { title: t("sidebar.categoryList"),  url: "/admin/category" },
      ],
    },
    {
      title: t("sidebar.customers"),
      url: "/admin/customers",
      icon: Users,
      badge: customers.length > 0 ? customers.length : undefined,
    },
    {
      title: t("sidebar.orders"),
      url: "/admin/orders",
      icon: Orders,
      badge: orders.length > 0 ? orders.length : undefined,
    },
    {
      title: t("sidebar.payments"),
      url: "/admin/payments",
      icon: DollarSign,
      badge: payments.length > 0 ? payments.length : undefined,
    },
    {
      title: t("sidebar.settings"),
      url: "#",
      icon: Settings2,
      items: [
        { title: t("sidebar.setting"), url: "/admin/settings" },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex items-center justify-center py-4 px-2 border-b border-sidebar-border/50">
        <Link to="/admin/dashboard" className="flex items-center justify-center w-full">
          {state === "collapsed" ? (
            <img src="/logo/logo_pos.png" alt="Logo" className="object-contain w-[59px]" />
          ) : (
            <img src="/logo/logo_pos.png" alt="Logo" className="h-10 w-auto max-w-[90%] object-contain" />
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
