import type { Subject } from "@/types/app";

const cleanSubjectDescriptions: Record<string, string> = {
  maths: "Complete NCERT Class 10 Mathematics chapter and exercise tracker.",
  science:
    "NCERT Science tracker grouped into Chemistry, Biology, Physics, and Environment.",
  "social-science":
    "History, Geography, Civics, and Economics progress from the NCERT books.",
  english: "NCERT First Flight and Footprints Without Feet literature tracker.",
  hindi: "NCERT Kshitij and Kritika reading tracker for Hindi Course A.",
  french: "CBSE Entre Jeunes Class 10 culture-and-civilisation lesson tracker.",
  optional: "School-specific optional subject tracker.",
};

const sampleDataCopyPattern =
  /\b(sample|verify official syllabus|verify against official|tracker testing)\b/i;

export function getSubjectDescription(
  subject: Pick<Subject, "id" | "description">,
) {
  const description = subject.description?.trim();

  if (!description || sampleDataCopyPattern.test(description)) {
    return (
      cleanSubjectDescriptions[subject.id] ??
      "Track chapters and revision status for this subject."
    );
  }

  return description;
}
