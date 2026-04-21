<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    players: { nickname: string; score: number }[];
    hasFinishedQuiz: boolean;
}>();

const emit = defineEmits<{
    (e: "advance"): void;
}>();

const sortedPlayers = computed(() =>
    [...props.players].sort((a, b) => b.score - a.score)
);

const medals = ['🥇', '🥈', '🥉'];
</script>

<template>
    <div class="lb-wrap">
        <div class="lb-card">

            <div class="lb-header">
                <h2>{{ hasFinishedQuiz ? 'Final scores' : 'Leaderboard' }}</h2>
                <span class="lb-count">{{ sortedPlayers.length }} players</span>
            </div>

            <div class="lb-empty" v-if="sortedPlayers.length === 0">
                No players yet.
            </div>

            <ol v-else class="lb-list">
                <li v-for="(player, i) in sortedPlayers" :key="i" class="lb-row" :class="{ 'lb-row--top3': i < 3 }">
                    <span class="lb-rank">
                        <span v-if="i < 3">{{ medals[i] }}</span>
                        <span v-else class="lb-rank-num">{{ i + 1 }}</span>
                    </span>
                    <span class="lb-avatar">{{ player.nickname.charAt(0).toUpperCase() }}</span>
                    <span class="lb-name">{{ player.nickname }}</span>
                    <span class="lb-score">{{ player.score }}</span>
                </li>
            </ol>

            <button v-if="!hasFinishedQuiz" class="btn-next" @click="emit('advance')">
                Next question →
            </button>

            <div v-else class="lb-fin">
                🎉 Quiz complete!
            </div>

        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.lb-wrap {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--bg, #FAF9F6);
}

.lb-card {
    width: 100%;
    max-width: 560px;
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 16px;
    overflow: hidden;
    animation: fadeUp 0.3s ease both;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(14px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.lb-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 1.75rem 1.25rem;
    border-bottom: 1.5px solid var(--border, #EDEBE5);
}

.lb-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text, #1A1814);
}

.lb-count {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
    background: var(--surface, #F2F0EB);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
}

.lb-empty {
    padding: 2rem 1.75rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    color: var(--muted, #6B6760);
}

.lb-list {
    list-style: none;
    padding: 0.75rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}

.lb-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.75rem;
    border-radius: 10px;
    background: var(--surface, #F2F0EB);
    transition: background 0.15s;
    animation: slideIn 0.2s ease both;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-8px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.lb-row--top3 {
    background: #FDF0EC;
}

.lb-row--top3:first-child {
    background: #FEF9EC;
    border: 1.5px solid #F5E4AA;
}

.lb-rank {
    width: 28px;
    text-align: center;
    font-size: 1.1rem;
    flex-shrink: 0;
}

.lb-rank-num {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
}

.lb-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(232, 71, 26, 0.12);
    color: var(--accent, #E8471A);
    font-family: 'Syne', sans-serif;
    font-size: 0.875rem;
    font-weight: 800;
    display: grid;
    place-items: center;
    flex-shrink: 0;
}

.lb-name {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text, #1A1814);
    flex: 1;
}

.lb-score {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: var(--text, #1A1814);
    letter-spacing: -0.01em;
}

.btn-next {
    display: block;
    width: calc(100% - 2rem);
    margin: 0.75rem 1rem 1.25rem;
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

.btn-next:hover {
    background: var(--accent-dk, #CF3A12);
    transform: translateY(-1px);
}

.lb-fin {
    text-align: center;
    padding: 1.25rem;
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text, #1A1814);
}
</style>