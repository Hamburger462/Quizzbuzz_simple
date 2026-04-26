<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <div class="not-found-page">
        <div class="not-found-inner">
            <p class="code">404</p>
            <h1>Page not found</h1>
            <p class="sub">The page you're looking for doesn't exist or has been moved.</p>
            <div class="actions">
                <RouterLink to="/" class="btn-primary">Go home</RouterLink>
                <button class="btn-ghost" @click="router.back()">Go back</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.not-found-page {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--bg, #FAF9F6);
}

.not-found-inner {
    text-align: center;
    max-width: 420px;
    animation: fadeUp 0.35s ease both;
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
}

.code {
    font-family: 'Syne', sans-serif;
    font-size: clamp(5rem, 16vw, 9rem);
    font-weight: 800;
    letter-spacing: -0.04em;
    line-height: 1;
    color: var(--border, #EDEBE5);
    margin-bottom: 0.5rem;
}

h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.5rem, 4vw, 2.25rem);
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--text, #1A1814);
    margin-bottom: 0.75rem;
}

.sub {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    color: var(--muted, #6B6760);
    line-height: 1.6;
    margin-bottom: 2rem;
}

.actions {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn-primary {
    display: inline-flex;
    align-items: center;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #FAF9F6;
    background: var(--accent, #E8471A);
    text-decoration: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
}

.btn-primary:hover {
    background: var(--accent-dk, #CF3A12);
    transform: translateY(-1px);
}

.btn-ghost {
    display: inline-flex;
    align-items: center;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text, #1A1814);
    background: transparent;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    border: 1.5px solid var(--border, #EDEBE5);
    cursor: pointer;
    transition: background 0.15s;
}

.btn-ghost:hover {
    background: var(--surface, #F2F0EB);
}
</style>