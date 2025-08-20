"use client";

import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { NavigationLinks } from "@/components/navigation-links";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export function DesktopSidebar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || "User";
  const userRole = "Adventurer"; // You can make this dynamic based on user role
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 px-6">
        {/* Desktop Sidebar Header */}
        <div className="flex h-16 shrink-0 items-center">
          <Logo size="lg" />
        </div>

        {/* Desktop Sidebar Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <NavigationLinks />
            </li>
          </ul>
        </nav>

        {/* Desktop Sidebar Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {userAvatar ? (
                <Image 
                  src={userAvatar} 
                  alt={userName}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div className="text-sm">
                <p className="font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                  {userName}
                </p>
                <p className="text-gray-500 dark:text-gray-400">{userRole}</p>
              </div>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}
