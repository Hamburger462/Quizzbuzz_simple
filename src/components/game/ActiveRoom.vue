<script setup lang="ts">
import Leaderboard from './Leaderboard.vue';
import QuestionPlayer from './QuestionPlayer.vue';

defineProps<{
    isHost: boolean;
    hasPlayerFinished: boolean | undefined;
    questions: {
        id: string;
        text: string;
        choices: string[];
        timeLimit: number;
        image_url?: string;
    }[] | null;
    answers: Record<string, { startedAt?: number }>;
    correctAnswer: string;
    questionOrder: number;
    players: { nickname: string; score: number }[];
    hasFinishedQuestion: boolean;
    hasFinishedQuiz: boolean;
    currentStake: number;
}>();

const emit = defineEmits<{
    (e: 'start',    payload: { questionId: string }): void;
    (e: 'answer',   payload: { questionId: string; choice: string; remainingRatio: number }): void;
    (e: 'advance'): void;
    (e: 'setStake', value: number): void;
}>();

const handleStart    = (payload: { questionId: string }) => emit('start', payload);
const handleSelect   = (payload: { questionId: string; choice: string; remainingRatio: number }) => emit('answer', payload);
const handleAdvance  = () => emit('advance');
const handleSetStake = (value: number) => emit('setStake', value);
</script>

<template>
    <!-- Host view -->
    <div v-if="isHost" class="host-view">
        <div class="host-card">
            <div class="host-icon">👁</div>
            <h2>Host view</h2>
            <p>You're running this session. Players are answering questions live.</p>
            <Leaderboard :players="players" :has-finished-quiz="hasFinishedQuiz" @advance="handleAdvance" />
        </div>
    </div>

    <!-- Player view -->
    <div v-else>
        <div v-if="hasPlayerFinished !== true">
            <template v-if="hasFinishedQuestion !== true">
                <QuestionPlayer
                    v-for="(question, qIndex) in questions"
                    :key="question.id"
                    :question="question"
                    :index="qIndex"
                    :active="questionOrder === qIndex"
                    :started-at="answers[question.id] ? answers[question.id].startedAt : null"
                    :current-stake="currentStake"
                    :correct-answer="correctAnswer"
                    @start="handleStart"
                    @select="handleSelect"
                    @set-stake="handleSetStake"
                />
            </template>

            <Leaderboard v-else :players="players" :has-finished-quiz="hasFinishedQuiz" @advance="handleAdvance" />
        </div>

        <div v-else class="finished-wrap">
            <div class="finished-card">
                <div class="finished-icon">🏁</div>
                <h2>You finished!</h2>
                <p>Great game. Wait for the final results or check the leaderboard.</p>
                <Leaderboard :players="players" :has-finished-quiz="true" @advance="handleAdvance" />
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.host-view {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 3rem 2rem;
    background: var(--bg, #FAF9F6);
}

.host-card {
    width: 100%;
    max-width: 560px;
    text-align: center;
}

.host-icon, .finished-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }

.host-card h2, .finished-card h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.75rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--text, #1A1814);
    margin-bottom: 0.4rem;
}

.host-card p, .finished-card p {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    color: var(--muted, #6B6760);
    margin-bottom: 2rem;
}

.finished-wrap {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 3rem 2rem;
    background: var(--bg, #FAF9F6);
}

.finished-card {
    width: 100%;
    max-width: 560px;
    text-align: center;
}
</style>