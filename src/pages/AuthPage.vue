<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

import Login from '../components/auth/Login.vue';
import Register from '../components/auth/Register.vue';

const router = useRoute();

const choice = computed(() => router.params.choice);

</script>

<template>
    <h2>This is auth page</h2>
    <Login v-if="choice == 'login'"></Login>
    <Register v-else-if="choice == 'register'"></Register>
</template>