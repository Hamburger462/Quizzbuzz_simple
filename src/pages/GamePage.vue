<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useQuiz, encodeChoice, decodeChoice } from '../composables/useQuiz';
import { useAuth } from '../composables/useAuth';
import { useSession } from '../composables/useSession';
import { uploadImage } from '../supabase';

import { type Question } from '../types';

const { useQuizById, deleteQuiz, updateQuiz } = useQuiz();
const { user } = useAuth();
const { createSession } = useSession();

const route = useRoute();
const router = useRouter();

const quizId = route.params.id as string;
const { quiz } = useQuizById(quizId);
const questions = ref<Array<Question>>([]);
const globalAvailable = ref<boolean>(false);
const coverImageUrl = ref<string | null>(null);

watch(quiz, () => {
    if (!quiz.value) return;
    questions.value = quiz.value.questions;
    globalAvailable.value = quiz.value.globalAvailable ?? false;
    coverImageUrl.value = quiz.value.cover_image_url ?? null;
});

const handleToggleGlobal = async () => {
    globalAvailable.value = !globalAvailable.value;
    await updateQuiz(quizId, { globalAvailable: globalAvailable.value });
};

// ── Actions ───────────────────────────────────────────────────────────────────
const saving = ref(false);
const launching = ref(false);
const showDeleteConfirm = ref(false);

const handleUpdate = async () => {
    saving.value = true;
    await updateQuiz(quizId, { questions: questions.value });
    saving.value = false;
};

const handleSession = async () => {
    if (!user.value) return;
    launching.value = true;
    const sessionId = await createSession(quizId, user.value.uid);
    router.push(`/session/${sessionId}`);
};

const handleDelete = () => {
    deleteQuiz(quizId);
};

// ── Questions ─────────────────────────────────────────────────────────────────
const handleQuestion = () => {
    const newQuestion: Question = {
        id: crypto.randomUUID(),
        text: '',
        choices: ['', '', '', ''],
        correctChoice: null,
        timeLimit: 10000,
        image_url: undefined,
    };
    questions.value.push(newQuestion);

    setTimeout(() => {
        const cards = document.querySelectorAll('.question-card');
        cards[cards.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
};

const handleRemoveQuestion = (id: string) => {
    questions.value = questions.value.filter(q => q.id !== id);
};

const handleCorrectChoice = (id: string, choiceId: number) => {
    const question = questions.value.find(v => id === v.id);
    if (!question) return;
    question.correctChoice = encodeChoice(question.choices[choiceId], quizId);
};

const handleCheckChoice = (id: string, choiceId: number): boolean => {
    const question = questions.value.find(v => id === v.id);
    if (!question?.correctChoice) return false;
    return decodeChoice(question.correctChoice) === question.choices[choiceId];
};

// ── Cover image ───────────────────────────────────────────────────────────────
const coverUploading = ref(false);
const coverError = ref('');

const handleCoverUpload = async (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    coverUploading.value = true;
    coverError.value = '';
    try {
        const url = await uploadImage(file);
        coverImageUrl.value = url;
        await updateQuiz(quizId, { cover_image_url: url });
    } catch {
        coverError.value = 'Upload failed. Please try again.';
    } finally {
        coverUploading.value = false;
        (e.target as HTMLInputElement).value = '';
    }
};

const handleCoverRemove = async () => {
    if (!coverImageUrl.value) return;
    coverImageUrl.value = null;
    await updateQuiz(quizId, { cover_image_url: null });
};

// ── Question images ───────────────────────────────────────────────────────────
const questionUploading = ref<Record<string, boolean>>({});
const questionUploadError = ref<Record<string, string>>({});

const handleQuestionImageUpload = async (e: Event, questionId: string) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    questionUploading.value[questionId] = true;
    questionUploadError.value[questionId] = '';
    try {
        const question = questions.value.find(q => q.id === questionId);
        if (!question) return;

        const url = await uploadImage(file);
        question.image_url = url;
        await updateQuiz(quizId, { questions: questions.value });
    } catch {
        questionUploadError.value[questionId] = 'Upload failed. Please try again.';
    } finally {
        questionUploading.value[questionId] = false;
        (e.target as HTMLInputElement).value = '';
    }
};

const handleQuestionImageRemove = async (questionId: string) => {
    const question = questions.value.find(q => q.id === questionId);
    if (!question?.image_url) return;

    question.image_url = undefined;
    await updateQuiz(quizId, { questions: questions.value });
};

const CHOICE_LETTERS = ['A', 'B', 'C', 'D'];
</script>

<template>
    <div v-if="quiz != null" class="game-page">

        <!-- ── Sticky toolbar ── -->
        <div class="toolbar">
            <div class="toolbar-inner">
                <div class="toolbar-left">
                    <RouterLink to="/archive" class="back-link">← Archive</RouterLink>
                    <span class="toolbar-divider"></span>
                    <h1 class="quiz-title-display">{{ quiz.title }}</h1>
                    <span class="q-count">{{ questions.length }} question{{ questions.length !== 1 ? 's' : '' }}</span>
                </div>
                <div class="toolbar-right">
                    <template v-if="user != null">
                        <template v-if="user.uid == quiz.ownerId">
                            <label class="global-toggle" :class="{ 'global-toggle--on': globalAvailable }"
                                @click.prevent="handleToggleGlobal">
                                <span class="global-toggle-track">
                                    <span class="global-toggle-thumb"></span>
                                </span>
                                <span class="global-toggle-label">{{ globalAvailable ? 'Public' : 'Private' }}</span>
                            </label>
                            <button class="btn-ghost" :disabled="saving" @click="handleUpdate">
                                <span v-if="!saving">Save</span>
                                <span v-else class="spinner spinner--dark"></span>
                            </button>
                        </template>
                    </template>
                    <button class="btn-primary" :disabled="launching || questions.length === 0" @click="handleSession">
                        <span v-if="!launching">▶ Launch session</span>
                        <span v-else class="spinner"></span>
                    </button>
                </div>
            </div>
        </div>

        <!-- ── Main content ── -->
        <div class="editor-body">
            <div class="container">

                <!-- ── Cover image ── -->
                <div class="cover-section">
                    <div v-if="coverImageUrl" class="cover-preview">
                        <img :src="coverImageUrl" alt="Quiz cover" class="cover-img" />
                        <button class="cover-remove" title="Remove cover" @click="handleCoverRemove">✕</button>
                    </div>
                    <label v-else class="cover-upload-label" :class="{ 'cover-upload-label--loading': coverUploading }">
                        <input
                            type="file"
                            accept="image/*"
                            class="file-input-hidden"
                            :disabled="coverUploading"
                            @change="handleCoverUpload"
                        />
                        <span v-if="!coverUploading" class="cover-upload-inner">
                            <span class="cover-upload-icon">🖼</span>
                            <span class="cover-upload-text">Add quiz cover image</span>
                            <span class="cover-upload-hint">PNG, JPG, WEBP · recommended 1280×720</span>
                        </span>
                        <span v-else class="spinner spinner--dark"></span>
                    </label>
                    <p v-if="coverError" class="upload-error">{{ coverError }}</p>
                </div>

                <!-- ── Questions list ── -->
                <div class="questions-list">
                    <div v-for="(question, qIndex) in questions" :key="question.id || qIndex" class="question-card"
                        :style="{ animationDelay: qIndex * 40 + 'ms' }">

                        <!-- Card header -->
                        <div class="qcard-header">
                            <span class="qcard-num">{{ qIndex + 1 }}</span>
                            <div class="qcard-meta">
                                <label class="timelimit-label">
                                    <span class="timelimit-icon">⏱</span>
                                    <input class="timelimit-input" type="number" min="5" max="300"
                                        :value="question.timeLimit / 1000"
                                        @change="(e) => question.timeLimit = Number((e.target as HTMLInputElement).value) * 1000" />
                                    <span class="timelimit-unit">s</span>
                                </label>
                            </div>
                            <button class="btn-remove" title="Remove question"
                                @click="handleRemoveQuestion(question.id)">✕</button>
                        </div>

                        <!-- Card body -->
                        <div class="qcard-body">

                            <!-- Question image -->
                            <div class="question-image-section">
                                <div v-if="question.image_url" class="question-img-preview">
                                    <img :src="question.image_url" alt="Question image" class="question-img" />
                                    <button
                                        class="question-img-remove"
                                        title="Remove image"
                                        @click="handleQuestionImageRemove(question.id)"
                                    >✕</button>
                                </div>
                                <label
                                    v-else
                                    class="question-img-upload"
                                    :class="{ 'question-img-upload--loading': questionUploading[question.id] }"
                                >
                                    <input
                                        type="file"
                                        accept="image/*"
                                        class="file-input-hidden"
                                        :disabled="questionUploading[question.id]"
                                        @change="(e) => handleQuestionImageUpload(e, question.id)"
                                    />
                                    <span v-if="!questionUploading[question.id]">
                                        <span class="question-img-upload-icon">＋</span> Add image
                                    </span>
                                    <span v-else class="spinner spinner--dark" style="width:12px;height:12px;border-width:2px;"></span>
                                </label>
                                <p v-if="questionUploadError[question.id]" class="upload-error">
                                    {{ questionUploadError[question.id] }}
                                </p>
                            </div>

                            <!-- Question text -->
                            <div class="field">
                                <label class="field-label">Question</label>
                                <textarea class="question-textarea" v-model="question.text"
                                    placeholder="Type your question here…" rows="2"></textarea>
                            </div>

                            <!-- Choices -->
                            <div class="choices-label-row">
                                <span class="field-label">Answers</span>
                                <span class="field-hint">Select the correct one</span>
                            </div>
                            <div class="choices-grid">
                                <label v-for="(_, cIndex) in question.choices" :key="cIndex" class="choice-row"
                                    :class="{ 'choice-row--correct': handleCheckChoice(question.id, cIndex) }">
                                    <input type="radio" class="choice-radio" :name="`correct-${question.id}`"
                                        :value="cIndex" :checked="handleCheckChoice(question.id, cIndex)"
                                        @change="() => handleCorrectChoice(question.id, cIndex)" />
                                    <span class="choice-letter">{{ CHOICE_LETTERS[cIndex] }}</span>
                                    <input class="choice-text-input" type="text" v-model="question.choices[cIndex]"
                                        :placeholder="`Answer ${CHOICE_LETTERS[cIndex]}`" />
                                    <span class="choice-check">✓</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Add question -->
                <button class="btn-add-question" @click="handleQuestion">
                    <span class="btn-add-icon">+</span>
                    Add question
                </button>

                <!-- Danger zone -->
                <div class="danger-zone">
                    <div class="danger-zone-inner">
                        <div class="danger-copy">
                            <p class="danger-title">Delete quiz</p>
                            <p class="danger-sub">This will permanently remove the quiz and all its questions.</p>
                        </div>
                        <div v-if="!showDeleteConfirm">
                            <button class="btn-danger-ghost" @click="showDeleteConfirm = true">
                                Delete quiz
                            </button>
                        </div>
                        <div v-else class="confirm-row">
                            <span class="confirm-label">Are you sure?</span>
                            <button class="btn-danger" @click="handleDelete">Yes, delete</button>
                            <button class="btn-ghost" @click="showDeleteConfirm = false">Cancel</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.game-page {
    min-height: 100vh;
    background: var(--bg, #FAF9F6);
    display: flex;
    flex-direction: column;
}

.container {
    max-width: 780px;
    margin: 0 auto;
    padding: 0 2rem;
    width: 100%;
}

/* ── Toolbar ── */
.toolbar {
    position: sticky;
    top: 60px;
    z-index: 50;
    background: rgba(250, 249, 246, 0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1.5px solid var(--border, #EDEBE5);
}

.toolbar-inner {
    max-width: 780px;
    margin: 0 auto;
    padding: 0 2rem;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.toolbar-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 0;
}

.back-link {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
    text-decoration: none;
    flex-shrink: 0;
    transition: color 0.15s;
}

.back-link:hover { color: var(--text, #1A1814); }

.toolbar-divider {
    width: 1px;
    height: 16px;
    background: var(--border, #EDEBE5);
    flex-shrink: 0;
}

.quiz-title-display {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: -0.015em;
    color: var(--text, #1A1814);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.q-count {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
    background: var(--surface, #F2F0EB);
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    flex-shrink: 0;
}

.toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
}

/* ── Buttons ── */
.btn-primary,
.btn-ghost,
.btn-danger,
.btn-danger-ghost {
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    border-radius: 7px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    border: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    transition: background 0.15s, transform 0.1s, border-color 0.15s;
    min-height: 36px;
    min-width: 80px;
}

.btn-primary { background: var(--accent, #E8471A); color: #FAF9F6; }
.btn-primary:hover:not(:disabled) { background: var(--accent-dk, #CF3A12); transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-ghost { background: #fff; color: var(--text, #1A1814); border: 1.5px solid var(--border, #EDEBE5); }
.btn-ghost:hover:not(:disabled) { background: var(--surface, #F2F0EB); }
.btn-ghost:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-danger { background: #B83215; color: #FAF9F6; }
.btn-danger:hover { background: #9a2910; }

.btn-danger-ghost { background: transparent; color: #B83215; border: 1.5px solid #F8C9C2; }
.btn-danger-ghost:hover { background: #FEF2F0; }

/* ── Spinner ── */
.spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(250, 249, 246, 0.35);
    border-top-color: #FAF9F6;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
}

.spinner--dark {
    border-color: rgba(26, 24, 20, 0.15);
    border-top-color: var(--text, #1A1814);
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Editor body ── */
.editor-body {
    flex: 1;
    padding: 2.5rem 0 5rem;
}

/* ── Cover image ── */
.cover-section { margin-bottom: 2rem; }

.cover-upload-label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 160px;
    border: 1.5px dashed var(--border, #EDEBE5);
    border-radius: 14px;
    cursor: pointer;
    background: #fff;
    transition: border-color 0.15s, background 0.15s;
    position: relative;
    overflow: hidden;
}

.cover-upload-label:hover:not(.cover-upload-label--loading) {
    border-color: var(--accent, #E8471A);
    background: #FDF0EC;
}

.cover-upload-label--loading { cursor: not-allowed; opacity: 0.6; }

.cover-upload-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    pointer-events: none;
}

.cover-upload-icon { font-size: 1.75rem; line-height: 1; }

.cover-upload-text {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text, #1A1814);
}

.cover-upload-hint {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    color: var(--muted, #6B6760);
}

.cover-preview {
    position: relative;
    width: 100%;
    height: 160px;
    border-radius: 14px;
    overflow: hidden;
    border: 1.5px solid var(--border, #EDEBE5);
}

.cover-img { width: 100%; height: 100%; object-fit: cover; display: block; }

.cover-remove {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: rgba(26, 24, 20, 0.55);
    border: none;
    color: #fff;
    font-size: 0.7rem;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: background 0.15s;
    backdrop-filter: blur(4px);
}

.cover-remove:hover { background: #B83215; }

/* ── Question images ── */
.question-image-section {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.question-img-preview {
    position: relative;
    width: 100%;
    max-height: 240px;
    border-radius: 10px;
    overflow: hidden;
    border: 1.5px solid var(--border, #EDEBE5);
}

.question-img {
    width: 100%;
    max-height: 240px;
    object-fit: cover;
    display: block;
}

.question-img-remove {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: rgba(26, 24, 20, 0.55);
    border: none;
    color: #fff;
    font-size: 0.65rem;
    cursor: pointer;
    display: grid;
    place-items: center;
    transition: background 0.15s;
    backdrop-filter: blur(4px);
}

.question-img-remove:hover { background: #B83215; }

.question-img-upload {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.35rem 0.75rem;
    border: 1.5px dashed var(--border, #EDEBE5);
    border-radius: 7px;
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
    cursor: pointer;
    background: transparent;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
    align-self: flex-start;
    position: relative;
}

.question-img-upload:hover:not(.question-img-upload--loading) {
    border-color: var(--accent, #E8471A);
    color: var(--accent, #E8471A);
    background: #FDF0EC;
}

.question-img-upload--loading { cursor: not-allowed; opacity: 0.6; }
.question-img-upload-icon { font-size: 0.9rem; line-height: 1; }

/* ── Shared upload helpers ── */
.file-input-hidden {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
}

.upload-error {
    font-family: 'Manrope', sans-serif;
    font-size: 0.78rem;
    color: #B83215;
    margin-top: 0.2rem;
}

/* ── Question cards ── */
.questions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1rem;
}

.question-card {
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 14px;
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
    transition: border-color 0.15s;
}

.question-card:focus-within { border-color: rgba(232, 71, 26, 0.4); }

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}

.qcard-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.85rem 1.25rem;
    border-bottom: 1.5px solid var(--border, #EDEBE5);
    background: var(--surface, #F2F0EB);
}

.qcard-num {
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 800;
    color: var(--muted, #6B6760);
    width: 22px;
    flex-shrink: 0;
}

.qcard-meta {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.timelimit-label {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    cursor: text;
}

.timelimit-icon { font-size: 0.8rem; }

.timelimit-input {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 700;
    color: var(--text, #1A1814);
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 5px;
    padding: 0.15rem 0.35rem;
    width: 3.5rem;
    text-align: center;
    outline: none;
    transition: border-color 0.15s;
    -moz-appearance: textfield;
}

.timelimit-input::-webkit-outer-spin-button,
.timelimit-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.timelimit-input:focus { border-color: var(--accent, #E8471A); }

.timelimit-unit {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
}

.btn-remove {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.8rem;
    color: var(--muted, #6B6760);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    line-height: 1;
    transition: color 0.15s, background 0.15s;
    margin-left: auto;
}

.btn-remove:hover { color: #B83215; background: #FEF2F0; }

.qcard-body {
    padding: 1.5rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
}

.field { display: flex; flex-direction: column; gap: 0.4rem; }

.field-label {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--muted, #6B6760);
}

.question-textarea {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text, #1A1814);
    background: var(--surface, #F2F0EB);
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 8px;
    padding: 0.75rem 0.9rem;
    width: 100%;
    resize: vertical;
    outline: none;
    line-height: 1.4;
    transition: border-color 0.15s, background 0.15s;
}

.question-textarea::placeholder { color: var(--muted, #6B6760); opacity: 0.5; font-weight: 600; }
.question-textarea:focus { border-color: var(--accent, #E8471A); background: #fff; }

.choices-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.field-hint {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    color: var(--muted, #6B6760);
    font-style: italic;
}

.choices-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }

.choice-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 0.75rem;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    position: relative;
}

.choice-row:hover { border-color: rgba(232, 71, 26, 0.35); }
.choice-row--correct { background: #FDF0EC; border-color: var(--accent, #E8471A); }
.choice-radio { position: absolute; opacity: 0; pointer-events: none; }

.choice-letter {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: var(--surface, #F2F0EB);
    border: 1.5px solid var(--border, #EDEBE5);
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 800;
    color: var(--muted, #6B6760);
    display: grid;
    place-items: center;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.choice-row--correct .choice-letter {
    background: var(--accent, #E8471A);
    color: #FAF9F6;
    border-color: var(--accent, #E8471A);
}

.choice-text-input {
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text, #1A1814);
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    min-width: 0;
}

.choice-text-input::placeholder { color: var(--muted, #6B6760); opacity: 0.5; }

.choice-check {
    font-size: 0.75rem;
    color: var(--accent, #E8471A);
    opacity: 0;
    flex-shrink: 0;
    transition: opacity 0.15s;
}

.choice-row--correct .choice-check { opacity: 1; }

/* ── Add question ── */
.btn-add-question {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.9rem;
    background: #fff;
    border: 1.5px dashed var(--border, #EDEBE5);
    border-radius: 12px;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
}

.btn-add-question:hover {
    border-color: var(--accent, #E8471A);
    color: var(--accent, #E8471A);
    background: #FDF0EC;
}

.btn-add-icon { font-size: 1.2rem; line-height: 1; }

/* ── Danger zone ── */
.danger-zone {
    margin-top: 3.5rem;
    border: 1.5px solid #F8C9C2;
    border-radius: 12px;
    overflow: hidden;
}

.danger-zone-inner {
    padding: 1.25rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    flex-wrap: wrap;
}

.danger-title {
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 700;
    color: #B83215;
    margin-bottom: 0.2rem;
}

.danger-sub {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    color: var(--muted, #6B6760);
    line-height: 1.5;
}

.confirm-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

/* ── Global toggle ── */
.global-toggle {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
    padding: 0.3rem 0.5rem;
    border-radius: 6px;
    transition: background 0.15s;
}

.global-toggle:hover { background: var(--surface, #F2F0EB); }

.global-toggle-track {
    position: relative;
    width: 32px;
    height: 18px;
    border-radius: 9px;
    background: var(--border, #EDEBE5);
    flex-shrink: 0;
    transition: background 0.2s;
}

.global-toggle--on .global-toggle-track { background: var(--accent, #E8471A); }

.global-toggle-thumb {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    transition: transform 0.2s;
}

.global-toggle--on .global-toggle-thumb { transform: translateX(14px); }

.global-toggle-label {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
    min-width: 42px;
    transition: color 0.15s;
}

.global-toggle--on .global-toggle-label { color: var(--accent, #E8471A); }
</style>