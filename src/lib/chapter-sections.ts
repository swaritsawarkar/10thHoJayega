import type { Chapter } from "@/types/app";

export type ChapterSection = {
  id: string;
  title: string;
  description?: string;
  chapterIds: string[];
};

export type ChapterGroup = {
  section: Omit<ChapterSection, "chapterIds"> | null;
  chapters: Chapter[];
};

const chapterSectionsBySubject: Record<string, ChapterSection[]> = {
  science: [
    {
      id: "chemistry",
      title: "Chemistry",
      chapterIds: [
        "science-chemical-reactions",
        "science-acids-bases-salts",
        "science-metals-non-metals",
        "science-carbon-compounds",
      ],
    },
    {
      id: "biology",
      title: "Biology",
      chapterIds: [
        "science-life-processes",
        "science-control-coordination",
        "science-organisms-reproduce",
        "science-heredity",
      ],
    },
    {
      id: "physics",
      title: "Physics",
      chapterIds: [
        "science-light-reflection-refraction",
        "science-human-eye-colourful-world",
        "science-electricity",
        "science-magnetic-effects-electric-current",
      ],
    },
    {
      id: "environment",
      title: "Environment",
      chapterIds: ["science-our-environment"],
    },
  ],
  english: [
    {
      id: "first-flight-prose",
      title: "First Flight - Prose",
      chapterIds: [
        "english-first-flight-letter-god",
        "english-first-flight-nelson-mandela",
        "english-first-flight-stories-flying",
        "english-first-flight-anne-frank",
        "english-first-flight-glimpses-india",
        "english-first-flight-mijbil-otter",
        "english-first-flight-madam-rides-bus",
        "english-first-flight-sermon-benares",
        "english-first-flight-proposal",
      ],
    },
    {
      id: "first-flight-poems",
      title: "First Flight - Poems",
      chapterIds: [
        "english-poem-dust-snow",
        "english-poem-fire-ice",
        "english-poem-tiger-zoo",
        "english-poem-how-to-tell-wild-animals",
        "english-poem-ball-poem",
        "english-poem-amanda",
        "english-poem-trees",
        "english-poem-fog",
        "english-poem-custard-dragon",
        "english-poem-anne-gregory",
      ],
    },
    {
      id: "footprints-without-feet",
      title: "Footprints Without Feet",
      chapterIds: [
        "english-footprints-triumph-surgery",
        "english-footprints-thief-story",
        "english-footprints-midnight-visitor",
        "english-footprints-question-trust",
        "english-footprints",
        "english-footprints-making-scientist",
        "english-footprints-necklace",
        "english-footprints-bholi",
        "english-footprints-book-saved-earth",
      ],
    },
  ],
  "social-science": [
    {
      id: "history",
      title: "History - India and the Contemporary World II",
      chapterIds: [
        "sst-rise-nationalism-europe",
        "sst-nationalism-india",
        "sst-making-global-world",
        "sst-age-industrialisation",
        "sst-print-culture",
      ],
    },
    {
      id: "geography",
      title: "Geography - Contemporary India II",
      chapterIds: [
        "sst-resources-development",
        "sst-forest-wildlife-resources",
        "sst-water-resources",
        "sst-agriculture",
        "sst-minerals-energy-resources",
        "sst-manufacturing-industries",
        "sst-lifelines-national-economy",
      ],
    },
    {
      id: "civics",
      title: "Civics - Democratic Politics II",
      chapterIds: [
        "sst-power-sharing",
        "sst-federalism",
        "sst-gender-religion-caste",
        "sst-political-parties",
        "sst-outcomes-democracy",
      ],
    },
    {
      id: "economics",
      title: "Economics - Understanding Economic Development",
      chapterIds: [
        "sst-development",
        "sst-sectors-indian-economy",
        "sst-money-credit",
        "sst-globalisation-indian-economy",
        "sst-consumer-rights",
      ],
    },
  ],
  hindi: [
    {
      id: "kshitij-kavya",
      title: "Kshitij - Kavya Khand",
      chapterIds: [
        "hindi-kshitij-surdas",
        "hindi-kshitij-tulsidas",
        "hindi-kshitij-jaishankar-prasad",
        "hindi-kshitij-nirala",
        "hindi-kshitij-nagarjun",
        "hindi-kshitij-manglesh-dabral",
      ],
    },
    {
      id: "kshitij-gadya",
      title: "Kshitij - Gadya Khand",
      chapterIds: [
        "hindi-kshitij-swayam-prakash",
        "hindi-kshitij-ramvriksh-benipuri",
        "hindi-kshitij-yashpal",
        "hindi-kshitij-mannu-bhandari",
        "hindi-kshitij-yatindra-mishra",
        "hindi-kshitij-bhadant-anand-kausalyayan",
      ],
    },
    {
      id: "kritika",
      title: "Kritika",
      chapterIds: [
        "hindi-kritika-mata-ka-anchal",
        "hindi-kritika-sana-sana-hath-jodi",
        "hindi-kritika-main-kyon-likhta-hoon",
      ],
    },
  ],
};

const subjectSupportNotes: Record<string, string> = {
  english:
    "Writing skills and grammar are not supported in the tracker yet. Coming soon.",
};

export function getChapterGroups(
  subjectId: string,
  chapters: Chapter[],
): ChapterGroup[] {
  const sections = chapterSectionsBySubject[subjectId];

  if (!sections) {
    return [{ section: null, chapters }];
  }

  const chaptersById = new Map(
    chapters.map((chapter) => [chapter.id, chapter]),
  );
  const usedChapterIds = new Set<string>();
  const groups: ChapterGroup[] = sections
    .map((section) => {
      const sectionChapters = section.chapterIds
        .map((chapterId) => chaptersById.get(chapterId))
        .filter((chapter): chapter is Chapter => Boolean(chapter));

      sectionChapters.forEach((chapter) => usedChapterIds.add(chapter.id));

      return {
        section: {
          id: section.id,
          title: section.title,
          description: section.description,
        },
        chapters: sectionChapters,
      };
    })
    .filter((group) => group.chapters.length > 0);

  const uncategorizedChapters = chapters.filter(
    (chapter) => !usedChapterIds.has(chapter.id),
  );

  if (uncategorizedChapters.length > 0) {
    groups.push({
      section: {
        id: "other",
        title: "Other Chapters",
      },
      chapters: uncategorizedChapters,
    });
  }

  return groups.length > 0 ? groups : [{ section: null, chapters }];
}

export function getChapterSectionTitle(subjectId: string, chapterId: string) {
  return chapterSectionsBySubject[subjectId]?.find((section) =>
    section.chapterIds.includes(chapterId),
  )?.title;
}

export function getSubjectSupportNote(subjectId: string) {
  return subjectSupportNotes[subjectId];
}
