import { defineStore } from "pinia";
import { CourseProgress } from "~~/types/course";

export const useCourseProgress = defineStore("courseProgress", () => {
  // initialize progress from local storage
  const progress = ref<CourseProgress>({});

  const initialized = ref(false);

  async function initialize() {
    // if the course has already been initialized, return
    if (initialized.value) return;
    initialized.value = true;

    // fetch user progress from endpoint
    const { data: userProgress } = await useFetch<CourseProgress>(
      "/api/user/progress",
      {
        headers: useRequestHeaders(["cookie"]),
      }
    );

    // Update progress value
    if (userProgress.value) {
      progress.value = userProgress.value;
    }
  }

  const toggleComplete = async (chapter: string, lesson: string) => {
    // If no user => return
    const user = useSupabaseUser();
    if (!user.value) return;

    if (!chapter || !lesson) {
      const {
        params: { chapterSlug, lessonSlug },
      } = useRoute();
      chapter = chapterSlug as string;
      lesson = lessonSlug as string;
    }

    // Get current progress for the lesson
    const currentProgress = progress.value[chapter]?.[lesson];

    progress.value[chapter] = {
      ...progress.value[chapter],
      [lesson]: !currentProgress,
    };

    // TODO: update in db
    try {
      await $fetch(`/api/course/chapter/${chapter}/lesson/${lesson}/progress`, {
        method: "POST",
        // Automatically stringified by ofetch
        body: {
          completed: !currentProgress,
          userEmail: user.value.email,
        },
      });
    } catch (error) {
      console.error(error);

      // If the request failed, revert the progress value
      progress.value[chapter] = {
        ...progress.value[chapter],
        [lesson]: currentProgress,
      };
    }
  };

  const percentageCompleted = computed(() => {
    console.log(progress.value);
    const chapters = Object.values(progress.value).map((chapter) => {
      const lessons = Object.values(chapter);
      const completedLesson = lessons.filter((lesson) => lesson);
      return Number((completedLesson.length / lessons.length) * 100).toFixed(0);
    }, []);

    const totalLessons = Object.values(progress.value).reduce(
      (number, chapter) => {
        return number + Object.values(chapter).length;
      },
      0
    );
    const totalCompletedLessons = Object.values(progress.value).reduce(
      (number, chapter) => {
        return (
          number + Object.values(chapter).filter((lesson) => lesson).length
        );
      },
      0
    );
    const course = Number((totalCompletedLessons / totalLessons) * 100).toFixed(
      0
    );

    return {
      chapters,
      course,
    };
  });

  return {
    initialize,
    progress,
    toggleComplete,
    percentageCompleted
  };
});
