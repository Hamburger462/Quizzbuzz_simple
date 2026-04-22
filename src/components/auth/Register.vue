<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const { register } = useAuth();
const router = useRouter();

const email   = ref<string>("");
const username = ref<string>("");
const pass    = ref<string>("");
const confirm = ref<string>("");
const error   = ref<string>("");
const loading = ref(false);

const handleInput = async (event: PointerEvent) => {
    event.preventDefault();
    error.value = "";

    if (!email.value || !pass.value || !username.value) return;

    if (pass.value !== confirm.value) {
        error.value = "Passwords don't match.";
        return;
    }

    if (pass.value.length < 6) {
        error.value = "Password must be at least 6 characters.";
        return;
    }

    loading.value = true;
    try {
        console.log("Registering")
        await register(email.value, pass.value, username.value);
        console.log("Redirecting")
        router.push("/archive");
    } catch (e: any) {
        error.value = "Couldn't create account. That email may already be in use.";
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="form-wrap">
        <div class="form-header">
            <h2>Create account</h2>
            <p>Free forever. Host unlimited games and track your history.</p>
        </div>

        <div v-if="error" class="error-banner">{{ error }}</div>

        <form class="auth-form" @submit.prevent>
            <div class="field">
                <label class="field-label" for="reg-name">Username</label>
                <input
                    id="reg-name"
                    class="text-input"
                    type="text"
                    name="name"
                    placeholder="username"
                    v-model="username"
                />
            </div>

            <div class="field">
                <label class="field-label" for="reg-email">Email</label>
                <input
                    id="reg-email"
                    class="text-input"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    v-model="email"
                />
            </div>

            <div class="field">
                <label class="field-label" for="reg-pass">Password</label>
                <input
                    id="reg-pass"
                    class="text-input"
                    type="password"
                    name="password"
                    placeholder="At least 6 characters"
                    autocomplete="new-password"
                    v-model="pass"
                />
            </div>

            <div class="field">
                <label class="field-label" for="reg-confirm">Confirm password</label>
                <input
                    id="reg-confirm"
                    class="text-input"
                    type="password"
                    name="confirm"
                    placeholder="Repeat your password"
                    autocomplete="new-password"
                    v-model="confirm"
                    :class="{ mismatch: confirm && pass !== confirm }"
                />
                <p v-if="confirm && pass !== confirm" class="field-hint">Passwords don't match</p>
            </div>

            <button
                class="btn-submit"
                :disabled="loading || !email || !pass || !confirm || pass !== confirm"
                @click="handleInput"
            >
                <span v-if="!loading">Create account →</span>
                <span v-else class="spinner"></span>
            </button>
        </form>

        <p class="form-footer">
            Already have an account?
            <RouterLink to="/auth/login">Log in</RouterLink>
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

.field-label {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text, #1A1814);
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

.text-input.mismatch {
    border-color: #E8471A;
    background: #FEF2F0;
}

.field-hint {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    color: var(--accent, #E8471A);
    font-weight: 500;
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