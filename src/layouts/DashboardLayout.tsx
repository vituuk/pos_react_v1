import { AppSidebar } from "@/components/app-sidebar"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar" 
import { Outlet } from "react-router-dom"

const DashboardLayout = () => {
  return (
   <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-3">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2  ">
            <SidebarTrigger className="-ml-1" />        
          </div>
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>
         
         <Outlet/>

      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout