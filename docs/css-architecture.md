# CSS設計ガイド

このテンプレートのCSS設計について説明します。

---

## 採用技術

| 技術 | 用途 |
|---|---|
| `@scope` | レイアウトコンポーネントのスタイルを隔離。BEM `__element` 命名が不要になる |
| `:where()` | リセットCSSの詳細度をゼロにし、上書きしやすくする |
| CSS Custom Properties | デザイントークンとコンポーネントのCSS変数APIに使用 |

FLOCSS / BEM の命名規則（`l-` / `c-` プレフィックス、`__element`）は使用しません。

---

## ファイル構成

```
src/scss/
├── style.scss               ← 3行のみ（各ディレクトリの _index.scss を @use）
│
├── base/
│   ├── _index.scss          ← base のエントリ（順序管理）
│   ├── _variables.scss      ← CSS Custom Properties（:root）
│   ├── _reset.scss          ← :where() ベースのリセット
│   └── _base.scss           ← body など素のスタイル
│
├── layout/
│   ├── _index.scss          ← layout のエントリ（順序管理）
│   ├── _container.scss      ← .container（最大幅ラッパー）
│   ├── _header.scss         ← @scope (.header) { ... }
│   ├── _hero.scss           ← @scope (.hero) { ... }
│   ├── _section.scss        ← @scope (.section) { ... }
│   └── _footer.scss         ← @scope (.footer) { ... }
│
└── components/
    ├── _index.scss          ← components のエントリ
    ├── _button.scss         ← .button / .button-outline
    └── _section-title.scss  ← .section-title
```

`style.scss` はディレクトリ単位で読み込むだけ:

```scss
@use "base";
@use "layout";
@use "components";
```

ファイルを追加するときは各ディレクトリの `_index.scss` に1行追記するだけでよい。

**`layout/_index.scss` の順序に注意**: `container` は `header` より前に記述すること。`@scope (.header)` 内の `.container` 追加スタイルが後勝ちになるよう保証するため。

---

## @scope の使い方

### なぜ @scope を使うか

同名クラス（`.nav-link` など）をヘッダーとフッターの両方で使っても干渉しない。

```scss
// _header.scss
@scope (.header) {
  .nav-link { color: var(--color-text); }       // ヘッダー内だけ適用
}

// _footer.scss
@scope (.footer) {
  .nav-link { opacity: 0.85; }                  // フッター内だけ適用
}
```

### 基本構文

```scss
@scope (.コンポーネント名) {
  :scope {
    // スコープ根ノード自身（例: .header 要素）のスタイル
  }

  .子クラス {
    // スコープ内の子要素のスタイル
  }
}
```

`:scope` の詳細度は `(0,0,0)`（ゼロ）。外部から `.header { }` と直接書けば上書きできる。

### .container のスコープ内追加

グローバルの `.container` とスコープ内の `.container` は**両方**同じ要素に適用される。
グローバルが `width / margin-inline / padding-inline` を担い、スコープ内で `display: flex` などを追加する形。

```scss
// _container.scss（グローバル）
.container {
  width: min(var(--container-max-width), 100%);
  margin-inline: auto;
  padding-inline: var(--container-padding);
}

// _header.scss（スコープ内で追加）
@scope (.header) {
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
```

---

## CSS Custom Properties（デザイントークン）

`base/_variables.scss` に定義。すべての値はここから参照する。

```scss
:root {
  // Colors
  --color-primary: #007bff;
  --color-text: #333;
  --color-text-muted: #555;
  --color-bg: #f8f9fa;
  --color-white: #fff;
  --color-border: #e2e8f0;
  --color-footer-bg: #1a202c;

  // Typography
  --font-family-base: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", ...;

  // Layout（min() で使うため px 単位必須）
  --container-max-width: 1200px;
  --container-padding: 2rem;

  // Effects
  --transition-base: 0.3s ease;
  --radius-pill: calc(infinity * 1px);
}
```

---

## ボタン（CSS変数API）

`.button` と `.button-outline` は外部から CSS変数で色・サイズをカスタマイズできる。

### 変数一覧

| 変数 | デフォルト値 | 役割 |
|---|---|---|
| `--btn-bg` | `var(--color-primary)` | 背景色・ボーダー色 |
| `--btn-color` | `var(--color-white)` | テキスト色（`.button` のみ） |
| `--btn-font-size` | `1rem` | フォントサイズ・サイズ感 |

### コンテキストからの上書き

```scss
// ヘッダー内のボタンを小さくする
@scope (.header) {
  .button {
    --btn-font-size: 0.875rem;
    padding-block: 0.5rem;
    padding-inline: 1.25rem;
  }
}

// ダークな背景のセクションで白ボタンにする（例）
@scope (.hero-dark) {
  .button {
    --btn-bg: var(--color-white);
    --btn-color: var(--color-primary);
  }
}
```

### HTML での使い方

```html
<!-- primary（塗りつぶし） -->
<a class="button" href="#">詳しく見る</a>

<!-- outline（枠線のみ） -->
<a class="button-outline" href="#">お問い合わせ</a>
```

---

## :where() リセット

`base/_reset.scss` のすべてのセレクタは `:where()` で詳細度ゼロにしてある。
どのスタイルからでも1クラスで上書きできる。

```scss
:where(*, *::before, *::after) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:where(h1, h2, h3, h4, h5, h6) {
  font-size: inherit;
  font-weight: inherit;
}
```

---

## ブラウザサポート

| 機能 | 対応ブラウザ |
|---|---|
| `@scope` | Chrome 118+ / Safari 17.4+ / Firefox 128+ |
| `:where()` | Chrome 88+ / Safari 14+ / Firefox 78+ |

IE11・旧 Edge は対象外。
