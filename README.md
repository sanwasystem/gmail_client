gmail_client
===============

Gmailの読み込みやラベル付加を行うLambda

### インストール
トークンはDynamoDBに入っていることを前提としている。次のような形のレコードをDynamoDBに入れておく。
テーブル名は既存のものが使い回せるが、文字型のプライマリキーが1個だけある（このキーだけでレコードが特定できる）ことが条件。

```json
{
  "Key": "UNIQUE-KEY", // プライマリキー（キー名はこれ以外でもよい）
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

#### 環境変数
* `DynamoDbTableName`: 上述のDynamoDBのテーブル名
* `DynamoDbTableKeyName`: 上述のDynamoDBのテーブルのプライマリキー名
* `defaultKeyValue`: プライマリキーの値（引数で指定されなかった場合に利用される）
* `defaultRegion`: `ap-northeast-1` とか

#### 処理内容
[gmail-api-client](https://github.com/sanwasystem/gmail-api-client) を呼び出しているだけなので詳細はこちらを参照。
