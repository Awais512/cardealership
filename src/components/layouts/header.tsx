import { routes } from "@/config/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { HeartIcon, MenuIcon } from "lucide-react";
import { redis } from "@/lib/redis-store";
import { Favourites } from "@/config/types";
import { getSourceId } from "@/lib/source-id";
import { navLinks } from "@/config/constants";
import { auth } from "@/auth";
import { SignOutForm } from "../auth/sign-out-form";

export const PublicHeader = async () => {
  const session = await auth();
  const sourceId = await getSourceId();
  const favourites = await redis.get<Favourites>(sourceId ?? "");

  return (
    <header className="flex items-center justify-between h-16 px-4 bg-transparent gap-x-6">
      <div className="flex items-center flex-1">
        <Link href={routes.home} className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            width={300}
            height={100}
            alt="Logo"
            className="relative"
          />
        </Link>
      </div>
      <nav className="hidden md:block">
        {navLinks.map((link) => (
          <Link
            key={link.id}
            className="group font-heading rounded px-3 py-2 text-base text-foreground hover:text-primary duration-300 transition-all ease-in-out font-semibold uppercase"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {session ? (
        <div className="items-center md:flex gap-x-6 hidden">
          <Link className="text-foreground" href={routes.admin.dashboard}>
            Backoffice
          </Link>
          <SignOutForm />
        </div>
      ) : (
        <Button>Login</Button>
      )}
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="relative inline-block group"
      >
        <Link href={routes.favourites}>
          <div className="flex group-hover:bg-pink-500 diratopm-200 transition-colors ease-in-out items-center justify-center w-10 h-10 bg-muted rounded-full">
            <HeartIcon className="w-6 h-6 text-primary group-hover:text-white group-hover:fill-white" />
          </div>
          <div className="absolute -top-1 5 -right-1.5 flex items-center justify-center w-5 h-5 text-white bg-pink-500 rounded-full group-hover:bg-primary">
            <span className="text-xs">
              {favourites ? favourites.ids.length : 0}
            </span>
          </div>
        </Link>
      </Button>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" size="icon" className="md:hidden border-none">
            <MenuIcon className="h-6 w-6 text-primary" />
            <SheetTitle className="sr-only">Toggle Nav Menu</SheetTitle>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full max-w-xs p-4 bg-white">
          <nav className="grid gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.id}
                className="flex items-center gap-2 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default PublicHeader;
