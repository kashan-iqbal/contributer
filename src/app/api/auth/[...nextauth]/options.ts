// import { NextAuthOptions } from "next-auth";
// import { UserModel } from "@/model/user";
// import dbConnect from "@/lib/connetDb";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";

// export const authOption: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credential",
//       name: "credential",
//       credentials: {
//         username: {
//           label: "Username",
//           type: "text",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credential: any): Promise<any> {
//         await dbConnect();
//         try {
//           const user = await UserModel.findOne({
//             $or: [
//               { email: credential.identifier },
//               { username: credential.identifier },
//             ],
//           });

//           if (!user) {
//             throw new Error("no user Found with this email");
//           }
//           if (!user.isVerified) {
//             throw new Error("Please verify your account before login");
//           }

//           const isPasswordCorrect = await bcrypt.compare(
//             credential.password,
//             user.password
//           );

//           if (isPasswordCorrect) {
//             return user;
//           } else {
//             throw new Error("Icorrect Password");
//           }
//         } catch (error: any) {
//           throw new Error(error);
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token, user }) {
//       if (token) {
//         session.user._id = token._id;
//         session.user.isVerfied = token.isVerfied;
//         session.user.isAcceptingMessage = token.isAcceptingMessage;
//         session.user.username = token.username;
//       }

//       return session;
//     },
//     async jwt({ user, token, session }) {
//       if (user) {
//         token._id = user._id;
//         token.isVerified = user.isVerfied;
//         token.isAcceptingMessage = user.isAcceptingMessage;
//         token.username = user.username;
//       }
//       return token;
//     },
//   },
//   pages: {
//     signIn: "/sign-in",
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXT_AUTH_SECRET_KEY,
// };

import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = { 
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credential",
      name: "credential",
      credentials: {
        username: {
          label: "Username", type: "text",
        },
        password: { label: "Password", type: "password" },

      },
      async authorize(credential: any): Promise<any> {
        await dbConnect()
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credential.identifier },
              { username: credential.identifier }
            ]
          })

          if (!user) {
            throw new Error("no user Found with this email")
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before login')
          }

          const isPasswordCorrect = await bcrypt.compare(credential.password, user.password)

          if (isPasswordCorrect) {
            return user
          } else {
            throw new Error("Icorrect Password")
          }


        } catch (error: any) {
          throw new Error(error)

        }



      }

    })
  ],
  callbacks: {
    async session({ session, token, user }) {
      if (token) {
        session.user._id = token._id
        session.user.isVerfied = token.isVerfied
        session.user.isAcceptingMessage = token.isAcceptingMessage
        session.user.username = token.username

      }

      return session
    },
    async jwt({ user, token, session }) {
      if (user) {
        token._id = user._id
        token.isVerified = user.isVerfied
        token.isAcceptingMessage = user.isAcceptingMessage
        token.username = user.username
      }
      return token
    }
  },
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXT_AUTH_SECRET_KEY,

}














