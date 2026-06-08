import * as React from "react";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { removeAccessToken } from "@/utils/tokenStorage";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const user = {
  name: "VITU",
  email: "m@example.com",
  avatar: "/img/profile.jpg",
};

export function UserDropdown() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    removeAccessToken();
    navigate("/login");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
          <Avatar className="h-9 w-9 rounded-full border border-border transition-transform hover:scale-105">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-full">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-[10px] mt-1">
          <div className="flex items-center gap-2 p-2 border-b">
            <Avatar className="h-8 w-8 rounded-full">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-full">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left text-xs leading-tight">
              <span className="font-semibold text-foreground">{user.name}</span>
              <span className="text-muted-foreground">{user.email}</span>
            </div>
          </div>
          <DropdownMenuItem
            onClick={() => setShowLogoutModal(true)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer gap-2 mt-1 rounded-[8px]"
          >
            <LogOut size={15} />
            {t("sidebar.logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmModal
        open={showLogoutModal}
        message={t("auth.logoutConfirm")}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
