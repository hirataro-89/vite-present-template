# Vite 静的サイト構築テンプレート

LINE登録特典としてお配りしている、Viteを用いた静的サイト構築のミニマル環境です。

このテンプレートのメインは **「Viteの爆速HMR（Hot Module Replacement）を体感してもらうこと」** です。
保存した瞬間にブラウザへ変更が反映される開発体験を、まずは5分で味わってみてください。

---

## 事前に必要なもの

- **Node.js 20 以上**（最新の LTS 版を推奨）
  - まだインストールしていない方は、[Node.js 公式サイト](https://nodejs.org/ja) からダウンロードしてください。
- **Yarn**（または npm でもOK）
  - Node.js をインストールすると、`corepack enable` コマンドで Yarn を有効化できます。

## 起動確認手順

以下の3ステップで起動できます。

1. このリポジトリの「Code → Download ZIP」からダウンロード＆解凍
2. ターミナル（黒い画面）で解凍したフォルダに移動し、`yarn` コマンドを実行（依存関係がインストールされます）
3. `yarn dev` を実行 → 自動的にブラウザで `http://localhost:5173` が開きます

---

## ⚡ HMR の動作確認 — このテンプレートの本命

Viteの最大のメリットは **「保存した瞬間にブラウザへ変更が即座に反映される」** こと。
他のビルドツール（webpack / Gulp など）と比べて、その差は一度体感すると戻れないレベルです。

開発サーバーが立ち上がったら、まずはこれを試してみてください。

### CSS（SCSS）のHMR

1. `src/scss/base/_variables.scss` をエディタで開きます
2. `--color-primary: #007bff;` のカラーコードをお好きな色（例: `#ff0000`）に変更して保存（Ctrl+S / Cmd+S）
3. ブラウザを**リロードせずに**画面を見てください — ボタンやアクセントの色が**瞬時に**切り替わります

### JavaScript のHMR

1. `src/script.js` をエディタで開きます
2. `console.log(...)` のメッセージを書き換えて保存
3. ブラウザの開発者ツール（F12）のコンソールタブを開いておくと、保存するたびに新しいメッセージが出力されます

---

## ディレクトリ構成

```
.
├── src/
│   ├── index.html       # エントリHTML
│   ├── script.js        # エントリJS（SCSSもここから読み込む）
│   └── scss/
│       ├── base/        # リセットCSS、デザイントークン、ベースのスタイル
│       ├── layout/      # ヘッダー、フッターなど大枠のレイアウト
│       └── components/  # ボタンや見出しなど再利用パーツ
├── vite.config.js
└── package.json
```

`src/scss/style.scss` で各ディレクトリの `_index.scss` を `@use` しています。新しいSCSSファイルを追加するときは、各ディレクトリの `_index.scss` に1行足すだけです。

---

## 💡 おまけ：モダンCSSについて

せっかくテンプレートを作るならと、最近のCSS機能を使った設計にしてみました。

> **これは「こうしなきゃいけない」というものではありません**。
> 普段お使いのFLOCSS / BEM / お気に入りの命名規則に書き換えて使ってもらって全く問題ありません。
> モダンCSSに興味があれば「ふーん、こんな書き方もあるんだ」くらいで眺めてみてください。

このテンプレートで採用しているもの:

| 技術 | ざっくり何が嬉しい？ | 詳細 |
|---|---|---|
| `@scope` | コンポーネントごとにスタイルの適用範囲を限定できる | [MDN: @scope](https://developer.mozilla.org/ja/docs/Web/CSS/@scope) |
| `:where()` | セレクタの詳細度をゼロにできる（リセットCSSで便利） | [MDN: :where()](https://developer.mozilla.org/ja/docs/Web/CSS/:where) |
| CSS Custom Properties | デザイントークン（`--color-primary` など）の定義 | [MDN: カスタムプロパティ](https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties) |
| `clamp()` + コンテナクエリ | フォントサイズを画面幅に応じて滑らかに変える | [MDN: clamp()](https://developer.mozilla.org/ja/docs/Web/CSS/clamp) ／ [MDN: container queries](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_container_queries) |
| `@include mq()` mixin | SP-firstのメディアクエリを簡潔に書ける（Sass mixin） | [docs/css-architecture.md](docs/css-architecture.md#レスポンシブ対応) |

このテンプレート固有の設計判断（ファイル構成・命名）について深掘りしたい方は [docs/css-architecture.md](docs/css-architecture.md) を参照してください。

> **対応ブラウザ**: `@scope` は Chrome 118+ / Safari 17.4+ / Firefox 128+ で動作します。古いブラウザ対応が必要な場合は別の書き方への置き換えをご検討ください。

---

## ライセンス

[MIT ライセンス](https://opensource.org/licenses/MIT)のもとで公開しています。商用・非商用問わず自由にご利用ください。
