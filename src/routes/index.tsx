import { createFileRoute } from "@tanstack/react-router";
import CskCoachingPlatform from "@/components/CskCoachingPlatform";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CSK Coaching Platform — Mobile Blueprints" },
      { name: "description", content: "Mobile app blueprints for the CSK coaching platform — coach and student flows." },
      { property: "og:title", content: "CSK Coaching Platform — Mobile Blueprints" },
      { property: "og:description", content: "Mobile app blueprints for the CSK coaching platform — coach and student flows." },
    ],
  }),
  component: Index,
});

function Index() {
  return <CskCoachingPlatform />;
}
