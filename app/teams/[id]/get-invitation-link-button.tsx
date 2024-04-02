"use client";
import { createClient } from "@/utils/supabase/client";
import { Button, useNotice } from "@yamada-ui/react";

export const GetInvitationLinkButton = (props: { id: number }) => {
	const notice = useNotice();
	const supabase = createClient();
	return (
		<Button
			onClick={async () => {
				// get from team_invitations
				const { data: teamInvitation, error } = await supabase
					.from("team_invitations")
					.select("*")
					.eq("team_id", props.id)
					.single();
				let teamInvitationId: string;
				if (error || !teamInvitation) {
					//create team_invitation
					const { error: error2 } = await supabase
						.from("team_invitations")
						.insert({ team_id: props.id });
					if (error2) {
						notice({
							status: "error",
							description: "招待リンクの作成に失敗しました",
						});
						return;
					}
					// get its id
					const { data: teamInvitation2, error: error3 } = await supabase
						.from("team_invitations")
						.select("*")
						.eq("team_id", props.id)
						.single();
					if (error3 || !teamInvitation2) {
						notice({
							status: "error",
							description: "招待リンクの取得に失敗しました",
						});
						return;
					}
					teamInvitationId = teamInvitation2.id;
				} else {
					teamInvitationId = teamInvitation.id;
				}
				// copy to clipboard
				await navigator.clipboard.writeText(
					`${location.origin}/teams/invitations/${teamInvitationId}`,
				);
				notice({
					status: "success",
					description: "招待リンクをコピーしました",
				});
			}}
		>
			招待リンクをコピー
		</Button>
	);
};
