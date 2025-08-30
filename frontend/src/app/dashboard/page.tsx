"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Power,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  KeyRound,
  BarChart3,
  CreditCard,
  ExternalLink,
  WalletCards,
} from "lucide-react";
import api from "@/utils/axios";

interface User {
  _id: string;
  fullName: {
    firstName: string;
    lastName: string;
  };
  email: string | null;
  profilePic: string;
  provider:
    | "google"
    | "github"
    | "facebook"
    | "discord"
    | "linkedin"
    | "web3"
    | "email";
  walletAddress: string | null;
  createdAt: string;
}

const ProviderIcons = ({ provider }: { provider: User["provider"] }) => {
  const iconClasses = "h-6 w-6 inline-block mr-2";
  switch (provider) {
    case "google":
      return (
        <svg
          className={iconClasses}
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          ></path>
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          ></path>
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C42.02,35.136,44,30.025,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          ></path>
        </svg>
      );
    case "github":
      return (
        <svg
          className={iconClasses}
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
          />
        </svg>
      );
    case "facebook":
      return <ShieldCheck className={iconClasses} />;
    case "discord":
      return <ShieldCheck className={iconClasses} />;
    case "linkedin":
      return <ShieldCheck className={iconClasses} />;
    case "web3":
      return <WalletCards className={iconClasses} />;
    case "email":
      return <Mail className={iconClasses} />;
    default:
      return <ShieldCheck className={iconClasses} />;
  }
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        router.replace("/login");
        return;
      }
      try {
        const response = await api.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        localStorage.removeItem("authToken");
        router.replace("/login?error=session_expired");
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex">
        <aside className="w-64 bg-white dark:bg-gray-950 p-6 hidden md:block border-r border-gray-200 dark:border-gray-800">
          <h2 className="text-2xl font-bold mb-8 text-cyan-500">AuthKit</h2>
          <nav>
            <a
              href="#"
              className="flex items-center py-2.5 px-4 rounded transition duration-200 bg-cyan-50 dark:bg-cyan-900 text-cyan-600 dark:text-cyan-200"
            >
              <LayoutDashboard className="mr-3" /> Dashboard
            </a>
            <a
              href="#"
              className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <KeyRound className="mr-3" /> API Keys
            </a>
            <a
              href="#"
              className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <CreditCard className="mr-3" /> Billing
            </a>
            <a
              href="#"
              className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            >
              <Settings className="mr-3" /> Settings
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-6 md:p-10">
          <header className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.fullName?.firstName || "User"}!
            </h1>
            <div className="flex items-center">
              <img
                src={
                  user?.profilePic ||
                  `https://avatar.vercel.sh/${user?._id}.png`
                }
                alt="Profile"
                className="w-10 h-10 rounded-full mr-4 border-2 border-cyan-500"
                onError={(e) => {
                  e.currentTarget.src = `https://avatar.vercel.sh/${user?._id}.png`;
                }}
              />
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition active:scale-95"
              >
                <Power className="mr-2 h-4 w-4" /> Logout
              </button>
            </div>
          </header>

          <div className="bg-white dark:bg-gray-950 p-8 rounded-2xl shadow-lg mb-10 border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-semibold mb-6">Your Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <UserIcon className="h-6 w-6 mr-3 text-cyan-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Full Name
                  </p>
                  <p className="font-medium">
                    {user?.fullName?.firstName} {user?.fullName?.lastName}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <Mail className="h-6 w-6 mr-3 text-cyan-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Email Address
                  </p>
                  <p className="font-medium">{user?.email || "Not Provided"}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-cyan-500">
                  <ProviderIcons provider={user?.provider!} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Login Provider
                  </p>
                  <p className="font-medium capitalize">{user?.provider}</p>
                </div>
              </div>
              {user?.walletAddress && (
                <div className="flex items-center">
                  <WalletCards className="h-6 w-6 mr-3 text-cyan-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Wallet Address
                    </p>
                    <p className="font-mono text-sm break-all">
                      {user.walletAddress}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <UserIcon className="h-6 w-6 mr-3 text-cyan-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Joined On
                  </p>
                  <p className="font-medium">
                    {new Date(user?.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
              <BarChart3 className="h-8 w-8 text-cyan-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Usage Analytics</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track your login events and user activity.{" "}
                <a href="#" className="text-cyan-500 hover:underline">
                  View Analytics <ExternalLink className="inline h-3 w-3" />
                </a>
              </p>
            </div>
            <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
              <KeyRound className="h-8 w-8 text-cyan-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Manage API Keys</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Create and manage keys for programmatic access.{" "}
                <a href="#" className="text-cyan-500 hover:underline">
                  Manage Keys <ExternalLink className="inline h-3 w-3" />
                </a>
              </p>
            </div>
            <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800">
              <CreditCard className="h-8 w-8 text-cyan-500 mb-4" />
              <h4 className="text-lg font-semibold mb-2">Billing Information</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upgrade your plan and manage your subscription.{" "}
                <a href="#" className="text-cyan-500 hover:underline">
                  View Billing <ExternalLink className="inline h-3 w-3" />
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
