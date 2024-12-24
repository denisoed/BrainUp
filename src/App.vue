<template>
  <TonConnectUIProvider :options="options">
    <AppLayout />
  </TonConnectUIProvider>
</template>

<script setup>
import AppLayout from '@/layouts/AppLayout.vue';
import { TonConnectUIProvider, THEME } from '@townsquarelabs/ui-vue';

const options = {
  manifestUrl: `${window.location.origin}/tonconnect-manifest.json`,
  uiPreferences: {
    colorsSet: {
      [THEME.DARK]: {
        connectButton: {
          background: '#FF9472',
        }
      }
    }
  }
};
</script>
