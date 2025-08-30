"use client";

import {
  LayoutDashboard,
  KeyRound,
  CreditCard,
  Settings,
  LogOut,
} from "lucide-react";
import { Layout, Menu } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation"; 

const { Sider } = Layout;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter(); 

  const handleLogout = () => {
    localStorage.removeItem("authToken"); 
    router.push("/login"); 
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
      <div className="h-16 flex items-center justify-center font-bold text-xl text-gray-900 dark:text-gray-100">
        {collapsed ? "A" : "AuthKit"}
      </div>

      <Menu
        mode="inline"
        selectable={false}
        style={{ background: "transparent", borderRight: "none" }}
        className={`
          [&_.ant-menu-item]:!my-5 
          [&_.ant-menu-item]:rounded-lg 
          [&_.ant-menu-item]:hover:!bg-gray-100 
          dark:[&_.ant-menu-item]:hover:!bg-gray-800
          [&_.ant-menu-item]:!text-gray-800
          dark:[&_.ant-menu-item]:!text-gray-200
          [&_.ant-menu-item-icon]:!text-gray-600
          dark:[&_.ant-menu-item-icon]:!text-gray-300
          [&_.ant-menu-title-content]:!ml-5   
        `}
        items={[
          { key: "1", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
          { key: "2", icon: <KeyRound size={18} />, label: "API Keys" },
          { key: "3", icon: <CreditCard size={18} />, label: "Billing" },
          { key: "4", icon: <Settings size={18} />, label: "Settings" },
        ]}
      />

      <Menu
        mode="inline"
        selectable={false}
        style={{ background: "transparent", borderRight: "none", marginTop: "auto" }}
        className={`
          [&_.ant-menu-item]:!my-1 
          [&_.ant-menu-item]:rounded-lg 
          [&_.ant-menu-item]:hover:!bg-gray-100 
          dark:[&_.ant-menu-item]:hover:!bg-gray-800
          [&_.ant-menu-item]:!text-gray-800
          dark:[&_.ant-menu-item]:!text-gray-200
          [&_.ant-menu-item-icon]:!text-gray-600
          dark:[&_.ant-menu-item-icon]:!text-gray-300
          [&_.ant-menu-title-content]:!ml-5  
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
    </Sider>
  );
}
