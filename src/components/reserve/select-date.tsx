"use client";

import {
  SelectDateSchema,
  type SelectDateType,
} from "@/app/schemas/form.schema";
import { routes } from "@/config/routes";
import {
  type MultiStepFormComponentProps,
  MultiStepFormEnum,
} from "@/config/types";
import { generateDateOptions, generateTimeOptions } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition, useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Select } from "../ui/select";

export const SelectDate = (props: MultiStepFormComponentProps) => {
  const { searchParams } = props;

  // Get initial values from URL parameters for backward compatibility
  const urlHandoverDate = (searchParams?.handoverDate as string) ?? undefined;
  const urlHandoverTime = (searchParams?.handoverTime as string) ?? undefined;

  const form = useForm<SelectDateType>({
    resolver: zodResolver(SelectDateSchema),
    mode: "onBlur",
    defaultValues: {
      handoverDate: urlHandoverDate
        ? decodeURIComponent(urlHandoverDate)
        : undefined,
      handoverTime: urlHandoverTime
        ? decodeURIComponent(urlHandoverTime)
        : undefined,
    },
  });

  // Load values from sessionStorage if they exist
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDate = sessionStorage.getItem("handoverDate");
      const storedTime = sessionStorage.getItem("handoverTime");

      if (storedDate) {
        form.setValue("handoverDate", storedDate);
      }

      if (storedTime) {
        form.setValue("handoverTime", storedTime);
      }
    }
  }, [form]);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", MultiStepFormEnum.WELCOME.toString());
      router.push(url.toString());
    });
  };

  const onSelectDate: SubmitHandler<SelectDateType> = (data) => {
    startTransition(async () => {
      const valid = await form.trigger();
      if (!valid) return;
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        // Store in sessionStorage
        sessionStorage.setItem("handoverDate", data.handoverDate);
        sessionStorage.setItem("handoverTime", data.handoverTime);

        console.log("Stored in sessionStorage:", {
          date: data.handoverDate,
          time: data.handoverTime,
        });

        // Use path-based navigation to maintain protocol
        const path = `/inventory/${props.classified.slug}/reserve?step=${MultiStepFormEnum.SUBMIT_DETAILS}`;
        router.push(path);
      } catch (error) {
        console.error("Error in date selection:", error);
        // Fallback to URL parameters if sessionStorage fails
        const url = new URL(window.location.href);
        url.searchParams.set(
          "step",
          MultiStepFormEnum.SUBMIT_DETAILS.toString()
        );
        url.searchParams.set(
          "handoverDate",
          encodeURIComponent(data.handoverDate)
        );
        url.searchParams.set(
          "handoverTime",
          encodeURIComponent(data.handoverTime)
        );
        router.push(url.toString());
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto bg-white flex flex-col rounded-b-lg shadow-lg p-6 h-96"
        onSubmit={form.handleSubmit(onSelectDate)}
      >
        <div className="space-y-6 flex-1">
          <FormField
            control={form.control}
            name="handoverDate"
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel htmlFor="handoverDate">Select a Date</FormLabel>
                <FormControl>
                  <Select options={generateDateOptions()} {...rest} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="handoverTime"
            render={({ field: { ref, ...rest } }) => (
              <FormItem>
                <FormLabel htmlFor="handoverTime">Select a Time</FormLabel>
                <FormControl>
                  <Select options={generateTimeOptions()} {...rest} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-x-4">
          <Button
            type="button"
            onClick={prevStep}
            disabled={isPrevPending}
            className="uppercase font-bold flex gap-x-3 w-full flex-1"
          >
            {isPrevPending ? (
              <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Previous Step
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="uppercase font-bold flex gap-x-3 w-full flex-1"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 shrink-0 animate-spin" />
            ) : null}{" "}
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};
