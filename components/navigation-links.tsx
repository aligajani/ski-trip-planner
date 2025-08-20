import Link from "next/link";
import { Home } from "lucide-react";

interface NavigationLinksProps {
  onNavigate?: () => void;
}

export function NavigationLinks({ onNavigate }: NavigationLinksProps) {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
  ];

  return (
    <ul role="list" className="-mx-2 space-y-1">
      {navigation.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={onNavigate}
          >
            <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
            {item.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
