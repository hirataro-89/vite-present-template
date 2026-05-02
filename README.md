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
2. `--color-primary: #007bff;` を好きな色に変更して保存
3. ブラウザをリロードせずに確認 — ボタンやアクセントの色が瞬時に切り替わります

### JavaScript のHMR

1. `src/script.js` を開く
2. `console.log(...)` のメッセージを書き換えて保存
3. ブラウザの開発者ツール（F12）のコンソールで確認

---

## ディレクトリ構成

```
.
├── src/
│   ├── index.html       # エントリHTML
│   ├── script.js        # エントリJS（SCSSもここから読み込む）
│   ├── images/          # 画像置き場（ビルド時に自動最適化）
│   └── scss/
│       ├── base/        # リセットCSS、デザイントークン、ベースのスタイル
│       ├── layout/      # ヘッダー、フッターなど大枠のレイアウト
│       └── components/  # ボタンや見出しなど再利用パーツ
├── .prettierrc
├── vite.config.js
└── package.json
```

新しい SCSS ファイルを追加するときは、各ディレクトリの `_index.scss` に1行 `@forward` するだけです。

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

## 🎨 カスタマイズガイド

`src/scss/base/_variables.scss` の CSS 変数を書き換えるだけで、サイト全体のデザインを一括変更できます。

### カラー

```scss
:root {
  --color-primary: #007bff;    /* メインカラー（ボタン・アクセント） */
  --color-text: #333;          /* 本文テキスト */
  --color-text-muted: #555;    /* サブテキスト（薄め） */
  --color-bg: #f8f9fa;         /* ページ背景 */
  --color-white: #fff;         /* 白（カード背景など） */
  --color-border: #e2e8f0;     /* 区切り線 */
  --color-footer-bg: #1a202c;  /* フッター背景 */
}
```

`--color-primary` を変えるだけでボタン・アクセントカラーがサイト全体で切り替わります。

### フォント

```scss
:root {
  --font-family-base: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN",
    "Hiragino Sans", Meiryo, sans-serif;
}
```

Google Fonts を使う場合は `index.html` で `<link>` を読み込んでからこの変数を書き換えます。

### レイアウト

```scss
:root {
  --container-max-width: 1200px;  /* コンテンツ幅の最大値 */
  --container-padding: 1rem;      /* 左右の余白（SP） */
  --section-padding-y: 3rem;      /* セクションの上下余白（SP） */
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

FLOSS / BEM など普段の命名規則に書き換えて使っても問題ありません。「こんな書き方もある」程度に眺めてみてください。

| 技術 | 何が嬉しい？ | 詳細 |
|---|---|---|
| `@scope` | コンポーネントごとにスタイルの適用範囲を限定できる | [MDN](https://developer.mozilla.org/ja/docs/Web/CSS/@scope) |
| `:where()` | セレクタの詳細度をゼロにできる（リセットCSSで便利） | [MDN](https://developer.mozilla.org/ja/docs/Web/CSS/:where) |
| CSS Custom Properties | デザイントークンの一元管理 | [MDN](https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties) |
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
