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

const page = () => {
  const [userName, setUserName] = useState("");
  const [isUserMessages, setIsUserMessages] = useState("");
  const [isCheckingUser, setIsCheckingUser] = useState("");
  const [formSubmitting, setFormSubmitting] = useState("");
  const [loading, setLoading] = useState(false);

  const deBounceValue = useDebounceCallback(setUserName, 400);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(singUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkingUserNameUnique = async () => {
      if (userName) {
        setLoading(true);
        setIsUserMessages("");
        try {
          const responce = await axios.get(
            `/api/checking-username-unique?username=${userName}`
          );

          setIsUserMessages(responce.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponce>;
          setIsUserMessages(
            axiosError.response?.data.message ?? "Error in checking User"
          );
        } finally {
          setLoading(false);
        }
      }
    };
    checkingUserNameUnique();
  }, [userName]);

  // submit user Data
  const onSubmit = async (data: z.infer<typeof singUpSchema>) => {
    try {
      const responce = await axios.post<ApiResponce>("/api/sign-up", data);
      toast({
        title: "success",
        description: responce.data?.message,
      });
      router.replace(`/verify/${userName}`);
      setLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      setIsUserMessages(
        axiosError.response?.data.message ?? "Error in Submitting The form"
      );
      let errorMsg = axiosError.response?.data.message;
      toast({
        title: "Sign-up faild",
        description: errorMsg,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center  items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md  p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center"></div>
        <div>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          deBounceValue(e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" aria-disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="m-2 h-4 w-4 animate-spin" /> please Wait
                  </>
                ) : (
                  "Sign Up"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Already A Member?
              <Link
                href="sign-in"
                className="text-blue-600 hover:text-blue-800"
              >
                sign-in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
