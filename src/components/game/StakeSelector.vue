<script setup lang="ts">
const STAKES = [
    { value: 1, label: '×1', desc: 'Normal' },
    { value: 2, label: '×2', desc: 'Risky' },
    { value: 3, label: '×3', desc: 'All in' },
];

defineProps<{
    currentStake: number;
}>();

const emit = defineEmits<{
    (e: 'select', value: number): void;
    (e: 'confirm'): void;
}>();
</script>

<template>
    <div class="stake-wrap">
        <div class="stake-card">
            <p class="eyebrow">Choose your stake</p>
            <h2>How confident<br>are you?</h2>
            <p class="sub">Your multiplier applies to points won — or lost — this round.</p>

            <div class="stake-grid">
                <button v-for="stake in STAKES" :key="stake.value" class="stake-btn"
                    :class="{ active: currentStake === stake.value }" @click="emit('select', stake.value)">
                    <span class="s-label">{{ stake.label }}</span>
                    <span class="s-desc">{{ stake.desc }}</span>
                </button>
            </div>

            <button class="btn-confirm" @click="emit('confirm')">
                Lock in ×{{ currentStake }} and play →
            </button>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.stake-wrap {
    min-height: calc(100vh - 60px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background: var(--bg, #FAF9F6);
}

.stake-card {
    width: 100%;
    max-width: 480px;
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 16px;
    padding: 2.5rem 2.75rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
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

.eyebrow {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent, #E8471A);
}

h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.85rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    line-height: 1.1;
    color: var(--text, #1A1814);
}

.sub {
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    color: var(--muted, #6B6760);
    line-height: 1.6;
}

.stake-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.65rem;
    margin-top: 0.25rem;
}

.stake-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
    padding: 1.25rem 1rem;
    background: var(--surface, #F2F0EB);
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
}

.stake-btn:hover {
    border-color: var(--accent, #E8471A);
    background: #FDF0EC;
    transform: translateY(-2px);
}

.stake-btn.active {
    background: #FDF0EC;
    border-color: var(--accent, #E8471A);
    box-shadow: 0 0 0 3px rgba(232, 71, 26, 0.12);
}

.s-label {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text, #1A1814);
    line-height: 1;
}

.stake-btn.active .s-label {
    color: var(--accent, #E8471A);
}

.s-desc {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--muted, #6B6760);
}

.stake-btn.active .s-desc {
    color: var(--accent-dk, #CF3A12);
}

.btn-confirm {
    width: 100%;
    padding: 0.8rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #FAF9F6;
    background: var(--text, #1A1814);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
    margin-top: 0.25rem;
}

.btn-confirm:hover {
    background: #2e2c28;
    transform: translateY(-1px);
}
</style>