<script setup lang="ts">
import { RouterLink } from 'vue-router';

const year = new Date().getFullYear();
</script>

<template>
    <footer class="site-footer">
        <div class="footer-inner">

            <div class="footer-brand">
                <RouterLink to="/" class="logo">
                    <span class="logo-dot"></span>
                    <span class="logo-text">Quizzbuzz</span>
                </RouterLink>
                <p class="brand-tagline">Live quiz games that keep you hooked.</p>
            </div>

            <nav class="footer-nav">
                <div class="footer-col">
                    <p class="col-heading">Play</p>
                    <RouterLink to="/session"  class="footer-link">Join a game</RouterLink>
                    <RouterLink to="/discover" class="footer-link">Discover</RouterLink>
                </div>
                <div class="footer-col">
                    <p class="col-heading">Create</p>
                    <RouterLink to="/archive"        class="footer-link">My archive</RouterLink>
                    <RouterLink to="/auth/register"  class="footer-link">Get started</RouterLink>
                </div>
                <div class="footer-col">
                    <p class="col-heading">Account</p>
                    <RouterLink to="/auth/login"     class="footer-link">Log in</RouterLink>
                    <RouterLink to="/auth/register"  class="footer-link">Register</RouterLink>
                </div>
            </nav>

        </div>

        <div class="footer-bottom">
            <p class="copyright">© {{ year }} Quizzbuzz. All rights reserved.</p>
        </div>
    </footer>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.site-footer {
    background: #FAF9F6;
    border-top: 1.5px solid #EDEBE5;
    margin-top: auto;
}

/* ── Main row ── */
.footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 3rem 2.5rem 2.5rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 3rem;
    flex-wrap: wrap;
}

/* Brand */
.footer-brand {
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
    max-width: 220px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    width: fit-content;
}

.logo-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #E8471A;
    flex-shrink: 0;
    margin-bottom: 1px;
}

.logo-text {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.1rem;
    color: #1A1814;
    letter-spacing: -0.02em;
}

.brand-tagline {
    font-family: 'Manrope', sans-serif;
    font-size: 0.85rem;
    color: #6B6760;
    line-height: 1.5;
}

/* Nav columns */
.footer-nav {
    display: flex;
    gap: 3.5rem;
    flex-wrap: wrap;
}

.footer-col {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.col-heading {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #1A1814;
    margin-bottom: 0.15rem;
}

.footer-link {
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6B6760;
    text-decoration: none;
    transition: color 0.15s;
    width: fit-content;
}

.footer-link:hover {
    color: #E8471A;
}

/* ── Bottom bar ── */
.footer-bottom {
    border-top: 1.5px solid #EDEBE5;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2.5rem;
}

.copyright {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    color: #6B6760;
}
</style>