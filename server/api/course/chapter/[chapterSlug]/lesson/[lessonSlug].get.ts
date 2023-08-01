import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
  const { chapterSlug, lessonSlug } = event.context.params;
  
  const lesson = await prisma.lesson.findFirst({
    where: {
        slug: lessonSlug,
        Chapter: {
            slug: chapterSlug
        }
    }
  }); // findMany

  if(!lesson) {
    throw createError({
        statusCode: 404,
        statusMessage: "Lesson not found"
    })
  }

  return {
    ...lesson,
    path: `/course/chapter/${chapterSlug}/lesson/${lessonSlug}`
  };

  // Get an array of lesson slug
//   return prisma.lesson.findMany({
//     where: {
//       Chapter: {
//         slug: chapterSlug,
//       },
//     },
//     select: {
//       slug: true,
//     },
//   });

  // Get first lesson with Chapter's slug and title info
//   return prisma.lesson.findFirst({
//     where: {
//       Chapter: {
//         slug: chapterSlug,
//       },
//     },
//     include: {
//         Chapter: {
//             select: {
//                 slug: true,
//                 title: true
//             }
//         }
//     }
//   });
});
