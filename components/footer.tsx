import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="w-full flex items-center justify-center border-t border-gray-200 dark:border-gray-700 mx-auto text-center text-sm py-12 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-left">
          <div>
            <div className="mb-3">
              <Logo size="lg" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              The wellness OS for modern therapists, coaches, and psychologists.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li><a href="#" className="hover:text-emerald-600">Features</a></li>
              <li><a href="#" className="hover:text-emerald-600">Pricing</a></li>
              <li><a href="#" className="hover:text-emerald-600">Security</a></li>
              <li><a href="#" className="hover:text-emerald-600">Integrations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li><a href="#" className="hover:text-emerald-600">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-600">Contact Us</a></li>
              <li><a href="#" className="hover:text-emerald-600">Training</a></li>
              <li><a href="#" className="hover:text-emerald-600">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-black dark:text-white mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li><a href="#" className="hover:text-emerald-600">About</a></li>
              <li><a href="#" className="hover:text-emerald-600">Blog</a></li>
              <li><a href="#" className="hover:text-emerald-600">Careers</a></li>
              <li><a href="#" className="hover:text-emerald-600">Privacy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2025 Theranote. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
