import { deleteHelp } from "@/app/actions";
import { DeleteButton } from "@/app/teams/[id]/delete-button";
import SendHelp from "@/app/teams/[id]/send-help";
import { Subscriptions } from "@/app/teams/[id]/subscriptions";
import { createClient } from "@/utils/supabase/server";
import {
	Accordion,
	AccordionItem,
	Box,
	Button,
	Card,
	CardBody,
	CardHeader,
	Container,
	Divider,
	FormControl,
	Heading,
	Text,
	VStack,
} from "@yamada-ui/react";
import { revalidatePath } from "next/cache";
import { redirect, useParams } from "next/navigation";

export default async function TeamPage({ params }: { params: { id: number } }) {
	const supabase = createClient();
	const { data: helps, error } = await supabase
		.from("help_requests")
		.select("*")
		.eq("team_id", params.id);

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return redirect("/login");
	}

	return (
		<Box>
			<Accordion variant={"card"} isToggle>
				<AccordionItem label={"助けを呼ぶ"}>
					<SendHelp teamId={params.id} />
				</AccordionItem>
			</Accordion>
			<Subscriptions teamId={params.id} />
			<Divider my={"4"} />
			<Box>
				{/*<Heading>今助けを求めし者たち</Heading>*/}
				<Box backgroundColor={"gray.50"} p={4} borderRadius={"md"} mt={4}>
					<Heading size="xl" mb={3}>
						今助けを求めし者たち
					</Heading>
					<VStack>
						{helps?.map((help) => (
							<Card key={help.id} backgroundColor={"white"}>
								<CardHeader>
									<Heading size="md">
										[{help.category != null ? help.category.join(",") : ""}]{" "}
										{help.name}
									</Heading>
								</CardHeader>

								<CardBody>
									<Text>場所：{help.location}</Text>
									<DeleteButton id={help.id} />
								</CardBody>
							</Card>
						))}
					</VStack>
				</Box>
			</Box>
		</Box>
	);
}
