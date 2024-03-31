import { createClient } from "@/utils/supabase/server";
import { Text } from "@yamada-ui/react";
import { redirect } from "next/navigation";

export default async function Index() {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}
	return (
		<div>
			<Text>チームを選んでください</Text>
		</div>
	);
}
