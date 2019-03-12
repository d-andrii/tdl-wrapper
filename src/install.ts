import axios from 'axios';
import { join } from 'path';
import zlib from 'zlib';
import { createWriteStream, existsSync, unlinkSync } from 'fs';

const platform = process.platform;
let ending = '';
switch (platform) {
	case 'win32':
		ending = '.dll';
		break;
	case 'darwin':
		ending = '.dylib';
		break;
	case 'linux':
		ending = '.so';
		break;
	default:
		throw new Error('Platform is not supported.');
}
// https://github.com/wfjsw/node-tdlib/releases/download/v1.3.0/tdlib-v1.3.0-patch370-napi-linux-x64.node.gz
// https://github.com/wfjsw/node-tdlib/releases/download/v1.3.0/tdlib-v1.3.0-patch370-napi-darwin-x64.node.gz
// https://github.com/wfjsw/node-tdlib/releases/download/v1.3.0/tdlib-v1.3.0-patch370-napi-win32-x64.node.gz
const gunzip = zlib.createGunzip();
const path = join(__dirname, '../libtdjson' + ending);
if (existsSync(path)) unlinkSync(path);
const stream = createWriteStream(path);
axios({
	method: 'get',
	url: `https://github.com/wfjsw/node-tdlib/releases/download/v1.3.0/tdlib-v1.3.0-patch370-napi-${platform}-x64.node.gz`,
	responseType: 'stream'
})
	.then((res) => {
		res.data.pipe(gunzip);
		gunzip
			.on('data', (data) => {
				stream.write(data);
			})
			.on('end', () => {
				Promise.resolve();
			})
			.on('error', (e) => {
				throw e;
			});
	})
	.catch((e) => {
		throw e;
	});
