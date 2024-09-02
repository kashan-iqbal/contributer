"use client";

import { CardWithForm } from "@/components/Messages-card";
import { useToast } from "@/components/ui/use-toast";
import { acceptMessages } from "@/Schemas/acceptMessagesSchema";
import { ApiResponce } from "@/Types/apiResponceType";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@radix-ui/react-select";
import { Switch } from "@radix-ui/react-switch";
import { Button } from "@react-email/components";
import axios, { AxiosError } from "axios";
import { constants } from "buffer";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type message = {
  _id: string;
};

type apiResponce = {
  messages: message[];
};

const page = () => {
  const [messages, setMessage] = useState<message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const deleteMessages = (id: string) => {
    setMessage(messages.filter((m) => m?._id !== id));
  };
  const { data: session } = useSession();
  const { register, setValue, watch } = useForm({
    resolver: zodResolver(acceptMessages),
  });

  const boolenaAccept = watch("accept", false);

  const checkingIsAcceptingMessage = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const result = await axios.get("api/accept-messages");
      setValue("accept", result.data.acceptMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "falied to fetch messages status",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const getAllMessages = useCallback(
    async (refresh: boolean) => {
      try {
        setLoading(true);
        setIsSwitchLoading(true);
        const result = await axios.get<apiResponce>("api/get-messages");
        setMessage(result.data.messages || []);
        if (refresh) {
          toast({
            title: "Resfresh Messages",
            description: "showing refresh messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponce>;
        toast({
          title: "Error",
          description: "falied failed to load lastest Messages",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setLoading, setMessage]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    checkingIsAcceptingMessage();
    getAllMessages(boolenaAccept);
  }, [session, setValue, checkingIsAcceptingMessage, getAllMessages]);

  const handleSwitch = async () => {
    try {
      const responce = await axios.post<apiResponce>("api/accept-messages", {
        acceptMessage: !acceptMessages,
      });
      setValue("accept", !acceptMessages);
      toast({
        title: "success",
        description: "status updated",
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponce>;
      toast({
        title: "Error",
        description: "failed to load lastest Messages",
        variant: "destructive",
      });
    }
  };

  // if (!session || !session.user) {
  //   return <div>Please login</div>;
  // }

  const profileUrl="ksahaniqbal"

  const copyToClipboard = ()=>{

  }
  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={boolenaAccept}
          onCheckedChange={handleSwitch}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator/>

      <Button
        className="mt-4"
        // variant="outline" typeScript Issue 
        onClick={(e) => {
          e.preventDefault();
          getAllMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <CardWithForm
              key={message._id}
              message={message}
              onMessagesDelete={deleteMessages}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
};

export default page;
