import GitHub from "@auth/core/providers/github";
import { defineConfig } from "auth-astro";
import Spotify from "./src/lib/spotify.js";
import config from "@data/config.json";

export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_AUTH_CLIENT,
      clientSecret: import.meta.env.GITHUB_AUTH_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const allowedEmails = config.adminEmails;

      const isAllowed =
        allowedEmails.includes(user.email) ||
        (user.email &&
          allowedEmails.some((email) =>
            user.email.endsWith(email.replace("*", ""))
          ));

      return isAllowed;
    },
    async session({ session, token }) {
      if (!session.spotifyAccessToken && session.user) {
        try {
          session.spotifyAccessToken = await Spotify.authorizeApp();
        } catch (error) {
          console.error("Could not generate Spotify access token: ", error);
        }
      }
      return session;
    },
  },
});
