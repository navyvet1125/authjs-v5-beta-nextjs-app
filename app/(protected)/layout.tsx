import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import "@/app/globals.css";
import Navbar from "@/app/(protected)/_components/navbar";
import { Toaster } from "@/components/ui/sonner";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Logged in user Dashboard",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const session = await auth();
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center 
    bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]
    from-sky-400 to-blue-800">
        <Toaster />
        <SessionProvider session={session}>
            <Navbar />
            {children}
        </SessionProvider>
        
    </div>
  );
}
