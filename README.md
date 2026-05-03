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
  "copyright": "© 2026 Your Name."
}
```

`src/index.html` 内の `{{title}}` や `{{siteName}}` などのプレースホルダーが、ビルド時に自動でこの値に置換されます。

### Step 2. 本文コンテンツを書き換える

`src/index.html` を開いて、ヒーロー・各セクションのテキストを書き換えます。サンプルでは「Web制作会社」のダミーコピーが入っているので、自分のサイトの内容に差し替えてください。

### Step 3. 配色を変える

`src/scss/base/_variables.scss` の `--color-primary` を書き換えれば、サイト全体のテーマカラーが切り替わります。

```scss
--color-primary: #1a8fa8;  // ブランド色（ボタン・テキスト・アクセント）
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

## 🎨 配色の設計

このテンプレートは色変数を **必要最小限の7個** に絞ってフラットに定義しています。階層を増やすと「どれが本物の色定義か」が辿りづらくなるため、用途で命名した変数に直接 hex を割り当てるシンプルな構造です。

```scss
--color-primary: #1a8fa8;     // ブランド色（ボタン・テキスト・アクセント）
--color-bg: #fcfbf8;          // ページ背景（warm off-white）
--color-bg-alt: #f4f1ea;      // section-alt の背景（warm sand）
--color-text: #1f2933;        // 本文テキスト
--color-text-muted: #5b6770;  // 補助テキスト
--color-border: #e8e4da;      // 区切り線
--color-black: #1f2933;       // shadow等の元色（透明度を派生させる用途）
```

**白（`#ffffff`）はあえて変数化していません。**「用途が分かる名前を付けても結局 white と書くのと同じ」になるためです。カードや header の背景は SCSS 側で `#ffffff` 直書きで OK。

### shadow を oklch で派生させる

`--shadow-card` は `--color-black` から oklch を使って透明度を派生させています。「shadow の濃さや色味を一元的に変えたい」というときに、元色を1箇所変えるだけで済みます。

```scss
--shadow-card: 0 1px 2px oklch(from var(--color-black) l c h / 0.04),
  0 4px 12px oklch(from var(--color-black) l c h / 0.04);
```

`oklch(from <色> l c h / <alpha>)` は、元の色の明度・彩度・色相をそのまま使って透明度だけを変える書き方です。`rgba()` で `(31, 41, 51, 0.04)` のようにマジックナンバーを書くより、変数を1つ持ち、そこから派生させたほうがメンテしやすくなります。

> **対応ブラウザ**: `oklch()` は Chrome 111+ / Safari 16.4+ / Firefox 113+ で動作します。古いブラウザもサポートしたい場合は `rgba(31, 41, 51, 0.04)` に書き戻してください。

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
  --radius-pill: calc(infinity * 1px);
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

### 同梱画像の出典

- `src/images/sample.jpg`: [Unsplash](https://unsplash.com/photos/photo-1557683316-973673baf926) — 自分のサイトで使う際は差し替えてください。
- `src/public/images/ogp.svg` `favicon.svg`: 本テンプレート用に作成したダミー画像（自由に差し替え可能）。
