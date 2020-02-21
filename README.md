gmail_client
===============

Gmailの読み込みやラベル付加を行うLambda

### 引数
* `key` でDynamoDBのレコードのプライマリキーを指定する。指定しなかった場合は環境変数のデフォルト値を利用する。
* `action` に以下のいずれかの値を指定する。指定しなかった場合はDynamoDB上のトークンを更新する。

|`action` の値  | 処理内容                                                   |
|--------------|------------------------------------------------------------|
| なし(undefined) | DynamoDB上に存在するレコードを全件検索し、トークンを更新する |
| `search`     | `condition` の条件でメールを検索し、メッセージIDを返す         |
| `searchEx`   | `condition` の条件でメールを検索し、メールの内容を返す。30件を超えた場合はエラーになる |
| `addLabels`  | `messageId` で与えたメールに `labelIds` で与えたラベルを追加する。 `labelIds` は文字列または文字列の配列 |
| `allLabels`  | そのアカウントに存在するラベルを返す                           |
| `message`    | `messageId` で与えたメールの内容を返す                       |
| `rawMessage` | `messageId` で与えたメールの内容を返す。テスト用              |

`condition` にはGmailの検索条件がそのまま使える。 `after:2020-02-21 label:UNREAD` など。

### インストール
#### DynamoDB
トークンはDynamoDBのレコードに保存するので、あらかじめOAuth認証を済ませて次のような形のレコードをDynamoDBに入れておく。

テーブル名は既存のものが使い回せるが、文字型のプライマリキーが1個だけある（このキーだけでレコードが特定できる）ことが条件。

```json
{
  "Key": "UNIQUE-KEY", // プライマリキー（キー名は Key でなくてもよい）
  "Account": "user@example.com", // 認証を行ったアカウント名。ログ等に出力される
  "Data": {
    "access_token": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "client_id": "999999999999-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com",
    "client_secret": "XXXXXXXXXXXXXXXXXXXXXXXX",
    "refresh_token": "1/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "scope": "...", // 特に利用しない。メモ用
    "token_type": "Bearer" // 同上
  },
  "Service": "Google" // 固定値
}
```
#### Lambda
普通に作成して上述のDynamoDBへの読み書き権限を与えておく。

##### 環境変数
* `DynamoDbTableName`: 上述のDynamoDBのテーブル名
* `DynamoDbTableKeyName`: 上述のDynamoDBのテーブルのプライマリキー名
* `defaultKeyValue`: プライマリキーの値（引数で指定されなかった場合に利用される）
* `defaultRegion`: `ap-northeast-1` とか

### 処理内容
[gmail-api-client](https://github.com/sanwasystem/gmail-api-client) を呼び出しているだけなので詳細はこちらを参照。
