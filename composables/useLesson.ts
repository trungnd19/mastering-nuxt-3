import { StorageSerializers } from "@vueuse/core";
import { LessonWithPath } from "~~/types/course";

export default async (chapterSlug: string, lessonSlug: string) => {
  const url = `/api/course/chapter/${chapterSlug}/lesson/${lessonSlug}`;
  const lesson = useSessionStorage<LessonWithPath>(url, null, {
    // By passing null as default => not know which serializer to use
    serializer: StorageSerializers.object,
  });

  if (!lesson.value) {
    const { data, error } = await useFetch<LessonWithPath>(url, 
    // {
    //   pick: ['title', 'number']
    //   lazy: true
    // }
  );

    if (error.value) {
      throw createError({
        ...error.value,
        statusMessage: `Could not fetch lesson ${lessonSlug} in chapter ${chapterSlug}`,
      });
    }

    lesson.value = data.value; // Gán lại data cho cache
  } else {
    console.log(
      `Getting lesson ${lessonSlug} in chapter ${chapterSlug} from cache`
    );
  }

  return lesson;
};
