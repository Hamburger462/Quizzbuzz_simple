<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuth } from '../composables/useAuth';
import { useSession, shuffleQuestions } from '../composables/useSession';
import { useQuiz, decodeChoice } from '../composables/useQuiz';
import { usePlayers } from '../composables/usePlayer';
import type { Quiz, Question, Player, Answer } from '../types';

import WaitingRoom from '../components/game/WaitingRoom.vue';
import ActiveRoom from '../components/game/ActiveRoom.vue';

const route = useRoute();
const router = useRouter();
const sessionCode = route.params.id;

const { user, loginAnonymously } = useAuth();
const { useSessionByCode, changeSessionStatus } = useSession();
const { addPlayer, usePlayersBySession, addPlayerAnswer, addPlayerScore, changePlayerStatus, usePlayerById } = usePlayers();
const { readQuiz } = useQuiz();

const { session, loading } = useSessionByCode(sessionCode as string);
let quiz: Quiz | null;
const questions = ref<Array<Question> | null>([]);

const { players } = usePlayersBySession(sessionCode as string);
const player = ref<Player | null>(null);

const answers = ref<Record<string, Answer>>({});
const currentStake = ref<number>(1);
const score = ref<number>(0);
const questionOrder = ref<number>(0);
const hasFinishedQuestion = ref<boolean>(false);
const hasFinishedQuiz = ref<boolean>(false);

watch(user, () => {
    if (!user.value) return;
    player.value = usePlayerById(sessionCode as string, user.value?.uid).player.value;
});

watch(loading, () => {
    if (loading.value) return;
    if (session.value != null) return;
    router.push({ path: "/session", query: { error: "incorrect_code" } });
});

watch(loading, async () => {
    if (loading.value) return;
    if (session.value == null) return;
    quiz = await readQuiz(session.value?.quizId);
    if (!quiz) return;
    questions.value = shuffleQuestions(quiz.questions);
});

const tempUserName = ref<string>("");

const handleCreateTempUser = async () => {
    await loginAnonymously();
    addPlayer(sessionCode as string, tempUserName.value);
};

const handleStartSession = () => {
    changeSessionStatus(sessionCode as string, "active");
};

// Called by ActiveRoom when the player picks a stake tile
const handleSetStake = (value: number) => {
    currentStake.value = value;
};

const handleAnswerQuestion = (payload: { questionId: string; choice: string; remainingRatio: number }) => {
    if (!user.value) return;
    const { questionId, choice, remainingRatio } = payload;

    answers.value[questionId] = { selected: choice, answeredAt: Date.now() };
    addPlayerAnswer(sessionCode as string, user.value.uid, answers.value);

    const points = Math.round(1000 * remainingRatio * currentStake.value);
    if (validateAnswer(questionId, choice) || choice !== '') score.value += points;
    else score.value -= points;

    addPlayerScore(sessionCode as string, user.value.uid, score.value);
    questionOrder.value++;
    hasFinishedQuestion.value = true;
};

const handleStartQuestion = (payload: { questionId: string }) => {
    if (!user.value) return;
    const startedAt = Date.now();
    answers.value[payload.questionId] = { ...answers.value[payload.questionId], startedAt };
    addPlayerAnswer(sessionCode as string, user.value.uid, answers.value);
};

const handleLeaderboardAdvance = () => {
    hasFinishedQuestion.value = false;
};

const validateAnswer = (questionId: string, choice: string): boolean => {
    const targetQuestion = quiz?.questions.find((q) => q.id === questionId);
    if (!targetQuestion?.correctChoice) return false;
    return decodeChoice(targetQuestion.correctChoice) === choice;
};

watch(questionOrder, () => {
    if (!user.value) return;
    if (questionOrder.value === questions.value?.length) {
        hasFinishedQuiz.value = true;
        changePlayerStatus(sessionCode as string, user.value.uid, true);
    }
});
</script>

<template>
    <!-- Loading -->
    <div v-if="loading" class="state-screen">
        <span class="spinner"></span>
        <p>Loading session…</p>
    </div>

    <!-- Session found -->
    <template v-else-if="session != null">

        <!-- Logged in -->
        <template v-if="user != null">
            <WaitingRoom
                v-if="session.status === 'waiting'"
                :sessionCode="sessionCode as string"
                :players="players"
                :isHost="user.uid === session.hostUid"
                @start="handleStartSession"
            />

            <ActiveRoom
                v-else-if="session.status === 'active'"
                :isHost="user.uid === session.hostUid"
                :has-player-finished="player?.finished"
                :questions="questions"
                :answers="answers"
                :questionOrder="questionOrder"
                :players="players"
                :has-finished-question="hasFinishedQuestion"
                :has-finished-quiz="hasFinishedQuiz"
                :current-stake="currentStake"
                @start="handleStartQuestion"
                @answer="handleAnswerQuestion"
                @advance="handleLeaderboardAdvance"
                @set-stake="handleSetStake"
            />
        </template>

        <!-- Guest join form -->
        <div v-else class="state-screen">
            <div class="join-card">
                <div class="join-icon">👋</div>
                <h2>Choose a nickname</h2>
                <p>You're joining session <strong>{{ sessionCode }}</strong>. Pick a name to get started.</p>

                <div class="field">
                    <label class="field-label" for="username">Your nickname</label>
                    <input
                        id="username"
                        class="text-input"
                        type="text"
                        name="username"
                        v-model="tempUserName"
                        placeholder="e.g. QuizWizard99"
                        @keyup.enter="handleCreateTempUser"
                    />
                </div>

                <button class="btn-primary" :disabled="!tempUserName.trim()" @click="handleCreateTempUser">
                    Join session →
                </button>
            </div>
        </div>

    </template>

    <!-- Invalid code -->
    <div v-else class="state-screen">
        <div class="error-card">
            <div class="error-icon">⚠️</div>
            <h2>Session not found</h2>
            <p>That code doesn't match any active session. Check the code and try again.</p>
            <RouterLink to="/session" class="btn-primary">Try another code</RouterLink>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.state-screen {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 2rem;
    background: var(--bg, #FAF9F6);
}

.spinner {
    width: 36px;
    height: 36px;
    border: 3px solid var(--border, #EDEBE5);
    border-top-color: var(--accent, #E8471A);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.state-screen > p {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    color: var(--muted, #6B6760);
}

.join-card, .error-card {
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 16px;
    padding: 2.75rem 3rem;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    animation: fadeUp 0.3s ease both;
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
}

.join-icon, .error-icon { font-size: 2rem; }

.join-card h2, .error-card h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--text, #1A1814);
}

.join-card p, .error-card p {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    color: var(--muted, #6B6760);
    line-height: 1.6;
}

.join-card p strong {
    color: var(--text, #1A1814);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
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
    background: var(--surface, #F2F0EB);
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 8px;
    padding: 0.7rem 0.9rem;
    width: 100%;
    outline: none;
    color: var(--text, #1A1814);
    transition: border-color 0.15s, background 0.15s;
}

.text-input::placeholder { color: var(--muted, #6B6760); opacity: 0.6; }
.text-input:focus { border-color: var(--accent, #E8471A); background: #fff; }

.btn-primary {
    display: inline-flex;
    justify-content: center;
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
    text-decoration: none;
    transition: background 0.15s, transform 0.1s;
}

.btn-primary:hover:not(:disabled) { background: var(--accent-dk, #CF3A12); transform: translateY(-1px); }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
</style>