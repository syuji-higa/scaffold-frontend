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

| タスク                      | コマンド             |
|:----------------------------|:---------------------|
| development                 | npm run build        |
| production                  | npm run production   |

### gulp
pug、Stylus、JavaScript、sprite のコンパイル等をして、関連ファイルを監視します。

### gulp watch
pug、Stylus、JavaScript、sprite の関連ファイルを監視します。

### gulp coding
pug、Stylus、sprite のコンパイル等をして、関連ファイルを監視します。

### gulp coding-watch
pug、Stylus、sprite の関連ファイルを監視します。

### gulp scripting
JavaScript のコンパイル等をして、関連ファイルを監視します。

### gulp scripting-watch
JavaScript の関連ファイルを監視します。

### gulp production
本番・納品用のタスクを実行します。

現状は以下を設定しています。

- pug、Stylus、JavaScript、sprite のコンパイル等（map ファイルの出力はしない）
- imagemin タスクの実行
- clean タスクの実行

必要なタスクを案件ごとに設定してください。
以下は例です。

- HTML、CSS、JavaScript の圧縮
- 文字コードを shift-jis に変更


### gulp imagemin
画像を圧縮します。

### gulp url-list
URL一覧を表示するHTMLファイルを生成します。

### gulp clean
不要なファイルを削除します。  
通常は gulp production で合わせて実行されますが、  
ファイルの削除だけする場合に使用。  
※ CSS、JavaScript 内にはソースマップへの参照が残ります。



## オプション

| オプション | コマンド |
|:-----------|:---------|
| php server | --php    |

タスクコマンドの後に追加して使用します。

```bash
# 例
$ gulp coding --php
```

### --php
ローカルサーバーをPHPで起動します。



# local server
ローカルサーバーは [BrowserSync](https://www.browsersync.io/) を使用しています。

### ポート
- 3000 -> /htdocs/ をルートとして起動
- 3001 -> BrowserSync のコントロールパネルを起動
- 3002 -> PHP 起動時のプロキシで使用
- 3003 -> /.url-list/ をルートとして起動（URL一覧表示用）
- 3004 -> /.esdoc/ をルートとして起動（ESDoc覧表示用）



# HTML
[pug](https://github.com/pugjs/pug) をコンパイルしています。

/pug/src/ 以下の pug ファイルをコンパイルし /htdocs/ 以下に出力します。

## コメントアウトで用意しているプラグイン

| 関数名         | 使用している内容 |
|:---------------|:-----------------|
| rename         | 拡張子変換       |
| crLfReplace    | 改行コード変換   |
| iconv          | 文字コード変換   |

## 用意されている変数

| 変数名       | 内容                       |
|:-------------|:---------------------------|
| dirname      | ディレクトリ名             |
| filename     | ファイル名                 |
| relative     | 相対パス                   |
| isProduction | productionタスク時のフラグ |

## 用意されている [filters](http://jade-lang.com/reference/filters/)

| filters名  | 内容                                                    |
|:-----------|:--------------------------------------------------------|
| do-nothing | そのまま出力（先頭は改行。インデントオプションあり。 ） |

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
テンプレートファイル（pug）と json から html 自動生成します。  
一部だけ違うページを大量生成する際におすすめ。

### テンプレートファイル
/json/factorys/ 以下の pug ファイル。  
`{{vars}}` に json から取得したデータが変数として挿入されます。

### データファイル
/json/factorys/ 以下の json ファイル。

```javascript
{ "factorys/index.pug": {  // 使用するテンプレートを指定

  "factory/index.pug": {  // 出力先のパスを指定（拡張は.pug）
    "factoryTitle": "タイトル1",  // key が変数名、value が 値として出力される。
    "factoryContents": "コンテンツ1"
  },
  "factory/hoge/index.pug": {
    "factoryTitle": "タイトル2",
    "factoryContents": "コンテンツ2<br>コンテンツ2"
  }

}}
// json ですので、カンマの位置に気をつける。
```



# CSS
[Stylus](http://stylus-lang.com/) をコンパイルしています。

/stylus/src/ 以下の stylus ファイルをコンパイルし /htdocs/ 以下に出力します。



# Image

## Sprite
/images/sprites/ 以下の画像をスプライト化して /htdocs/ 以下に出力します。  
最終ディレクトリ名がファイル名になります。

> 例  
/images/sprites/images/sample/a.png  
/images/sprites/images/sample/b.png  
↓  
/htdocs/images/sample.png

Stylus で使用する為に /stylus/imports/sprite.styl が出力されます。  
[mixins](http://stylus-lang.com/docs/mixins.html) が用意されているので import して使用します。

```stylus
// 例

@import "../../imports/sprite"

#a
  sprite("images/sample/a.png")  // スプライト化する前のフィアルパスを指定
#b
  sprite("images/sample/b.png")
```

`gulp production` 実行時には /images/src/ 以下に出力されて、image minimizing タスクが実行されます。


## image minimizing
/images/src/ 以下の画像を圧縮して /htdocs/ 以下に出力します。  
`gulp production` 実行時に一度だけ実行されます。  
`gulp imagemin` でも個別に実行できます。



# JavaScript
[Babel](https://babeljs.io/)（[es2015](https://babeljs.io/docs/plugins/preset-es2015/)、[stage-0](https://babeljs.io/docs/plugins/preset-stage-0/)）をトランスパイルして、[webpack](https://webpack.github.io/) でバンドルします。

/webpac/src/ 以下の js または ts ファイルをコンパイル（トランスパイル）し /htdocs/ 以下に出力します。


## webpack
パッケージマネージャーには [npm](https://www.npmjs.com/)、[Bower](http://bower.io/) が使えます。

minファイルなど package.json で指定されている main 以外のファイルを使用したい場合は、  
オプションの alias に指定すると便利。

```js:gulpfile.babel.js
// 例
alias: {
  'lodash'     : 'lodash/dist/lodash.min',
  'Velocity'   : 'velocity/velocity.min',
  'Velocity.ui': 'velocity/velocity.ui.min',
},
```

## ESDoc
/.esdoc/ 以下に [ESDoc](https://esdoc.org/) でAPIドキュメントを出力します。

出力コマンド
```
npm run esdoc
```

## ユニットテスト
/test/ 以下に [Jasmine](http://jasmine.github.io/) & [Karma](https://karma-runner.github.io/) でテストできる環境を用意しています。

テストコマンド
```
npm run test
```


# URL list
3003ポートにURL一覧を表示します。

/.url-list/tmp.html がテンプレートファイルになっていて  
/.url-list/index.html にファイル一覧のデータを追加して出力されます。

## テストサーバーへのリンク
テストサーバーへリンクさせたい場合は2パターンあります。

### ローカル（サーバーなし）で表示
以下のドメインを変更して url-list タスクを実行し /.url-list/index.html を更新して、ブラウザで直接表示。

```js:/.url-list/tmp.html
var domain = 'domain.com';
```

### テストサーバーにアップして表示
以下を変更すると /.url-list/index.html と同じファイルが  
/htdocs/url-list.html として出力されます。  
（変更後に url-list タスクの実行が必要）  
このファイルをテストサーバーにアップして表示。

```js:gulpfile.babel.js
const outputUrlListToHtdocs = false;
```
↓

```js:gulpfile.babel.js
const outputUrlListToHtdocs = true;
```
※ 不要ファイルですので納品ファイルに含めないように注意。  
　直接消すか、納品時に gulp production か gulp clean するなどで対応。


# Clean
不要ファイル削除をします。

現状は以下のファイルを削除するようにしています。

- .DS_Store
- Thumb.db
- /htdocs/url-list.html
- /htdocs/ 以下の map ファイル

変更する場合は以下を変更します。

```js:gulpfile.babel.js
del([ './**/.DS_Store', './**/Thumb.db', './htdocs/url-list.html', './htdocs/**/*.map' ]);
```
