<template>
  <div>
    <div class="mb-4 flex justify-between items-center w-full">
      <h1 class="text-3xl">
        <span class="font-medium">
          <span class="font-bold">{{ course.title }}</span>
        </span>
      </h1>
      <UserCard />
    </div>

    <div class="flex flex-row justify-center flex-grow">
      <div
        class="prose mr-4 p-8 bg-white rounded-md min-w-[20ch] max-w-[30ch] flex flex-col"
      >
        <h3>Chapters</h3>
        <div
          class="space-y-1 mb-4 flex flex-col"
          v-for="(chapter, index) in course.chapters"
          :key="chapter.slug"
        >
          <h4 class="flex justify-between items-center">
            {{ chapter.title }}
            <span v-if="percentageCompleted && user" class="text-emerald-500 text-sm">
              {{ percentageCompleted.chapters[index] }}%
            </span>
          
          </h4>
          <NuxtLink
            v-for="(lesson, index) in chapter.lessons"
            :key="lesson.slug"
            class="flex flex-row space-x-1 no-underline prose-sm font-normal py-1 px-4 -mx-4"
            :to="`/course/chapter/${chapter.slug}/lesson/${lesson.slug}`"
            :class="{
              'text-blue-500': lesson.path === $route.fullPath,
              'text-gray-600': lesson.path !== $route.fullPath
            }"
          >
            <span class="text-gray-500">{{ index + 1 }}.</span>
            <span>{{ lesson.title }}</span>
          </NuxtLink>
        </div>
        <div v-if="percentageCompleted" class="mt-8 font-medium text-gray-500 flex justify-between">
          Course completion: 
          <span>{{ percentageCompleted.course }}%</span>
        </div>

      </div>

      <div class="prose p-12 bg-white rounded-md w-[65ch]">
        <NuxtErrorBoundary>
          <NuxtPage />
          <template #error="{ error }">
            <p>
              Oh no, something broke!
              <code>{{ error }}</code>
            </p>
            <button class="text-white bg-gray-500" @click="resetError(error)">
              Reset
            </button>
          </template>
        </NuxtErrorBoundary>
      </div>
    </div>
  </div>
</template>
<script setup>
import { storeToRefs } from 'pinia';
import { useCourseProgress } from '~~/stores/courseProgress';

// useFirstLesson() cũng gọi đến useCourse(), nhưng nhờ dùng useFetchWithCache => đã được cache
const user = useSupabaseUser();
const course = await useCourse();
const firstLesson = await useFirstLesson();
const { percentageCompleted } = storeToRefs(useCourseProgress())
async function resetError(error) {
  await navigateTo(firstLesson.path);
  error.value = null;

  // Use when nothing you can do but throw the error
  // throw createError({
  //   fatal: true,
  //   message: "Fatal error"
  // });
}
</script>
