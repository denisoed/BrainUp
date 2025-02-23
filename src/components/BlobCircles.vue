<template>
  <div class="rings">
    <div class="ring a"> </div>
    <div class="ring b"> </div>
    <div class="ring c"> </div>
  </div>
</template>

<style lang="scss" scoped>
$opacity: 1;
$color1: var(--primary-rgb);
$color2: var(--primary-rgb);
$color3: var(--primary-rgb);

.rings {
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  position: absolute;
  top: 50%;
  left: 50%;
  transition: transform 150ms cubic-bezier(0,.3,.3,1), 
              top 2000ms cubic-bezier(0,.6,.4,1), 
              left 2000ms cubic-bezier(0,.6,.4,1);
}
.ring {
  width: 100%;
  height: 100%;
  position: absolute;
  mix-blend-mode: screen;
  
  &.a {
    animation: blob1 8s linear infinite alternate;
    box-shadow: rgba($color1,$opacity) 0 0 300px 10px, rgba($color1, $opacity) 0 0 30px 0 inset;
  }
  
  &.b {
    animation: blob2 9s linear infinite alternate;
    box-shadow: rgba($color2, $opacity) 0 0 300px 5px, rgba($color2,$opacity) 0 0 20px 0 inset;
  }

   &.c {
    animation: blob2 10s linear infinite alternate;
    box-shadow: rgba($color3, $opacity) 0 0 300px 0, rgba($color3,$opacity) 0 0 10px 0 inset;
  }
}


@keyframes blob1 {
    0%,
   100% {border-radius: 43% 77% 80% 40% / 40% 40% 80% 80%; }
    20% {border-radius: 47% 73% 61% 59% / 47% 75% 45% 73%; }
    40% {border-radius: 46% 74% 74% 46% / 74% 58% 62% 46%; }
    60% {border-radius: 47% 73% 61% 59% / 40% 40% 80% 80%; }
    80% {border-radius: 50% 70% 52% 68% / 51% 61% 59% 69%; }
}

@keyframes blob2 {
    0%,
  100% { border-radius: 61% 39% 55% 45% / 55% 48% 52% 45%; } 
   20% { border-radius: 47% 73% 61% 59% / 40% 40% 80% 80%; } 
   40% { border-radius: 40% 60% 54% 46% / 61% 38% 62% 39%; } 
   60% { border-radius: 61% 39% 67% 33% / 40% 40% 80% 80%; } 
   80% { border-radius: 47% 73% 61% 59% / 47% 75% 45% 73%; } 
}

@keyframes blob3 {
    0%,
  100% { border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%; } 
   14% { border-radius: 40% 60% 54% 46% / 49% 60% 40% 51%; } 
   28% { border-radius: 54% 46% 38% 62% / 49% 70% 30% 51%; } 
   42% { border-radius: 61% 39% 55% 45% / 61% 38% 62% 39%; } 
   56% { border-radius: 61% 39% 67% 33% / 70% 50% 50% 30%; } 
   70% { border-radius: 50% 50% 34% 66% / 56% 68% 32% 44%; } 
   84% { border-radius: 46% 54% 50% 50% / 35% 61% 39% 65%; } 
}
</style>