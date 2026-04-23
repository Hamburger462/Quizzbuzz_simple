<script setup lang="ts"></script>

<template>
    <div class="home">

        <!-- ── HERO ── -->
        <section class="hero">
            <div class="container hero-inner">
                <div class="hero-copy">
                    <div class="hero-label">
                        <span class="hero-label-dot"></span>
                        Live quiz platform
                    </div>
                    <h1>Quiz games<br>that keep<br>you <em>hooked.</em></h1>
                    <p class="hero-sub">
                        Host or join live quiz sessions with your team, class, or friends.
                        Real-time scoring, timed questions, instant leaderboards.
                    </p>
                    <div class="hero-actions">
                        <RouterLink to="/auth/register" class="btn btn-primary">Register</RouterLink>
                        <RouterLink to="/session" class="btn btn-ghost">Join with code</RouterLink>
                    </div>
                    <p class="hero-stat"><strong>12,400+</strong> games played this week</p>
                </div>

                <div class="hero-visual" aria-hidden="true">
                    <div class="hcard hcard-question">
                        <div class="q-meta">Question 3 of 8</div>
                        <div class="q-text">What is the capital city of Australia?</div>
                        <div class="q-timer">
                            <div class="q-bar-bg">
                                <div class="q-bar"></div>
                            </div>
                            <span class="q-seconds">12s</span>
                        </div>
                    </div>
                    <div class="hcard hcard-choices">
                        <div class="choice choice--selected">Canberra</div>
                        <div class="choice">Sydney</div>
                        <div class="choice">Melbourne</div>
                    </div>
                    <div class="hcard hcard-score">
                        <div class="score-label">Your score</div>
                        <div class="score-value">2,400</div>
                        <div class="score-delta">+1,000 pts</div>
                    </div>
                </div>
            </div>
        </section>

        <hr class="section-rule" />

        <!-- ── HOW IT WORKS ── -->
        <section class="section how">
            <div class="container">
                <p class="section-label">How it works</p>
                <h2>Three steps to game night.</h2>
                <div class="steps">
                    <div class="step card">
                        <div class="step-num">01</div>
                        <h3>Create your quiz</h3>
                        <p>Build from scratch or pick from the community library. Set time limits, scoring rules, and
                            question order.</p>
                    </div>
                    <div class="step card">
                        <div class="step-num">02</div>
                        <h3>Share the code</h3>
                        <p>Players join instantly with a 6-character room code — no account needed. Works on any device.
                        </p>
                    </div>
                    <div class="step card">
                        <div class="step-num">03</div>
                        <h3>Play live</h3>
                        <p>Questions sync in real time. The leaderboard updates after every answer. First to the top
                            wins.</p>
                    </div>
                </div>
            </div>
        </section>

        <hr class="section-rule" />

        <!-- ── JOIN BANNER ── -->
        <section class="section join-section">
            <div class="container">
                <div class="join-card">
                    <div class="join-copy">
                        <h2>Got a code?<br>Jump right in.</h2>
                        <p>No account required to play.</p>
                    </div>
                    <div class="join-form">
                        <input class="join-input" type="text" placeholder="ABC 123" maxlength="7" />
                        <RouterLink to="/session" class="btn btn-accent">Join →</RouterLink>
                    </div>
                </div>
            </div>
        </section>

    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

/* ── Layout helpers (scoped so they don't conflict with Layout.vue globals) ── */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2.5rem;
}

.section {
    padding: 5rem 0;
}

.section-rule {
    border: none;
    border-top: 1.5px solid var(--border, #EDEBE5);
    max-width: 1200px;
    margin: 0 auto;
}

/* ── HERO ── */
.hero {
    padding: 6rem 0 5rem;
}

.hero-inner {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 4rem;
    align-items: center;
}

.hero-label {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    font-family: 'Manrope', sans-serif;
    font-size: .8rem;
    font-weight: 600;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--accent, #E8471A);
    background: #FDF0EC;
    border-radius: 20px;
    padding: .3rem .85rem;
    margin-bottom: 1.5rem;
    width: fit-content;
    animation: fadeUp .5s ease both;
}

.hero-label-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent, #E8471A);
    flex-shrink: 0;
}

h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: clamp(2.5rem, 5vw, 4.25rem);
    letter-spacing: -.03em;
    line-height: 1.05;
    color: var(--text, #1A1814);
    animation: fadeUp .55s .08s ease both;
}

h1 em {
    color: var(--accent, #E8471A);
    font-style: normal;
}

.hero-sub {
    margin-top: 1.25rem;
    font-size: 1.0625rem;
    color: var(--muted, #6B6760);
    line-height: 1.7;
    max-width: 480px;
    animation: fadeUp .55s .16s ease both;
}

.hero-actions {
    display: flex;
    align-items: center;
    gap: .75rem;
    margin-top: 2.25rem;
    flex-wrap: wrap;
    animation: fadeUp .55s .22s ease both;
}

.hero-stat {
    margin-top: 1.25rem;
    font-size: .8125rem;
    color: var(--muted, #6B6760);
    font-family: 'Manrope', sans-serif;
    animation: fadeUp .55s .28s ease both;
}

.hero-stat strong {
    color: var(--text, #1A1814);
    font-weight: 600;
}

/* ── Buttons ── */
.btn {
    display: inline-flex;
    align-items: center;
    gap: .5rem;
    font-family: 'Manrope', sans-serif;
    font-size: .9375rem;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    border-radius: 6px;
    padding: .7rem 1.5rem;
    transition: background .15s ease, transform .1s ease;
}

.btn:active {
    transform: translateY(0) !important;
}

.btn-primary {
    background: var(--accent, #E8471A);
    color: #FAF9F6;
}

.btn-primary:hover {
    background: var(--accent-dk, #CF3A12);
    transform: translateY(-1px);
}

.btn-ghost {
    background: transparent;
    color: var(--text, #1A1814);
    border: 1.5px solid var(--border, #EDEBE5);
}

.btn-ghost:hover {
    background: var(--surface, #F2F0EB);
}

.btn-accent {
    background: var(--accent, #E8471A);
    color: #FAF9F6;
}

.btn-accent:hover {
    background: var(--accent-dk, #CF3A12);
    transform: translateY(-1px);
}

/* ── Hero visual ── */
.hero-visual {
    position: relative;
    height: 340px;
    animation: fadeUp .6s .3s ease both;
}

.hcard {
    position: absolute;
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 12px;
    font-family: 'Manrope', sans-serif;
}

.hcard-question {
    width: 340px;
    top: 0;
    left: 0;
    padding: 1.25rem 1.5rem;
    box-shadow: 0 8px 32px rgba(26, 24, 20, .07);
}

.q-meta {
    font-size: .75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--muted, #6B6760);
    margin-bottom: .75rem;
}

.q-text {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text, #1A1814);
    line-height: 1.45;
    margin-bottom: 1rem;
}

.q-timer {
    display: flex;
    align-items: center;
    gap: .5rem;
}

.q-bar-bg {
    flex: 1;
    height: 5px;
    background: var(--surface, #F2F0EB);
    border-radius: 3px;
    overflow: hidden;
}

.q-bar {
    height: 100%;
    width: 60%;
    background: var(--accent, #E8471A);
    border-radius: 3px;
}

.q-seconds {
    font-size: .8125rem;
    font-weight: 600;
    color: var(--accent, #E8471A);
}

.hcard-choices {
    width: 300px;
    top: 110px;
    left: 30px;
    padding: 1rem 1.1rem;
    box-shadow: 0 16px 48px rgba(26, 24, 20, .10);
}

.choice {
    padding: .6rem .9rem;
    border-radius: 6px;
    font-size: .875rem;
    font-weight: 500;
    margin-bottom: .4rem;
    border: 1.5px solid transparent;
    color: var(--muted, #6B6760);
    background: var(--surface, #F2F0EB);
}

.choice:last-child {
    margin-bottom: 0;
}

.choice--selected {
    background: #FDF0EC;
    border-color: #F5C4B4;
    color: var(--accent-dk, #CF3A12);
}

.hcard-score {
    width: 160px;
    top: 220px;
    right: 0;
    padding: 1rem;
    text-align: center;
    box-shadow: 0 8px 24px rgba(26, 24, 20, .08);
}

.score-label {
    font-size: .75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--muted, #6B6760);
}

.score-value {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: var(--text, #1A1814);
    letter-spacing: -.02em;
    margin: .1rem 0;
}

.score-delta {
    font-size: .8125rem;
    font-weight: 600;
    color: #28A745;
}

/* ── HOW IT WORKS ── */
.section-label {
    font-size: .8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .08em;
    color: var(--accent, #E8471A);
    margin-bottom: .75rem;
    font-family: 'Manrope', sans-serif;
}

.how h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -.025em;
    color: var(--text, #1A1814);
    margin-bottom: 3rem;
}

.steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.card {
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 12px;
    padding: 1.75rem;
}

.step-num {
    font-family: 'Syne', sans-serif;
    font-size: 3rem;
    font-weight: 800;
    color: var(--border, #EDEBE5);
    line-height: 1;
    margin-bottom: .75rem;
    letter-spacing: -.04em;
}

.step h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.2rem;
    font-weight: 800;
    letter-spacing: -.01em;
    margin-bottom: .5rem;
    color: var(--text, #1A1814);
}

.step p {
    font-size: .9rem;
    color: var(--muted, #6B6760);
    line-height: 1.6;
    font-family: 'Manrope', sans-serif;
}

/* ── JOIN BANNER ── */
.join-section {
    padding-bottom: 6rem;
}

.join-card {
    background: var(--text, #1A1814);
    border-radius: 12px;
    padding: 3rem 3.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
}

.join-copy h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2.25rem);
    font-weight: 800;
    letter-spacing: -.025em;
    color: #FAF9F6;
    line-height: 1.1;
}

.join-copy p {
    color: rgba(250, 249, 246, .5);
    font-size: .9375rem;
    margin-top: .5rem;
    font-family: 'Manrope', sans-serif;
}

.join-form {
    display: flex;
    gap: .6rem;
    align-items: center;
}

.join-input {
    font-family: 'Manrope', sans-serif;
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: .18em;
    text-transform: uppercase;
    text-align: center;
    background: rgba(255, 255, 255, .08);
    border: 1.5px solid rgba(255, 255, 255, .15);
    color: #FAF9F6;
    border-radius: 6px;
    padding: .65rem 1.25rem;
    width: 180px;
    outline: none;
    transition: border-color .15s;
}

.join-input::placeholder {
    color: rgba(250, 249, 246, .3);
    letter-spacing: .18em;
}

.join-input:focus {
    border-color: var(--accent, #E8471A);
}

/* ── Animations ── */
@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(18px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>