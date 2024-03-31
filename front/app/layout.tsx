import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from './globals';
import { Context } from './Context';
import "./globals.css";

import NavBar from "./NavBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "exercises",
  description: "", // TODO
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={cn(inter.className, 'flex flex-col w-full h-full bg-background')}>
        <Context>
            <NavBar />
            {children}
        </Context>
      </body>
    </html>
  );
}
