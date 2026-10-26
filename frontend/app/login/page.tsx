"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e?: React.FormEvent) {
        e?.preventDefault();

        const result = await signIn("credentials", {
            username,
            password,
            redirect: false,
        });

        if (!result?.error) {
            router.push("/dashboard");
            return;
        }

        alert("Sai username hoặc password");
    }

    return (
        <div className="flex min-h-screen items-center justify-center"
            style={{
                backgroundImage: "url('/images/login_bg.png')",
            }}>
            <form
                onSubmit={handleLogin}
                className="w-[350px] space-y-4 rounded-xl bg-white p-6 shadow-2xl"
            >
                <h1 className="text-center text-xl font-bold text-blue-800">
                    Factory-X Login
                </h1>

                <input
                    className="w-full rounded border p-2"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full rounded border p-2"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
                >
                    Login
                </button>
            </form>
        </div>
    );
}