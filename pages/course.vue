<template>
    <div class="mb-12 prose">
      <h1>
        <span class="font-medium">
          Course:
          <span class="font-bold">Mastering Nuxt 3</span>
        </span>
      </h1>
    </div>

    <div class="flex flex-row justify-center flex-grow">
      <div
        class="prose mr-4 p-8 bg-white rounded-md min-w-[20ch] max-w-[30ch] flex flex-col"
      >
        <h3>Chapters</h3>
		<div
					class="space-y-1 mb-4 flex flex-col"
					v-for="chapter in chapters"
					:key="chapter.slug"
				>
					<h4>{{ chapter.title }}</h4>
					<NuxtLink
						v-for="(lesson, index) in chapter.lessons"
						:key="lesson.slug"
						class="flex flex-row space-x-1 no-underline prose-sm font-normal py-1 px-4 -mx-4"
						:to="`/course/chapter/${chapter.slug}/lesson/${lesson.slug}`"
						:class="{
							'text-blue-500': lesson.path === $route.fullPath,
							'text-gray-600': lesson.path !== $route.fullPath,
						}"
					>
						<span class="text-gray-500">{{ index + 1 }}.</span>
						<span>{{ lesson.title }}</span>
					</NuxtLink>
				</div>
      </div>

      <div class="prose p-12 bg-white rounded-md w-[65ch]">
		<NuxtErrorBoundary>
			<NuxtPage />
			<template #error="{ error }">
				<p>Oh no, something broke!
					<code>{{ error }}</code>
				</p>
				<button class="text-white bg-gray-500" @click="resetError(error)">Reset</button>


			</template>
		</NuxtErrorBoundary>
      </div>
    </div>
</template>
<script setup>
const { chapters } = useCourse();
function resetError(error) {
	error.value = null;
}
</script>