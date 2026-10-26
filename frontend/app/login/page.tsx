import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "./login-form";

export const instant = false;

export default async function Page() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}