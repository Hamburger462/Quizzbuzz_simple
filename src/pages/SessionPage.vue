<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
const sessionId = route.params.id;
</script>

<template>
    <h2>This is session page</h2>
    <div>Session code:</div>
    <div>{{ sessionId }}</div>
</template>