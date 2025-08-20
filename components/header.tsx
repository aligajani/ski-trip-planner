import { AuthButton } from "@/components/auth-button";
import { Logo } from "@/components/logo";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";

export function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-gray-200 dark:border-gray-700 h-14 bg-white dark:bg-black sticky top-0 z-50">
      <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex items-center">
          <Link href={"/"}>
            <Logo size="lg" />
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {!hasEnvVars ? null : <AuthButton showDashboard={true} />}
          {/* <ThemeSwitcher /> */}
        </div>
      </div>
    </nav>
  );
}
