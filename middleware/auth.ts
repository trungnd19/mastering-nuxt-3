export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  // Nếu user đã log in => xem được mọi videos trong khóa học
  if (user.value || to.params.chapterSlug === "1-chapter-1") {
    return;
  }
  return navigateTo(`/login?redirectTo=${to.path}`);
});
