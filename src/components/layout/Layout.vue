<script setup lang="ts">
import LayoutHeader from './LayoutHeader.vue';
import LayoutFooter from './LayoutFooter.vue';
import { RouterView } from 'vue-router';
</script>

<template>
    <div class="app-root">
        <LayoutHeader />
        <main class="main-content">
            <RouterView />
        </main>
        <LayoutFooter />
    </div>
</template>

<style>
/* ── Global tokens ── */
:root {
    --color-bg:        #FAF9F6;
    --color-surface:   #F2F0EB;
    --color-border:    #EDEBE5;
    --color-text:      #1A1814;
    --color-muted:     #6B6760;
    --color-accent:    #E8471A;
    --color-accent-dk: #CF3A12;

    --font-display: 'Syne', sans-serif;
    --font-body:    'Manrope', sans-serif;

    --radius-sm: 6px;
    --radius-md: 12px;
    --radius-lg: 20px;
}

*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
}

body {
    background: var(--color-bg);
    color: var(--color-text);
    font-family: var(--font-body);
    line-height: 1.6;
}

/* ── Typography scale ── */
h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1.1;
}

h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); }
h2 { font-size: clamp(1.75rem, 4vw, 2.75rem); }
h3 { font-size: 1.35rem; }

p {
    color: var(--color-muted);
    font-size: 1rem;
    line-height: 1.7;
}

/* ── Shared button primitives ── */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-family: var(--font-body);
    font-size: 0.9375rem;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    border-radius: var(--radius-sm);
    padding: 0.65rem 1.5rem;
    transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
}

.btn:active { transform: translateY(0) !important; }

.btn-primary {
    background: var(--color-accent);
    color: #FAF9F6;
}

.btn-primary:hover {
    background: var(--color-accent-dk);
    transform: translateY(-1px);
}

.btn-ghost {
    background: transparent;
    color: var(--color-text);
    border: 1.5px solid var(--color-border);
}

.btn-ghost:hover {
    background: var(--color-surface);
    transform: translateY(-1px);
}

/* ── Card ── */
.card {
    background: #fff;
    border: 1.5px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 1.75rem;
}

/* ── Utility ── */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2.5rem;
}

.section {
    padding: 5rem 0;
}
</style>

<style scoped>
.app-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex: 1;
}
</style>