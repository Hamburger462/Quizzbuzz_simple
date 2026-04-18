<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <header>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/auth/register">Register</RouterLink>
            <RouterLink to="/auth/login">Login</RouterLink>
        </nav>
    </header>
</template>