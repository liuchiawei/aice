# チームメンバー紹介ページ

Apple Watch OS にインスパイアされたインタラクティブなドラッグ可能グリッドインターフェースを特徴とするメンバー紹介ページです。

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)、React 19
- **UI**: Tailwind CSS 4、shadcn/ui コンポーネント
- **アニメーション**: Motion/React (Framer Motion)
- **データベース**: PostgreSQL (Prisma ORM)
- **ストレージ**: Vercel Blob (画像保存)
- **パッケージマネージャー**: pnpm (ワークスペース構成)

## セットアップ

### 1. 依存関係のインストール

```bash
pnpm install
```

### 2. 環境変数の設定

`.env` ファイルを作成し、以下の変数を設定してください：

```env
DATABASE_URL="your-postgresql-connection-string"
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### 3. データベースのセットアップ

```bash
# Prisma Client を生成
pnpm dlx prisma generate

# マイグレーションを実行
pnpm dlx prisma migrate dev

# データベースにシードデータを投入（オプション）
pnpm dlx prisma db seed
```

### 4. 開発サーバーの起動

```bash
pnpm dev
```

## 主な機能

### 1. インタラクティブグリッドシステム

- Motion/React を使用したドラッグ可能なハニカムスタイルグリッド
- 画面幅に基づく レスポンシブグリッドカラム（3〜10列）
- スケール・トランスレート効果を使った Transform ベースのアニメーション
- アイコンをクリックしてメンバー詳細カードを開く
- 新しいメンバーを追加するためのプラスボタン

### 2. メンバー登録システム

- アバター写真アップロード機能付き登録フォーム
- ファイルサイズ制限：4MB 以下
- Vercel Blob ストレージとの統合
- 多言語対応（姓、名、ふりがな、ニックネーム）

### 3. データベース統合

- PostgreSQL (Neon) を使用したサーバーレスデータベース
- Prisma ORM によるタイプセーフなデータアクセス
- サーバーコンポーネントでのリアルタイムデータフェッチ

## よく使うコマンド

```bash
# 開発
pnpm dev                         # Turbopack で開発サーバーを起動

# ビルド & デプロイ
pnpm build                       # Turbopack でプロダクションビルド
pnpm start                       # プロダクションサーバーを起動

# コード品質
pnpm lint                        # ESLint を実行

# データベース (Prisma)
pnpm dlx prisma generate         # src/generated/prisma に Prisma Client を生成
pnpm dlx prisma migrate dev      # マイグレーションを作成・適用
pnpm dlx prisma studio           # Prisma Studio GUI を開く
pnpm dlx prisma db push          # マイグレーションなしでスキーマ変更をプッシュ
```

## プロジェクト構成

```
src/
├── app/
│   ├── (index)/
│   │   ├── components/
│   │   │   ├── hero.tsx              # インタラクティブグリッド
│   │   │   └── TeamMemberCard.tsx    # メンバーカード
│   │   ├── [id]/                     # メンバー詳細ページ
│   │   └── page.tsx                  # チーム一覧ページ
│   ├── register/
│   │   └── page.tsx                  # 登録フォーム
│   └── api/
│       └── register/
│           └── route.ts              # 登録 API
├── components/
│   ├── ui/                           # shadcn/ui コンポーネント
│   └── layout/                       # レイアウトコンポーネント
└── data/
    └── team-members.json             # シード用データ

prisma/
├── schema.prisma                     # データベーススキーマ
└── seed.ts                           # シードスクリプト
```

## API エンドポイント

### POST `/api/register`

チームメンバーの登録とアバターアップロード

**リクエスト形式**: `FormData`

**フィールド**:
- `firstName`, `lastName`, `furigana`, `nickname` (必須)
- `role`, `description`, `age`, `joinReason`, `goal`, `message` (必須)
- `partTimeJob` (任意)
- `avatar` (任意、画像ファイル、4MB以下)

**レスポンス**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "firstName": "太郎",
    "lastName": "山田",
    "image": "https://blob.vercel-storage.com/...",
    ...
  }
}
```

## データベーススキーマ

```prisma
model TeamMember {
  id          Int      @id @default(autoincrement())
  firstName   String
  lastName    String
  furigana    String
  nickname    String
  image       String
  role        String
  partTimeJob String
  description String
  age         Int
  joinReason  String
  goal        String
  message     String
}
```

## デプロイ

このアプリを Vercel にデプロイするのが最も簡単です：

1. GitHub リポジトリを Vercel に接続
2. 環境変数を設定（`DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`）
3. デプロイ

詳細は [Next.js デプロイメントドキュメント](https://nextjs.org/docs/app/building-your-application/deploying)をご覧ください。

## ライセンス

MIT
