import type { Chapter, Exercise, Subject } from "@/types/app";

export const MANAGED_SYLLABUS_SUBJECT_IDS = new Set([
  "maths",
  "science",
  "social-science",
  "english",
  "hindi",
  "french",
]);

const mathsUrl = "https://www.ncert.nic.in/textbook/pdf/jemh1ps.pdf";
const scienceUrl = "https://www.ncert.nic.in/textbook/pdf/jesc1ps.pdf";
const historyUrl = "https://ncert.nic.in/textbook/pdf/jess3ps.pdf";
const geographyUrl = "https://www.ncert.nic.in/textbook/pdf/jess1ps.pdf";
const civicsUrl = "https://ncert.nic.in/textbook/pdf/jess4ps.pdf";
const economicsUrl = "https://www.ncert.nic.in/textbook/pdf/jess2ps.pdf";
const firstFlightUrl = "https://ncert.nic.in/textbook/pdf/jeff1ps.pdf";
const footprintsUrl = "https://ncert.nic.in/textbook/pdf/jefp1ps.pdf";
const kshitijUrl = "https://ncert.nic.in/textbook/pdf/jhks1ps.pdf";
const kritikaUrl = "https://ncert.nic.in/textbook/pdf/jhkr1ps.pdf";
const frenchUrl =
  "https://cbseacademic.nic.in/web_material/CurriculumMain26/Sec/French_Sec_2025-26.pdf";

export const canonicalSubjects: Subject[] = [
  {
    id: "maths",
    name: "Maths",
    description:
      "Complete NCERT Class 10 Mathematics chapter and exercise tracker.",
    sort_order: 10,
  },
  {
    id: "science",
    name: "Science",
    description:
      "NCERT Science tracker grouped into Chemistry, Biology, Physics, and Environment.",
    sort_order: 20,
  },
  {
    id: "social-science",
    name: "Social Science",
    description:
      "History, Geography, Civics, and Economics progress from the NCERT books.",
    sort_order: 30,
  },
  {
    id: "english",
    name: "English",
    description:
      "NCERT First Flight and Footprints Without Feet literature tracker.",
    sort_order: 40,
  },
  {
    id: "hindi",
    name: "Hindi",
    description:
      "NCERT Kshitij and Kritika reading tracker for Hindi Course A.",
    sort_order: 50,
  },
  {
    id: "french",
    name: "French",
    description:
      "CBSE Entre Jeunes Class 10 culture-and-civilisation lesson tracker.",
    sort_order: 50,
  },
  {
    id: "optional",
    name: "Optional Subject",
    description: "School-specific optional subject tracker.",
    sort_order: 60,
  },
];

export const canonicalChapters: Chapter[] = [
  chapter("maths-real-numbers", "maths", "Real Numbers", 1, mathsUrl, 101),
  chapter("maths-polynomials", "maths", "Polynomials", 2, mathsUrl, 102),
  chapter(
    "maths-linear-equations",
    "maths",
    "Pair of Linear Equations in Two Variables",
    3,
    mathsUrl,
    103,
  ),
  chapter(
    "maths-quadratic-equations",
    "maths",
    "Quadratic Equations",
    4,
    mathsUrl,
    104,
  ),
  chapter(
    "maths-arithmetic-progressions",
    "maths",
    "Arithmetic Progressions",
    5,
    mathsUrl,
    105,
  ),
  chapter("maths-triangles", "maths", "Triangles", 6, mathsUrl, 106),
  chapter(
    "maths-coordinate-geometry",
    "maths",
    "Coordinate Geometry",
    7,
    mathsUrl,
    107,
  ),
  chapter(
    "maths-introduction-trigonometry",
    "maths",
    "Introduction to Trigonometry",
    8,
    mathsUrl,
    108,
  ),
  chapter(
    "maths-applications-trigonometry",
    "maths",
    "Some Applications of Trigonometry",
    9,
    mathsUrl,
    109,
  ),
  chapter("maths-circles", "maths", "Circles", 10, mathsUrl, 110),
  chapter(
    "maths-areas-related-circles",
    "maths",
    "Areas Related to Circles",
    11,
    mathsUrl,
    111,
  ),
  chapter(
    "maths-surface-areas-volumes",
    "maths",
    "Surface Areas and Volumes",
    12,
    mathsUrl,
    112,
  ),
  chapter("maths-statistics", "maths", "Statistics", 13, mathsUrl, 113),
  chapter("maths-probability", "maths", "Probability", 14, mathsUrl, 114),

  chapter(
    "science-chemical-reactions",
    "science",
    "Chemical Reactions and Equations",
    1,
    scienceUrl,
    201,
  ),
  chapter(
    "science-acids-bases-salts",
    "science",
    "Acids, Bases and Salts",
    2,
    scienceUrl,
    202,
  ),
  chapter(
    "science-metals-non-metals",
    "science",
    "Metals and Non-metals",
    3,
    scienceUrl,
    203,
  ),
  chapter(
    "science-carbon-compounds",
    "science",
    "Carbon and its Compounds",
    4,
    scienceUrl,
    204,
  ),
  chapter(
    "science-life-processes",
    "science",
    "Life Processes",
    5,
    scienceUrl,
    205,
  ),
  chapter(
    "science-control-coordination",
    "science",
    "Control and Coordination",
    6,
    scienceUrl,
    206,
  ),
  chapter(
    "science-organisms-reproduce",
    "science",
    "How do Organisms Reproduce?",
    7,
    scienceUrl,
    207,
  ),
  chapter("science-heredity", "science", "Heredity", 8, scienceUrl, 208),
  chapter(
    "science-light-reflection-refraction",
    "science",
    "Light - Reflection and Refraction",
    9,
    scienceUrl,
    209,
  ),
  chapter(
    "science-human-eye-colourful-world",
    "science",
    "The Human Eye and the Colourful World",
    10,
    scienceUrl,
    210,
  ),
  chapter("science-electricity", "science", "Electricity", 11, scienceUrl, 211),
  chapter(
    "science-magnetic-effects-electric-current",
    "science",
    "Magnetic Effects of Electric Current",
    12,
    scienceUrl,
    212,
  ),
  chapter(
    "science-our-environment",
    "science",
    "Our Environment",
    13,
    scienceUrl,
    213,
  ),

  chapter(
    "sst-rise-nationalism-europe",
    "social-science",
    "The Rise of Nationalism in Europe",
    1,
    historyUrl,
    301,
  ),
  chapter(
    "sst-nationalism-india",
    "social-science",
    "Nationalism in India",
    2,
    historyUrl,
    302,
  ),
  chapter(
    "sst-making-global-world",
    "social-science",
    "The Making of a Global World",
    3,
    historyUrl,
    303,
  ),
  chapter(
    "sst-age-industrialisation",
    "social-science",
    "The Age of Industrialisation",
    4,
    historyUrl,
    304,
  ),
  chapter(
    "sst-print-culture",
    "social-science",
    "Print Culture and the Modern World",
    5,
    historyUrl,
    305,
  ),
  chapter(
    "sst-resources-development",
    "social-science",
    "Resources and Development",
    1,
    geographyUrl,
    321,
  ),
  chapter(
    "sst-forest-wildlife-resources",
    "social-science",
    "Forest and Wildlife Resources",
    2,
    geographyUrl,
    322,
  ),
  chapter(
    "sst-water-resources",
    "social-science",
    "Water Resources",
    3,
    geographyUrl,
    323,
  ),
  chapter(
    "sst-agriculture",
    "social-science",
    "Agriculture",
    4,
    geographyUrl,
    324,
  ),
  chapter(
    "sst-minerals-energy-resources",
    "social-science",
    "Minerals and Energy Resources",
    5,
    geographyUrl,
    325,
  ),
  chapter(
    "sst-manufacturing-industries",
    "social-science",
    "Manufacturing Industries",
    6,
    geographyUrl,
    326,
  ),
  chapter(
    "sst-lifelines-national-economy",
    "social-science",
    "Lifelines of National Economy",
    7,
    geographyUrl,
    327,
  ),
  chapter(
    "sst-power-sharing",
    "social-science",
    "Power-sharing",
    1,
    civicsUrl,
    341,
  ),
  chapter("sst-federalism", "social-science", "Federalism", 2, civicsUrl, 342),
  chapter(
    "sst-gender-religion-caste",
    "social-science",
    "Gender, Religion and Caste",
    3,
    civicsUrl,
    343,
  ),
  chapter(
    "sst-political-parties",
    "social-science",
    "Political Parties",
    4,
    civicsUrl,
    344,
  ),
  chapter(
    "sst-outcomes-democracy",
    "social-science",
    "Outcomes of Democracy",
    5,
    civicsUrl,
    345,
  ),
  chapter(
    "sst-development",
    "social-science",
    "Development",
    1,
    economicsUrl,
    361,
  ),
  chapter(
    "sst-sectors-indian-economy",
    "social-science",
    "Sectors of the Indian Economy",
    2,
    economicsUrl,
    362,
  ),
  chapter(
    "sst-money-credit",
    "social-science",
    "Money and Credit",
    3,
    economicsUrl,
    363,
  ),
  chapter(
    "sst-globalisation-indian-economy",
    "social-science",
    "Globalisation and the Indian Economy",
    4,
    economicsUrl,
    364,
  ),
  chapter(
    "sst-consumer-rights",
    "social-science",
    "Consumer Rights",
    5,
    economicsUrl,
    365,
  ),

  chapter(
    "english-first-flight-letter-god",
    "english",
    "A Letter to God",
    1,
    firstFlightUrl,
    401,
  ),
  chapter(
    "english-first-flight-nelson-mandela",
    "english",
    "Nelson Mandela - Long Walk to Freedom",
    2,
    firstFlightUrl,
    402,
  ),
  chapter(
    "english-first-flight-stories-flying",
    "english",
    "Stories About Flying",
    3,
    firstFlightUrl,
    403,
  ),
  chapter(
    "english-first-flight-anne-frank",
    "english",
    "From the Diary of Anne Frank",
    4,
    firstFlightUrl,
    404,
  ),
  chapter(
    "english-first-flight-glimpses-india",
    "english",
    "Glimpses of India",
    5,
    firstFlightUrl,
    405,
  ),
  chapter(
    "english-first-flight-mijbil-otter",
    "english",
    "Mijbil the Otter",
    6,
    firstFlightUrl,
    406,
  ),
  chapter(
    "english-first-flight-madam-rides-bus",
    "english",
    "Madam Rides the Bus",
    7,
    firstFlightUrl,
    407,
  ),
  chapter(
    "english-first-flight-sermon-benares",
    "english",
    "The Sermon at Benares",
    8,
    firstFlightUrl,
    408,
  ),
  chapter(
    "english-first-flight-proposal",
    "english",
    "The Proposal",
    9,
    firstFlightUrl,
    409,
  ),
  chapter(
    "english-poem-dust-snow",
    "english",
    "Dust of Snow",
    1,
    firstFlightUrl,
    431,
  ),
  chapter(
    "english-poem-fire-ice",
    "english",
    "Fire and Ice",
    2,
    firstFlightUrl,
    432,
  ),
  chapter(
    "english-poem-tiger-zoo",
    "english",
    "A Tiger in the Zoo",
    3,
    firstFlightUrl,
    433,
  ),
  chapter(
    "english-poem-how-to-tell-wild-animals",
    "english",
    "How to Tell Wild Animals",
    4,
    firstFlightUrl,
    434,
  ),
  chapter(
    "english-poem-ball-poem",
    "english",
    "The Ball Poem",
    5,
    firstFlightUrl,
    435,
  ),
  chapter("english-poem-amanda", "english", "Amanda!", 6, firstFlightUrl, 436),
  chapter("english-poem-trees", "english", "The Trees", 7, firstFlightUrl, 437),
  chapter("english-poem-fog", "english", "Fog", 8, firstFlightUrl, 438),
  chapter(
    "english-poem-custard-dragon",
    "english",
    "The Tale of Custard the Dragon",
    9,
    firstFlightUrl,
    439,
  ),
  chapter(
    "english-poem-anne-gregory",
    "english",
    "For Anne Gregory",
    10,
    firstFlightUrl,
    440,
  ),
  chapter(
    "english-footprints-triumph-surgery",
    "english",
    "A Triumph of Surgery",
    1,
    footprintsUrl,
    461,
  ),
  chapter(
    "english-footprints-thief-story",
    "english",
    "The Thief's Story",
    2,
    footprintsUrl,
    462,
  ),
  chapter(
    "english-footprints-midnight-visitor",
    "english",
    "The Midnight Visitor",
    3,
    footprintsUrl,
    463,
  ),
  chapter(
    "english-footprints-question-trust",
    "english",
    "A Question of Trust",
    4,
    footprintsUrl,
    464,
  ),
  chapter(
    "english-footprints",
    "english",
    "Footprints Without Feet",
    5,
    footprintsUrl,
    465,
  ),
  chapter(
    "english-footprints-making-scientist",
    "english",
    "The Making of a Scientist",
    6,
    footprintsUrl,
    466,
  ),
  chapter(
    "english-footprints-necklace",
    "english",
    "The Necklace",
    7,
    footprintsUrl,
    467,
  ),
  chapter(
    "english-footprints-bholi",
    "english",
    "Bholi",
    8,
    footprintsUrl,
    468,
  ),
  chapter(
    "english-footprints-book-saved-earth",
    "english",
    "The Book that Saved the Earth",
    9,
    footprintsUrl,
    469,
  ),

  chapter("hindi-kshitij-surdas", "hindi", "सूरदास - पद", 1, kshitijUrl, 501),
  chapter(
    "hindi-kshitij-tulsidas",
    "hindi",
    "तुलसीदास - राम-लक्ष्मण-परशुराम संवाद",
    2,
    kshitijUrl,
    502,
  ),
  chapter(
    "hindi-kshitij-jaishankar-prasad",
    "hindi",
    "जयशंकर प्रसाद - आत्मकथ्य",
    3,
    kshitijUrl,
    503,
  ),
  chapter(
    "hindi-kshitij-nirala",
    "hindi",
    "सूर्यकांत त्रिपाठी निराला - उत्साह / अट नहीं रही है",
    4,
    kshitijUrl,
    504,
  ),
  chapter(
    "hindi-kshitij-nagarjun",
    "hindi",
    "नागार्जुन - यह दंतुरित मुस्कान / फसल",
    5,
    kshitijUrl,
    505,
  ),
  chapter(
    "hindi-kshitij-manglesh-dabral",
    "hindi",
    "मंगलेश डबराल - संगतकार",
    6,
    kshitijUrl,
    506,
  ),
  chapter(
    "hindi-kshitij-swayam-prakash",
    "hindi",
    "स्वयं प्रकाश - नेताजी का चश्मा",
    7,
    kshitijUrl,
    521,
  ),
  chapter(
    "hindi-kshitij-ramvriksh-benipuri",
    "hindi",
    "रामवृक्ष बेनीपुरी - बालगोबिन भगत",
    8,
    kshitijUrl,
    522,
  ),
  chapter(
    "hindi-kshitij-yashpal",
    "hindi",
    "यशपाल - लखनवी अंदाज़",
    9,
    kshitijUrl,
    523,
  ),
  chapter(
    "hindi-kshitij-mannu-bhandari",
    "hindi",
    "मन्नू भंडारी - एक कहानी यह भी",
    10,
    kshitijUrl,
    524,
  ),
  chapter(
    "hindi-kshitij-yatindra-mishra",
    "hindi",
    "यतीन्द्र मिश्र - नौबतखाने में इबादत",
    11,
    kshitijUrl,
    525,
  ),
  chapter(
    "hindi-kshitij-bhadant-anand-kausalyayan",
    "hindi",
    "भदंत आनंद कौसल्यायन - संस्कृति",
    12,
    kshitijUrl,
    526,
  ),
  chapter(
    "hindi-kritika-mata-ka-anchal",
    "hindi",
    "माता का अंचल",
    1,
    kritikaUrl,
    541,
  ),
  chapter(
    "hindi-kritika-sana-sana-hath-jodi",
    "hindi",
    "साना-साना हाथ जोड़ि...",
    2,
    kritikaUrl,
    542,
  ),
  chapter(
    "hindi-kritika-main-kyon-likhta-hoon",
    "hindi",
    "मैं क्यों लिखता हूँ?",
    3,
    kritikaUrl,
    543,
  ),

  chapter("french-apres-le-bac", "french", "Après le bac", 2, frenchUrl, 512),
  chapter(
    "french-chercher-travail",
    "french",
    "Chercher du travail",
    3,
    frenchUrl,
    513,
  ),
  chapter(
    "french-plaisir-lire",
    "french",
    "Le plaisir de lire",
    4,
    frenchUrl,
    514,
  ),
  chapter("french-les-medias", "french", "Les médias", 5, frenchUrl, 515),
  chapter(
    "french-chacun-ses-gouts",
    "french",
    "Chacun ses goûts",
    6,
    frenchUrl,
    516,
  ),
  chapter(
    "french-en-pleine-forme",
    "french",
    "En pleine forme",
    7,
    frenchUrl,
    517,
  ),
  chapter(
    "french-lenvironnement",
    "french",
    "L'environnement",
    8,
    frenchUrl,
    518,
  ),
  chapter(
    "french-vive-la-republique",
    "french",
    "Vive la République!",
    10,
    frenchUrl,
    520,
  ),

  chapter(
    "optional-school-specific",
    "optional",
    "School-specific Optional Subject",
    1,
    null,
    601,
  ),
];

export const canonicalExercises: Exercise[] = [
  exercise("ex-maths-real-1-1", "maths-real-numbers", "Exercise 1.1", 1011),
  exercise("ex-maths-real-1-2", "maths-real-numbers", "Exercise 1.2", 1012),
  exercise(
    "ex-maths-polynomials-2-1",
    "maths-polynomials",
    "Exercise 2.1",
    1021,
  ),
  exercise(
    "ex-maths-polynomials-2-2",
    "maths-polynomials",
    "Exercise 2.2",
    1022,
  ),
  exercise(
    "ex-maths-linear-3-1",
    "maths-linear-equations",
    "Exercise 3.1",
    1031,
  ),
  exercise(
    "ex-maths-linear-3-2",
    "maths-linear-equations",
    "Exercise 3.2",
    1032,
  ),
  exercise(
    "ex-maths-linear-3-3",
    "maths-linear-equations",
    "Exercise 3.3",
    1033,
  ),
  exercise(
    "ex-maths-quadratic-4-1",
    "maths-quadratic-equations",
    "Exercise 4.1",
    1041,
  ),
  exercise(
    "ex-maths-quadratic-4-2",
    "maths-quadratic-equations",
    "Exercise 4.2",
    1042,
  ),
  exercise(
    "ex-maths-arithmetic-5-1",
    "maths-arithmetic-progressions",
    "Exercise 5.1",
    1051,
  ),
  exercise(
    "ex-maths-arithmetic-5-2",
    "maths-arithmetic-progressions",
    "Exercise 5.2",
    1052,
  ),
  exercise(
    "ex-maths-arithmetic-5-3",
    "maths-arithmetic-progressions",
    "Exercise 5.3",
    1053,
  ),
  exercise("ex-maths-triangles-6-1", "maths-triangles", "Exercise 6.1", 1061),
  exercise("ex-maths-triangles-6-2", "maths-triangles", "Exercise 6.2", 1062),
  exercise("ex-maths-triangles-6-3", "maths-triangles", "Exercise 6.3", 1063),
  exercise(
    "ex-maths-coordinate-7-1",
    "maths-coordinate-geometry",
    "Exercise 7.1",
    1071,
  ),
  exercise(
    "ex-maths-coordinate-7-2",
    "maths-coordinate-geometry",
    "Exercise 7.2",
    1072,
  ),
  exercise(
    "ex-maths-trigonometry-8-1",
    "maths-introduction-trigonometry",
    "Exercise 8.1",
    1081,
  ),
  exercise(
    "ex-maths-trigonometry-8-2",
    "maths-introduction-trigonometry",
    "Exercise 8.2",
    1082,
  ),
  exercise(
    "ex-maths-trigonometry-8-3",
    "maths-introduction-trigonometry",
    "Exercise 8.3",
    1083,
  ),
  exercise(
    "ex-maths-applications-trigonometry-9-1",
    "maths-applications-trigonometry",
    "Exercise 9.1",
    1091,
  ),
  exercise("ex-maths-circles-10-1", "maths-circles", "Exercise 10.1", 1101),
  exercise("ex-maths-circles-10-2", "maths-circles", "Exercise 10.2", 1102),
  exercise(
    "ex-maths-areas-circles-11-1",
    "maths-areas-related-circles",
    "Exercise 11.1",
    1111,
  ),
  exercise(
    "ex-maths-surface-areas-volumes-12-1",
    "maths-surface-areas-volumes",
    "Exercise 12.1",
    1121,
  ),
  exercise(
    "ex-maths-surface-areas-volumes-12-2",
    "maths-surface-areas-volumes",
    "Exercise 12.2",
    1122,
  ),
  exercise(
    "ex-maths-statistics-13-1",
    "maths-statistics",
    "Exercise 13.1",
    1131,
  ),
  exercise(
    "ex-maths-statistics-13-2",
    "maths-statistics",
    "Exercise 13.2",
    1132,
  ),
  exercise(
    "ex-maths-statistics-13-3",
    "maths-statistics",
    "Exercise 13.3",
    1133,
  ),
  exercise(
    "ex-maths-probability-14-1",
    "maths-probability",
    "Exercise 14.1",
    1141,
  ),
];

const canonicalSubjectsById = new Map(
  canonicalSubjects.map((subject) => [subject.id, subject]),
);
const canonicalChaptersById = new Map(
  canonicalChapters.map((chapter) => [chapter.id, chapter]),
);
const canonicalChapterIds = new Set(
  canonicalChapters.map((chapter) => chapter.id),
);

export function mergeSubjectsWithCanonical(subjects: Subject[]) {
  const subjectById = new Map(subjects.map((subject) => [subject.id, subject]));

  canonicalSubjects.forEach((subject) => subjectById.set(subject.id, subject));

  return sortByOrder([...subjectById.values()]);
}

export function mergeChaptersWithCanonical(chapters: Chapter[]) {
  const chapterById = new Map<string, Chapter>();

  chapters.forEach((chapter) => {
    if (!MANAGED_SYLLABUS_SUBJECT_IDS.has(chapter.subject_id)) {
      chapterById.set(chapter.id, chapter);
    }
  });
  canonicalChapters.forEach((chapter) => chapterById.set(chapter.id, chapter));

  return sortByOrder([...chapterById.values()]);
}

export function mergeExercisesWithCanonical(exercises: Exercise[]) {
  const exerciseById = new Map<string, Exercise>();

  exercises.forEach((exerciseItem) => {
    if (!canonicalChapterIds.has(exerciseItem.chapter_id)) {
      exerciseById.set(exerciseItem.id, exerciseItem);
    }
  });
  canonicalExercises.forEach((exerciseItem) =>
    exerciseById.set(exerciseItem.id, exerciseItem),
  );

  return sortByOrder([...exerciseById.values()]);
}

export function getCanonicalSubject(subjectId: string) {
  return canonicalSubjectsById.get(subjectId) ?? null;
}

export function getCanonicalChapter(chapterId: string) {
  return canonicalChaptersById.get(chapterId) ?? null;
}

export function mergeSubjectChaptersWithCanonical(
  subjectId: string,
  chapters: Chapter[],
) {
  if (MANAGED_SYLLABUS_SUBJECT_IDS.has(subjectId)) {
    return canonicalChapters.filter(
      (chapterItem) => chapterItem.subject_id === subjectId,
    );
  }

  return sortByOrder(chapters);
}

export function mergeSubjectExercisesWithCanonical(
  subjectId: string,
  exercises: Exercise[],
) {
  if (subjectId === "maths") {
    return canonicalExercises;
  }

  return sortByOrder(exercises);
}

function chapter(
  id: string,
  subject_id: string,
  title: string,
  chapter_number: number | null,
  official_textbook_url: string | null,
  sort_order: number,
): Chapter {
  return {
    id,
    subject_id,
    title,
    chapter_number,
    official_textbook_url,
    sort_order,
  };
}

function exercise(
  id: string,
  chapter_id: string,
  title: string,
  sort_order: number,
): Exercise {
  return {
    id,
    chapter_id,
    title,
    sort_order,
  };
}

function sortByOrder<T extends { sort_order: number; id: string }>(items: T[]) {
  return [...items].sort(
    (a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id),
  );
}
