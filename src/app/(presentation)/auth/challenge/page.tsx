import { auth } from "@/auth";
import { OTPForm } from "@/components/auth/otp-form";

const ChallengePage = async () => {
  const session = await auth();

  return <OTPForm />;
};

export default ChallengePage;
