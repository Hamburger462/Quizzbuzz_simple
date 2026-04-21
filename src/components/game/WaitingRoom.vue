<script setup lang="ts">
defineProps<{
    sessionCode: string;
    players: { id: string; nickname: string }[];
    isHost: boolean;
}>();

const emit = defineEmits<{
    (e: 'start'): void;
}>();
</script>

<template>
    <div class="waiting-page">
        <div class="waiting-inner">

            <!-- Code panel -->
            <div class="code-panel">
                <p class="code-label">Session code</p>
                <div class="code-display">{{ sessionCode }}</div>
                <p class="code-hint">Share this code with players to let them join</p>
            </div>

            <!-- Players panel -->
            <div class="players-panel">
                <div class="players-header">
                    <h2>Lobby</h2>
                    <span class="player-count">{{ players.length }} joined</span>
                </div>

                <div class="players-empty" v-if="players.length === 0">
                    <span class="pulse-dot"></span>
                    Waiting for players to join…
                </div>

                <ul class="players-list" v-else>
                    <li v-for="(player, i) in players" :key="player.id" class="player-item">
                        <span class="player-avatar">{{ player.nickname.charAt(0).toUpperCase() }}</span>
                        <span class="player-name">{{ player.nickname }}</span>
                        <span class="player-index">#{{ i + 1 }}</span>
                    </li>
                </ul>

                <button v-if="isHost" class="btn-start" :disabled="players.length === 0" @click="emit('start')">
                    Start session →
                </button>

                <div v-else class="waiting-status">
                    <span class="pulse-dot"></span>
                    Waiting for the host to start…
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.waiting-page {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 3rem 2rem;
    background: var(--bg, #FAF9F6);
}

.waiting-inner {
    width: 100%;
    max-width: 760px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Code panel */
.code-panel {
    background: var(--text, #1A1814);
    border-radius: 16px;
    padding: 2.5rem;
    text-align: center;
}

.code-label {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(250, 249, 246, 0.45);
    margin-bottom: 0.75rem;
}

.code-display {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 800;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #FAF9F6;
    line-height: 1;
    margin-bottom: 0.75rem;
}

.code-hint {
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    color: rgba(250, 249, 246, 0.4);
}

/* Players panel */
.players-panel {
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 16px;
    padding: 2rem;
}

.players-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
}

.players-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text, #1A1814);
}

.player-count {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
    background: var(--surface, #F2F0EB);
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
}

.players-empty,
.waiting-status {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    color: var(--muted, #6B6760);
    padding: 1rem 0;
}

.pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent, #E8471A);
    flex-shrink: 0;
    animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }

    50% {
        opacity: 0.4;
        transform: scale(0.75);
    }
}

.players-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
}

.player-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.85rem;
    background: var(--surface, #F2F0EB);
    border-radius: 8px;
    animation: slideIn 0.2s ease both;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(6px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.player-avatar {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #FDF0EC;
    color: var(--accent, #E8471A);
    font-family: 'Syne', sans-serif;
    font-size: 0.875rem;
    font-weight: 800;
    display: grid;
    place-items: center;
    flex-shrink: 0;
}

.player-name {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text, #1A1814);
    flex: 1;
}

.player-index {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--muted, #6B6760);
}

.btn-start {
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

.btn-start:hover:not(:disabled) {
    background: var(--accent-dk, #CF3A12);
    transform: translateY(-1px);
}

.btn-start:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}
</style>