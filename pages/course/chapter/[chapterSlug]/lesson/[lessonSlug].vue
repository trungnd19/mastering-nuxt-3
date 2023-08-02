<template>
  <div>
    <p class="mt-0 uppercase font-bold text-slate-400 mb-1">
      Lesson {{ chapter.number }} - {{ lesson.number }}
    </p>
    <h2 class="my-0">{{ lesson.title }}</h2>
    <div class="flex space-x-4 mt-2 mb-8">
      <NuxtLink
        :to="lesson.sourceUrl"
        v-if="lesson.sourceUrl"
        class="font-normal text-md text-gray-500"
      >
        Download source code
      </NuxtLink>
      <NuxtLink
        :to="lesson.downloadUrl"
        v-if="lesson.downloadUrl"
        class="font-normal text-md text-gray-500"
      >
        Download video
      </NuxtLink>
    </div>
    <VideoPlayer v-if="lesson.videoId" :videoId="lesson.videoId" />
    <p>{{ lesson.text }}</p>
    <LessonCompleteButton
      v-if="user"
      :model-value="isCompleted"
      @update:model-value="toggleComplete"
    ></LessonCompleteButton>
  </div>
</template>
<script setup>
import { useCourseProgress } from "~/stores/courseProgress.ts";
const course = await useCourse();
const route = useRoute();
const { chapterSlug, lessonSlug } = route.params;
const lesson = await useLesson(chapterSlug, lessonSlug);
const user = useSupabaseUser();
const store = useCourseProgress();
const { initialize, toggleComplete } = store;
initialize();
definePageMeta({
  middleware: [
    async function ({ params }, from) {
      const course = await useCourse();

      const chapter = computed(() => {
        return course.value.chapters.find(
          (chapter) => chapter.slug === params.chapterSlug
        );
      });

      const lesson = computed(() => {
        return chapter.value.lessons.find(
          (lesson) => lesson.slug === params.lessonSlug
        );
      });

      if (!chapter.value) {
        return abortNavigation(
          createError({
            statusCode: 404,
            message: "Chapter not found"
          })
        );
      }

      if (!lesson.value) {
        return abortNavigation(
          createError({
            statusCode: 404,
            message: "Lesson not found"
          })
        );
      }
    },
    "auth"
  ]
});

// if (route.params.lessonSlug === "3-typing-component-events") {
//   console.log(route.params.unexistedparams.toUppercase());
// }

const chapter = computed(() => {
  return course.value.chapters.find(
    (chapter) => chapter.slug === route.params.chapterSlug
  );
});

const pageTitle = computed(() => {
  return `${lesson.value.title} - ${course.value.title}`;
});

useHead({
  title: pageTitle
});

const isCompleted = computed(() => {
  return store.progress?.[chapterSlug]?.[lessonSlug] || 0;
});
</script>
