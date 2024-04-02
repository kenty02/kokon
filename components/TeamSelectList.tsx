"use client";
import type { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/client";
import { Center, Option, Select, Text, useNotice } from "@yamada-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const supabase = createClient();
export default function TeamSelectList() {
	// todo: `teams/[id]`以外のパターンも考慮する 例えば`user/[id]`などで絶対バグる
	const { id } = useParams();
	const isTeamPage = id !== undefined;
	const notice = useNotice();
	const [teams, setTeams] = useState<
		Database["public"]["Tables"]["teams"]["Row"][]
	>([]);
	async function getTeams() {
		const { data: teams, error } = await supabase.from("teams").select("*");
		if (error) {
			console.error(error);
			notice({
				description: "チームを取得できませんでした",
				status: "error",
			});
			return;
		}
		setTeams(teams);
	}
	useEffect(() => {
		void getTeams();
	}, []);
	const formRef = useRef<HTMLFormElement>(null);

	const router = useRouter();
	return (
		<header>
			<Center py={4}>
				<Text size={"xl"} fontWeight={"bold"}>
					kokon
				</Text>
			</Center>

			<form ref={formRef}>
				<Select
					placeholder="チームを選択"
					onChange={async (value) => {
						if (value === "") {
							router.push("/");
							return;
						}
						router.push(`/teams/${value}`);
					}}
					name={"team_id"}
					defaultValue={typeof id === "string" ? id : undefined}
				>
					{teams?.map((team) => (
						<Option key={team.id} value={String(team.id)}>
							{team.name}
						</Option>
					))}
				</Select>
			</form>
		</header>
	);
}
