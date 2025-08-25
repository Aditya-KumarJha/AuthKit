"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeToggleButton from "@/components/ui/theme-toggle-button";
import { useState } from "react";
import { Menu, X, Home, FileText, Info, Settings } from "lucide-react"; 

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/features", label: "Features", icon: Settings },
    { href: "/docs", label: "Docs", icon: FileText },
    { href: "/about", label: "About", icon: Info },
  ];

  return (
    <nav className="w-full fixed top-0 left-0 z-50 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-8 py-4">

        <Link
          href="/"
          className="text-3xl font-extrabold tracking-wide transition-transform hover:scale-110"
        >
          AuthKit
        </Link>

        <div className="hidden md:flex gap-12">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-2 text-md font-medium transition-transform transform hover:scale-110 " +
                    "after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] " +
                    "after:bg-gray-700 dark:after:bg-gray-300 after:transition-all hover:after:w-full",
                  pathname === item.href ? "font-bold" : "font-medium"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex">
          <ThemeToggleButton
            variant="gif"
            url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWI1ZmNvMGZyemhpN3VsdWp4azYzcWUxcXIzNGF0enp0eW1ybjF0ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/Fa6uUw8jgJHFVS6x1t/giphy.gif"
          />
        </div>

        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="focus:outline-none"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <ThemeToggleButton
            variant="gif"
            url="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWI1ZmNvMGZyemhpN3VsdWp4azYzcWUxcXIzNGF0enp0eW1ybjF0ZyZlcD12MV9zdGlja2Vyc19zZWFyY2gmY3Q9cw/Fa6uUw8jgJHFVS6x1t/giphy.gif"
          />
        </div>
      </div>

      <div
        className={cn(
          "md:hidden absolute top-full left-0 w-full flex flex-col gap-4 px-6 py-4 " +
            "bg-gray-50 dark:bg-zinc-900 backdrop-blur-md shadow-md " +
            "transition-transform duration-300 origin-top",
          mobileOpen
            ? "scale-y-100 opacity-100 pointer-events-auto"
            : "scale-y-0 opacity-0 pointer-events-none"
        )}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 text-lg font-medium transition-transform transform hover:scale-110",
                pathname === item.href ? "font-bold" : "font-medium"
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
