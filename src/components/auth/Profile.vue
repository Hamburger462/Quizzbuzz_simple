<script setup lang="ts">
import { useAuth } from '../../composables/useAuth';

const { user } = useAuth();
</script>

<template>
    <div v-if="user != null">{{ user.email }}</div>
    <div v-else>Login in to see the profile</div>
</template>