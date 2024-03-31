"use client";
import { deleteHelp } from "@/app/actions";
import { Button } from "@yamada-ui/react";

export const DeleteButton = (props: { id: number }) => {
	return (
		<Button
			onClick={async () => {
				await deleteHelp(props.id);
			}}
		>
			削除
		</Button>
	);
};
