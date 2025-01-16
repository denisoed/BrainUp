<template>
  <div class="container home-page">
    <h1>Breathe...</h1>
    <div class="home-page_links mt-lg">
      <router-link to="/">Home</router-link>
      <router-link to="/exercises">Exercises</router-link>
    </div>
    <div class="home-page_list mt-lg">
      <div
        v-for="(item, index) in LIST"
        :key="index"
        class="home-page_list-item"
      >
        <h2>{{ item.name }}</h2>
        <router-link :to="item.link" :class="item.type" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const LIST = [
  {
    name: 'Antistress Technique',
    link: '/item/antistress',
    type: 'antistress',
  },
  {
    name: '4-7-8 Technique',
    link: '/item/four-seven-eight',
    type: 'four-seven-eight',
  }
]
</script>

<style lang="scss" scoped>
.home-page {
  h1 {
    font-size: 30px;
    color: #3c3c4c;
    font-weight: bold;
    margin: 0;
  }

  &_links {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 16px;

    a {
      color: #3c3c4c;
      display: flex;
      align-items: center;
      line-height: normal;
      position: relative;

      &::after {
        content: '';
        width: 1px;
        height: 15px;
        display: block;
        background: #9b9bc6;
        transform: translateX(8px);
        opacity: 0.5;
      }

      &:last-child {
        &::after {
          display: none;
        }
      }
    }

    .router-link-exact-active {
      font-weight: bold;
    }
  }

  &_list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    &-item {
      display: flex;
      flex-direction: column;
      gap: 8px;

      h2 {
        color: #3c3c4c;
        font-size: 14px;
        margin: 0;
      }

      a {
        width: 100%;
        height: 130px;
        display: block;
        background: #9b9bc6;
        border-radius: 20px;
        position: relative;
        background-position: 150%;
        background-size: 70%;
        background-repeat: no-repeat;;
        overflow: hidden;
      }
      
      .antistress {
        background-image: url('@/assets/circle-bg.svg');
      }
      
      .four-seven-eight {
        background-image: url('@/assets/cube-bg.svg');
        background-size: 90%;
        background-position: 150% 40px;
      }
    }
  }
}
</style>
