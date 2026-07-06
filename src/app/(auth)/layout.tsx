import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <Link href="/" className="text-xl font-semibold tracking-tight">
            AI Interview Tutor
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
