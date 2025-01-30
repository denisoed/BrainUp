<template>
  <div class="the-header">
    <h1>Breathe...</h1>
    <div class="the-header_links mt-lg">
      <router-link to="/">Home</router-link>
      <router-link to="/exercises">Exercises</router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.the-header {
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
}
</style>