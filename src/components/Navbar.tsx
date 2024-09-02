"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";
import { clsx } from "clsx";

const Navbar = () => {
  const { data: session } = useSession();
  const user:User = session?.user as User

  console.log(user);
  return (
    <nav className="p-4 md:p-6  shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a className="text-xl font-bold mb-4 md:mb-0" href="#">
          Mystry Message
        </a>

        {session ? (
          <>
            {" "}
            <span className="mr-4">{user?.name || user?.email}</span>
            <Button className="w-full md:w-auto">Logout</Button>{" "}
          </>
        ) : (
          <a href="/sign-in">
            <Button className="w-full md:w-auto"> Login</Button>
          </a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
