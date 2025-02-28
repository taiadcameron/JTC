import "@/app/globals.css";
import Image from "next/image";
import Stars from "@img/Stars.svg";
import Stars2 from "@img/Stars-left.svg";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LoginForm from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // Redirect to dashboard if already authenticated
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-primary-500 
      bg-[radial-gradient(ellipse_at_bottom_center,_var(--tw-gradient-stops))] 
      from-white/5 via-primary-50 to-transparent"
    >
      <div className="text-center border-2 border-slate-400 px-12 py-16 bg-[rgba(74,74,74,0.1)] rounded-3xl backdrop-blur-sm bg-opacity-10 border border-gray-100/20 shadow-[inset_2px_4px_16px_0px_rgba(248,248,248,0.2)] z-10">
        <h1 className="text-4xl font-bold mb-8">JOINTHECLUB</h1>
        <p className="mb-4">Sign In With Your Schools Gmail</p>
        <LoginForm />
      </div>
      <Image
        src={Stars}
        alt=""
        width={1000}
        height={1000}
        className="absolute bottom-0 right-0 opacity-45"
      />
      <Image
        src={Stars2}
        alt=""
        width={1000}
        height={1000}
        className="absolute bottom-0 left-0 opacity-45"
      />
    </div>
  );
}
