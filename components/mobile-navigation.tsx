"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Logo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { AuthButton } from "@/components/auth-button";
import { NavigationLinks } from "@/components/navigation-links";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface MobileNavigationProps {
  children: React.ReactNode;
}

export function MobileNavigation({ children }: MobileNavigationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <>
      {/* Mobile sidebar overlay */}
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4 border-r border-gray-200 dark:border-gray-700">
                  {/* Mobile Sidebar Header */}
                  <div className="flex h-16 shrink-0 items-center">
                    <Logo size="lg" />
                  </div>

                  {/* Mobile Sidebar Navigation */}
                  <nav className="flex flex-1 flex-col">
                    <ul role="list" className="flex flex-1 flex-col gap-y-7">
                      <li>
                        <NavigationLinks onNavigate={() => setSidebarOpen(false)} />
                      </li>
                    </ul>
                  </nav>

                  {/* Mobile Sidebar Footer */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex flex-col space-y-4">
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
                      {/* Mobile Logout Button */}
                      <div className="lg:hidden">
                        <AuthButton />
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Mobile menu button - rendered from children */}
      <div onClick={() => setSidebarOpen(true)}>
        {children}
      </div>
    </>
  );
}
