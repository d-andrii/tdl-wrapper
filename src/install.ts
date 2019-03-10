import axios from 'axios';
import { Extract } from 'unzipper';

let platform = '';
switch (process.platform) {
	case 'win32':
		platform = 'windows';
		break;
	case 'darwin':
		platform = 'osx';
		break;
	case 'linux':
		platform = 'linux';
		break;
	default:
		throw new Error('Platform is not supported.');
}
axios({
	method: 'get',
	url: `https://github.com/ForNeVeR/tdlib.native/releases/latest/download/tdlib.${platform}.zip`,
	responseType: 'stream'
}).then(res => {
	res.data.pipe(Extract({ path: '' }));
});
