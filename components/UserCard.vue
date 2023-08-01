<template>
  <div v-if="user" class="rounded p-3 flex items-center space-x-3 bg-white">
    <img
      :src="profile"
      class="rounded-full w-12 h-12 border-2 border-blue-400"
      alt=""
    />
    <div class="text-right">
      <div class="font-medium">{{ name }}</div>
      <button class="text-sm underline text-slate-500" @click="logout">
        Log out
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser();
const { auth } = useSupabaseAuthClient();

const logout = async () => {
  const { error } = await auth.signOut();

  if (error) {
    console.error(error);
    return;
  }

  // Fix supabase bug: log in => log out => click back => still log in
  try {
    await $fetch("api/_supabase/session", {
      method: "POST",
      body: { event: "SIGNED_OUT", session: null }
    });
    user.value = null;
  } catch (e) {
    console.error(e);
  }

  await navigateTo("/login");
};

const name = computed(() => {
  return user.value?.user_metadata.full_name;
});

const profile = computed(() => {
  return user.value?.user_metadata.avatar_url;
});
</script>

<style scoped></style>
