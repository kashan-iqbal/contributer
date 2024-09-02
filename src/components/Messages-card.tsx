"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X } from "lucide-react";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponce } from "@/Types/apiResponceType";

type messageCardPorps = {
  messages: string;
  onMessagesDelete: (messageId: string) => void;
};

export function CardWithForm({ messages, onMessagesDelete }: messageCardPorps) {
  const { toast } = useToast();

  const handleDeleteMessages = async () => {
    const responce = await axios.delete<ApiResponce>(
      `api/delete-message/${messages}`
    );
    toast({
      title: responce.data.message,
    });
  };

  return (
    <>
      <Card className="flex justify-around align-middle w-[350px]">
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>
            Deploy your new project in one-click.
          </CardDescription>
        </CardHeader>
  
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <X className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteMessages}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
      </Card>
    </>
  );
}
