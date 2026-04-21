<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const sessionCode = ref<string>("");
const hasError = route.query.error === 'incorrect_code';

const handleJoin = () => {
    router.push(`/session/${sessionCode.value}`);
}
</script>

<template>
    <div class="join-page">
        <div class="join-card">
            <div class="join-header">
                <div class="join-icon">▶</div>
                <h1>Join a game</h1>
                <p>Enter the session code your host shared with you.</p>
            </div>

            <div v-if="hasError" class="error-banner">
                That code didn't match any active session. Double-check and try again.
            </div>

            <div class="field">
                <label class="field-label" for="sessionCode">Session code</label>
                <input
                    id="sessionCode"
                    class="code-input"
                    type="text"
                    name="sessionCode"
                    v-model="sessionCode"
                    placeholder="ABC 123"
                    maxlength="7"
                    autocomplete="off"
                    @keyup.enter="handleJoin"
                />
            </div>

            <button class="btn-primary" @click="handleJoin" :disabled="!sessionCode.trim()">
                Enter session →
            </button>

            <p class="join-footer">
                Want to host? <RouterLink to="/auth/register">Create an account</RouterLink>
            </p>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.join-page {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--bg, #FAF9F6);
}

.join-card {
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 16px;
    padding: 2.75rem 3rem;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.join-header {
    text-align: center;
}

.join-icon {
    width: 48px;
    height: 48px;
    background: #FDF0EC;
    color: var(--accent, #E8471A);
    border-radius: 12px;
    display: grid;
    place-items: center;
    font-size: 1.1rem;
    margin: 0 auto 1.25rem;
}

h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.75rem;
    letter-spacing: -0.025em;
    color: var(--text, #1A1814);
    margin-bottom: 0.4rem;
}

p {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    color: var(--muted, #6B6760);
    line-height: 1.6;
}

.error-banner {
    background: #FEF2F0;
    border: 1.5px solid #F8C9C2;
    color: #B83215;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.field-label {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text, #1A1814);
    letter-spacing: 0.01em;
}

.code-input {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-align: center;
    background: var(--surface, #F2F0EB);
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 8px;
    padding: 0.85rem 1rem;
    width: 100%;
    outline: none;
    color: var(--text, #1A1814);
    transition: border-color 0.15s, background 0.15s;
}

.code-input::placeholder {
    color: var(--muted, #6B6760);
    opacity: 0.5;
}

.code-input:focus {
    border-color: var(--accent, #E8471A);
    background: #fff;
}

.btn-primary {
    width: 100%;
    padding: 0.8rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #FAF9F6;
    background: var(--accent, #E8471A);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
}

.btn-primary:hover:not(:disabled) {
    background: var(--accent-dk, #CF3A12);
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.join-footer {
    text-align: center;
    font-size: 0.85rem;
}

.join-footer a {
    color: var(--accent, #E8471A);
    font-weight: 600;
    text-decoration: none;
}

.join-footer a:hover {
    text-decoration: underline;
}
</style>