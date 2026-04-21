<script lang="ts" setup>
import { RouterLink } from 'vue-router';

defineProps<{
    players?: { nickname: string; score: number }[];
}>();
</script>

<template>
    <div class="finished-page">
        <div class="finished-inner">
            <div class="trophy">🏆</div>
            <h1>Game over!</h1>
            <p>Thanks for playing. Check out the final scores below or head back home.</p>

            <div v-if="players && players.length" class="podium">
                <div v-for="(player, i) in [...players].sort((a, b) => b.score - a.score).slice(0, 3)" :key="i"
                    class="podium-item" :class="`podium-item--${i + 1}`">
                    <span class="podium-medal">{{ ['🥇', '🥈', '🥉'][i] }}</span>
                    <span class="podium-name">{{ player.nickname }}</span>
                    <span class="podium-score">{{ player.score || 0 }}</span>
                </div>
            </div>

            <RouterLink to="/" class="btn-home">Back to home</RouterLink>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.finished-page {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--bg, #FAF9F6);
}

.finished-inner {
    text-align: center;
    max-width: 480px;
    animation: fadeUp 0.4s ease both;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(16px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.trophy {
    font-size: 4rem;
    margin-bottom: 1rem;
}

h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text, #1A1814);
    margin-bottom: 0.5rem;
}

p {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    color: var(--muted, #6B6760);
    line-height: 1.6;
    margin-bottom: 2.5rem;
}

.podium {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 2rem;
    text-align: left;
}

.podium-item {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    padding: 0.85rem 1rem;
    border-radius: 10px;
    border: 1.5px solid var(--border, #EDEBE5);
    background: #fff;
}

.podium-item--1 {
    background: #FEF9EC;
    border-color: #F5E4AA;
}

.podium-medal {
    font-size: 1.35rem;
    flex-shrink: 0;
}

.podium-name {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text, #1A1814);
    flex: 1;
}

.podium-score {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    font-weight: 800;
    color: var(--text, #1A1814);
}

.btn-home {
    display: inline-flex;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #FAF9F6;
    background: var(--accent, #E8471A);
    text-decoration: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    transition: background 0.15s, transform 0.1s;
}

.btn-home:hover {
    background: var(--accent-dk, #CF3A12);
    transform: translateY(-1px);
}
</style>