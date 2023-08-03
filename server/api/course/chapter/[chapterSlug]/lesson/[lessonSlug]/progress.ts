import { Lesson, PrismaClient } from "@prisma/client";
import protectRoute from "~~/server/utils/protectRoute";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
    // Only allow put, patch, post method
    assertMethod(event, ['PUT', 'PATCH', 'POST'])

    // Throw 404 if user not login
    protectRoute(event)

    // Get the route params
    const {chapterSlug, lessonSlug} = event.context.params

    // Get the lesson from DB
    const lesson = await prisma.lesson.findFirst({
        where: {
            slug: lessonSlug,
            Chapter: {
                slug: chapterSlug
            }
        }
    })

    if(!lesson) {
        throw createError({
            statusCode: 404,
            message: "Lesson not found",
        });
    }

    // Get the completed value from the request body and update progress
    // Select based on the chapter and lesson slug
    const {completed} = await readBody(event)

    // Get user email from the supabase user if there is one
    const { user: { userEmail } } = event.context;

    console.log(lesson, 'lesson')
    debugger

    // upsert: update or insert new record
    return prisma.lessonProgress.upsert({
        where: {
            // lessonId_userEmail => unique id
            lessonId_userEmail: {
                lessonId: lesson.id,
                userEmail
            }
        },
        update: {
            completed
        },
        create: {
            completed,
            userEmail,
            Lesson: {
                connect: {
                    id: lesson.id
                }
            }
        }
        
    })
})