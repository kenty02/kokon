"use client";
import type {Database} from "@/database.types";
import {Center, Option, Select, Text} from "@yamada-ui/react";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useRef, useState} from "react";

export default function TeamSelectList({
	teams,
}: { teams: Database["public"]["Tables"]["teams"]["Row"][] }) {
	// todo: `teams/[id]`以外のパターンも考慮する 例えば`user/[id]`などで絶対バグる
	let id: string | null;
	const params = useParams();
	if (typeof params.id !== "string") {
		id = null;
	} else {
		id = params.id;
	}
	const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
	useEffect(() => {
		setSelectedTeam(id);
	}, [id]);
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
						setSelectedTeam(value);
						if (value === "") {
							router.push("/");
							return;
						}
						if (value === "_create") {
							router.push("/teams/create");
							return;
						}
						router.push(`/teams/${value}`);
					}}
					name={"team_id"}
					value={selectedTeam ?? undefined}
				>
					{teams?.map((team) => (
						<Option key={team.id} value={String(team.id)}>
							{team.name}
						</Option>
					))}
					<Option key={"_create"} value={"_create"}>
						新しいチームを作成
					</Option>
				</Select>
			</form>
		</header>
	);
}
