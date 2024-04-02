import { createClient } from "@/utils/supabase/server";
import { Text } from "@yamada-ui/react";
import { redirect } from "next/navigation";

export default async function Index() {
	return redirect("/teams");
}
