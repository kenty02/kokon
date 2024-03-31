"use client";
import { handleRevalidate } from "@/app/actions";
import { Database } from "@/database.types";
import { createClient } from "@/utils/supabase/client";
import { useNotice } from "@yamada-ui/react";
import { revalidatePath } from "next/cache";
import { useCallback, useEffect } from "react";

export function Subscriptions(props: { teamId: number }) {
	const notice = useNotice();
	const supabase = createClient();
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const fetchRealtimeData = useCallback(() => {
		try {
			supabase
				.channel("*") // 任意のチャンネル名
				.on(
					"postgres_changes", // ここは固定
					{
						event: "*", // "INSERT" | "DELETE" | "UPDATE"  条件指定が可能
						schema: "public",
						table: "help_requests", // DBのテーブル名
					},
					(payload) => {
						// // データ登録
						if (payload.eventType === "INSERT") {
							const { name } = payload.new;
							notice({
								description: `${name}さんが助けを求めました!`,
								status: "info",
							});
						}
						// もう全部取得し直す
						void handleRevalidate(`/teams/${props.teamId}`);
					},
				)
				.subscribe();

			// リスナーの解除
			return () => {
				supabase.channel("table_postgres_changes").unsubscribe();
			};
		} catch (error) {
			console.error(error);
		}
	}, []);

	useEffect(() => {
		fetchRealtimeData();
	}, [fetchRealtimeData]);
	return null;
}
