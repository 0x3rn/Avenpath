import DashboardShell from "@/components/DashboardShell";

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
