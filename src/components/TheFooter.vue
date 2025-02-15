<template>
  <div class="footer">
    <router-link to="/">
      <HomeIcon />
    </router-link>
    <router-link to="/list">
      <ListIcon />
    </router-link>
    <router-link to="/activity">
      <ActivityIcon />
    </router-link>
    <router-link to="/settings">
      <SettingsIcon />
    </router-link>
  </div>
</template>

<script setup lang="ts">
import HomeIcon from '@/components/Icons/HomeIcon.vue';
import ListIcon from '@/components/Icons/ListIcon.vue';
import ActivityIcon from '@/components/Icons/ActivityIcon.vue';
import SettingsIcon from '@/components/Icons/Settings.vue';
</script>

<style scoped lang="scss">
.footer {
  position: fixed;
  bottom: 0;
  right: 0;
  width: 100%;
  padding: 12px 16px 24px;
  box-sizing: border-box;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: space-between;
  gap: 16px;
  z-index: 1;

  a {
    width: 45px;
    height: 45px;
    border-radius: 8px;
    text-align: center;
    line-height: 40px;
    color: #222;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    opacity: 0.5;
    border-radius: 12px;
    overflow: hidden;

    &:active {
      transform: scale(0.9);
      opacity: 0.8;
    }

    img {
      width: 30px;
    }

    &.router-link-exact-active {
      transform: scale(1.05);
      opacity: 1;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 3px;
        height: 3px;
        background: var(--primary);
        border-radius: 100%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>
