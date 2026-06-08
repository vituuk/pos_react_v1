"use client"

import * as React from "react"
import {
  ScanQrCode,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
  LayoutDashboard,
  Users,
  ShoppingBag as Orders,
  DollarSign
} from "lucide-react"
import { useTranslation } from "react-i18next"

import { NavMain } from "@/components/nav-main";
import { useCustomers } from "@/hooks/use-customer";
import { useOrders } from "@/hooks/useOrder";
import { usePayments } from "@/hooks/usePayment";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const userData = {
  user: {
    name: "VITU",
    email: "m@example.com",
    avatar: "/img/profile.jpg",
  },
  teams: [
    {
      name: "POS",
      logo: GalleryVerticalEnd,
      plan: "",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        { title: t("sidebar.general"), url: "#" },
        { title: t("sidebar.team"),    url: "#" },
        { title: t("sidebar.billing"), url: "#" },
        { title: t("sidebar.limits"),  url: "#" },
      ],
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent focus:bg-transparent select-none cursor-default"
            >
              <Avatar className="h-8 w-8 rounded-lg shrink-0">
                <AvatarImage src={userData.user.avatar} alt={userData.user.name} />
                <AvatarFallback className="rounded-lg">
                  {userData.user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userData.user.name}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
