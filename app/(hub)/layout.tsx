import DashboardShell from "@/components/DashboardShell";
import { getUserProfile } from "@/app/actions/user";
import { Toaster } from "sonner";

export default async function HubLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();
  return (
    <>
      <DashboardShell initialProfile={profile}>{children}</DashboardShell>
      <Toaster position="bottom-right" richColors />
    </>
  );
}
