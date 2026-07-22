"use client";

import TakeTestClient from "../take-test/TakeTestClient";

export default function TakeExamClient({ lessons }: { lessons: any[] }) {
  return <TakeTestClient lessons={lessons} />;
}
