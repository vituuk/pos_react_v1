"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
    ScanQrCode,
  GalleryVerticalEnd,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
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
    // {
    //   name: "Acme Corp.",
    //   logo: AudioWaveform,
    //   plan: "Startup",
    // },
    // {
    //   name: "Evil Corp.",
    //   logo: Command,
    //   plan: "Free",
    // },
  ],
  navMain: [
    {
      title: "Products",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Product List",
          url: "/admin/products",
        },
        // {
        //   title: "Category List",
        //   url: "/category",
        // },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },

    {

      title: "Categories",
      url: "#",
      icon: Settings2,
      items: [

        {
          title: "Category List",

          url: "/admin/category",

        },

        {

          title: "Test Category",

          url: "/admin/testCategory",

        },

        {

          title: "Billing",

          url: "#",

        },

        {

          title: "Limits",

          url: "#",

        },
        {
           title: "POS",
          url: "/admin/pos",
        }

      ],

    },
     {
      title: "POS",
      url: "/admin/pos",
      icon: ScanQrCode,
    },

        {

    title: "Banks",

      url: "#",

      icon: Settings2,

      items: [

        {

          title: "General",

          url: "#",

        },

        {

          title: "Team",

          url: "#",

        },

        {

          title: "Billing",

          url: "#",

        },

        {

          title: "Limits",

          url: "#",

        },

      ],

    },



    {
      title: "KYC",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Merchant",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },

        {

    title: "Customers",

      url: "#",

      icon: Settings2,

      items: [

        {

          title: "General",

          url: "#",

        },

        {

          title: "Team",

          url: "#",

        },

        {

          title: "Billing",

          url: "#",

        },

        {

          title: "Limits",

          url: "#",

        },

      ],

    },

    
     {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],

  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
