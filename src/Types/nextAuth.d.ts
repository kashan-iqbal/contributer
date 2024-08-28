import "next-auth"
import "bcrypt-ts"
import { DefaultSession } from "next-auth";


declare module "next-auth" {
    interface User {
        _id?: string;
        isVerfied?: boolean;
        isAcceptingMessage?: boolean;
        username?: string
    }
    interface Session {
        user: {
            _id?: string;
            isVerfied?: boolean;
            isAcceptingMessage?: boolean;
            username?: string
        } & DefaultSession['user']
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id?: string;
        isVerfied?: boolean;
        isAcceptingMessage?: boolean;
        username?: string
    }
}

declare module "bcrypt-ts" {

    export function hash(data: string | Buffer, saltOrRounds: string | number): Promise<string>
    export function compare(data: string | Buffer, encrypted: string): Promise<boolean>

}

// src/types/ai.d.ts or just ai.d.ts in the root
declare module 'ai' {
    // Add module declarations here, or use any if you’re unsure
    export function OpenAIStream(): any;
    export function StreamingTextResponse(): any;
  }
  














