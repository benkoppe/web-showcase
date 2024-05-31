<script lang="ts">
	import Chat from '$lib/components/chat/Chat.svelte';
	import type { Message } from '$lib/components/chat/chat_store.ts';

	interface OpenAIMessage {
		role: 'system' | 'user' | 'assistant';
		content: string;
	}

	async function onUserMessage({
		detail: { messages, addBotMessage }
	}: {
		detail: {
			messages: Message[];
			addBotMessage: (
				content: string,
				loading?: boolean
			) => (content: string, loading?: boolean) => void;
		};
	}) {
		let openAIMessages: OpenAIMessage[] = messages.map((message) => ({
			role: message.bot ? 'assistant' : 'user',
			content: message.content
		}));
		openAIMessages = [
			{
				role: 'system',
				content: 'You are an AI assistant that only writes quick, short-form responses.'
			},
			...openAIMessages
		];

		const updateBotMessage = addBotMessage('', true);

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					messages: openAIMessages
				})
			});

			if (response.ok) {
				const data = await response.json();
				console.log(data.content);
				updateBotMessage(data.content, false);
			}
		} catch (error) {
			console.error(error);
		}
	}
</script>

<Chat on:message={onUserMessage} />
