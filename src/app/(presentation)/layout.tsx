import { PublicLayout } from "@/components/layouts/public-layout";

interface Props {
  children: React.ReactNode;
}

const PresentationLayout = ({ children }: Props) => {
  return <PublicLayout>{children}</PublicLayout>;
};

export default PresentationLayout;
