<script setup lang="ts"></script>

<template>
  <video class="home-video" poster="/poster.png" src="/quick.mp4" controls="controls"></video>
</template>

<style>
.home-video {
  margin-left: 60px;
  margin-top: 42px;
  background: transparent;
}

@media (max-width: 960px) {
  .home-video {
    margin-left: 0px;
    margin-top: 42px;
  }
}
</style>
