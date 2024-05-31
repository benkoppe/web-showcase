<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';

	import { chatStore } from './chat_store';
	import ChatBubble from './ChatBubble.svelte';

	const BOT_CHAT_COLOR = 'variant-soft-primary';

	const dispatch = createEventDispatcher();
	let elemChat: HTMLElement;

	// Reactive Variables
	let currentBotId: number = $chatStore.bots[0].id;
	let currentMessage = '';

	// Computed Variables
	$: currentBot = $chatStore.bots.find((bot) => bot.id === currentBotId);
	$: chats = $chatStore.messages.filter((chat) => chat.botId === currentBotId);

	// Functions
	function scrollChatBottom(behavior?: ScrollBehavior): void {
		elemChat.scrollTo({
			top: elemChat.scrollHeight,
			behavior
		});
	}

	function addUserMessage(): void {
		// catch empty messages
		if (!currentMessage) return;

		chatStore.addMessage(currentBotId, false, currentMessage);

		let messages = $chatStore.messages.filter((chat) => chat.botId === currentBotId);
		dispatch('message', {
			messages: messages,
			addBotMessage: (content: string, loading?: boolean) =>
				addBotMessage(currentBotId, content, loading)
		});

		// clear the current message
		currentMessage = '';
		// smooth scroll to bottom
		// timeout prevents race conditions
		setTimeout(() => {
			scrollChatBottom('smooth');
		}, 0);
	}

	function addBotMessage(
		botId: number,
		content: string,
		loading?: boolean
	): (content: string, loading?: boolean) => void {
		const messageId = chatStore.addMessage(botId, true, content, loading);
		// smooth scroll to bottom
		// timeout prevents race conditions
		if (botId === currentBotId) {
			setTimeout(() => {
				scrollChatBottom('smooth');
			}, 0);
		}

		return (content: string, loading?: boolean) => {
			chatStore.updateMessage(messageId, content, loading);
		};
	}

	function addBot(): void {
		const newId = chatStore.addBot(`ChatGPT ${$chatStore.bots.length + 1}`);
		currentBotId = newId;
		addBotMessage(newId, 'Hello! How can I help you today?');
	}

	function removeBot(id: number): void {
		chatStore.removeBot(id);

		if (id === currentBotId) {
			currentBotId = $chatStore.bots[0].id;
		}
	}

	function onPromptKeydown(event: KeyboardEvent): void {
		if (['Enter'].includes(event.code)) {
			event.preventDefault();
			addUserMessage();
		}
	}

	// when DOM mounts, scroll to bottom
	onMount(() => {
		scrollChatBottom();
	});
</script>

<!-- Card Container -->
<section class="card">
	<div class="chat w-full h-full grid sm:grid-cols-[25%_1fr]">
		<!-- Navigation -->
		<div class="hidden sm:grid grid-rows-[1fr_auto] border-r border-surface-500/30">
			<!-- List -->
			<div class="p-4 space-y-4 overflow-y-auto">
				<div class="flex flex-row justify-between items-center">
					<small class="opacity-50 sm:text-sm md:text-md lg:text-lg">Bots</small>
					<button type="button" class="btn variant-filled-primary" on:click={addBot}>
						<i class="fa-solid fa-plus" />
					</button>
				</div>
				<div class="flex flex-col space-y-1">
					{#each $chatStore.bots as bot}
						<div class="w-full justify-items-center">
							<button
								type="button"
								class="btn btn-icon-sm md:btn-base w-full h-[50px] flex items-center {bot.id ===
								currentBotId
									? 'variant-filled-primary'
									: 'bg-surface-hover-token'}"
								on:click={() => {
									currentBotId = bot.id;
								}}
							>
								<div class="pl-3 pr-1 gap-1 flex w-full place-items-center">
									<Avatar background={bot.color} class="min-w-[40px] w-[40px]">
										<i class="fa-solid fa-robot" />
									</Avatar>
									<span class="w-full text-sm lg:text-base overflow-hidden truncate text-start">
										{bot.name}
									</span>
								</div>
								<div class="flex justify-items-end pr-3">
									<button
										class="btn-icon btn-icon-sm variant-ghost-tertiary pointer-events-auto"
										on:click={() => removeBot(bot.id)}
									>
										<i class="fa-solid fa-trash" />
									</button>
								</div>
							</button>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Chat -->
		<div class="grid grid-row-[1fr_auto]">
			<!-- Conversation -->
			<section bind:this={elemChat} class="max-h-[500px] p-4 overflow-y-auto space-y-4">
				{#each chats as chat}
					<ChatBubble
						bot_chat_color={BOT_CHAT_COLOR}
						bot_name={currentBot?.name || 'Unknown Bot'}
						bot={chat.bot}
						avatar_color={chat.bot ? currentBot?.color || 'bg-primary-500' : 'bg-secondary-500'}
						message={chat.content}
						loading={chat.loading}
						timestamp={chat.timestamp}
					/>
				{/each}
			</section>
			<!-- Prompt -->
			<section class="border-t border-surface-500/30 p-4">
				<div class="input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token">
					<textarea
						bind:value={currentMessage}
						class="bg-transparent border-0 ring-0"
						name="prompt"
						id="prompt"
						placeholder="Write a message..."
						rows="1"
						on:keydown={onPromptKeydown}
					></textarea>
					<button
						class={currentMessage ? 'variant-filled-primary' : 'input-group-shim'}
						on:click={addUserMessage}
					>
						<i class="fa-solid fa-paper-plane"></i>
					</button>
				</div>
			</section>
		</div>
	</div>
</section>
