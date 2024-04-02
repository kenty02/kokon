"use client";

import { Button } from "@yamada-ui/react";
import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ComponentProps<"button"> & {
	pendingText?: string;
};

export function LoginButton({ children, pendingText, ...props }: Props) {
	const { pending, action } = useFormStatus();

	const isPending = pending && action === props.formAction;

	return (
		<Button {...props} type="submit" aria-disabled={pending}>
			{isPending ? pendingText : children}
		</Button>
	);
}
