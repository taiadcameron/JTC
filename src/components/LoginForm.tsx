"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <button
      onClick={handleSignIn}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded z-10  "
    >
      Sign In with Google
    </button>
  );
}
