<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuth } from '../../composables/useAuth';


const { user } = useAuth();
</script>

<template>
    <header>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            <RouterLink v-if="user != null" :to="`/profile/${user.uid}`">Profile</RouterLink>
            <template v-else>
                <RouterLink to="/auth/register">Register</RouterLink>
                <RouterLink to="/auth/login">Login</RouterLink>
            </template>
        </nav>
    </header>
</template>