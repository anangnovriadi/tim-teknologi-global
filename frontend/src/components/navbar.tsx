"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/dark-mode-toggle";
import { School, Menu, X } from "lucide-react";
import { useSelector } from "react-redux";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const token = useSelector((state: any) => state.auth.token);
  const isLoggedIn = Boolean(token);
  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur-sm">
      <div className="max-w-auto mx-auto flex items-center justify-between px-6 py-3">
        <a href="" className="text-lg flex gap-2 items-center font-bold hover:opacity-80">
          <School />
          <span className="text-sm">Tim Teknologi Global</span>
        </a>

        <div className="flex items-center gap-2.5 md:gap-2">
          <a href="/admin">
            <Button variant="outline" className="hidden md:inline-flex cursor-pointer">
              {isClient ? (isLoggedIn ? "Dashboard" : "Login") : "Login"}
            </Button>
          </a>
          <ModeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X />
            ) : (
              <Menu />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t text-center">
          <a
            href="/admin"
            className={`block text-sm hover:text-blue-500 p-2 transition-colors ${isActive("/admin") ? "text-blue-500" : ""
              }`}
            onClick={() => setIsOpen(false)}
          >
            <Button variant="outline" className="w-full flex cursor-pointer">{isLoggedIn ? "Dashboard" : "Login"}</Button>
          </a>
        </div>
      )}
    </nav>
  );
}
