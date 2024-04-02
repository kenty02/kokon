import { createClient } from "@/utils/supabase/server";
import { Text } from "@yamada-ui/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Index() {
	const supabase = createClient();
	// is user belongs to any team?
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) {
		return redirect("/login");
	}
	// get teams
	const { data: teamMemberships, error } = await supabase
		.from("team_membership")
		.select("team_id")
		.eq("user_id", user.id);
	if (error || !teamMemberships) {
		throw new Error("Failed to fetch teams");
	}

	return (
		<div>
			<Text>チームを選んでください</Text>
			{teamMemberships.length == 0 ? (
				<Text>
					あなたはどのチームにも所属していないようです。
					<Link href={"/teams/invitations/global"}>ここ</Link>
					をクリックしてグローバルチームに参加
				</Text>
			) : null}
		</div>
	);
}
