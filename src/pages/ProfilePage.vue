<script setup lang="ts">
import { useAuth } from '../composables/useAuth';

const { user, logout } = useAuth();
</script>

<template>
    <div v-if="user != null">
        <div>{{ user.email }}</div>
        <button @click="logout">Log out</button>
    </div>
    <div v-else>Login in to see the profile</div>
</template>