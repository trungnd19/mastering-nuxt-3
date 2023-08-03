// https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/prisma-validator
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

// Using TS Omit type + map function to add path to every lesson
const lessonSelect = Prisma.validator<Prisma.LessonArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
  },
});
export type LessonOutline = Prisma.LessonGetPayload<typeof lessonSelect> & {
  path: string
};

const chapterSelect = Prisma.validator<Prisma.ChapterArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
    lessons: lessonSelect,
  },
});
export type ChapterOutline = Omit<Prisma.ChapterGetPayload<typeof chapterSelect>, 'lessons'> & {
  lessons: LessonOutline[]
};

const courseSelect = Prisma.validator<Prisma.CourseArgs>()({
  select: {
    title: true,
    chapters: chapterSelect,
  },
});
export type CourseOutline = Omit<Prisma.CourseGetPayload<typeof courseSelect>, 'chapters'> & {
  chapters: ChapterOutline[]
};

export default defineEventHandler(async (): Promise<CourseOutline> => {
  const outline = await prisma.course.findFirst(courseSelect);

  if(!outline) {
    throw createError({
      statusCode: 404,
      statusMessage: "Course not found!"
    })
  }

  // Map the outline, add lesson path
  const chapters = outline.chapters.map(chapter => ({
    ...chapter,
    lessons: chapter.lessons.map((lesson) => ({
      ...lesson,
      path: `/course/chapter/${chapter.slug}/lesson/${lesson.slug}`
    }))
  }))

  return {
    ...outline,
    chapters
  }
});

// include all the chapters, include all the lessons in chapter
// export default defineEventHandler((event) => {
//   prisma.course.findFirst({
//     select: {
//       title: true,
//       chapters: {
//         select: {
//           title: true,
//           slug: true,
//           number: true,
//           lessons: {
//             select: {
//               title: true,
//               slug: true,
//               number: true,
//             },
//           },
//         },
//       },
//     },
//   });
// });
