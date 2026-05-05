import type { Subject } from "@/types/app";

const cleanSubjectDescriptions: Record<string, string> = {
  maths: "Chapter and exercise tracker for Class 10 Maths.",
  science: "Science chapters in one clean progress checklist.",
  "social-science": "History, Geography, Civics, and Economics progress.",
  english: "English course tracker for reading, writing, and revision.",
  hindi: "Hindi language subject tracker for your course.",
  french: "French language subject tracker for your course.",
  optional: "School-specific optional subject tracker.",
};

const sampleDataCopyPattern =
  /\b(sample|verify official syllabus|verify against official|tracker testing)\b/i;

export function getSubjectDescription(subject: Pick<Subject, "id" | "description">) {
  const description = subject.description?.trim();

  if (!description || sampleDataCopyPattern.test(description)) {
    return (
      cleanSubjectDescriptions[subject.id] ??
      "Track chapters and revision status for this subject."
    );
  }

  return description;
}
