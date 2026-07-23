import DashboardShell from "@/components/DashboardShell";
import { getUserProfile } from "@/app/actions/user";

export default async function SubjectsLayout({ children }: { children: React.ReactNode }) {
  const profile = await getUserProfile();
  
  if (profile) {
    return <DashboardShell initialProfile={profile} noPadding={true}>{children}</DashboardShell>;
  }

  return <>{children}</>;
}
