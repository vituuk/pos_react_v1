import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { ThemeToggle } from "@/components/ThemeToggle"
import { UserDropdown } from "@/components/UserDropdown"

const DashboardLayout = () => {
  return (
   <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="p-3">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex-1" />
          {/* Theme Switcher, Language switcher and User profile dropdown — right side of header */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <UserDropdown />
          </div>
        </header>

        <Outlet/>

      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout