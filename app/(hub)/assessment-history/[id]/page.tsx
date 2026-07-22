import { getAssessmentSubmissionById } from "@/app/actions/assessment-history-actions";
import { notFound } from "next/navigation";
import AssessmentDetailClient from "./AssessmentDetailClient";

export default async function AssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id, 10);

  if (isNaN(numId)) {
    notFound();
  }

  const submission = await getAssessmentSubmissionById(numId);

  if (!submission) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
      <AssessmentDetailClient submission={submission} />
    </div>
  );
}
