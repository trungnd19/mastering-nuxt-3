// https://www.prisma.io/docs/concepts/components/prisma-client/advanced-type-safety/prisma-validator
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

const lessonSelect = Prisma.validator<Prisma.LessonArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
  },
});
export type LessonOutline = Prisma.LessonGetPayload<typeof lessonSelect>;

const chapterSelect = Prisma.validator<Prisma.ChapterArgs>()({
  select: {
    title: true,
    slug: true,
    number: true,
    lessons: lessonSelect,
  },
});
export type ChapterOutline = Prisma.ChapterGetPayload<typeof chapterSelect>;

const courseSelect = Prisma.validator<Prisma.CourseArgs>()({
  select: {
    title: true,
    chapters: chapterSelect,
  },
});
export type CourseOutline = Prisma.CourseGetPayload<typeof courseSelect>;

export default defineEventHandler(() => {
  return prisma.course.findFirst(courseSelect);
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
