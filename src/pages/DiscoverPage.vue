<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { usePublicQuizzes } from '../composables/useQuiz';

const router = useRouter();

// ── Data ──────────────────────────────────────────────────────────────────────
// All Firestore logic is now encapsulated in this composable
const { quizzes, loading, error } = usePublicQuizzes();

// ── Search / filter ───────────────────────────────────────────────────────────
const search = ref('');

const filtered = computed(() => {
    const q = search.value.trim().toLowerCase();
    if (!q) return quizzes.value;
    return quizzes.value.filter(quiz =>
        quiz.title.toLowerCase().includes(q)
    );
});

// ── Actions ───────────────────────────────────────────────────────────────────
const handlePlay = (quizId?: string) => {
    if (!quizId) return;
    router.push(`/game/${quizId}`);
};
</script>

<template>
    <div class="discover-page">
        <div class="container">

            <div class="page-header">
                <div>
                    <p class="eyebrow">Community</p>
                    <h1>Discover</h1>
                </div>
                <p class="page-sub">Browse quizzes shared by the community and launch a session in one click.</p>
            </div>

            <div class="search-row">
                <div class="search-wrap">
                    <span class="search-icon">⌕</span>
                    <input
                        class="search-input"
                        type="text"
                        placeholder="Search quizzes…"
                        v-model="search"
                    />
                    <button
                        v-if="search"
                        class="search-clear"
                        @click="search = ''"
                    >✕</button>
                </div>
                <span class="result-count" v-if="!loading">
                    {{ filtered.length }} quiz{{ filtered.length !== 1 ? 'zes' : '' }}
                </span>
            </div>

            <div v-if="loading" class="state-block">
                <span class="spinner"></span>
            </div>

            <div v-else-if="error" class="state-block">
                <div class="error-banner">{{ error }}</div>
            </div>

            <div v-else-if="quizzes.length === 0" class="empty-state">
                <div class="empty-icon">🔍</div>
                <h3>Nothing here yet</h3>
                <p>Be the first to make a quiz public from your Archive.</p>
                <RouterLink to="/archive" class="btn-primary">Go to Archive</RouterLink>
            </div>

            <div v-else-if="filtered.length === 0" class="empty-state">
                <div class="empty-icon">🤷</div>
                <h3>No matches</h3>
                <p>Try a different search term.</p>
                <button class="btn-ghost" @click="search = ''">Clear search</button>
            </div>

            <div v-else class="quiz-grid">
                <div
                    v-for="(quiz, i) in filtered"
                    :key="quiz.id"
                    class="quiz-card"
                    :style="{ animationDelay: i * 35 + 'ms', backgroundImage: `url(${quiz.cover_image_url})`, }"
                >
                    <div class="quiz-card-inner">
                        <div class="quiz-top">
                            <div class="quiz-initial">
                                {{ quiz.title?.charAt(0)?.toUpperCase() ?? '?' }}
                            </div>
                            <span class="quiz-public-badge">Public</span>
                        </div>

                        <p class="quiz-title">{{ quiz.title }}</p>

                        <p class="quiz-meta">
                            {{ quiz.questions?.length ?? 0 }} question{{ (quiz.questions?.length ?? 0) !== 1 ? 's' : '' }}
                        </p>

                        <button class="btn-play" @click="handlePlay(quiz.id)">
                            ▶ Play
                        </button>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.discover-page {
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
    gap: 2rem;
    margin-bottom: 2.25rem;
    flex-wrap: wrap;
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

.page-sub {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    color: var(--muted, #6B6760);
    line-height: 1.6;
    max-width: 380px;
    text-align: right;
}

/* ── Search ── */
.search-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
}

.search-wrap {
    position: relative;
    flex: 1;
    max-width: 480px;
}

.search-icon {
    position: absolute;
    left: 0.85rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.1rem;
    color: var(--muted, #6B6760);
    pointer-events: none;
    line-height: 1;
}

.search-input {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 500;
    width: 100%;
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 8px;
    padding: 0.65rem 2.5rem 0.65rem 2.25rem;
    outline: none;
    color: var(--text, #1A1814);
    transition: border-color 0.15s;
}
.search-input::placeholder { color: var(--muted, #6B6760); opacity: 0.6; }
.search-input:focus { border-color: var(--accent, #E8471A); }

.search-clear {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.75rem;
    color: var(--muted, #6B6760);
    padding: 0.2rem;
    line-height: 1;
    transition: color 0.15s;
}
.search-clear:hover { color: var(--text, #1A1814); }

.result-count {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
    white-space: nowrap;
}

/* ── States ── */
.state-block {
    display: flex;
    justify-content: center;
    padding: 5rem 0;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--border, #EDEBE5);
    border-top-color: var(--accent, #E8471A);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

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

.empty-state {
    text-align: center;
    padding: 5rem 2rem;
    border: 1.5px dashed var(--border, #EDEBE5);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.65rem;
}

.empty-icon { font-size: 2.5rem; }

.empty-state h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--text, #1A1814);
    letter-spacing: -0.02em;
}

.empty-state p {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    color: var(--muted, #6B6760);
    margin-bottom: 0.5rem;
}

/* ── Buttons ── */
.btn-primary {
    display: inline-flex;
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: #FAF9F6;
    background: var(--accent, #E8471A);
    text-decoration: none;
    padding: 0.6rem 1.25rem;
    border-radius: 7px;
    border: none;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
}
.btn-primary:hover { background: var(--accent-dk, #CF3A12); transform: translateY(-1px); }

.btn-ghost {
    display: inline-flex;
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text, #1A1814);
    background: transparent;
    padding: 0.6rem 1.25rem;
    border-radius: 7px;
    border: 1.5px solid var(--border, #EDEBE5);
    cursor: pointer;
    transition: background 0.15s;
}
.btn-ghost:hover { background: var(--surface, #F2F0EB); }

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
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
    transition: border-color 0.15s, transform 0.15s, box-shadow 0.15s;
}

.quiz-card:hover {
    border-color: var(--accent, #E8471A);
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(26, 24, 20, 0.08);
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
}

.quiz-card-inner {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    backdrop-filter: blur(20px);
}

.quiz-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
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
    flex-shrink: 0;
}

.quiz-public-badge {
    font-family: 'Manrope', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #166534;
    background: #DCFCE7;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
}

.quiz-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text, #1A1814);
    letter-spacing: -0.01em;
    line-height: 1.3;
}

.quiz-meta {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    color: var(--muted, #6B6760);
    flex: 1;
}

.btn-play {
    margin-top: 0.75rem;
    width: 100%;
    padding: 0.6rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--accent, #E8471A);
    background: #FDF0EC;
    border: 1.5px solid transparent;
    border-radius: 7px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
}

.quiz-card:hover .btn-play {
    background: var(--accent, #E8471A);
    color: #FAF9F6;
}
</style>