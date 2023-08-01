import { Lesson } from "@prisma/client"

// export type Lesson = {
//   title: string;
//   slug: string;
//   number: number;
//   downloadUrl: string;
//   sourceUrl?: string;
//   videoId: string;
//   text: string;
// };

// intersection type => combine 2 types together
export type LessonWithPath = Lesson & { path: string };

export type Chapter = {
  title: string;
  slug: string;
  number: number;
  lessons: Lesson[] | LessonWithPath[];
};

export type Course = {
  title: string;
  chapters: Chapter[];
};

export type OutlineBase = {
  title: string;
  slug: string;
  number: number;
};

export type OutlineChapter = OutlineBase & {
  lessons: OutlineLesson[];
};

export type OutlineLesson = OutlineBase & {
  path: string;
};

export type CourseMeta = {
  title: string;
  chapters: OutlineChapter[];
};
