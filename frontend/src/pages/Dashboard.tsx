"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import ProfileCard from "@/components/dashboard/ProfileCard";
import StatCard from "@/components/dashboard/StatCard";
import { BarChart3, KeyRound, CreditCard } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    // 🛑 Disable auth check for now during local dev
  
    const token = localStorage.getItem("authToken");
    if (!token) return router.replace("/login");
    api
      .get("/api/users/me", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("authToken");
        router.replace("/login?error=session_expired");
      })
      .finally(() => setLoading(false));
    
  }, [router]);

  
  const handleConnectWallet = () => {
    alert("Connect Wallet clicked (implement MetaMask/Web3 here)");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 flex">
      <Sidebar />
      <main className="flex-1 p-6 md:p-10">
        
        <Header user={user} onConnectWallet={handleConnectWallet} />

        <ProfileCard
          user={user ?? { name: "Demo User", email: "demo@email.com" }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <StatCard
            icon={<BarChart3 className="h-8 w-8 text-cyan-500 mb-4" />}
            title="Usage Analytics"
            description="Track your login events and user activity."
            linkText="View Analytics"
          />
          <StatCard
            icon={<KeyRound className="h-8 w-8 text-cyan-500 mb-4" />}
            title="Manage API Keys"
            description="Create and manage keys for programmatic access."
            linkText="Manage Keys"
          />
          <StatCard
            icon={<CreditCard className="h-8 w-8 text-cyan-500 mb-4" />}
            title="Billing Information"
            description="Upgrade your plan and manage your subscription."
            linkText="View Billing"
          />
        </div>
      </main>
    </div>
  );
}
