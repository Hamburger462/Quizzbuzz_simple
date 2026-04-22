<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const { login } = useAuth();
const router = useRouter();

const email = ref<string>("");
const pass  = ref<string>("");
const error = ref<string>("");
const loading = ref(false);

const handleInput = async (event: PointerEvent) => {
    event.preventDefault();
    if (!email.value || !pass.value) return;
    error.value = "";
    loading.value = true;
    try {
        await login(email.value, pass.value);
        router.push("/archive");
    } catch (e: any) {
        error.value = "Incorrect email or password. Please try again.";
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="form-wrap">
        <div class="form-header">
            <h2>Welcome back</h2>
            <p>Log in to host games and track your scores.</p>
        </div>

        <div v-if="error" class="error-banner">{{ error }}</div>

        <form class="auth-form" @submit.prevent>
            <div class="field">
                <label class="field-label" for="login-email">Email</label>
                <input
                    id="login-email"
                    class="text-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    v-model="email"
                />
            </div>

            <div class="field">
                <div class="field-row">
                    <label class="field-label" for="login-pass">Password</label>
                    <a href="#" class="forgot-link">Forgot password?</a>
                </div>
                <input
                    id="login-pass"
                    class="text-input"
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    v-model="pass"
                />
            </div>

            <button
                class="btn-submit"
                :class="{ loading }"
                :disabled="loading || !email || !pass"
                @click="handleInput"
            >
                <span v-if="!loading">Log in →</span>
                <span v-else class="spinner"></span>
            </button>
        </form>

        <p class="form-footer">
            Don't have an account?
            <RouterLink to="/auth/register">Register for free</RouterLink>
        </p>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.form-wrap {
    width: 100%;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    animation: fadeUp 0.3s ease both;
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}

.form-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--text, #1A1814);
    margin-bottom: 0.3rem;
}

.form-header p {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    color: var(--muted, #6B6760);
    line-height: 1.5;
}

.error-banner {
    background: #FEF2F0;
    border: 1.5px solid #F8C9C2;
    color: #B83215;
    border-radius: 8px;
    padding: 0.7rem 0.9rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
}

.auth-form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
}

.field {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
}

.field-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.field-label {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text, #1A1814);
}

.forgot-link {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 500;
    color: var(--muted, #6B6760);
    text-decoration: none;
}

.forgot-link:hover {
    color: var(--accent, #E8471A);
}

.text-input {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 500;
    background: var(--surface, #F2F0EB);
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 8px;
    padding: 0.7rem 0.9rem;
    width: 100%;
    outline: none;
    color: var(--text, #1A1814);
    transition: border-color 0.15s, background 0.15s;
}

.text-input::placeholder {
    color: var(--muted, #6B6760);
    opacity: 0.55;
}

.text-input:focus {
    border-color: var(--accent, #E8471A);
    background: #fff;
}

.btn-submit {
    width: 100%;
    margin-top: 0.25rem;
    padding: 0.8rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #FAF9F6;
    background: var(--accent, #E8471A);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s, transform 0.1s;
    min-height: 44px;
}

.btn-submit:hover:not(:disabled) {
    background: var(--accent-dk, #CF3A12);
    transform: translateY(-1px);
}

.btn-submit:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(250, 249, 246, 0.35);
    border-top-color: #FAF9F6;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.form-footer {
    text-align: center;
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    color: var(--muted, #6B6760);
}

.form-footer a {
    color: var(--accent, #E8471A);
    font-weight: 600;
    text-decoration: none;
}

.form-footer a:hover {
    text-decoration: underline;
}
</style>