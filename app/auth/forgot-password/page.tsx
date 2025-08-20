import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <Header />
      <div className="flex min-h-[calc(100vh-7rem)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <ForgotPasswordForm />
        </div>
      </div>
      <Footer />
    </div>
  );
}
