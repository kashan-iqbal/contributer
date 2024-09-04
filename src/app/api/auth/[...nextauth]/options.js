import nextAuth from "next-auth";
import NextAuth from "next-auth/next";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  provider: [
    Credential({
      id: "credential",
      name: "credential",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "text" },
      },

      async authorize(credentials) {},
    }),
    GitHubProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRETS,
    }),
  ],
};

// Export the GET method
export async function GET(req) {
  return NextAuth(authOptions)(req);
}

// Export the POST method
export async function POST(req) {
  return NextAuth(authOptions)(req);
}
