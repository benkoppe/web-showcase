import { persisted } from 'svelte-persisted-store';

// Types
export interface Bot {
	id: number;
	name: string;
	color: string;
}

export interface Message {
	id: number;
	botId: number;
	bot: boolean;
	content: string;
	timestamp: string;
	loading: boolean;
}

// convenience functions
function getCurrentTimestamp(): string {
	return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
}

export function randomColor() {
	const tailwindColors = [
		'bg-red-500',
		'bg-blue-500',
		'bg-green-500',
		'bg-yellow-500',
		'bg-indigo-500',
		'bg-purple-500',
		'bg-pink-500',
		'bg-gray-500',
		'bg-red-600',
		'bg-blue-600',
		'bg-green-600',
		'bg-yellow-600',
		'bg-indigo-600',
		'bg-purple-600',
		'bg-pink-600',
		'bg-gray-600',
		'bg-red-700',
		'bg-blue-700',
		'bg-green-700',
		'bg-yellow-700',
		'bg-indigo-700',
		'bg-purple-700',
		'bg-pink-700',
		'bg-gray-700'
	];

	const randomIndex = Math.floor(Math.random() * tailwindColors.length);
	return tailwindColors[randomIndex];
}

// utility function to generate unique IDs
const generateId = () => Math.floor(Math.random() * 1000000);

// creating the store
function createChatStore() {
	const { subscribe, set, update } = persisted('chat', {
		messages: [] as Message[],
		bots: [] as Bot[]
	});

	// add a bot to the store
	function addBot(name: string) {
		const id: number = generateId();

		update((state) => {
			const bot: Bot = {
				id,
				name,
				color: randomColor()
			};

			state.bots.push(bot);
			return state;
		});

		return id;
	}

	// remove a bot from the store
	function removeBot(id: number) {
		update((state) => {
			state.bots = state.bots.filter((bot) => bot.id !== id);
			state.messages = state.messages.filter((message) => message.botId !== id);
			return state;
		});
	}

	// add a message to the store
	function addMessage(botId: number, bot: boolean, content: string, loading: boolean = false) {
		const id: number = generateId();

		update((state) => {
			const message: Message = {
				id,
				botId,
				bot,
				content,
				timestamp: getCurrentTimestamp(),
				loading
			};

			state.messages.push(message);
			return state;
		});

		return id;
	}

	// update a message in the store
	function updateMessage(messageId: number, content: string, loading?: boolean) {
		update((state) => {
			const message = state.messages.find((message) => message.id === messageId);
			if (message) {
				message.content = content;
				if (typeof loading !== 'undefined') {
					message.loading = loading;
				}
			}
			return state;
		});
	}

	return {
		subscribe,
		addBot,
		removeBot,
		addMessage,
		updateMessage
	};
}

export const chatStore = createChatStore();
