<script setup lang="ts">
import { watch, computed, ref } from 'vue';
import { useQuizTimer } from '../../composables/usePlayer';
import StakeSelector from './StakeSelector.vue';

const props = defineProps<{
    question: {
        id: string;
        text: string;
        timeLimit: number;
        choices: string[];
    };
    startedAt?: number | null;
    index: number;
    active: boolean;
    currentStake: number;
}>();

const emit = defineEmits<{
    (e: 'start',      payload: { questionId: string }): void;
    (e: 'select',     payload: { questionId: string; choice: string; remainingRatio: number }): void;
    (e: 'setStake',   value: number): void;
}>();

// ── Stake gate ──────────────────────────────────────────────────────────────
// stakeConfirmed starts false each time a new question becomes active.
// The question + timer are hidden until the player confirms their stake.
const stakeConfirmed = ref(false);

watch(
    () => props.active,
    (isActive) => {
        if (isActive) stakeConfirmed.value = false; // reset for every new question
    },
    { immediate: true }
);

const handleConfirmStake = () => {
    stakeConfirmed.value = true;
    // Only NOW do we tell the parent to write startedAt — starting the timer.
    emit('start', { questionId: props.question.id });
};

// ── Timer ────────────────────────────────────────────────────────────────────
const { startTimer, stopTimer, remainingTime, isExpired } = useQuizTimer({ qDuration: props.question.timeLimit });

// Timer starts only after stake is confirmed AND startedAt arrives from Firestore.
watch(
    () => props.startedAt,
    (startedAt) => {
        if (props.active && stakeConfirmed.value && startedAt != null) {
            startTimer(startedAt);
        }
    }
);

watch(isExpired, () => {
    if (isExpired) {
        emit('select', {
            questionId: props.question.id,
            choice: '',
            remainingRatio: getRoundedRatio() || 0,
        });
    }
});

// ── Helpers ───────────────────────────────────────────────────────────────────
const getRoundedRatio = () => {
    if (!remainingTime.value) return 0;
    const raw = remainingTime.value / props.question.timeLimit;
    return Math.round(raw * 10000) / 10000;
};

const handleSelect = (choice: string) => {
    emit('select', { questionId: props.question.id, choice, remainingRatio: getRoundedRatio() });
    stopTimer();
};

const timerPct = computed(() => {
    if (!props.question.timeLimit) return 0;
    return Math.min(100, (remainingTime.value / props.question.timeLimit) * 100);
});

const timerColor = computed(() => {
    if (timerPct.value > 50) return '#28A745';
    if (timerPct.value > 25) return '#F59E0B';
    return '#E8471A';
});
</script>

<template>
    <div v-if="active">

        <!-- ① Stake selector — shown until player confirms -->
        <StakeSelector
            v-if="!stakeConfirmed"
            :current-stake="currentStake"
            @select="emit('setStake', $event)"
            @confirm="handleConfirmStake"
        />

        <!-- ② Question — revealed only after stake is locked in -->
        <div v-else class="question-wrap">
            <div class="question-card">

                <div class="timer-track">
                    <div
                        class="timer-bar"
                        :style="{ width: timerPct + '%', background: timerColor }"
                    ></div>
                </div>

                <div class="q-meta">
                    <span class="q-num">Question {{ index + 1 }}</span>
                    <span class="q-stake">Stake ×{{ currentStake }}</span>
                    <span class="q-time" :style="{ color: timerColor }">
                        {{ Math.ceil(remainingTime / 1000) }}s
                    </span>
                </div>

                <p class="q-text">{{ question.text }}</p>

                <div class="choices">
                    <label
                        v-for="(choice, cIndex) in question.choices"
                        :key="cIndex"
                        class="choice-label"
                    >
                        <input
                            type="radio"
                            :name="`question-${index}`"
                            class="choice-radio"
                            @change="handleSelect(choice)"
                        />
                        <span class="choice-marker">{{ String.fromCharCode(65 + cIndex) }}</span>
                        <span class="choice-text">{{ choice }}</span>
                    </label>
                </div>

            </div>
        </div>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.question-wrap {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--bg, #FAF9F6);
}

.question-card {
    width: 100%;
    max-width: 640px;
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 16px;
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
}

.timer-track {
    height: 5px;
    background: var(--surface, #F2F0EB);
    width: 100%;
}

.timer-bar {
    height: 100%;
    border-radius: 0 3px 3px 0;
    transition: width 0.18s linear, background 0.4s ease;
}

.q-meta {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 1.25rem 1.75rem 0;
}

.q-num {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--muted, #6B6760);
    flex: 1;
}

.q-stake {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--accent, #E8471A);
    background: #FDF0EC;
    padding: 0.2rem 0.55rem;
    border-radius: 20px;
}

.q-time {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    transition: color 0.4s ease;
}

.q-text {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.1rem, 3vw, 1.5rem);
    font-weight: 700;
    color: var(--text, #1A1814);
    letter-spacing: -0.02em;
    line-height: 1.3;
    padding: 1rem 1.75rem 1.5rem;
}

.choices {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    padding: 0 1.75rem 1.75rem;
}

.choice-label {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.85rem 1rem;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
    position: relative;
}

.choice-label:hover {
    border-color: var(--accent, #E8471A);
    background: #FDF0EC;
    transform: translateX(3px);
}

.choice-radio {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.choice-radio:checked ~ .choice-marker {
    background: var(--accent, #E8471A);
    color: #FAF9F6;
    border-color: var(--accent, #E8471A);
}

.choice-radio:checked ~ .choice-text {
    color: var(--accent, #E8471A);
    font-weight: 600;
}

.choice-label:has(.choice-radio:checked) {
    border-color: var(--accent, #E8471A);
    background: #FDF0EC;
}

.choice-marker {
    width: 30px;
    height: 30px;
    border-radius: 7px;
    border: 1.5px solid var(--border, #EDEBE5);
    background: var(--surface, #F2F0EB);
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    font-weight: 800;
    color: var(--muted, #6B6760);
    display: grid;
    place-items: center;
    flex-shrink: 0;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.choice-text {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 500;
    color: var(--text, #1A1814);
    transition: color 0.15s;
}
</style>