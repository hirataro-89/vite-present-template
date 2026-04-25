# Modern CSS (@scope / :where) 移行 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** FLOCSS/BEM命名を廃止し、`@scope` と `:where()` を使ったシンプルなクラス名のVite LPテンプレートに移行する。

**Architecture:** `foundation/` を `base/` に再構成し、各レイアウトファイルに `@scope` を導入する。`style.scss` のグロブインポートを廃止して明示的な `@use` リストに変換し、`vite-plugin-sass-glob-import` 依存も除去する。

**Tech Stack:** Vite 7.3.2 / Dart Sass 1.99.0 / CSS @scope (Baseline 2025) / CSS :where()

---

## ファイルマップ

| 操作 | ファイル |
|------|---------|
| 作成 | `src/scss/base/_variables.scss` |
| 作成 | `src/scss/base/_reset.scss` |
| 作成 | `src/scss/base/_base.scss` |
| リネーム→更新 | `src/scss/layout/_inner.scss` → `_container.scss` |
| リネーム→更新 | `src/scss/layout/_mv.scss` → `_hero.scss` |
| 更新 | `src/scss/layout/_header.scss` |
| 更新 | `src/scss/layout/_footer.scss` |
| 更新 | `src/scss/layout/_section.scss` |
| 更新 | `src/scss/components/_button.scss` |
| 更新 | `src/scss/components/_section-title.scss` |
| 更新 | `src/scss/style.scss` |
| 削除 | `src/scss/foundation/` (ディレクトリごと) |
| 更新 | `src/index.html` |
| 更新 | `package.json` |
| 更新 | `vite.config.js` |

---

## Task 1: base/ ディレクトリのセットアップ

CSS変数・リセット・ベーススタイルを `foundation/` から `base/` に移行し、リセットを `:where()` ベースに書き換える。

**Files:**
- Create: `src/scss/base/_variables.scss`
- Create: `src/scss/base/_reset.scss`
- Create: `src/scss/base/_base.scss`

- [ ] **Step 1: `base/` ディレクトリを作成する**

```bash
mkdir -p src/scss/base
```

- [ ] **Step 2: `_variables.scss` を作成する**

`src/scss/base/_variables.scss` を以下の内容で作成（既存の `foundation/_variables.scss` と同内容）:

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
  --font-family-base: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN",
    "Hiragino Sans", Meiryo, sans-serif;

  // Layout
  // min() で 100% と比較するため px 単位必須
  --container-max-width: 1200px;
  --container-padding: 2rem;

  // Effects
  --transition-base: 0.3s ease;
  --radius-pill: calc(infinity * 1px);
}
```

- [ ] **Step 3: `_reset.scss` を作成する**

`src/scss/base/_reset.scss` を以下の内容で作成（全セレクタを `:where()` 化）:

```scss
:where(html) {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

:where(*, *::before, *::after) {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:where(h1, h2, h3, h4, h5, h6) {
  font-size: inherit;
  font-weight: inherit;
}

:where(ul, ol) {
  list-style: none;
}

:where(a) {
  color: inherit;
  text-decoration: none;
  background-color: transparent;
}

:where(button) {
  background: none;
  border: 0;
  font: inherit;
  cursor: pointer;
  padding: 0;
  appearance: none;
}

:where(img, picture, video) {
  display: block;
  max-width: 100%;
  height: auto;
}
```

- [ ] **Step 4: `_base.scss` を作成する**

`src/scss/base/_base.scss` を以下の内容で作成（img スタイルは `_reset.scss` に集約済みのため削除）:

```scss
body {
  font-family: var(--font-family-base);
  color: var(--color-text);
  background-color: var(--color-white);
  line-height: 1.6;
}
```

- [ ] **Step 5: コミットする**

```bash
git add src/scss/base/
git commit -m "feat(scss): base/ディレクトリを作成し:where()ベースのリセットを導入"
```

---

## Task 2: layout/ の更新（container・header）

`_inner.scss` を `_container.scss` にリネームし、`_header.scss` を `@scope` 対応にする。

**Files:**
- Rename→Modify: `src/scss/layout/_inner.scss` → `src/scss/layout/_container.scss`
- Modify: `src/scss/layout/_header.scss`

- [ ] **Step 1: `_inner.scss` を削除して `_container.scss` として作成する**

`src/scss/layout/_container.scss` を以下の内容で作成:

```scss
.container {
  width: min(var(--container-max-width), 100%);
  margin-inline: auto;
  padding-inline: var(--container-padding);
}
```

- [ ] **Step 2: `_header.scss` を `@scope` 対応に書き換える**

`src/scss/layout/_header.scss` を以下の内容に置き換える:

```scss
@scope (.header) {
  :scope {
    background-color: var(--color-white);
    border-block-end: 1px solid var(--color-border);
  }

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-block: 1.75rem;
  }

  .logo-link {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-primary);
    transition: opacity var(--transition-base);

    @media (any-hover: hover) {
      &:hover {
        opacity: 0.75;
      }
    }
  }

  .nav-list {
    display: flex;
    gap: 2rem;
    align-items: center;
  }

  .nav-link {
    font-weight: bold;
    transition: color var(--transition-base);

    @media (any-hover: hover) {
      &:hover {
        color: var(--color-primary);
      }
    }
  }
}
```

- [ ] **Step 3: コミットする**

```bash
git add src/scss/layout/_container.scss src/scss/layout/_header.scss
git rm src/scss/layout/_inner.scss
git commit -m "feat(scss): _container.scss作成・_header.scssを@scope対応に更新"
```

---

## Task 3: layout/ の更新（footer・hero・section）

`_mv.scss` を `_hero.scss` にリネームし、`_footer.scss` と `_section.scss` を `@scope` 対応にする。

**Files:**
- Rename→Modify: `src/scss/layout/_mv.scss` → `src/scss/layout/_hero.scss`
- Modify: `src/scss/layout/_footer.scss`
- Modify: `src/scss/layout/_section.scss`

- [ ] **Step 1: `_hero.scss` を作成する**（旧 `_mv.scss` の内容をクラス名更新して新規作成）

`src/scss/layout/_hero.scss` を以下の内容で作成:

```scss
@scope (.hero) {
  :scope {
    background-color: var(--color-bg);
    padding-block: 6rem;
    text-align: center;
  }

  .main-title {
    font-size: 2.5rem;
    font-weight: bold;
    line-height: 1.3;
    color: var(--color-text);
    margin-block-end: 1.5rem;
  }

  .sub-title {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--color-text-muted);
    max-width: 800px;
    margin-inline: auto;
  }
}
```

- [ ] **Step 2: `_footer.scss` を `@scope` 対応に書き換える**

`src/scss/layout/_footer.scss` を以下の内容に置き換える:

```scss
@scope (.footer) {
  :scope {
    background-color: var(--color-footer-bg);
    color: var(--color-white);
    margin-block-start: 4rem;
    padding-block: 3rem 2rem;
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-block-end: 2rem;
  }

  .logo-link {
    font-size: 1.25rem;
    font-weight: bold;
  }

  .nav-list {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .nav-link {
    font-size: 0.875rem;
    opacity: 0.85;
    transition: opacity var(--transition-base);

    @media (any-hover: hover) {
      &:hover {
        opacity: 1;
      }
    }
  }

  .copy {
    font-size: 0.875rem;
    text-align: center;
    opacity: 0.7;
    padding-block-start: 2rem;
    border-block-start: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

- [ ] **Step 3: `_section.scss` を `@scope` 対応に書き換える**

`src/scss/layout/_section.scss` を以下の内容に置き換える:

```scss
@scope (.section) {
  :scope {
    padding-block: 5rem;
    text-align: center;
  }

  .text {
    max-width: 700px;
    margin-inline: auto;
    margin-block-end: 2.5rem;
  }

  .buttons {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
}
```

- [ ] **Step 4: コミットする**

```bash
git add src/scss/layout/_hero.scss src/scss/layout/_footer.scss src/scss/layout/_section.scss
git rm src/scss/layout/_mv.scss
git commit -m "feat(scss): _hero.scss作成・_footer.scss・_section.scssを@scope対応に更新"
```

---

## Task 4: components/ の更新

`_button.scss` と `_section-title.scss` のクラス名を更新する（`@scope` 不要、クラス名リネームのみ）。

**Files:**
- Modify: `src/scss/components/_button.scss`
- Modify: `src/scss/components/_section-title.scss`

- [ ] **Step 1: `_button.scss` のクラス名を更新する**

`src/scss/components/_button.scss` を以下の内容に置き換える（`.c-button` → `.button`）:

```scss
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-block: 0.875rem;
  padding-inline: 2.5rem;
  border-radius: var(--radius-pill);
  border: 2px solid transparent;
  font-weight: bold;
  font-size: 1rem;
  line-height: 1;
  text-align: center;
  transition: all var(--transition-base);
}

.button[data-variant="primary"] {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.button[data-variant="outline"] {
  background-color: transparent;
  color: var(--color-primary);
  border-color: var(--color-primary);
}

@media (any-hover: hover) {
  .button[data-variant="primary"]:hover {
    background-color: transparent;
    color: var(--color-primary);
  }

  .button[data-variant="outline"]:hover {
    background-color: var(--color-primary);
    color: var(--color-white);
  }
}

.button[data-size="sm"] {
  padding-block: 0.5rem;
  padding-inline: 1.25rem;
  font-size: 0.875rem;
}
```

- [ ] **Step 2: `_section-title.scss` のクラス名を更新する**

`src/scss/components/_section-title.scss` を以下の内容に置き換える（`.c-section-title` → `.section-title`）:

```scss
.section-title {
  position: relative;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  color: var(--color-text);
  margin-block-end: 2.5rem;
  padding-block-end: 1rem;
  text-transform: capitalize;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 40px;
  height: 3px;
  background-color: var(--color-primary);
  transform: translateX(-50%);
}
```

- [ ] **Step 3: コミットする**

```bash
git add src/scss/components/_button.scss src/scss/components/_section-title.scss
git commit -m "feat(scss): componentsのクラス名をBEMプレフィックスなしに更新"
```

---

## Task 5: style.scss の更新とビルド確認

グロブインポートを廃止し、明示的な `@use` リストに書き換える。この時点でビルドが通ることを確認してから `foundation/` を削除する。

**Files:**
- Modify: `src/scss/style.scss`

- [ ] **Step 1: `style.scss` を書き換える**

`src/scss/style.scss` を以下の内容に置き換える:

```scss
@use "base/variables";
@use "base/reset";
@use "base/base";
@use "layout/container";
@use "layout/header";
@use "layout/footer";
@use "layout/hero";
@use "layout/section";
@use "components/button";
@use "components/section-title";
```

- [ ] **Step 2: ビルドが通ることを確認する**

```bash
yarn build
```

Expected: エラーなしでビルド完了。`dist/` に CSS が出力される。

エラーが出た場合: `@use` のパスを確認する。Sass の `@use` は `_` プレフィックスと拡張子を省略できる（例: `@use "base/variables"` → `src/scss/base/_variables.scss` を参照）。

- [ ] **Step 3: `foundation/` ディレクトリを削除する**

```bash
git rm -r src/scss/foundation/
```

- [ ] **Step 4: 再度ビルドが通ることを確認する**

```bash
yarn build
```

Expected: エラーなしでビルド完了。

- [ ] **Step 5: コミットする**

```bash
git add src/scss/style.scss
git commit -m "feat(scss): style.scssをグロブ廃止・明示的@useに変更しfoundation/を削除"
```

---

## Task 6: index.html のクラス名全面リネーム

FLOCSS/BEM クラス名をシンプルな英語クラス名に全面更新する。

**Files:**
- Modify: `src/index.html`

- [ ] **Step 1: `index.html` を以下の内容に置き換える**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Vite Static Site Template</title>
  <meta name="description" content="Viteを用いた静的サイト構築のためのミニマルテンプレートです。" />
</head>
<body>
  <header class="header">
    <div class="container">
      <h1 class="logo">
        <a class="logo-link" href="#">Logo</a>
      </h1>
      <nav>
        <ul class="nav-list">
          <li><a class="nav-link" href="#">私たちについて</a></li>
          <li><a class="nav-link" href="#">事業内容</a></li>
          <li><a class="nav-link" href="#">お知らせ</a></li>
          <li><a class="button" data-variant="primary" data-size="sm" href="#">お問い合わせ</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="container">
        <h2 class="main-title">メインタイトルだよ</h2>
        <p class="sub-title">
          ここにサブタイトルが入ります。<br />
          ここにサブタイトルが入ります。ここにサブタイトルが入ります。
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section-title">sample</h2>
        <p class="text">
          ここに本文コンテンツが入ります。<br />
          このテンプレートを起点に、自由にセクションやコンポーネントを追加してください。
        </p>
        <div class="buttons">
          <a class="button" data-variant="primary" href="#">詳しく見る</a>
          <a class="button" data-variant="outline" href="#">お問い合わせ</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="content">
        <p class="logo">
          <a class="logo-link" href="#">Logo</a>
        </p>
        <nav>
          <ul class="nav-list">
            <li><a class="nav-link" href="#">ホーム</a></li>
            <li><a class="nav-link" href="#">私たちについて</a></li>
            <li><a class="nav-link" href="#">事業内容</a></li>
            <li><a class="nav-link" href="#">お問い合わせ</a></li>
          </ul>
        </nav>
      </div>
      <p class="copy">&copy; 2025 Vite Template. All rights reserved.</p>
    </div>
  </footer>

  <script type="module" src="/script.js"></script>
</body>
</html>
```

- [ ] **Step 2: dev サーバーを起動して表示を確認する**

```bash
yarn dev
```

ブラウザで以下を確認:
- ヘッダー: ロゴ・ナビゲーション・ボタンが正しく表示される
- ヒーロー: 背景色・タイトル・サブタイトルが表示される
- セクション: タイトル・テキスト・ボタン2つが表示される
- フッター: ロゴ・ナビ・コピーライトが表示される
- `@scope` によりヘッダーの `.nav-link` とフッターの `.nav-link` のスタイルが正しく分離されている（ヘッダーは太字・ホバーでプライマリカラー、フッターは opacity 制御）

- [ ] **Step 3: コミットする**

```bash
git add src/index.html
git commit -m "feat(html): クラス名をBEMプレフィックスなしのシンプルな英語名に全面更新"
```

---

## Task 7: vite-plugin-sass-glob-import の削除

`vite-plugin-sass-glob-import` への依存を `package.json` と `vite.config.js` から除去する。

**Files:**
- Modify: `package.json`
- Modify: `vite.config.js`

- [ ] **Step 1: `vite.config.js` を更新する**

`src/vite.config.js`（プロジェクトルートの `vite.config.js`）を以下の内容に置き換える:

```js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  server: {
    open: true
  },
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true
  }
});
```

- [ ] **Step 2: `package.json` から `vite-plugin-sass-glob-import` を削除する**

```bash
yarn remove vite-plugin-sass-glob-import
```

Expected: `package.json` の `devDependencies` から `vite-plugin-sass-glob-import` が削除され、`yarn.lock` が更新される。

- [ ] **Step 3: ビルドが通ることを最終確認する**

```bash
yarn build
```

Expected: エラーなしでビルド完了。

- [ ] **Step 4: コミットする**

```bash
git add vite.config.js package.json yarn.lock
git commit -m "chore: vite-plugin-sass-glob-importを削除しvite.config.jsを整理"
```
