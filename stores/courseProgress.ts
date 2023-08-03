import { defineStore } from "pinia";

export const useCourseProgress = defineStore("courseProgress", () => {
  // initialize progress from local storage
  const progress = ref<any>({});

  const initialized = ref(false);

  async function initialize() {
    // if the course has already been initialized, return
    if (initialized.value) return;
    initialized.value = true;

    // TODO: fetch user progress from endpoint
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
        body: {
          completed: !currentProgress,
          userEmail: user.value.email
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

  return {
    initialize,
    progress,
    toggleComplete,
  };
});
