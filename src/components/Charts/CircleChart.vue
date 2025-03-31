<template>
  <div class="circle-chart">
    <figure :class="`chart-${size} animate`" :style="{ '--percentage': percentage }">
      <svg role="img" xmlns="http://www.w3.org/2000/svg">
        <circle class="circle-background"/>
        <circle class="circle-foreground"/>
      </svg>
      <figcaption>
        <span class="counter">{{ counter }}%</span>
      </figcaption>
    </figure>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  percentage: {
    type: Number,
    default: 70,
    validator: (value: number) => value >= 0 && value <= 100
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    default: 'lg'
  }
});

const counter = ref(0);

const animateCounter = () => {
  const duration = 3000; // 3s
  const delay = 1000; // 1s
  const steps = 100;
  const increment = props.percentage / steps;
  const interval = duration / steps;

  setTimeout(() => {
    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep >= steps) {
        clearInterval(timer);
        counter.value = props.percentage;
        return;
      }
      currentStep++;
      counter.value = Math.round(currentStep * increment);
    }, interval);
  }, delay);
};

onMounted(() => {
  animateCounter();
});

watch(() => props.percentage, () => {
  counter.value = 0;
  animateCounter();
});
</script>

<style scoped lang="scss">
$configs: (
	chart-sm: (
		svgSize: 200px,
		strokeWidth: 1px,
		backgroundColor: rgba(var(--primary-rgb), 0.2),
		foregroundColor: var(--primary),
		labelColor: #fff,
		labelFontSize: 2.5rem,
		duration: 3s,
		animationDelay: 1s
	),
	chart-md: (
		svgSize: 200px,
		strokeWidth: 15px,
		backgroundColor: rgba(var(--primary-rgb), 0.2),
		foregroundColor: var(--primary),
		labelColor: #fff,
		labelFontSize: 2.5rem,
		duration: 3s,
		animationDelay: 1s
	),
	chart-lg: (
		svgSize: 200px,
		strokeWidth: 25px,
		backgroundColor: rgba(var(--primary-rgb), 0.2),
		foregroundColor: var(--primary),
		labelColor: #fff,
		labelFontSize: 2.5rem,
		duration: 3s,
		animationDelay: 1s
	)
);

/* ------- DO NOT EDIT BELOW --------- */
$pi: 3.14;
$labelData: '';
@for $i from 0 to 101 {
	$labelData: $labelData + $i + '%' + '\a';
}

@each $chart, $param in $configs {
	
	$c: (map-get($param, svgSize) - map-get($param, strokeWidth)) * $pi;
	
	.#{$chart} {
		width: map-get($param, svgSize);
		height: map-get($param, svgSize);
		margin: 0;
		position: relative;
		
		&.animate {
			svg .circle-foreground {
				animation: offset map-get($param, duration) ease-in-out forwards;
				animation-delay: map-get($param, animationDelay);
			}
			figcaption:after {
				animation: #{$chart}-label map-get($param, duration) steps(var(--percentage)) forwards;
				animation-delay: map-get($param, animationDelay);
			}
		}

		svg {
			width: 100%;
			height: 100%;
			.circle-background {
				r: (map-get($param, svgSize) - map-get($param, strokeWidth))/2;
				cx: 50%;
				cy: 50%;
				fill: none;
				stroke: map-get($param, backgroundColor);
				stroke-width: map-get($param, strokeWidth);
			}
			.circle-foreground {
				@extend .circle-background;
				stroke: map-get($param, foregroundColor);
				stroke-dasharray: calc(var(--percentage) * #{$c} / 100) #{$c};
				stroke-dashoffset: calc(var(--percentage) * #{$c} / 100);
				stroke-linecap: round;
				transform-origin: 50% 50%;
				transform: rotate(-90deg);
			}
		}
  
		figcaption {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			color: map-get($param, labelColor);
			font-size: map-get($param, labelFontSize);
			line-height: 1;

			.counter {
				transition: opacity 0.3s ease;
			}
		}
	}
	@keyframes #{$chart}-label {
		100% {
			transform: translateY(calc(map-get($param, labelFontSize) * (-var(--percentage))));
		}
	}
}
@keyframes offset {
	100% {
		stroke-dashoffset: 0;
	}
}
</style>
