import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Available Quizzes",
};

export default function QuizzesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
