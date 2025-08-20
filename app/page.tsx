import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-100 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <div className="text-center space-y-8 max-w-2xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
            Ski Trip Planner
          </h1>
          
          {/* Subtitle */}
          <p className="text-2xl md:text-3xl font-medium text-blue-600 dark:text-blue-400">
            By Ali Gajani
          </p>
          
          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-colors duration-200"
          >
            Get Started
          </Link>
          
          
        </div>
      </div>
    </div>
  );
}
