---
description: 不卡矩阵
layoutClass: m-nav-layout
outline: [2, 3, 4]
---

<script setup>
import { NAV_DATA } from './nav/data'
</script>
<style src="./nav/index.scss"></style>

# 不卡矩阵

<MNavLinks v-for="{title, items} in NAV_DATA" :title="title" :items="items"/>
