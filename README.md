# kokon

「助けを呼びづらい」そんなことありませんか？kokonで解決しましょう！鋭意開発中

## 現在の機能

- ヘルプ要求の作成
- ヘルプ要求の一覧表示
- チーム機能
    - チームの作成
    - チームの一覧表示
    - 招待リンクによるチームへの参加
- GitHubによるログイン

## Clone and run locally

1. [Supabaseのプロジェクトを作成します](https://database.new)

2. `.env.local.example`を`.env.local`にリネームして各種項目を埋めます。

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   `NEXT_PUBLIC_SUPABASE_URL`と`NEXT_PUBLIC_SUPABASE_ANON_KEY`は[SupabaseプロジェクトのAPI settings](https://app.supabase.com/project/_/settings/api)を参照してください。

5. Next.jsのローカルサーバーを起動します。

   ```bash
   npm run dev
   ```

   [localhost:3000](http://localhost:3000/)でアプリケーションが起動します。
