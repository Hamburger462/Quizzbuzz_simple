<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuth } from '../composables/useAuth';
import { useQuiz, subscribeToUserQuizzes } from '../composables/useQuiz';

const router = useRouter();

const { user } = useAuth();
const { createQuiz } = useQuiz();

const title = ref<string>("");
const quizzes = ref<any>([]);
const creating = ref(false);
const showForm = ref(false);

const unsubscribe = subscribeToUserQuizzes(user.value?.uid as string, (data: any) => {
    quizzes.value = data;
});

onUnmounted(() => unsubscribe());

const handleCreate = async (event: PointerEvent) => {
    event.preventDefault();
    if (!user.value || !title.value.trim()) return;
    creating.value = true;
    try {
        const quizId = await createQuiz(title.value, user.value.uid);
        goToGamePage(quizId);
    } finally {
        creating.value = false;
    }
};

const goToGamePage = (quizId: string): void => {
    router.push(`/game/${quizId}`);
};
</script>

<template>
    <div class="archive-page">
        <div class="container">

            <!-- Page header -->
            <div class="page-header">
                <div class="page-header-copy">
                    <p class="eyebrow">Your quizzes</p>
                    <h1>Archive</h1>
                </div>
                <button class="btn-new" @click="showForm = !showForm">
                    <span class="btn-new-icon">{{ showForm ? '✕' : '+' }}</span>
                    {{ showForm ? 'Cancel' : 'New quiz' }}
                </button>
            </div>

            <!-- Create form (toggled) -->
            <Transition name="slide">
                <div v-if="showForm" class="create-panel">
                    <form class="create-form" @submit.prevent>
                        <div class="field">
                            <label class="field-label" for="quiz-title">Quiz title</label>
                            <input
                                id="quiz-title"
                                class="text-input"
                                type="text"
                                placeholder="e.g. World Geography 101"
                                v-model="title"
                                @keyup.enter="handleCreate"
                                autofocus
                            />
                        </div>
                        <button
                            class="btn-create"
                            :disabled="creating || !title.trim()"
                            @click="handleCreate"
                        >
                            <span v-if="!creating">Create & edit →</span>
                            <span v-else class="spinner"></span>
                        </button>
                    </form>
                </div>
            </Transition>

            <!-- Empty state -->
            <div v-if="quizzes.length === 0" class="empty-state">
                <div class="empty-icon">📋</div>
                <h3>No quizzes yet</h3>
                <p>Create your first quiz and it'll appear here.</p>
                <button class="btn-new btn-new--inline" @click="showForm = true">
                    <span class="btn-new-icon">+</span>
                    New quiz
                </button>
            </div>

            <!-- Quiz grid -->
            <div v-else class="quiz-grid">
                <div
                    v-for="(quiz, i) in quizzes"
                    :key="quiz.id"
                    class="quiz-card"
                    :style="{ animationDelay: i * 40 + 'ms' }"
                    @click="goToGamePage(quiz.id)"
                >
                    <div class="quiz-card-inner">
                        <div class="quiz-card-top">
                            <div class="quiz-initial">{{ quiz.title?.charAt(0)?.toUpperCase() ?? '?' }}</div>
                            <span class="quiz-arrow">→</span>
                        </div>
                        <p class="quiz-title">{{ quiz.title }}</p>
                        <p v-if="quiz.questionCount != null" class="quiz-meta">
                            {{ quiz.questionCount }} question{{ quiz.questionCount !== 1 ? 's' : '' }}
                        </p>
                        <p v-else class="quiz-meta">Open to edit</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.archive-page {
    min-height: calc(100vh - 60px);
    background: var(--bg, #FAF9F6);
    padding: 3.5rem 0 5rem;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2.5rem;
}

/* ── Page header ── */
.page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 2rem;
    gap: 1rem;
}

.eyebrow {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent, #E8471A);
    margin-bottom: 0.3rem;
}

h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text, #1A1814);
    line-height: 1;
}

.btn-new {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text, #1A1814);
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 8px;
    padding: 0.55rem 1rem;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
    flex-shrink: 0;
}

.btn-new:hover {
    background: var(--surface, #F2F0EB);
    transform: translateY(-1px);
}

.btn-new--inline {
    margin-top: 1.25rem;
}

.btn-new-icon {
    font-size: 1rem;
    line-height: 1;
    font-style: normal;
}

/* ── Create panel ── */
.create-panel {
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 12px;
    padding: 1.75rem 2rem;
    margin-bottom: 2rem;
}

.create-form {
    display: flex;
    gap: 0.85rem;
    align-items: flex-end;
}

.field {
    flex: 1;
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

.btn-create {
    padding: 0.7rem 1.4rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #FAF9F6;
    background: var(--accent, #E8471A);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 148px;
    min-height: 42px;
    transition: background 0.15s, transform 0.1s;
    flex-shrink: 0;
}

.btn-create:hover:not(:disabled) {
    background: var(--accent-dk, #CF3A12);
    transform: translateY(-1px);
}

.btn-create:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(250, 249, 246, 0.35);
    border-top-color: #FAF9F6;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Slide transition ── */
.slide-enter-active,
.slide-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

/* ── Empty state ── */
.empty-state {
    text-align: center;
    padding: 5rem 2rem;
    border: 1.5px dashed var(--border, #EDEBE5);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.empty-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

.empty-state h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text, #1A1814);
    margin-bottom: 0.4rem;
    letter-spacing: -0.02em;
}

.empty-state p {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    color: var(--muted, #6B6760);
}

/* ── Quiz grid ── */
.quiz-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
}

.quiz-card {
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 12px;
    cursor: pointer;
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
    transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}

.quiz-card:hover {
    border-color: var(--accent, #E8471A);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(26, 24, 20, 0.08);
}

.quiz-card-inner {
    padding: 1.5rem;
}

.quiz-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.quiz-initial {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: #FDF0EC;
    color: var(--accent, #E8471A);
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    display: grid;
    place-items: center;
}

.quiz-arrow {
    font-size: 1rem;
    color: var(--border, #EDEBE5);
    transition: color 0.15s, transform 0.15s;
}

.quiz-card:hover .quiz-arrow {
    color: var(--accent, #E8471A);
    transform: translateX(3px);
}

.quiz-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    color: var(--text, #1A1814);
    letter-spacing: -0.01em;
    line-height: 1.3;
    margin-bottom: 0.35rem;
}

.quiz-meta {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    color: var(--muted, #6B6760);
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}
</style>