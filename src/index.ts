import { Client as tdlClient } from 'tdl';
import { Chat, Message } from 'tdl/types/tdlib';
import { join } from 'path';

export class Client extends tdlClient {
	constructor(apiId: number, apiHash: string) {
		let platform = '';
		switch (process.platform) {
			case 'win32':
				platform = 'tdjson';
				break;
			case 'darwin':
			case 'linux':
				platform = 'libtdjson';
				break;
			default:
				throw new Error('Platform is not supported.');
		}
		super({ apiId, apiHash, binaryPath: join(__dirname, '../', platform) });
	}
	/**
	 * Sends message to existing chat.
	 * @async
	 * @param { string | number } chat Chat title or ID.
	 * @param { string } text Text to send.
	 * @returns { Promise<Message> } Promise resolves Message.
	 */
	public async sendText(chat: string | number, text: string): Promise<Message> {
		let chatId: number | undefined;
		if (typeof chat === 'number') {
			chatId = chat;
		} else {
			await this.invoke({
				_: 'getChats',
				offset_order: '9223372036854775807',
				offset_chat_id: 0,
				limit: 100
			})
				.then(async (res) => {
					const chats = await this.getChats(...res.chat_ids);
					const found = chats.filter((el) => {
						return el.title === chat;
					});
					chatId = found[0] ? found[0].id : undefined;
				})
				.catch(console.error);
		}
		if (chatId === undefined) return Promise.reject('Chat does not exist.');
		return await this.invoke({
			_: 'sendMessage',
			chat_id: chatId,
			input_message_content: {
				_: 'inputMessageText',
				text: {
					_: 'formattedText',
					text
				}
			}
		});
	}
	/**
	 * Returns full info of passed chats.
	 * @async
	 * @param { number[] } ids chat IDs.
	 * @returns { Promise<Chat> } Promise resolves Chat[].
	 */
	public async getChats(...ids: number[]): Promise<Chat[]> {
		const promises: Array<Promise<Chat>> = [];
		ids.forEach((id) => {
			promises.push(
				this.invoke({
					_: 'getChat',
					chat_id: id
				})
			);
		});
		return await Promise.all(promises);
	}
}
