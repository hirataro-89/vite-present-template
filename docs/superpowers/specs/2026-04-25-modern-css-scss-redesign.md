# CSS設計リデザイン仕様書

**作成日**: 2026-04-25  
**対象PJ**: vite-present-template  
**ステータス**: 承認済

---

## 前提条件

- **Dart Sass 1.72 以降**を使用すること（`@scope` を at-rule として素通しするバージョン）
- 現プロジェクトの `sass` パッケージは `^1.99.0` のため条件を満たしている

---

## 背景・目的

Vite環境を無料プレゼントとして配布し、有料版（Vite + WordPress テンプレート）への導線とする。  
メイン訴求は「Vite環境の取っ掛かり」であり、モダンCSS技術（`@scope` / `:where()`）は副次的に盛り込む。  
FLOCSS / BEM の命名規則は廃止し、シンプルな英語クラス名に刷新する。

---

## 採用技術

| 技術 | 採用 | 理由 |
|---|---|---|
| `@scope` | ✅ さりげなく使う | スコープ根ノードでマッチング範囲を限定し、コンポーネント外の同名クラスへの干渉を防ぐ。これにより `__element` 型のBEM命名が不要になる |
| `:where()` | ✅ リセットに使う | 引数内のセレクタ詳細度をゼロにするため、上書きしやすいリセットになる |
| `@layer` | ❌ 使わない | このテンプレート規模では不要、複雑性が増す |
| コンテナクエリ | ❌ 使わない | 複雑になりすぎる、省く |
| CSS Custom Properties | ✅ 継続 | 既存のまま活用 |

---

## ファイル構成

### 変更前

```
src/scss/
├── style.scss
├── foundation/
│   ├── _index.scss
│   ├── _base.scss
│   ├── _reset.scss
│   └── _variables.scss
├── layout/
│   ├── _footer.scss
│   ├── _header.scss
│   ├── _inner.scss
│   ├── _mv.scss
│   └── _section.scss
└── components/
    ├── _button.scss
    └── _section-title.scss
```

### 変更後

```
src/scss/
├── style.scss               ← @use でまとめるだけ
├── base/
│   ├── _variables.scss       ← CSS Custom Properties（:root）
│   ├── _reset.scss           ← :where() ベースのリセット（全面書き換え）
│   └── _base.scss            ← body など素のスタイル（imgは_reset.scssに集約）
├── layout/
│   ├── _container.scss       ← .container（最大幅ラッパー）
│   ├── _header.scss          ← @scope (.header) { ... }
│   ├── _footer.scss          ← @scope (.footer) { ... }
│   ├── _hero.scss            ← @scope (.hero) { ... }（旧 _mv.scss）
│   └── _section.scss         ← @scope (.section) { ... }
└── components/
    ├── _button.scss          ← .button（単独コンポーネント、@scope不要）
    └── _section-title.scss   ← .section-title（単独コンポーネント、@scope不要）
```

---

## 命名規則

FLOCSS プレフィックス（`l-` / `c-`）および BEM `__element` を廃止。  
`@scope` でスコープ化するため、内部要素は単純な英語クラス名で十分。

| 変更前 | 変更後 |
|---|---|
| `.l-header` | `.header` |
| `.l-header__inner` | `.container`（`@scope (.header)` 内） |
| `.l-header__logo` | `.logo`（`@scope (.header)` 内） |
| `.l-header__logo-link` | `.logo-link`（`@scope (.header)` 内） |
| `.l-header__nav` | クラスなし（素の `nav` 要素）（`@scope (.header)` 内） |
| `.l-header__nav-list` | `.nav-list`（`@scope (.header)` 内） |
| `.l-header__nav-link` | `.nav-link`（`@scope (.header)` 内） |
| `.l-mv` | `.hero` |
| `.l-mv__main-title` | `.main-title`（`@scope (.hero)` 内） |
| `.l-mv__sub-title` | `.sub-title`（`@scope (.hero)` 内） |
| `.l-section` | `.section` |
| `.l-section__text` | `.text`（`@scope (.section)` 内） |
| `.l-section__buttons` | `.buttons`（`@scope (.section)` 内） |
| `.l-inner` | `.container` |
| `.l-footer` | `.footer` |
| `.l-footer__inner` | `.container`（`@scope (.footer)` 内） |
| `.l-footer__content` | `.content`（`@scope (.footer)` 内） |
| `.l-footer__logo` | `.logo`（`@scope (.footer)` 内） |
| `.l-footer__logo-link` | `.logo-link`（`@scope (.footer)` 内） |
| `.l-footer__nav` | クラスなし（素の `nav` 要素）（`@scope (.footer)` 内） |
| `.l-footer__nav-list` | `.nav-list`（`@scope (.footer)` 内） |
| `.l-footer__nav-link` | `.nav-link`（`@scope (.footer)` 内） |
| `.l-footer__copy` | `.copy`（`@scope (.footer)` 内） |
| `.c-button` | `.button` |
| `.c-section-title` | `.section-title`（グローバルコンポーネント、`@scope` 不要） |

---

## 各ファイルの実装方針

### `style.scss`

`foundation/_index.scss` は削除し、`@use` を個別に列挙する形に変更。  
グロブインポートは廃止し、明示的な `@use` リストに変更。  
**`@use` の順序は変更しないこと**（`layout/container` を `layout/header` より前に記述することで、`@scope` 内の `.container` 追記スタイルが後勝ちになることを保証する）。

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

### `base/_reset.scss`

`:where()` で詳細度を 0 にして上書きしやすいリセットにする。  
`img` 系のリセットはここに集約し、`_base.scss` には記載しない（重複防止）。

現行リセットからの主な変更点:
- 全セレクタを `:where()` に包んで詳細度ゼロに統一
- `main { display: block; }` は削除（IE11 対応不要）
- `body { margin: 0; }` は `*` の `margin: 0` でカバー済みのため削除
- `img { vertical-align: middle; }` → `display: block` に変更（縦方向の隙間をなくす意図）
- `-webkit-text-size-adjust: 100%` は維持（iOS Safari のテキストサイズ自動調整抑制）
- `h1-h6` のフォントリセットは維持（実害が出やすい）
- `button` の `appearance: none` は維持

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

### `base/_base.scss`

`img` のスタイルは `_reset.scss` に集約するため、このファイルからは削除する。

```scss
body {
  font-family: var(--font-family-base);
  color: var(--color-text);
  background-color: var(--color-white);
  line-height: 1.6;
}
```

### `layout/_header.scss`（@scope 実装例）

**各レイアウトファイル共通のルール**: `:scope { ... }` にスコープ根ノード自身のスタイルを記述する。

**`:scope` の詳細度について**: `@scope (.header) { :scope { ... } }` の `:scope` 詳細度は `(0,0,0)`（ゼロ）。外部から `.header { ... }` と直接書いた場合の `(0,1,0)` より低い。通常このケースは発生しないが、外部からスコープ根ノード自体のスタイルを上書きする場合は `:scope.header` または `.header` として書けば上書きできる。

`@scope (.header)` 内の `.container` とグローバルの `.container` は**両方このDOM要素に適用される**。  
`@scope` 内では追加・上書きしたいプロパティ（`display: flex` 等）のみ宣言し、グローバルの `width` / `margin-inline` / `padding-inline` は引き継ぐ。

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
      &:hover { opacity: 0.75; }
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
      &:hover { color: var(--color-primary); }
    }
  }
}
```

### `layout/_section.scss`

`.section-title` はグローバルコンポーネント（`_section-title.scss`）として定義するため、`@scope (.section)` 内でスコープ指定せずそのまま使う。  
`@scope (.section)` 内で `.section-title` のスタイルを上書きしたい場合は `@scope (.section) { .section-title { ... } }` と記述すれば対応可能（グローバルの `.section-title` には影響しない）。

### `layout/_container.scss`

`--container-max-width` は `px` 単位で定義すること（`min()` 内で `100%` と比較するため単位が必要）。  
現在の `_variables.scss` では `1200px` と正しく定義されている。

```scss
.container {
  width: min(var(--container-max-width), 100%);
  margin-inline: auto;
  padding-inline: var(--container-padding);
}
```

### `components/_button.scss`

`button` は単独で使う再利用コンポーネントのため `@scope` 不要。  
`data-variant` / `data-size` 属性でバリアント管理（既存の方針を継続）。

### `components/_section-title.scss`

`section-title` も単独で使う再利用コンポーネントのため `@scope` 不要。  
クラス名を `.c-section-title` → `.section-title` にリネームするのみ。

---

## HTMLの変更方針

クラス名のリネームに合わせて `src/index.html` を更新する。  
`l-header__inner l-inner` のような複合クラスは `@scope` 内の `.container` を活用する形に変更。

変更例（ヘッダー）:
```html
<!-- 変更前 -->
<header class="l-header">
  <div class="l-header__inner l-inner">
    <h1 class="l-header__logo">
      <a class="l-header__logo-link" href="#">Logo</a>
    </h1>
    <nav class="l-header__nav">
      <ul class="l-header__nav-list">
        <li><a class="l-header__nav-link" href="#">私たちについて</a></li>
      </ul>
    </nav>
  </div>
</header>

<!-- 変更後 -->
<header class="header">
  <div class="container">
    <h1 class="logo">
      <a class="logo-link" href="#">Logo</a>
    </h1>
    <nav>
      <ul class="nav-list">
        <li><a class="nav-link" href="#">私たちについて</a></li>
      </ul>
    </nav>
  </div>
</header>
```

---

## 対象外（実装しない）

- `@layer` によるカスケードレイヤー管理
- コンテナクエリ（`container-type: inline-size`）
- ライト/ダークテーマ切り替えデモ
- ユーティリティクラス群
- 古いブラウザへの `@scope` ポリフィル対応（対象: Chrome 118+ / Safari 17.4+ / Firefox 128+ のモダンブラウザのみ）

---

## 変更が必要なファイルと作業順序

**作業順序に注意**（逆順で行うとビルドエラーになる）:

1. `src/scss/base/` ディレクトリを作成
2. `src/scss/foundation/` の `_variables.scss` / `_reset.scss` / `_base.scss` を `base/` にコピー
3. `_reset.scss` を `:where()` ベースに全面書き換え（`img` スタイル集約、`main { display: block }` / `body { margin: 0 }` 削除）
4. `_base.scss` から `img` スタイルを削除
5. `src/scss/layout/_inner.scss` → `_container.scss` にリネーム・更新
6. `src/scss/layout/_mv.scss` → `_hero.scss` にリネーム・クラス名更新
7. `src/scss/layout/_header.scss` — `@scope` 対応、クラス名更新
8. `src/scss/layout/_footer.scss` — `@scope` 対応、クラス名更新
9. `src/scss/layout/_section.scss` — `@scope` 対応、クラス名更新
10. `src/scss/components/_button.scss` — クラス名更新（`c-button` → `button`）
11. `src/scss/components/_section-title.scss` — クラス名更新（`c-section-title` → `section-title`）
12. `src/scss/style.scss` — グロブ廃止、明示的 `@use` リストに書き換え
13. **ビルド確認**（`npm run dev` でエラーがないことを検証）
14. `src/scss/foundation/` ディレクトリを削除（`_index.scss` ごと）
15. `src/index.html` — クラス名全面リネーム
16. `package.json` — `vite-plugin-sass-glob-import` 削除
17. `vite.config.js` — `import sassGlobImports from 'vite-plugin-sass-glob-import'` の import 文と `plugins: [sassGlobImports()]` の登録を両方削除（`server` / `build` の設定はそのまま維持）
