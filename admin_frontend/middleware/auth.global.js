export default defineNuxtRouteMiddleware((to, from) => {
  // 1. Grab the token from the cookie (using the exact name from your components)
  const token = useCookie("ec_token");

  // 2. Define your public routes (pages anyone can visit)
  const publicRoutes = ["/auth/login", "/"]; // Add any other public paths here

  // 3. The Bouncer Logic: No token + trying to access a private page
  if (!token.value && !publicRoutes.includes(to.path)) {
    // Send them straight back to the login page
    return navigateTo("/auth/login");
  }

  // 4. The Reverse Bouncer: They have a token, but are trying to view the login page
  if (token.value && to.path === "/auth/login") {
    // Send them into the dashboard so they don't have to log in again
    return navigateTo("/merch"); // Or '/dinner', depending on your default landing page
  }
});
