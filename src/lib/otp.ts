import { env } from "@/env";
import { bcryptPasswordCompare, bcryptPasswordHash } from "./bcrypt";
import { redis } from "./redis-store";
import { resend } from "./resend";
import ChallengeEmail from "@/emails/challenge";
import { prisma } from "./prisma";

const REDIS_PREFIX = "otp";

export async function issueChallenge(userId: string, email: string) {
  const array = new Uint32Array(1);
  const code = (crypto.getRandomValues(array)[0] % 900000) + 100000;
  const hash = await bcryptPasswordHash(code.toString());
  const challenge = { codeHash: hash, email };

  await redis.setex(`${REDIS_PREFIX}:uid-${userId}`, 60 * 60, challenge);

  const { error } = await resend.emails.send({
    from: env.FROM_EMAIL_ADDRESS,
    to: email,
    subject: `Sign in to ${env.NEXT_PUBLIC_APP_URL}`,
    html: `<p>${code}</p>`,
    react: ChallengeEmail({ data: { code } }),
  });

  if (error) {
    console.log({ error });
    throw new Error(`Error sending email: ${error.name} - ${error.message}`);
  }
}

interface Challenge {
  codeHash: string;
  email: string;
}
export async function completeChallenge(userId: string, code: string) {
  const challenge = await redis.get<Challenge>(`${REDIS_PREFIX}:uid-${userId}`);

  if (challenge) {
    const isCorrect = await bcryptPasswordCompare(code, challenge.codeHash);
    if (isCorrect) {
      const session = await prisma.session.findFirst({
        where: { userId, requires2FA: true },
      });

      if (session) {
        await prisma.session.updateMany({
          where: {
            sessionToken: session.sessionToken,
            userId,
          },
          data: {
            requires2FA: false,
          },
        });
        await redis.del(`${REDIS_PREFIX}:uid-${userId}`);

        return { success: true, message: "2FA enabled successfully" };
      }
      return {
        succcess: false,
        message: "Could not find the session for the user",
      };
    }
    return {
      succcess: false,
      message: "Incorrect verification code - please try again",
    };
  }
  return {
    succcess: false,
    message: "Challenge does not exist - please try again",
  };
}
