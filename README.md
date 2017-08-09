# 開発環境の構築

このプロジェクトは [node.js](https://nodejs.org/en/) で構築されています。

## グローバルにインストールが必要なモジュール
- [node.js](https://nodejs.org/en/)

## [npm](https://www.npmjs.com/) から必要なモジュールをインストール

```bash
$ npm install
```


# Gulp コマンド

## タスク

| コマンド                   |
|:---------------------------|
| npm run watch              |
| npm run build              |
| npm run build:production   |
| npu run imagemin           |
| npu run php-server         |

### npm run watch
pug、stylus、fusebox、sprite の関連ファイルを監視

### npm run build
pug、stylus、fusebox、sprite のコンパイル等をして関連ファイルを監視

### npm run production
本番・納品用のタスクを実行

- pug、stylus、fusebox を圧縮してコンパイル（map ファイルの出力なし）
- sprite を圧縮して出力
- imagemin タスクの実行
- clean タスクの実行

### npu run imagemin
画像を圧縮

### npu run php-server
PHP のビルトインサーバを起動


## オプション

| コマンド                        |
|:--------------------------------|
| --coding                        |
| --scripting                     |
| --watch-output-only             |
| --watch-pug-output-only         |
| --watch-pug-factory-output-only |
| --watch-stylus-output-only      |
| --watch-fusebox-output-only     |
| --php                           |

タスクコマンドの後に追加して使用します。

```bash
# 例
$ npm run build -- --php
```

### --coding
fusebox タスクを実行しない

### --scripting
pug、stylus、sprite タスクを実行しない

### --watch-output-only
出力ファイルのみ監視

### --watch-pug-output-only
pug を出力ファイルのみ監視

### --watch-pug-factory-output-only
pug-factory を出力ファイルのみ監視

### --watch-stylus-output-only
stylus を出力ファイルのみ監視

### --watch-fusebox-output-only
fusebox を出力ファイルのみ監視

### --php
browser-sync のサーバに PHP ビルトインサーバを使用
※別途 `npu run php-server` コマンドで PHP ビルトインサーバ立ち上げが必要



# local server
ローカルサーバーは [BrowserSync](https://www.browsersync.io/) を使用
※PHP 使用時は PHP ビルトインサーバと連携

### ポート
- 3000 -> /htdocs/ をルートとして起動
- 3001 -> BrowserSync のコントロールパネルを起動
- 3002 -> /.url-list/ をルートとして起動（URL一覧表示用）



# HTML
[pug](https://github.com/pugjs/pug) をコンパイル

/pug/src/ 以下の pug ファイルをコンパイルし /htdocs/ 以下に出力

## 用意されている変数

| 変数名       | 内容                       |
|:-------------|:---------------------------|
| dirname      | ディレクトリ名             |
| filename     | ファイル名                 |
| relative     | 相対パス                   |
| isProduction | productionタスク時のフラグ |

## 用意されている [filters](http://jade-lang.com/reference/filters/)

| filters名  | 内容                                                 |
|:-----------|:-----------------------------------------------------|
| do-nothing | そのまま出力（先頭は改行、インデントオプションあり） |

### do-nothing のインデントオプション
1行目に `{{indent=[数値]}}` を追加することで数値の数だけスペースを追加します。

```jade
// 例
:do-nothing
  {{indent=2}}
  <div>
    <p>sample</p>
  </div>
```

## Factory
テンプレートファイル（pug）と json から html 自動生成

### テンプレートファイル
/json/factorys/ 以下の pug ファイル  
`{{vars}}` に json から取得したデータが変数として挿入される

### データファイル
/json/factorys/ 以下の json ファイル

```javascript
{ "factorys/index.pug": {  // 使用するテンプレートを指定

  "factory/index.pug": {  // 出力先のパスを指定（拡張は.pug）
    "factoryTitle": "タイトル1",  // key が変数名、value が 値として出力される
    "factoryContents": "コンテンツ1"
  },
  "factory/hoge/index.pug": {
    "factoryTitle": "タイトル2",
    "factoryContents": "コンテンツ2<br>コンテンツ2"
  }

}}
```



# CSS
[Stylus](http://stylus-lang.com/) をコンパイル

/stylus/src/ 以下の stylus ファイルをコンパイルし /htdocs/ 以下に出力



# Image

## Sprite
/images/sprite/ 以下の画像をスプライト化して /htdocs/ 以下に出力  
最終ディレクトリ名がファイル名になる

> 例  
/images/sprite/images/sample/a.png  
/images/sprite/images/sample/b.png  
↓  
/htdocs/images/sample.png

Stylus で使用する為に /stylus/imports/sprite.styl が出力  
[mixins](http://stylus-lang.com/docs/mixins.html) を import して使用

```stylus
// 例

@import "../../imports/sprite"

#a
  sprite("images/sample/a.png")  // スプライト化する前のフィアルパスを指定
#b
  sprite("images/sample/b.png")
```


## image minimizing
/images/minify/ 以下の画像を圧縮して /htdocs/ 以下に出力  



# JavaScript
[Babel](https://babeljs.io/)（[es2015](https://babeljs.io/docs/plugins/preset-es2015/)、[stage-0](https://babeljs.io/docs/plugins/preset-stage-0/)）をトランスパイルし、[FuseBox](http://fuse-box.org/) でバンドル

/fusebox/src/ 以下の js ファイルをトランスパイルし /htdocs/ 以下に出力


## FuseBox
パッケージマネージャーは [npm](https://www.npmjs.com/) を使用



# URL list
3002ポートにURL一覧を表示

/.url-list/index.tmp がテンプレートファイル  
/.url-list/index.html にファイル一覧のデータを追加して出力

テストサーバー等へリンクさせる場合は以下を更新

```js:/.url-list/index.tmp
const root = 'http://domain.com/';
```



# Clean
不要ファイル削除
変更する場合は以下を更新

```js:/task-config.js
deletes: [
  'htdocs/**/.DS_Store', 'htdocs/**/Thumb.db', 'htdocs/**/*.map',
],
```
