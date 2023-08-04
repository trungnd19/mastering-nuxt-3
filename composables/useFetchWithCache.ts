import { StorageSerializers } from "@vueuse/core";

// <T> ở đây là type nói chung của function
export default async <T>(url: string) => {
  const cached = useSessionStorage<T>(url, null, {
    // By passing null as default => not know which serializer to use
    serializer: StorageSerializers.object
  });

  if (!cached.value) {
    const { data, error } = await useFetch<T>(
      url,
      {
        headers: useRequestHeaders(['cookie']),
        // pick: ['title', 'number']
        // lazy: true
      }
    );

    if (error.value) {
      throw createError({
        ...error.value,
        statusMessage: `Could not fetch data from ${url}`
      });
    }

    cached.value = data.value as T; // Gán lại data cho cache
  } else {
    console.log(`Getting value from cache for ${url}`);
  }

  return cached;
};
