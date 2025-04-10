"use client"; // Mark this file as a Client Component

import type React from "react";
import { Sidebar } from "@/components/sidebar/sidebar";
import { Chat } from "@/components/chat/chat";
import { MobileNav } from "@/components/mobile-nav/mobile-nav";
import { useMediaQuery } from "@/hooks/use-media-query";

export function Layout({ children }: { children: React.ReactNode }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 ">
        {isDesktop ? (
          <>
            <Sidebar />
            <main className="flex-1 overflow-auto scroll-smooth scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-purple-950/30">
              {children}
            </main>
            <Chat />
          </>
        ) : (
          <>
            <main className="flex-1 overflow-auto pb-16">{children}</main>
            <MobileNav />
          </>
        )}
      </div>
    </div>
  );
}
