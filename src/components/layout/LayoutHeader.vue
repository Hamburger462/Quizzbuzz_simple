<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuth } from '../../composables/useAuth';


const { user } = useAuth();
</script>

<template>
    <header>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <template v-if="user != null">
                <RouterLink to="/session">Join the game</RouterLink>
                <RouterLink :to="`/profile/${user.uid}`">Profile</RouterLink>
                <RouterLink to="/archive">Archive</RouterLink>
                <RouterLink to="/discover">Discover</RouterLink>
            </template>
            <template v-else>
                <RouterLink to="/session">Join the game</RouterLink>
                <RouterLink to="/auth/register">Register</RouterLink>
                <RouterLink to="/auth/login">Login</RouterLink>
            </template>
        </nav>
    </header>
</template>