import { z } from "zod";

export const OneTimePasswordSchema = z.object({
  code: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contains only numbers"),
});

export type OTPSchema = z.infer<typeof OneTimePasswordSchema>;
