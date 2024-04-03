import TeamSelectList from "@/components/TeamSelectList";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const supabase = createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}

	//get team
	const { data: teams, error: teamsError } = await supabase
		.from("teams")
		.select("*");
	if (teamsError || !teams) {
		throw new Error("Failed to fetch teams");
	}
	return (
		<>
			<TeamSelectList teams={teams} />
			{children}
		</>
	);
}
