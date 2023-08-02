import { defineStore } from "pinia";

export const useCourseProgress = defineStore("courseProgress", () => {
  // initialize progress from local storage
  const progress = useLocalStorage("progress", {});

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
        params: { chapterSlug, lessonSlug }
      } = useRoute();
      chapter = chapterSlug as string;
      lesson = lessonSlug as string;
    }

    // Get current progress for the lesson
    // @ts-ignore
    const currentProgress = progress.value[chapter]?.[lesson];

    // @ts-ignore
    progress.value[chapter] = {
      // @ts-ignore
      ...progress.value[chapter],
      [lesson]: !currentProgress
    };

    // TODO: update in db
  };

  return {
    initialize,
    progress,
    toggleComplete
  };
});