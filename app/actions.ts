"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function sendHelp(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	prevState: { message: string; errors?: any },
	formData: FormData,
) {
	const supabase = createClient();
	const { data: userData } = await supabase.auth.getUser();
	if (!userData.user) {
		return { message: "You must be logged in to send a help request" };
	}
	const schema = z.object({
		name: z.string(),
		category: z.array(z.string()),
		location: z.string(),
		user_id: z.string(),
		team_id: z.number(),
	});
	const data = schema.safeParse({
		name: formData.get("name"),
		category: formData.has("category")
			? JSON.parse(formData.get("category") as string)
			: [],
		location: formData.get("location"),
		user_id: userData.user.id,
		team_id: Number.parseInt(formData.get("team_id") as string),
	});
	if (!data.success) {
		return {
			message: `validation failed, ${JSON.stringify(data.error.flatten())}`,
			errors: data.error.flatten().fieldErrors,
		};
	}
	const { error } = await supabase.from("help_requests").insert(data.data);

	if (error) {
		return { message: "Could not send help request" };
	}
	revalidatePath(`/teams/${data.data.team_id}`);
	return { message: "Help request sent" };
}

export async function deleteHelp(id: number) {
	const supabase = createClient();
	// fetch team id before deleting
	const { data } = await supabase
		.from("help_requests")
		.select("team_id")
		.eq("id", id)
		.single();
	if (!data) {
		return { message: "Help request not found" };
	}
	const { error } = await supabase.from("help_requests").delete().eq("id", id);
	if (error) {
		return { message: "Could not delete help request" };
	}
	revalidatePath(`/teams/${data.team_id}`);
	return { message: "Help request deleted" };
}

export async function setTeamId(formData: FormData) {
	const team_id = Number.parseInt(formData.get("team_id") as string);
	console.log(formData);
	if (!team_id) {
		return;
	}

	redirect(`/teams/${team_id}`);
}
export async function handleRevalidate(path: string) {
	revalidatePath(path);
}

export async function createTeam(
	state: { message: string; id?: number },
	formData: FormData,
) {
	const supabase = createClient();
	const { data: userData } = await supabase.auth.getUser();
	if (!userData.user) {
		return { message: "You must be logged in to create a team" };
	}
	const schema = z.object({
		name: z.string(),
	});
	const data = schema.safeParse({
		name: formData.get("name"),
	});
	if (!data.success) {
		return {
			message: `validation failed, ${JSON.stringify(data.error.flatten())}`,
		};
	}
	const supabaseAdmin = createAdminClient();
	const { error, data: createdTeam } = await supabaseAdmin
		.from("teams")
		.insert({ name: data.data.name, owner_id: userData.user.id })
		.select()
		.single();

	if (error || !createdTeam) {
		return { message: "Could not create team" };
	}
	// add user to team
	const { error: membershipError } = await supabaseAdmin
		.from("team_membership")
		.insert({ team_id: createdTeam.id, user_id: userData.user.id });
	if (membershipError) {
		return { message: "Could not add user to team" };
	}
	revalidatePath("/teams", "layout");
	redirect(`/teams/${createdTeam.id}`);
}
