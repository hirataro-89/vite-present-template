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
    └── _section-title.scss
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

`base/_variables.scss` に定義しています:

```scss
:root {
  // Colors
  --color-primary: #007bff;
  --color-text: #333;
  // ...

  // Layout
  --container-max-width: 1200px;
  --section-padding-y: 5rem;

  // Effects
  --transition-base: 0.3s ease;
}
```

色を変えたい場合は、ここの値を書き換えるだけで全体に反映されます。

---

## ボタンのCSS変数API

`.button` と `.button-outline` は外部からCSS変数で見た目を上書きできます。

| 変数 | デフォルト | 役割 |
|---|---|---|
| `--btn-bg` | `var(--color-primary)` | 背景色・ボーダー色 |
| `--btn-color` | `var(--color-white)` | テキスト色（`.button` のみ） |
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

## ブラウザサポート

| 機能 | 対応 |
|---|---|
| `@scope` | Chrome 118+ / Safari 17.4+ / Firefox 128+ |
| `:where()` | Chrome 88+ / Safari 14+ / Firefox 78+ |
| コンテナクエリ | Chrome 105+ / Safari 16+ / Firefox 110+ |

古いブラウザ対応が必要な場合は、別の書き方（`@scope` → ネスト or BEM、コンテナクエリ → メディアクエリ など）に置き換えてご利用ください。
