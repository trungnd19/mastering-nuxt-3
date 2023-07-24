import { Course, Chapter, Lesson, LessonWithPath } from "types/course";
import course from "~/server/courseData";

export default defineEventHandler((event): LessonWithPath => {
    // @ts-ignore
    const { chapterSlug, lessonSlug } = event.context.params;

    // @ts-ignore
    const chapter: Maybe<Chapter> = course?.chapters.find((chapter) => chapter.slug === chapterSlug);

    const lesson: Maybe<Lesson> = chapter?.lessons.find((lesson) => lesson.slug === lessonSlug);

    if(!chapter) {
        throw createError({
            statusCode: 404,
            message: "Chapter not found"
        })
    }

    if(!lesson) {
        throw createError({
            statusCode: 404,
            message: "Lesson not found"
        })
    }

    return {
        ...lesson,
        path: `/course/chapter/${chapterSlug}/${lessonSlug}`
    };
})