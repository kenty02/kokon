"use client";
import { createTeam } from "@/app/actions";
import { createClient } from "@/utils/supabase/client";
import {
	Box,
	Button,
	FormControl,
	Input,
	Text,
	VStack,
} from "@yamada-ui/react";
import { useFormState } from "react-dom";

export default function CreateTeamPage({ params }: { params: { id: number } }) {
	const supabase = createClient();

	const initialState = { message: "" };

	const [state, formAction] = useFormState(createTeam, initialState);

	return (
		<Box>
			<Box mt={4}>
				<form action={formAction}>
					<VStack>
						<FormControl label={"チーム名"}>
							<Input name={"name"} />
						</FormControl>
						<Text aria-live="polite" className="sr-only">
							{state?.message}
						</Text>
						<Button colorScheme={"primary"} size={"md"} mt={4} type={"submit"}>
							チームを作成
						</Button>
					</VStack>
				</form>
			</Box>
		</Box>
	);
}
