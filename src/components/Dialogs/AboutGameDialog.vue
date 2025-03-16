<template>
	<div class="about-game-dialog">
		<div 
			class="about-game-dialog_content"
			v-touch:swipe.left="nextStep"
			v-touch:swipe.right="prevStep"
			v-touch:swipe.up="onClose"
			v-touch:swipe.down="onClose"
		>
			<div class="about-game-dialog_header">
				<div class="about-game-dialog_title">
					<span class="about-game-dialog_emoji">📖</span>
					<h2>{{ t(`games.howToPlay`) }}</h2>
				</div>
				<button class="close-btn" @click="onClose">×</button>
			</div>

			<div class="stepper">
				<div 
					v-for="step in totalSteps" 
					:key="step"
					class="stepper-dot"
					:class="{ 'active': currentStep === step }"
					@click="currentStep = step"
				/>
			</div>

			<div class="about-game-dialog_content-wrapper">
				<div 
					class="about-game-dialog_rules" 
					v-if="currentStep === 1"
					:key="1"
				>
					<div class="rule-item" v-html="t(`games.${game}.about.rule1`)" />
				</div>

				<template v-if="t(`games.${game}.about.rule2`) !== `games.${game}.about.rule2`">
					<div 
						class="about-game-dialog_rules" 
						v-if="currentStep === 2"
						:key="2"
					>
						<div class="rule-item" v-html="t(`games.${game}.about.rule2`)" />
					</div>

					<div 
						class="about-game-dialog_rules" 
						v-if="currentStep === 3 && t(`games.${game}.about.rule3`) !== `games.${game}.about.rule3`"
						:key="3"
					>
						<div class="rule-item" v-html="t(`games.${game}.about.rule3`)" />
					</div>

					<div 
						class="about-game-dialog_rules" 
						v-if="currentStep === 4 && t(`games.${game}.about.rule4`) !== `games.${game}.about.rule4`"
						:key="4"
					>
						<div class="rule-item" v-html="t(`games.${game}.about.rule4`)" />
					</div>
				</template>

				<div 
					class="about-game-dialog_description" 
					v-if="currentStep === totalSteps"
					:key="totalSteps"
				>
					<div v-html="t(`games.${game}.about.descr`)" />
				</div>
			</div>

			<div class="swipe-hint hidden" :class="{ 'swipe-hint--hidden': currentStep === totalSteps }">
				<div class="swipe-hint_icon swipe-hint_icon--left">👈</div>
				<div class="swipe-hint_text">{{ t('common.swipe') }}</div>
				<div class="swipe-hint_icon swipe-hint_icon--right">👉</div>
			</div>

			<div class="about-game-dialog_footer">
				<div class="navigation-buttons">
					<Button 
						class="btn btn--secondary" 
						@click="prevStep"
						:disabled="currentStep === 1"
					>
						{{ t('common.prev') }}
					</Button>
					<Button 
						class="btn"
						:class="{ 'btn--primary': currentStep === totalSteps, 'btn--success': currentStep !== totalSteps }"
						@click="currentStep === totalSteps ? onClose() : nextStep()"
					>
						{{ currentStep === totalSteps ? t('games.gotIt') : t('common.next') }}
					</Button>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@/components/Button.vue';

const { t } = useI18n();
const emit = defineEmits(['close', 'on-collect']);
const props = defineProps({
	game: {
		type: String,
		required: true,
	}
});

const currentStep = ref(1);
const totalSteps = computed(() => {
	let steps = 1; // Начинаем с 1 (rule1 всегда есть)
	
	// Проверяем наличие rule2
	const hasRule2 = t(`games.${props.game}.about.rule2`) !== `games.${props.game}.about.rule2`;
	
	// Если rule2 нет, сразу переходим к описанию
	if (!hasRule2) {
		steps++; // Добавляем только шаг с описанием
		return steps;
	}
	
	// Если rule2 есть, проверяем остальные правила
	steps++; // Добавляем rule2
	if (t(`games.${props.game}.about.rule3`) !== `games.${props.game}.about.rule3`) steps++;
	if (t(`games.${props.game}.about.rule4`) !== `games.${props.game}.about.rule4`) steps++;
	
	// Добавляем последний шаг для описания
	steps++;
	
	return steps;
});

function nextStep() {
	if (currentStep.value < totalSteps.value) {
		currentStep.value++;
	}
}

function prevStep() {
	if (currentStep.value > 1) {
		currentStep.value--;
	}
}

function onClose() {
	emit('close');
}
</script>

<style scoped lang="scss">
.about-game-dialog {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	box-shadow: none;

	&_content {
		background: var(--dark-color);
		border-radius: 16px;
		padding: 24px;
		width: 90%;
		max-width: 400px;
		position: relative;
		touch-action: pan-x;
	}

	&_content-wrapper {
		position: relative;
		overflow: hidden;
	}

	&_header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	&_title {
		display: flex;
		align-items: center;
		gap: 12px;

		h2 {
			color: var(--white-color);
			margin: 0;
			font-size: 24px;
		}
	}

	&_emoji {
		font-size: 32px;
		animation: bounce 1s infinite;
	}

	&_rules {
		margin-bottom: 8px;
		min-height: 100px;

		.rule-item {
			padding: 12px;
			background: rgba(255, 255, 255, 0.05);
			border-radius: 12px;
			color: var(--white-color);
			font-size: 14px;
			animation: fadeIn 0.3s ease-in-out;

			:deep(span) {
				color: var(--primary);
			}
		}
	}

	&_description {
		margin-bottom: 24px;
		padding: 16px;
		background: rgba(var(--primary-rgb), 0.1);
  	border: 1px solid var(--primary);
		border-radius: 12px;
		color: var(--white-color);
		font-size: 14px;
		min-height: 100px;
		animation: fadeIn 0.3s ease-in-out;

		:deep(span) {
			color: var(--primary);
		}
	}
}

.swipe-hint {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	margin-bottom: 24px;
	color: var(--white-color);
	opacity: 0.7;
	animation: fadeIn 0.3s ease-in-out;

	&--hidden {
		display: none;
	}

	&_text {
		font-size: 14px;
	}

	&_icon {
		font-size: 20px;

		&--left {
			animation: swipeLeft 2s infinite;
		}

		&--right {
			animation: swipeRight 2s infinite;
		}
	}
}

.stepper {
	display: flex;
	justify-content: center;
	gap: 8px;
	margin-bottom: 24px;

	&-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.2);
		cursor: pointer;
		transition: all 0.3s ease;

		&.active {
			background: var(--primary);
			transform: scale(1.2);
		}
	}
}

.navigation-buttons {
	display: flex;
	gap: 12px;

	.btn {
		flex: 1;
	}
}

.close-btn {
	width: 32px;
	height: 32px;
	background: none;
	border: none;
	color: var(--white-color);
	font-size: 24px;
	cursor: pointer;
	padding: 0;
	opacity: 0.7;
	transition: opacity 0.2s;
	position: absolute;
	top: 12px;
	right: 12px;

	&:hover {
		opacity: 1;
	}
}

.btn {
	padding: 12px 24px;
	border-radius: 8px;
	font-size: 16px;
	cursor: pointer;
	transition: all 0.3s ease;
	border: none;

	&--primary {
		background: var(--primary);
		color: var(--dark-color);
	}

	&--secondary {
		background: rgba(255, 255, 255, 0.1);
		color: var(--white-color);
	}

	&--success {
		background: var(--white-color);
		color: var(--dark-color);
	}
}

@keyframes bounce {
	0%, 100% {
		transform: translateY(0);
	}
	50% {
		transform: translateY(-10px);
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes swipeLeft {
	0%, 100% {
		transform: translateX(0);
		opacity: 0.7;
	}
	50% {
		transform: translateX(-5px);
		opacity: 1;
	}
}

@keyframes swipeRight {
	0%, 100% {
		transform: translateX(0);
		opacity: 0.7;
	}
	50% {
		transform: translateX(5px);
		opacity: 1;
	}
}
</style>
