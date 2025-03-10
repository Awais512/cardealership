import React from "react";
import PublicHeader from "./header";
import { PublicFooter } from "./footer";

interface Props {
  children: React.ReactNode;
}

export const PublicLayout = ({ children }: Props) => {
  return (
    <>
      <PublicHeader />
      <main className="bg-white">{children}</main>
      <PublicFooter />
    </>
  );
};
