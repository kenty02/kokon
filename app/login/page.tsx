import { createClient } from "@/utils/supabase/server";
import { Text } from "@yamada-ui/react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginButton } from "./login-button";

export default function Login({
	searchParams,
}: {
	searchParams: { message: string };
}) {
	const signIn = async () => {
		"use server";
		const supabase = createClient();

		const { error, data } = await supabase.auth.signInWithOAuth({
			provider: "github",
			options: {
				redirectTo: new URL(
					"/auth/callback",
					headers().get("x-origin")!,
				).toString(),
			},
		});

		if (error) {
			return redirect("/login?message=Could not authenticate user");
		}

		return redirect(data.url);
	};

	return (
		<div>
			<form action={signIn}>
				<LoginButton pendingText={"redirecting..."}>
					Login via GitHub
				</LoginButton>
				{searchParams?.message && <Text>{searchParams.message}</Text>}
			</form>
		</div>
	);
}
