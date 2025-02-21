<template>
	<SwipeToClose @on-close="onClose">
		<div class="about-game-dialog flex column gap-sm">
			<div class="close-line" />
			<div class="about-game-dialog_content flex column items-center">
				<div class="about-game-dialog_content-title mb-sm" v-html="$t(`games.howToPlay`)" />
				<div class="about-game-dialog_content-rules mb-sm" v-html="$t(`games.${game}.about.rule1`)" />
				<div class="about-game-dialog_content-rules mb-md" v-html="$t(`games.${game}.about.rule2`)" />
				<div
					v-if="$t(`games.${game}.about.rule3`) !== `games.${game}.about.rule3`"
					class="about-game-dialog_content-rules mb-md" 
					v-html="$t(`games.${game}.about.rule3`)" 
				/>
				<div class="about-game-dialog_content-descr" v-html="$t(`games.${game}.about.descr`)" />
				<Button
					class="mt-md"
					@click="onClose"
				>
					<div class="flex items-center gap-xs">
						<span>{{ $t(`games.${game}.about.btn`) }}</span>
					</div>
				</Button>
			</div>
		</div>
	</SwipeToClose>
</template>

<script lang="ts" setup>
import SwipeToClose from '@/components/SwipeToClose.vue';
import Button from '@/components/Button.vue';

const emit = defineEmits(['close', 'on-collect']);
defineProps({
	game: {
		type: String,
		required: true,
	}
})

function onClose() {
	emit('close');
}
</script>

<style scoped lang="scss">
.about-game-dialog {
	position: relative;
	width: 100%;
	padding: 20px 20px 30px;
	box-sizing: border-box;
	text-align: left;
	border-top-left-radius: 16px;
	border-top-right-radius: 16px;
	background: linear-gradient(175deg, #3b3b3b 0%, rgba(34, 40, 49 ,1) 100%);

	.close-line {
		position: absolute;
		top: 12px;
		left: 50%;
		width: 40px;
		height: 3px;
		background-color: var(--white-color);
		border-radius: 10px;
		transform: translateX(-50%);
	}

	&_content {
		:deep(.about-game-dialog_content-title) {
			width: 100%;
			font-size: 24px;
			color: var(--primary);
		}

		:deep(.about-game-dialog_content-descr) {
			width: 100%;
			font-size: 14px;
			color: var(--white-color);
			background-color: rgba(0, 217, 255, 0.1);
			border-radius: 12px;
			padding: 16px;

			span {
				color: var(--primary);
			}
		}
		
		:deep(.about-game-dialog_content-rules) {
			width: 100%;
			font-size: 14px;
			color: var(--white-color);
			
			span {
				color: var(--primary);
			}
		}

		.button {
			width: 100%;
			line-height: normal;
			color: var(--dark-color);
		}
	}
}
</style>
