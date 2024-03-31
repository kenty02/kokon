"use client";
import { sendHelp } from "@/app/actions";
import { createClient } from "@/utils/supabase/server";
import { State } from "@popperjs/core";
import {
	Autocomplete,
	AutocompleteOption,
	Box,
	Button,
	FormControl,
	Heading,
	Input,
	MultiSelect,
	Option,
	OptionGroup,
	Select,
	Text,
	VStack,
	useNotice,
} from "@yamada-ui/react";
import { useMemo, useState } from "react";
import { useFormState } from "react-dom";
import { z } from "zod";

export default function SendHelp(props: { teamId: number }) {
	const examples = [
		"パソコンが何もしてないのに壊れた",
		"Reactが動かないので見てほしい",
		"何も無いけど雑談したい",
	];
	const exampleName = useMemo(() => {
		return examples[Math.floor(Math.random() * examples.length)];
	}, []);
	const initialState = { message: "", errors: {} };
	const [state, formAction] = useFormState(sendHelp, initialState);

	const [category, setCategory] = useState<string[]>([]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		formData.append("category", JSON.stringify(category));
		formAction(formData);
	};

	return (
		<Box>
			{/*<Heading>助けを求める</Heading>*/}
			<Text color={"gray.500"}>
				どんなことでも大丈夫！誰かがきっと力になってくれます
			</Text>
			<Box mt={4}>
				<form action={formAction} onSubmit={handleSubmit}>
					<VStack>
						<FormControl label={"内容"}>
							<Input name={"name"} placeholder={exampleName} />
						</FormControl>
						<FormControl label={"カテゴリ"}>
							<MultiSelect
								name={"category"}
								placeholder="カテゴリを指定"
								onChange={(value) => {
									setCategory(value);
								}}
							>
								<OptionGroup label="技術サポート">
									<Option value="フロントエンド">フロントエンド</Option>
									<Option value="バックエンド">バックエンド</Option>
									<Option value="インフラ">インフラ</Option>
									<Option value="データベース">データベース</Option>
									<Option value="技術その他">その他</Option>
								</OptionGroup>

								<OptionGroup label="オフタイム">
									<Option value="雑談">雑談</Option>
									<Option value="ゲーム">ゲーム</Option>
									<Option value="ご飯">ご飯</Option>
								</OptionGroup>

								<OptionGroup label="緊急">
									<Option value="気分が優れない">気分が優れない</Option>
									<Option value="怪我">怪我</Option>
								</OptionGroup>
							</MultiSelect>
						</FormControl>
						<FormControl label={"どこで"}>
							<Autocomplete
								name={"location"}
								placeholder="今いる場所・Web会議のURL"
							>
								<AutocompleteOption value="対面で">対面で</AutocompleteOption>
								<AutocompleteOption value="オンラインで">
									オンラインで
								</AutocompleteOption>
								<AutocompleteOption value="通話を開始する">
									通話を開始する
								</AutocompleteOption>
							</Autocomplete>
						</FormControl>
						<input type={"hidden"} name={"team_id"} value={props.teamId} />
						<Text aria-live="polite" className="sr-only">
							{state?.message}
						</Text>
						<Button colorScheme={"primary"} size={"md"} mt={4} type={"submit"}>
							HELP!
						</Button>
					</VStack>
				</form>
			</Box>
		</Box>
	);
}
