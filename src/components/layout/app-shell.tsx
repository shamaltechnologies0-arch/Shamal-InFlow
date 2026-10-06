import { getSession, type SessionUser } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  let user: SessionUser | null = null;
  try {
    user = await getSession();
  } catch {
    user = null;
  }

  return (
    <div className="app-atmosphere flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <Topbar />
      <div className="flex min-h-0 flex-1">
        <Sidebar user={user} />
        <main className="flex-1 overflow-y-auto px-5 py-6 md:px-8 md:py-7">
          <div className="animate-fade-up mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
