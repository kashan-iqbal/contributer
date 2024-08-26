"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const page = () => {
  const [userName, setUserName] = useState("");
  const [isUserMessages, setIsUserMessages] = useState("");
  const [isCheckingUser, setIsCheckingUser] = useState("");
  const [formSubmitting, setFormSubmitting] = useState("");

  const deBounceValue = useDebounceValue(userName, 400);

  const { toast } = useToast();
  const router = useRouter()
  

  return <div >page <h1 >Sing in  I Am</h1></div>;
};

export default page;
