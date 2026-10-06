import { redirect } from "next/navigation";
import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  try {
    const { getSession } = await import("@/lib/auth");
    const session = await getSession();
    if (session) redirect("/");
  } catch {
    // show login
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#060e18] text-foreground">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-35"
        style={{ backgroundImage: "url(/login-bg.jpg)" }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#060e18]/70 via-[#060e18]/85 to-[#060e18]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgb(62_201_194_/_12%),transparent_55%)]"
        aria-hidden
      />

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <span className="mb-8 inline-flex items-center rounded-md bg-white px-3 py-2">
          <Image
            src="/shamal-logo.png"
            alt="Shamal Inventory"
            width={952}
            height={172}
            className="h-16 w-auto"
            priority
          />
        </span>
        <div className="animate-fade-up w-full max-w-md rounded-2xl border border-white/10 bg-surface/80 px-8 py-10 shadow-panel backdrop-blur-xl sm:px-10">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
            Command access
          </p>
          <h1 className="mt-2 text-center text-xl font-semibold tracking-tight text-foreground">
            UAV Operations Management
          </h1>
          <p className="mt-2 border-b border-border/80 pb-5 text-center text-sm text-foreground-muted">
            Sign in to Shamal Inventory
          </p>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
