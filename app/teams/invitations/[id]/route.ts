import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const id = params.id;
	const supabase = createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}
	const supabaseAdmin = createAdminClient();
	let team_id: number;
	if (id === "global") {
		// get global team
		const { data: globalTeam, error } = await supabaseAdmin
			.from("teams")
			.select("id")
			.eq("name", "Global");
		if (error || !globalTeam || globalTeam.length === 0) {
			throw new Error("Failed to fetch global team");
		}
		team_id = globalTeam[0].id;
	} else {
		// get team_invitation by id
		const { data: teamInvitation, error } = await supabaseAdmin
			.from("team_invitations")
			.select("*")
			.eq("id", id)
			.single();
		if (error || !teamInvitation) {
			return new Response("Invitation not found", { status: 404 });
		}
		team_id = teamInvitation.team_id;
	}
	// add to team_memberships
	const { error: error2 } = await supabaseAdmin
		.from("team_membership")
		.insert({ team_id, user_id: user.id });
	if (error2) {
		return new Response("Failed to join team", { status: 500 });
	}

	// redirect to team page

	const requestUrl = new URL(request.url);
	const origin = requestUrl.origin;
	return NextResponse.redirect(`${origin}/teams/${team_id}`);
}
