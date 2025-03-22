"use client";

import {
  SubmitDetailsSchema,
  SubmitDetailsSchemaType,
} from "@/app/schemas/customer.schema";
import { MultiStepFormComponentProps, MultiStepFormEnum } from "@/config/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

import { formatDate } from "@/lib/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { createCustomerAction } from "@/app/_actions/customer";
import { routes } from "@/config/routes";

export const SubmitDetails = (props: MultiStepFormComponentProps) => {
  const { params, searchParams } = props;
  const router = useRouter();

  // Add state to hold retrieved date and time
  const [handoverDate, setHandoverDate] = useState<string | null>(null);
  const [handoverTime, setHandoverTime] = useState<string | null>(null);

  // Get date and time from sessionStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Use fallback to URL parameters if sessionStorage is empty
      // This provides backwards compatibility
      const storedDate =
        sessionStorage.getItem("handoverDate") ||
        (searchParams?.handoverDate
          ? decodeURIComponent(searchParams.handoverDate as string)
          : null);

      const storedTime =
        sessionStorage.getItem("handoverTime") ||
        (searchParams?.handoverTime
          ? decodeURIComponent(searchParams.handoverTime as string)
          : null);

      setHandoverDate(storedDate);
      setHandoverTime(storedTime);

      // Check if we have the required data
      if (!storedDate || !storedTime) {
        console.warn(
          "Missing date or time data, redirecting back to date selection"
        );
        // Redirect back to date selection step
        const url = new URL(window.location.href);
        url.searchParams.set("step", MultiStepFormEnum.SELECT_DATE.toString());
        router.push(url.toString());
      }
    }
  }, [router, searchParams]);

  const form = useForm<SubmitDetailsSchemaType>({
    resolver: zodResolver(SubmitDetailsSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      terms: "false",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [isPrevPending, startPrevTransition] = useTransition();

  const prevStep = () => {
    startPrevTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const url = new URL(window.location.href);
      url.searchParams.set("step", MultiStepFormEnum.SELECT_DATE.toString());
      router.push(url.toString());
    });
  };

  const onSubmitDetails: SubmitHandler<SubmitDetailsSchemaType> = (data) => {
    startTransition(async () => {
      const valid = await form.trigger();
      if (!valid) return;
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Make sure we have date and time
      if (!handoverDate || !handoverTime) {
        console.error("Missing date or time data");
        return;
      }

      try {
        // Format the date - ensure proper error handling
        const date = formatDate(handoverDate, handoverTime);

        if (!date) {
          console.error("Date formatting failed");
          return;
        }

        console.log("Submitting with date:", date);

        const { success, message } = await createCustomerAction({
          slug: params?.slug as string,
          date, // Pass the properly formatted date
          ...data,
        });

        if (!success) {
          console.error("Submission failed:", message);
          return;
        }

        // Clear sessionStorage after successful submission
        sessionStorage.removeItem("handoverDate");
        sessionStorage.removeItem("handoverTime");

        setTimeout(() => {
          router.push(routes.success(params?.slug as string));
        }, 1000);
      } catch (error) {
        console.error("Error during submission:", error);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        className="mx-auto bg-white flex flex-col rounded-b-lg shadow-lg p-6 h-96"
        onSubmit={form.handleSubmit(onSubmitDetails)}
      >
        <div className="space-y-6 flex-1">
          {/* Display selected date and time for user reference */}
          {handoverDate && handoverTime && (
            <div className="text-sm text-gray-500 mb-2">
              Selected handover: {handoverDate} at {handoverTime}
            </div>
          )}
          <div className="grid grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="firstName">Enter First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="lastName">Enter Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Enter Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="mobile">Enter Mobile</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-center space-x-2">
            <FormField
              control={form.control}
              name="terms"
              render={({ field: { ref, onChange, ...rest } }) => (
                <FormItem className="flex items-center gap-x-2">
                  <FormControl>
                    <Checkbox
                      className="cursor-pointer m-0"
                      onCheckedChange={(e) => onChange(e ? "true" : "false")}
                      {...rest}
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and conditions
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
            Submit Details
          </Button>
        </div>
      </form>
    </Form>
  );
};
