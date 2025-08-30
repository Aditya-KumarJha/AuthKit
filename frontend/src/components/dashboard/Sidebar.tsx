"use client";

import {
  LayoutDashboard,
  KeyRound,
  CreditCard,
  Settings,
  LogOut,
  UserRound,
} from "lucide-react";
import { Layout, Menu } from "antd";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const getSelectedKey = () => {
    if (!pathname) return "dashboard"; 
    if (pathname.startsWith("/dashboard/profile")) return "profile";
    if (pathname.startsWith("/dashboard/api-keys")) return "api-keys";
    if (pathname.startsWith("/dashboard/billing")) return "billing";
    if (pathname.startsWith("/dashboard/settings")) return "settings";
    return "dashboard"; 
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={240}
      style={{ background: "transparent" }}
      className="h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
    >
      <div className="h-16 flex items-center justify-center font-bold text-xl text-gray-900 dark:text-gray-100 cursor-pointer" onClick={() => handleNavigate('/dashboard')}>
        {collapsed ? "A" : "AuthKit"}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]} 
        style={{ background: "transparent", borderRight: "none" }}
        className={`
          px-2
          [&_.ant-menu-item]:!my-2
          [&_.ant-menu-item]:!h-11
          [&_.ant-menu-item-selected]:!bg-cyan-50
          dark:[&_.ant-menu-item-selected]:!bg-cyan-900/50
          dark:[&_.ant-menu-item-selected]:!text-cyan-200
          [&_.ant-menu-item-selected_svg]:!text-cyan-600
          dark:[&_.ant-menu-item-selected_svg]:!text-cyan-200
          [&_.ant-menu-item]:rounded-lg 
          [&_.ant-menu-item]:hover:!bg-gray-100 
          dark:[&_.ant-menu-item]:hover:!bg-gray-800
          [&_.ant-menu-item]:!text-gray-800
          dark:[&_.ant-menu-item]:!text-gray-200
          [&_.ant-menu-item-icon]:!text-gray-600
          dark:[&_.ant-menu-item-icon]:!text-gray-300
          [&_.ant-menu-title-content]:!ml-4
        `}
        items={[
          { key: "dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard", onClick: () => handleNavigate("/dashboard") },
          { key: "profile", icon: <UserRound size={18} />, label: "Update Profile", onClick: () => handleNavigate("/dashboard/profile") },
          { key: "api-keys", icon: <KeyRound size={18} />, label: "API Keys", onClick: () => handleNavigate("/dashboard/api-keys") },
          { key: "billing", icon: <CreditCard size={18} />, label: "Billing", onClick: () => handleNavigate("/dashboard/billing") },
          { key: "settings", icon: <Settings size={18} />, label: "Settings", onClick: () => handleNavigate("/dashboard/settings") },
        ]}
      />

      <div className="mt-auto p-4">
        <Menu
          mode="inline"
          selectable={false}
          style={{ background: "transparent", borderRight: "none" }}
          className={`
            [&_.ant-menu-item]:!my-1 
            [&_.ant-menu-item]:rounded-lg 
            [&_.ant-menu-item]:hover:!bg-red-50
            dark:[&_.ant-menu-item]:hover:!bg-red-900/50
            [&_.ant-menu-item]:!text-red-600
            dark:[&_.ant-menu-item]:!text-red-400
            [&_.ant-menu-item-icon]:!text-red-600
            dark:[&_.ant-menu-item-icon]:!text-red-400
            [&_.ant-menu-title-content]:!ml-4
          `}
          items={[
            {
              key: "logout",
              icon: <LogOut size={16} />,
              label: !collapsed && "Logout",
              onClick: handleLogout,
            },
          ]}
        />
      </div>
    </Sider>
  );
}

