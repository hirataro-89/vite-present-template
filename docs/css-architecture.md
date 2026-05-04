# CSS設計について（補足資料）

> **このドキュメントは「このテンプレートではこう設計した」という記録です。**
> CSSの設計に正解はありません。ここに書いた設計に縛られず、お好みのアーキテクチャに書き換えて使ってください。

---

## 採用している技術

| 技術 | 役割 | 詳細リンク |
|---|---|---|
| `@scope` | レイアウトコンポーネントのスタイルを隔離 | [MDN: @scope](https://developer.mozilla.org/ja/docs/Web/CSS/@scope) |
| `:where()` | リセットCSSの詳細度をゼロにする | [MDN: :where()](https://developer.mozilla.org/ja/docs/Web/CSS/:where) |
| CSS Custom Properties | デザイントークン + コンポーネントAPI | [MDN: カスタムプロパティ](https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties) |
| `clamp()` + コンテナクエリ | FVのフォントサイズを画面幅に応じて変化 | [MDN: clamp()](https://developer.mozilla.org/ja/docs/Web/CSS/clamp) ／ [MDN: container queries](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_container_queries) |

各機能の使い方や挙動の詳細はMDNがいちばん分かりやすいので、深く知りたい方はリンク先を参照してください。

---

## ファイル構成

```
src/scss/
├── style.scss               ← 各ディレクトリの _index.scss を @use
│
├── base/
│   ├── _index.scss
│   ├── _variables.scss      ← CSS Custom Properties（:root）
│   ├── _reset.scss          ← :where() ベースのリセット
│   └── _base.scss           ← body などのベースのスタイル
│
├── layout/
│   ├── _index.scss
│   ├── _container.scss      ← .container（最大幅ラッパー）
│   ├── _header.scss         ← @scope (.header)
│   ├── _hero.scss           ← @scope (.hero)
│   ├── _section.scss        ← @scope (.section)
│   └── _footer.scss         ← @scope (.footer)
│
└── components/
    ├── _index.scss
    ├── _button.scss         ← .button / .button-outline
    ├── _card.scss           ← サービスセクションのカード
    ├── _section-title.scss
    └── _steps.scss          ← 使い方セクションの手順リスト
```

`style.scss` はディレクトリ単位で読み込むだけ:

```scss
@use "base";
@use "layout";
@use "components";
```

ファイルを追加するときは各ディレクトリの `_index.scss` に1行追記するだけです。

> **`layout/_index.scss` の順序**: `container` を `header` より前に記述してください。`@scope (.header)` 内の `.container` 追加スタイルが後勝ちになる順序を保証するためです。

---

## デザイントークン

`base/_variables.scss` に定義しています。色変数は **必要最小限の7個** をフラットに定義しています（階層を増やすと「どれが本物の色定義か」が辿りづらくなるため）。

```scss
:root {
  // Color（用途で命名、hexで直接定義）
  --color-primary: #1a8fa8;
  --color-bg: #fcfbf8;
  --color-bg-alt: #f4f1ea;
  --color-text: #1f2933;
  --color-text-muted: #5b6770;
  --color-border: #e8e4da;
  --color-black: #1f2933;  // shadow等の元色

  // Layout
  --container-max-width: 1200px;
  --section-padding-y: 3rem;

  // Effects
  --transition-base: 0.3s ease;
  --shadow-card: 0 1px 2px oklch(from var(--color-black) l c h / 0.04),
    0 4px 12px oklch(from var(--color-black) l c h / 0.04);
}
```

色を変えたい場合は、`--color-primary` を書き換えるだけでサイト全体のテーマカラーが切り替わります。

### shadow を oklch で派生させる

`--shadow-card` は `--color-black` から `oklch(from ...)` を使って透明度を派生しています。`rgba(31, 41, 51, 0.04)` のようにマジックナンバーを書くより、元色を変数化して派生させたほうが、shadow の色味を一括で変えられてメンテしやすくなります。

> `oklch()` は Chrome 111+ / Safari 16.4+ / Firefox 113+ で動作します。古いブラウザもサポートする場合は `rgba()` に書き戻してください。

---

## ボタンのCSS変数API

`.button` と `.button-outline` は外部からCSS変数で見た目を上書きできます。

| 変数 | デフォルト | 役割 |
|---|---|---|
| `--btn-bg` | `var(--color-primary)` | 背景色・ボーダー色 |
| `--btn-color` | `#ffffff` | テキスト色（`.button` のみ） |
| `--btn-font-size` | `1rem` | サイズ感 |

例: ヘッダー内のボタンを小さくする

```scss
@scope (.header) {
  .button {
    --btn-font-size: 0.875rem;
    padding-block: 0.5rem;
    padding-inline: 1.25rem;
  }
}
```

---

## レスポンシブ対応

### `@include mq()` mixin（SPファースト）

`base/_breakpoints.scss` に Sass mixin を定義しています。`min-width` ベースの SPファースト設計です。

```scss
$breakpoints: (
  sm: 600px,
  md: 768px,   // デフォルト
  lg: 1024px,
  xl: 1440px,
);
```

### 使い方

mixin を使いたい SCSS ファイルの先頭で `@use` してから呼び出します。

```scss
@use "../base/breakpoints" as *;

.foo {
  font-size: 1rem;

  @include mq(md) {
    font-size: 1.25rem;
  }

  @include mq(lg) {
    font-size: 1.5rem;
  }
}
```

引数省略時は `md`（768px）が使われます。

### CSS変数を使ったレスポンシブ（推奨）

このテンプレートでは、各コンポーネントで `mq()` を散らすのではなく、`_variables.scss` で **CSS変数自体をレスポンシブにする** アプローチを採っています。

```scss
// _variables.scss
:root {
  --container-padding: 1rem;
  --section-padding-y: 3rem;
}

@include mq(md) {
  :root {
    --container-padding: 2rem;
    --section-padding-y: 6rem;
  }
}
```

これにより、`var(--section-padding-y)` を参照しているすべての箇所（hero / section）が自動的にレスポンシブになります。コンポーネント側の SCSS は `mq()` を意識する必要がありません。

---

## ブラウザサポート

| 機能 | 対応 |
|---|---|
| `@scope` | Chrome 118+ / Safari 17.4+ / Firefox 128+ |
| `:where()` | Chrome 88+ / Safari 14+ / Firefox 78+ |
| コンテナクエリ | Chrome 105+ / Safari 16+ / Firefox 110+ |

古いブラウザ対応が必要な場合は、別の書き方（`@scope` → ネスト or BEM、コンテナクエリ → メディアクエリ など）に置き換えてご利用ください。
