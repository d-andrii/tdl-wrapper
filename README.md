# TDL-wrapper
[![Build Status](https://travis-ci.org/d-andrii/tdl-wrapper.svg?branch=master)](https://travis-ci.org/d-andrii/tdl-wrapper)
## Instalation
`npm install tdl-wrapper`

## Examples

config.ts (see https://my.telegram.org/):
```typescript
export const apiId = 123456;
export const apiHash = '1234567890abcdefghijklmnopqrstuv';
export const phoneNumber = '+380123456789';
```

index.tx:
```typescript
import { apiId, apiHash, phoneNumber } from './config';
import { Client } from 'tdl-wrapper';

const client = new Client(apiId, apiHash);

const handler = async () => {
	await client.sendText('My Friend', 'ACHTUNG!!!');
};

client.connect().then(() => {
	client.setLogVerbosityLevel(1);
	client.login(() => ({ phoneNumber })).then(handler);
});
```

Docs: https://d-andrii.github.io/tdl-wrapper/
