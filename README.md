# Vite 静的サイト構築テンプレート

このテンプレートは、LINE登録特典として配布する「Viteを用いた静的サイト構築環境」です。
複雑なツールチェーンを省き、必要最小限の構成で高速なHMR（Hot Module Replacement）を体感できるように設計されています。

## 事前に必要なもの

- **Node.js 20 以上**（最新の LTS 版を推奨）
  - まだインストールしていない方は、[Node.js 公式サイト](https://nodejs.org/ja) からダウンロードしてください。
- **Yarn**（または npm でもOK）
  - Node.js をインストールすると、`corepack enable` コマンドで Yarn を有効化できます。

## 起動確認手順

以下の3ステップで起動することができます。

1. このリポジトリの「Code → Download ZIP」からダウンロード＆解凍してください。
2. ターミナル（黒い画面）で解凍したフォルダに移動し、`yarn` コマンドを実行します（依存関係がインストールされます）。
3. `yarn dev` を実行 → 自動的にブラウザで `http://localhost:5173` が開きます。

## HMR の動作確認方法

Viteの最大のメリットは「保存した瞬間にブラウザへ変更が即座に反映される（HMR）」ことです。
開発サーバーが立ち上がったら、以下をお試しください。

### CSS（SCSS）のHMR

1. `src/scss/foundation/_variables.scss` をエディタで開きます。
2. `--color-primary: #007bff;` のカラーコードをお好きな色（例: `#ff0000`など）に変更して、上書き保存（Ctrl+S / Cmd+S）します。
3. ブラウザをリロード**せずに**画面を見てください。ボタンやアクセントの色などが即座に切り替わります！

### JavaScript のHMR

1. `src/script.js` をエディタで開きます。
2. `console.log(...)` のメッセージを書き換えて保存します。
3. ブラウザの開発者ツール（F12）のコンソールタブを開いておくと、保存するたびに新しいメッセージが出力されます。

## ディレクトリ構成について

```
.
├── src/
│   ├── index.html       # エントリHTML
│   ├── script.js        # エントリJS（SCSSもここから読み込む）
│   └── scss/
│       ├── foundation/  # リセットCSS、デザイントークン（CSS変数）、ベースとなるタグのスタイル
│       ├── layout/      # ヘッダー、フッターなど、ページを構成する大枠のスタイル
│       └── components/  # ボタンや見出しなど、再利用可能な独立したパーツ
├── vite.config.js
└── package.json
```

CSS構成はFLOCSSライクな3層（Foundation, Layout, Components）を採用しています。

## SCSS のグロブインポートについて

本テンプレートは [`vite-plugin-sass-glob-import`](https://www.npmjs.com/package/vite-plugin-sass-glob-import) を使い、
[`src/scss/style.scss`](src/scss/style.scss) でワイルドカードによる一括読み込みを行っています。

```scss
@use "foundation";
@use "layout/**";
@use "components/**";
```

`layout/` や `components/` の中にファイルを追加するだけで自動的に読み込まれるため、
コンポーネント分割が増えても `style.scss` を毎回書き換える必要がありません。

`foundation/` だけは読み込み順序が意味を持つため、[`foundation/_index.scss`](src/scss/foundation/_index.scss) で明示的に `@use` しています。

## デザイントークン（CSS変数）について

配色・フォント・余白などの共通値は、[`src/scss/foundation/_variables.scss`](src/scss/foundation/_variables.scss) に **CSS カスタムプロパティ（CSS変数）** としてまとめています。

```scss
:root {
  --color-primary: #007bff;
  --color-text: #333;
  --container-max-width: 1200px;
  // ...
}
```

各 SCSS ファイルからは `var(--color-primary)` のように参照するだけで使えます。

```scss
.c-button {
  background-color: var(--color-primary);
  border-radius: var(--radius-pill);
}
```

SCSS変数（`$xxx`）とは異なり、CSS変数はブラウザ実行時に評価されるため、
将来的にダークモードやテーマ切り替えを導入したくなったときも、クラス単位で `--color-*` を上書きするだけで対応できます。
また、各ファイルで毎回 `@use` を書く必要がないので、構成がシンプルになります。

## ライセンス

[MIT ライセンス](https://opensource.org/licenses/MIT)のもとで公開されています。商用・非商用問わず自由にご利用ください。
