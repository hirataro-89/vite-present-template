# CSS設計について（補足資料）

> **このドキュメントは「このテンプレートではこう設計した」という記録です。**
> CSSの設計に正解はありません。ここに書いた設計に縛られず、お好みのアーキテクチャに書き換えて使ってください。

---

## 採用している技術

| 技術                       | 役割                                     | 詳細リンク                                                                                                                                                           |
| -------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@scope`                   | レイアウトコンポーネントのスタイルを隔離 | [MDN: @scope](https://developer.mozilla.org/ja/docs/Web/CSS/@scope)                                                                                                  |
| `:where()`                 | リセットCSSの詳細度をゼロにする          | [MDN: :where()](https://developer.mozilla.org/ja/docs/Web/CSS/:where)                                                                                                |
| CSS Custom Properties      | デザイントークン + コンポーネントAPI     | [MDN: カスタムプロパティ](https://developer.mozilla.org/ja/docs/Web/CSS/Using_CSS_custom_properties)                                                                 |
| `clamp()` + コンテナクエリ | FVのフォントサイズを画面幅に応じて変化   | [MDN: clamp()](https://developer.mozilla.org/ja/docs/Web/CSS/clamp) ／ [MDN: container queries](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_container_queries) |

各機能の使い方や挙動の詳細はMDNがいちばん分かりやすいので、深く知りたい方はリンク先を参照してください。

---

## ファイル構成

```
src/assets/scss/
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
@use 'base';
@use 'layout';
@use 'components';
```

ファイルを追加するときは各ディレクトリの `_index.scss` に1行追記するだけです。

> **`layout/_index.scss` の順序**: `_header.scss` 内では `@scope (.header) { .container { ... } }` で `.container` のスタイルを上書きしています。CSS は後に読み込まれた宣言が勝つため、ベースの `_container.scss` を先に、上書き側の `_header.scss` を後に読み込む順序にしてください。

---

## デザイントークン

`base/_variables.scss` に定義しています。色・フォント・レイアウト・エフェクトのトークンをフラットに定義しています（階層を増やすと「どれが本物の定義か」が辿りづらくなるため、用途で命名した変数に直接値を割り当てるシンプルな構造です）。

```scss
:root {
  // ─────────────────────────────────────────────
  // Color Tokens
  // ─────────────────────────────────────────────
  --color-primary: #1a8fa8;
  --color-bg: #fcfbf8;
  --color-bg-alt: #f4f1ea;
  --color-text: #1f2933;
  --color-text-muted: #5b6770;
  --color-border: #e8e4da;
  --color-white: #ffffff;
  --color-black: #1f2933;

  // ─────────────────────────────────────────────
  // Typography
  // ─────────────────────────────────────────────
  --font-family-base:
    'Noto Sans JP', 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN',
    'Hiragino Sans', Meiryo, sans-serif;

  // ─────────────────────────────────────────────
  // Layout（SPファーストの初期値）
  // ─────────────────────────────────────────────
  --container-max-width: 1200px;
  --container-padding: 1rem;
  --section-padding-y: 3rem;

  // ─────────────────────────────────────────────
  // Effects
  // ─────────────────────────────────────────────
  --transition-base: 0.3s ease;
  --radius-pill: calc(infinity * 1px);
  --radius-card: 12px;
  --shadow-card:
    0 1px 2px oklch(from var(--color-black) l c h / 0.04),
    0 4px 12px oklch(from var(--color-black) l c h / 0.04);
}
```

色を変えたい場合は、`--color-primary` を書き換えるだけでサイト全体のテーマカラーが切り替わります。

### shadow を oklch で派生させる

`--shadow-card` は `--color-black` から `oklch(from ...)` を使って透明度を派生しています。`rgba()` で色を直書きするより、`oklch(from var(--color-black) ...)` で元色から派生させたほうが、`--color-black` を変えるだけで shadow の色味も自動で追従します。

---

## ボタンのCSS変数API

`.button` と `.button-outline` は外部からCSS変数で見た目を上書きできます。

| 変数              | デフォルト                          | 役割                   |
| ----------------- | ----------------------------------- | ---------------------- |
| `--btn-bg`        | `var(--color-primary)`              | 背景色・ボーダー色     |
| `--btn-color`     | `var(--color-white)`                | `.button` のテキスト色 |
| `--btn-font-size` | `1rem`（`var()` のフォールバック）  | サイズ感               |

`--btn-bg` / `--btn-color` は `.button, .button-outline` で実定義されたデフォルト値、`--btn-font-size` は `font-size: var(--btn-font-size, 1rem)` のフォールバック値として `1rem` が使われています（変数自体は未定義）。

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
  md: 768px,
  lg: 1024px,
  xl: 1440px,
);
```

### 使い方

mixin を使いたい SCSS ファイルの先頭で `@use` してから呼び出します。

```scss
@use '../base/breakpoints' as *;

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

---

## ブラウザサポート

| 機能           | 対応                                      |
| -------------- | ----------------------------------------- |
| `@scope`       | Chrome 118+ / Safari 17.4+ / Firefox 128+ |
| `:where()`     | Chrome 88+ / Safari 14+ / Firefox 78+     |
| コンテナクエリ | Chrome 105+ / Safari 16+ / Firefox 110+   |
| `oklch()`      | Chrome 111+ / Safari 16.4+ / Firefox 113+ |

古いブラウザ対応が必要な場合は、別の書き方（`@scope` → ネスト or BEM、コンテナクエリ → メディアクエリ、`oklch()` → `rgba()` など）に置き換えてご利用ください。
