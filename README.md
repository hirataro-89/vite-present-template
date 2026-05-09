# Vite 静的サイト構築テンプレート

Vite + Sass + モダンCSSのミニマルな静的サイト制作テンプレートです。

---

## 必要なもの

- **Node.js** `^20.19.0` または `>=22.12.0`（[公式サイト](https://nodejs.org/ja)）
- **Yarn**（`corepack enable` で有効化）

## 起動

```bash
yarn        # 依存関係をインストール
yarn dev    # 開発サーバー起動（ブラウザが自動で開きます）
```

ファイルを保存すると、ブラウザに変更が即座に反映されます（HMR）。

---

## ディレクトリ構成

```
src/
├── index.html        # エントリHTML
├── public/           # そのまま dist/ にコピー（OGP・favicon）
└── assets/
    ├── images/       # 本文用画像（ビルド時に自動最適化）
    ├── js/script.js  # エントリJS
    └── scss/
        ├── base/         # リセット・トークン・ベース
        ├── layout/       # ヘッダー、フッターなど
        ├── components/   # ボタン、カードなど
        └── style.scss
```

新しい SCSS ファイルを追加するときは、各ディレクトリの `_index.scss` に1行 `@use` するだけで読み込まれます。

---

## ビルド

| コマンド       | 用途                                  |
| -------------- | ------------------------------------- |
| `yarn dev`     | 開発（HMR あり）                      |
| `yarn build`   | 本番ビルド（CSS/JS 圧縮・画像最適化） |
| `yarn preview` | ビルド結果の確認                      |

`dist/` フォルダの中身をそのままサーバーにアップロードすれば公開できます。

> **画像の最適化**: `src/assets/images/` に PNG / JPEG / WebP / AVIF を置いてビルドすると自動で品質80に圧縮されます。

---

## スタイリング

### 配色

`src/assets/scss/base/_variables.scss` に CSS 変数で色をまとめて定義しています。`--color-primary` を書き換えればサイト全体のテーマカラーが変わります。

```scss
--color-primary: #1a8fa8; // ブランド色
--color-bg: #fcfbf8; // ページ背景
--color-bg-alt: #f4f1ea; // section-alt の背景
--color-text: #1f2933; // 本文テキスト
--color-text-muted: #5b6770; // 補助テキスト
--color-border: #e8e4da; // 区切り線
--color-white: #ffffff;
--color-black: #1f2933; // shadow等の元色
```

### その他のデザイントークン

`_variables.scss` には色のほかに、フォント・余白・角丸・トランジション・シャドウなどもまとめて定義しています。サイト全体で共通の値を変えたいときはここを見てください。

### ブレークポイント

`_breakpoints.scss` に定義済み。SCSS 内で `@include mq(md) { ... }` と書くと 768px 以上に適用されます。

### 設計の詳細

[docs/css-architecture.md](docs/css-architecture.md) を参照してください（`@scope` / `:where()` / `oklch()` などモダンCSSの活用例）。

---

## コードフォーマット

Prettier を同梱しています。VS Code の [Prettier 拡張機能](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) を入れると保存時に自動整形されます。CLI で一括整形したい場合は以下を実行してください。

```bash
yarn format        # 整形を実行
yarn format:check  # 整形漏れがないか確認
```

---

## ライセンス

[MIT](https://opensource.org/licenses/MIT) — 商用・非商用問わず自由にご利用ください。

### 同梱画像

- `src/assets/images/sample.jpg`: [Unsplash](https://unsplash.com/photos/photo-1557683316-973673baf926) — 自分のサイトで使う際は差し替えてください。
- `src/assets/images/sample.svg` / `src/public/images/{ogp.png, favicon.svg, favicon.png, apple-touch-icon.png}`: 本テンプレート用のダミー（自由に差し替え可能）。OGPは主要SNSがSVGに非対応のため**PNGまたはJPGを使ってください**。
