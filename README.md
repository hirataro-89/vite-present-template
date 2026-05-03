# Vite 静的サイト構築テンプレート

Vite を使った静的サイト構築のミニマルテンプレートです。

**このテンプレートの核心は HMR（Hot Module Replacement）の体験**です。保存した瞬間にブラウザへ変更が反映される開発体験を、まず5分で味わってみてください。

---

## 必要なもの

- **Node.js `^20.19.0` または `>=22.12.0`**（Vite 7 の要件 / [公式サイト](https://nodejs.org/ja) からインストール、最新の LTS 推奨）
- **Yarn**（Node.js インストール後に `corepack enable` で有効化）

## 起動手順

```bash
# 1. リポジトリをクローン or ZIP ダウンロード＆解凍
# 2. 依存関係をインストール
yarn

# 3. 開発サーバーを起動（ブラウザが自動で開きます）
yarn dev
```

---

## ⚡ HMR を試してみる

Vite の最大のメリットは**保存した瞬間にブラウザへ変更が即座に反映される**こと。webpack / Gulp と比べてその差は一度体感すると戻れないレベルです。

### CSS（SCSS）のHMR

1. `src/scss/base/_variables.scss` を開く
2. `--color-brand: #5ed4ee;` を好きな色（例: `#ff6b6b`）に変更して保存
3. ブラウザをリロードせずに確認 — ボタンやアクセントの色が瞬時に切り替わります

### JavaScript のHMR

1. `src/script.js` を開く
2. `console.log(...)` のメッセージを書き換えて保存
3. ブラウザの開発者ツール（F12）のコンソールで確認

### サイト名・タイトルのHMR

1. `site.config.json` を開く
2. `siteName` や `title` を書き換えて保存
3. ブラウザがフルリロードされ、ヘッダー・タイトル・OGPが更新されます

---

## 🚀 自分のサイトとして使い始める

このテンプレートを土台に、自分のサイトを立ち上げる手順です。

### Step 1. サイト情報を書き換える

`site.config.json` を開いて、各項目を自分のサイトの情報に書き換えます。

```json
{
  "siteName": "あなたのサイト名",
  "title": "あなたのサイト名 | ページタイトル",
  "description": "サイトの説明文（検索結果やSNSシェア時に表示されます）",
  "url": "https://yourdomain.com",
  "ogImage": "/images/ogp.svg",
  "favicon": "/images/favicon.svg",
  "copyright": "© 2025 Your Name."
}
```

`src/index.html` 内の `{{title}}` や `{{siteName}}` などのプレースホルダーが、ビルド時に自動でこの値に置換されます。

### Step 2. 本文コンテンツを書き換える

`src/index.html` を開いて、ヒーロー・各セクションのテキストを書き換えます。サンプルでは「Web制作会社」のダミーコピーが入っているので、自分のサイトの内容に差し替えてください。

### Step 3. 配色を変える

`src/scss/base/_variables.scss` の **Brand Color** を書き換えれば、サイト全体のテーマカラーが切り替わります。

```scss
--color-brand: #5ed4ee;       // メインカラー（装飾アクセント）
--color-brand-dark: #1a8fa8;  // 濃いめ（ボタン・テキスト用）
--color-brand-soft: #eaf7fa;  // 淡い（ヒーロー背景用）
```

### Step 4. OGP画像・faviconを差し替える

`src/public/images/` の `ogp.svg` `favicon.svg` を自分のものに差し替えます。
SVG のままで構いませんが、PNG / JPEG でも OK です（その場合は `site.config.json` の拡張子も合わせて変更）。

### Step 5. ビルドして公開

```bash
yarn build
```

`dist/` フォルダの中身を Web サーバー（さくらのレンタルサーバー、Vercel、Netlify など）にアップロードすれば公開完了です。

---

## ディレクトリ構成

```
.
├── src/
│   ├── index.html       # エントリHTML（{{key}} プレースホルダーで site.config.json を参照）
│   ├── script.js        # エントリJS（SCSSもここから読み込む）
│   ├── images/          # 本文用画像（バンドル対象、ビルド時に自動最適化）
│   ├── public/          # そのまま dist/ にコピー（OGP・favicon など）
│   │   └── images/
│   └── scss/
│       ├── base/        # リセットCSS、デザイントークン、ベースのスタイル
│       ├── layout/      # ヘッダー、フッターなど大枠のレイアウト
│       └── components/  # ボタンや見出しなど再利用パーツ
├── site.config.json     # サイト全体のメタ情報
├── .prettierrc
├── vite.config.js
└── package.json
```

新しい SCSS ファイルを追加するときは、各ディレクトリの `_index.scss` に1行 `@use` するだけで読み込まれます。

---

## 🏗️ ビルドと本番確認

| コマンド | 用途 |
|---|---|
| `yarn dev` | 開発中（HMR あり、最適化なし） |
| `yarn build` | 本番ビルド（CSS/JS 圧縮・画像最適化あり） |
| `yarn preview` | ビルド結果の最終確認 |

```bash
yarn build    # dist/ に本番用ファイルを出力
yarn preview  # ビルド結果をブラウザで確認
```

`dist/` フォルダの中身をそのままサーバーにアップロードすれば公開できます。

> **画像の最適化**: `src/images/` に PNG / JPEG / WebP / AVIF を置いてビルドすると自動で品質80に圧縮されます。

---

## 📝 サイトメタ情報の管理（site.config.json）

サイト名・タイトル・OGP・favicon などのメタ情報は `site.config.json` で一元管理されています。

`src/index.html` 内に `{{title}}` `{{description}}` などのプレースホルダーを書いておくと、Vite の `transformIndexHtml` フックがビルド時に自動で置換します。

| 利用できるプレースホルダー | 出力例 |
|---|---|
| `{{siteName}}` | サイト名（ヘッダー・フッターのロゴ部分） |
| `{{title}}` | `<title>` タグの中身 |
| `{{description}}` | `<meta name="description">` の中身 |
| `{{url}}` | `<meta property="og:url">` の中身 |
| `{{ogType}}` | `<meta property="og:type">` の中身 |
| `{{ogImage}}` | OGP 画像のパス |
| `{{twitterCard}}` | Twitter カードの種類 |
| `{{favicon}}` | favicon のパス |
| `{{locale}}` | `<html lang="...">` の中身 |
| `{{copyright}}` | フッターのコピーライト表記 |

**特徴：**
- 静的HTMLとして埋め込まれるため OGP / SEO クローラーにも完璧に対応
- 開発中に `site.config.json` を編集するとフルリロードで即座に反映
- OGP 画像や favicon は `src/public/images/` に配置（`public/` 配下はそのままのパスで `dist/` に出力されます）

---

## 🎨 配色の設計（CSS変数の3層構造）

このテンプレートは CSS 変数を **3層に分けて** 設計しているため、色のメンテナンスやテーマ変更がとても簡単です。

### Layer 1: Brand Tokens（ブランド色）

サイト固有のブランドカラー。**配色を変えたいときはここだけを書き換えれば OK**。

```scss
--color-brand: #5ed4ee;       // メインカラー
--color-brand-dark: #1a8fa8;  // ボタン・テキスト用（コントラスト確保）
--color-brand-soft: #eaf7fa;  // ヒーロー背景用
```

### Layer 2: Neutral Tokens（中性色のスケール）

背景・ボーダー・テキスト用の中性色。基本的にはそのまま使えます。

```scss
--color-neutral-50:  #fcfbf8;  // page background（warm off-white）
--color-neutral-100: #f4f1ea;  // section-alt（warm sand）
--color-neutral-200: #e8e4da;  // border
--color-neutral-700: #5b6770;  // sub text
--color-neutral-900: #1f2933;  // main text
--color-neutral-950: #1b2530;  // footer bg
```

### Layer 3: Semantic Tokens（用途で命名）

実装側はこのレイヤーを参照します。「何の用途か」が名前から分かるので、SCSS を書くときに迷いません。

```scss
--color-primary       // → Layer 1 を参照
--color-text          // → Layer 2 を参照
--color-bg-hero       // ヒーローの背景
--color-bg-alt        // section-alt の背景
--color-surface       // カードなどの浮いた面
--color-border        // 区切り線
```

**この設計の利点：**
- ブランド色を変えるなら Layer 1 だけ
- 実装側は `--color-primary-dark` のように"用途"で書ける
- テーマ追加（ダークモードなど）も Layer 3 を再定義するだけ

### その他の変数

```scss
:root {
  // Typography
  --font-family-base: "Noto Sans JP", ...;

  // Layout
  --container-max-width: 1200px;
  --container-padding: 1rem;
  --section-padding-y: 3rem;

  // Effects
  --transition-base: 0.3s ease;
  --radius-card: 12px;
  --shadow-card: ...;
}
```

### ブレークポイント

`src/scss/base/_breakpoints.scss` に定義しています。SCSS ファイル内で `@include mq(md) { ... }` と書くと 768px 以上に適用されます。

```scss
$breakpoints: (
  sm: 600px,
  md: 768px,
  lg: 1024px,
  xl: 1440px,
);
```

---

## 💡 採用しているモダン CSS

FLOCSS / BEM など普段の命名規則に書き換えて使っても問題ありません。「こんな書き方もある」程度に眺めてみてください。

| 技術 | 何が嬉しい？ | 詳細 |
|---|---|---|
| `@scope` | コンポーネントごとにスタイルの適用範囲を限定できる | [MDN](https://developer.mozilla.org/ja/docs/Web/CSS/@scope) |
| `:where()` | セレクタの詳細度をゼロにできる（リセットCSSで便利） | [MDN](https://developer.mozilla.org/ja/docs/Web/CSS/:where) |
| CSS Custom Properties | デザイントークンの一元管理（上記の3層構造） | [MDN](https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties) |
| `clamp()` + コンテナクエリ | フォントサイズを画面幅に応じて滑らかに変える | [MDN](https://developer.mozilla.org/ja/docs/Web/CSS/clamp) |
| `@include mq()` mixin | SP-first のメディアクエリを簡潔に書ける | [docs/css-architecture.md](docs/css-architecture.md) |

設計判断の詳細は [docs/css-architecture.md](docs/css-architecture.md) を参照してください。

> **対応ブラウザ**: `@scope` は Chrome 118+ / Safari 17.4+ / Firefox 128+ で動作します。

---

## ✨ コードフォーマット（Prettier）

`.prettierrc` を同梱しています。VS Code の [Prettier 拡張機能](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) をインストールすると保存時に自動整形されます。

```bash
yarn add -D prettier        # Prettier をインストール（初回のみ）
yarn prettier --write src/  # フォーマット実行
```

---

## ライセンス

[MIT](https://opensource.org/licenses/MIT) — 商用・非商用問わず自由にご利用ください。
