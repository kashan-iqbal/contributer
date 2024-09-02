"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceValue, useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { singUpSchema } from "@/Schemas/signUpSchema";
import { signInSchema } from "@/Schemas/signInSchema";
import axios, { AxiosError } from "axios";
import { ApiResponce } from "@/Types/apiResponceType";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@react-email/components";
import { Loader2 } from "lucide-react";
import { constants } from "buffer";
import { signIn } from "next-auth/react";

const page = () => {
  const [userName, setUserName] = useState("");
  const [isUserMessages, setIsUserMessages] = useState<ApiResponce>();
  const [isCheckingUser, setIsCheckingUser] = useState("");
  const [formSubmitting, setFormSubmitting] = useState("");
  const [loading, setLoading] = useState(false);

  const deBounceValue = useDebounceCallback(setUserName, 400);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // submit user Data
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn("credentials", {
      identifier: data.identifier,
      password: data.password,
    });
    console.log(result);
  };
  return (
    <div className="flex justify-center  items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md  p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1>Sign-Up</h1>
        </div>
        <div>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="outline outline-1 p-3 cursor-pointer"
                aria-disabled={loading}
              >
            sigin
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              dont have account?
              <Link
                href="sign-up"
                className="text-blue-600 hover:text-blue-800"
              >
                sign-up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
