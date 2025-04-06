"use client";

import { OneTimePasswordSchema, OTPSchema } from "@/app/schemas/otp.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { OTPInput } from "./otp-input";
import { Loader2Icon, RotateCw } from "lucide-react";
import {
  completeChallengeAction,
  resendChallengeAction,
} from "@/app/_actions/challenge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { routes } from "@/config/routes";

export const OTPForm = () => {
  const router = useRouter();
  const [sendButtonText, setSendButtonText] = useState("Send Code");

  const [isCodePending, startCodeTransition] = useTransition();
  const [isSubmitPending, startSubmitTransition] = useTransition();

  const form = useForm<OTPSchema>({
    resolver: zodResolver(OneTimePasswordSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit: SubmitHandler<OTPSchema> = (data) => {
    startSubmitTransition(async () => {
      const result = await completeChallengeAction(data.code);

      if (!result?.success) {
        toast.error(result?.message || "Something went wrong");
      } else {
        console.log({ result });
        // router.push(routes.admin.dashboard);
      }
    });
  };

  const sendCode = () => {
    startCodeTransition(async () => {
      const { success, message } = await resendChallengeAction();
      setSendButtonText("Resend Code");

      if (!success) {
        toast.error(message);
        return;
      }

      toast.success("Code sent to your email");
    });
  };

  useEffect(() => {
    if (isCodePending) {
      setSendButtonText("Sending code...");
    }
  }, [isCodePending]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex w-full flex-1 justify-center px-6 pt-10 lg:items-center lg:pt-0">
      <div className="flex w-full max-w-lg flex-col">
        <h3 className="mb-4 text-4xl lg:text-5xl text-center">
          One time password
        </h3>
        <p className="mb-12 text-center text-slate-500">
          Enter the 6 digits code sent to your email
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field: { value, onChange, ...rest } }) => (
                <FormItem className="mb-8">
                  <FormControl>
                    <OTPInput type="number" setValue={onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-center justify-center">
              <button
                type="button"
                className="flex items-center gap-2.5 text-base font-medium text-slate-600 transition-colors duration-200 hover:text-primary group cursor-pointer"
                onClick={sendCode}
                disabled={isCodePending}
              >
                {isCodePending ? (
                  <Loader2Icon className="w-6 h-6 text-secondary transition-colors duration-200 group-hover:text-primary animate-spin" />
                ) : (
                  <RotateCw className="w-6 h-6 text-secondary transition-colors duration-200 group-hover:text-primary" />
                )}
                {sendButtonText}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
