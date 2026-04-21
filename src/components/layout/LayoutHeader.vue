<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const { user } = useAuth();
</script>

<template>
    <header class="site-header">
        <div class="header-inner">
            <RouterLink to="/" class="logo">
                <span class="logo-dot"></span>
                <span class="logo-text">Quizzbuzz</span>
            </RouterLink>

            <nav class="nav">
                <template v-if="user != null">
                    <RouterLink to="/discover" class="nav-link">Discover</RouterLink>
                    <RouterLink to="/archive" class="nav-link">Archive</RouterLink>
                    <RouterLink :to="`/profile/${user.uid}`" class="nav-link">Profile</RouterLink>
                </template>
                <template v-else>
                    <RouterLink to="/auth/register" class="nav-link">Register</RouterLink>
                    <RouterLink to="/auth/login" class="nav-link">Login</RouterLink>
                </template>

                <RouterLink to="/session" class="nav-cta">Play now</RouterLink>
            </nav>
        </div>
    </header>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #FAF9F6;
    border-bottom: 1.5px solid #EDEBE5;
}

.header-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2.5rem;
    height: 60px;
    display: flex;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    margin-right: auto;
}

.logo-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #E8471A;
    flex-shrink: 0;
    margin-bottom: 1px;
}

.logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.25rem;
    color: #1A1814;
    letter-spacing: -0.02em;
}

.nav {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.nav-link {
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6B6760;
    text-decoration: none;
    padding: 0.4rem 0.85rem;
    border-radius: 6px;
    transition: color 0.15s ease, background 0.15s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
    color: #1A1814;
    background: #EDEBE5;
}

.nav-cta {
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #FAF9F6;
    text-decoration: none;
    background: #E8471A;
    padding: 0.45rem 1.1rem;
    border-radius: 6px;
    margin-left: 0.5rem;
    transition: background 0.15s ease, transform 0.1s ease;
}

.nav-cta:hover {
    background: #CF3A12;
    transform: translateY(-1px);
}

.nav-cta:active {
    transform: translateY(0);
}
</style>