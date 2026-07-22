import { getUserAssessmentHistory } from "@/app/actions/assessment-history-actions";
import AssessmentHistoryClient from "./AssessmentHistoryClient";

export default async function AssessmentHistoryPage() {
  const history = await getUserAssessmentHistory();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-16">
      <AssessmentHistoryClient initialHistory={history} />
    </div>
  );
}
