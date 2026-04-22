<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

import Login from '../components/auth/Login.vue';
import Register from '../components/auth/Register.vue';

const route = useRoute();
const choice = computed(() => route.params.choice);
</script>

<template>
    <div class="auth-page">

        <!-- Split layout: left brand panel + right form -->
        <div class="auth-brand">
            <RouterLink to="/" class="brand-logo">
                <span class="logo-dot"></span>
                <span class="logo-text">Quizzbuzz</span>
            </RouterLink>
            <div class="brand-copy">
                <h1>Test your knowledge.<br>Beat the clock.<br>Top the board.</h1>
                <p>Join thousands of players competing live every day.</p>
            </div>
            <div class="brand-stat-row">
                <div class="brand-stat">
                    <span class="stat-val">12k+</span>
                    <span class="stat-lbl">Games today</span>
                </div>
                <div class="brand-stat">
                    <span class="stat-val">48k+</span>
                    <span class="stat-lbl">Players</span>
                </div>
                <div class="brand-stat">
                    <span class="stat-val">3.2k+</span>
                    <span class="stat-lbl">Quiz packs</span>
                </div>
            </div>
        </div>

        <div class="auth-form-panel">
            <div class="auth-tabs">
                <RouterLink to="/auth/login"    class="auth-tab" :class="{ active: choice === 'login'    }">Log in</RouterLink>
                <RouterLink to="/auth/register" class="auth-tab" :class="{ active: choice === 'register' }">Register</RouterLink>
            </div>

            <Login    v-if="choice === 'login'" />
            <Register v-else-if="choice === 'register'" />
        </div>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.auth-page {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
}

/* ── Brand panel ── */
.auth-brand {
    background: var(--text, #1A1814);
    padding: 3rem 3.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.brand-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
}

.logo-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent, #E8471A);
    flex-shrink: 0;
}

.logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.25rem;
    color: #FAF9F6;
    letter-spacing: -0.02em;
}

.brand-copy {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 4rem 0 3rem;
}

.brand-copy h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(1.75rem, 3vw, 2.75rem);
    letter-spacing: -0.03em;
    line-height: 1.1;
    color: #FAF9F6;
    margin-bottom: 1.25rem;
}

.brand-copy p {
    font-family: 'Manrope', sans-serif;
    font-size: 1rem;
    color: rgba(250, 249, 246, 0.5);
    line-height: 1.6;
}

.brand-stat-row {
    display: flex;
    gap: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(250, 249, 246, 0.1);
}

.brand-stat {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
}

.stat-val {
    font-family: 'Syne', sans-serif;
    font-size: 1.35rem;
    font-weight: 800;
    color: #FAF9F6;
    letter-spacing: -0.02em;
}

.stat-lbl {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    color: rgba(250, 249, 246, 0.4);
}

/* ── Form panel ── */
.auth-form-panel {
    background: var(--bg, #FAF9F6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
}

.auth-tabs {
    display: flex;
    gap: 0;
    background: var(--surface, #F2F0EB);
    border-radius: 10px;
    padding: 4px;
    margin-bottom: 2.5rem;
    width: 100%;
    max-width: 400px;
}

.auth-tab {
    flex: 1;
    text-align: center;
    padding: 0.55rem 1rem;
    border-radius: 7px;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
}

.auth-tab.active {
    background: #fff;
    color: var(--text, #1A1814);
    box-shadow: 0 1px 4px rgba(26, 24, 20, 0.08);
}
</style>