<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';

const router = useRouter();
const { user, logout, useUserDoc, updateUserDoc } = useAuth();

// ── User doc ─────────────────────────────────────────────────────────────────
const userDocData   = ref<any>(null);
const docLoading    = ref(true);
let unsubscribe: (() => void) | null = null;

watch(user, (u) => {
    if (unsubscribe) unsubscribe();
    if (!u) { userDocData.value = null; docLoading.value = false; return; }

    const { userDoc, docLoading: dl, unsubscribe: unsub } = useUserDoc(u.uid);
    unsubscribe = unsub;

    watch(userDoc,   (v) => { userDocData.value = v; });
    watch(dl,        (v) => { docLoading.value  = v; });
}, { immediate: true });

onUnmounted(() => { if (unsubscribe) unsubscribe(); });

// ── Edit username ─────────────────────────────────────────────────────────────
const editing       = ref(false);
const editedName    = ref('');
const saving        = ref(false);
const saveError     = ref('');

const startEdit = () => {
    editedName.value = userDocData.value?.username ?? '';
    editing.value    = true;
    saveError.value  = '';
};

const cancelEdit = () => { editing.value = false; };

const handleSave = async () => {
    if (!user.value || !editedName.value.trim()) return;
    saving.value    = true;
    saveError.value = '';
    try {
        await updateUserDoc(user.value.uid, { username: editedName.value.trim() });
        editing.value = false;
    } catch {
        saveError.value = 'Failed to save. Please try again.';
    } finally {
        saving.value = false;
    }
};

// ── Logout ────────────────────────────────────────────────────────────────────
const handleLogout = async () => {
    await logout();
    router.push('/');
};
</script>

<template>
    <div class="profile-page">
        <div class="container">

            <!-- Not logged in -->
            <div v-if="!user" class="empty-state">
                <div class="empty-icon">🔒</div>
                <h2>You're not logged in</h2>
                <p>Log in to view your profile.</p>
                <RouterLink to="/auth/login" class="btn-primary">Log in</RouterLink>
            </div>

            <!-- Loading doc -->
            <div v-else-if="docLoading" class="loading-state">
                <span class="spinner spinner--dark"></span>
            </div>

            <!-- Profile -->
            <div v-else class="profile-layout">

                <!-- Left: identity card -->
                <aside class="identity-card">
                    <div class="avatar">
                        <span class="avatar-letter">
                            {{ (userDocData?.username ?? user.email ?? '?').charAt(0).toUpperCase() }}
                        </span>
                    </div>

                    <!-- Username -->
                    <div class="identity-name-row">
                        <template v-if="!editing">
                            <h2 class="identity-name">{{ userDocData?.username ?? '—' }}</h2>
                            <button class="btn-edit-inline" @click="startEdit" title="Edit username">✎</button>
                        </template>
                        <template v-else>
                            <div class="edit-field">
                                <input
                                    class="edit-input"
                                    type="text"
                                    v-model="editedName"
                                    placeholder="Username"
                                    @keyup.enter="handleSave"
                                    @keyup.escape="cancelEdit"
                                    autofocus
                                />
                                <div class="edit-actions">
                                    <button
                                        class="btn-save"
                                        :disabled="saving || !editedName.trim()"
                                        @click="handleSave"
                                    >
                                        <span v-if="!saving">Save</span>
                                        <span v-else class="spinner"></span>
                                    </button>
                                    <button class="btn-cancel" @click="cancelEdit">Cancel</button>
                                </div>
                                <p v-if="saveError" class="edit-error">{{ saveError }}</p>
                            </div>
                        </template>
                    </div>

                    <p class="identity-email">{{ userDocData?.email ?? user.email }}</p>

                    <div class="identity-badge" v-if="!user.isAnonymous">
                        <span class="badge-dot"></span>
                        Registered account
                    </div>
                    <div class="identity-badge identity-badge--anon" v-else>
                        Guest session
                    </div>

                    <button class="btn-logout" @click="handleLogout">Log out</button>
                </aside>

                <!-- Right: stats / info -->
                <div class="profile-content">
                    <div class="section-header">
                        <p class="eyebrow">Account</p>
                        <h3>Details</h3>
                    </div>

                    <div class="detail-list">
                        <div class="detail-row">
                            <span class="detail-key">Username</span>
                            <span class="detail-val">{{ userDocData?.username ?? '—' }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-key">Email</span>
                            <span class="detail-val">{{ userDocData?.email ?? user.email ?? '—' }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-key">User ID</span>
                            <span class="detail-val detail-val--mono">{{ user.uid }}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-key">Account type</span>
                            <span class="detail-val">{{ user.isAnonymous ? 'Guest' : 'Registered' }}</span>
                        </div>
                    </div>

                    <div class="section-header" style="margin-top: 2.5rem;">
                        <p class="eyebrow">Activity</p>
                        <h3>Quick links</h3>
                    </div>

                    <div class="quick-links">
                        <RouterLink to="/archive" class="quick-link-card">
                            <span class="ql-icon">📋</span>
                            <div>
                                <p class="ql-title">My quizzes</p>
                                <p class="ql-sub">Create and manage your quiz archive</p>
                            </div>
                            <span class="ql-arrow">→</span>
                        </RouterLink>
                        <RouterLink to="/discover" class="quick-link-card">
                            <span class="ql-icon">🔍</span>
                            <div>
                                <p class="ql-title">Discover</p>
                                <p class="ql-sub">Browse community quizzes</p>
                            </div>
                            <span class="ql-arrow">→</span>
                        </RouterLink>
                        <RouterLink to="/session" class="quick-link-card">
                            <span class="ql-icon">▶</span>
                            <div>
                                <p class="ql-title">Join a game</p>
                                <p class="ql-sub">Enter a session code to play</p>
                            </div>
                            <span class="ql-arrow">→</span>
                        </RouterLink>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Manrope:wght@400;500;600&display=swap');

.profile-page {
    min-height: calc(100vh - 60px);
    background: var(--bg, #FAF9F6);
    padding: 3.5rem 0 5rem;
}

.container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 2.5rem;
}

/* ── Empty / loading ── */
.empty-state {
    text-align: center;
    padding: 5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
}

.empty-icon { font-size: 2.5rem; }

.empty-state h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: var(--text, #1A1814);
}

.empty-state p {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    color: var(--muted, #6B6760);
}

.loading-state {
    display: flex;
    justify-content: center;
    padding: 5rem;
}

/* ── Layout ── */
.profile-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    align-items: flex-start;
}

/* ── Identity card ── */
.identity-card {
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 16px;
    padding: 2rem 1.75rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    position: sticky;
    top: 80px;
    animation: fadeUp 0.3s ease both;
}

@keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
}

.avatar {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    background: #FDF0EC;
    display: grid;
    place-items: center;
    margin-bottom: 0.25rem;
}

.avatar-letter {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    color: var(--accent, #E8471A);
    line-height: 1;
}

/* Username row */
.identity-name-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    width: 100%;
}

.identity-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.25rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text, #1A1814);
}

.btn-edit-inline {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.875rem;
    color: var(--muted, #6B6760);
    padding: 0.2rem 0.3rem;
    border-radius: 4px;
    line-height: 1;
    transition: color 0.15s, background 0.15s;
    flex-shrink: 0;
}
.btn-edit-inline:hover { color: var(--accent, #E8471A); background: #FDF0EC; }

/* Edit field */
.edit-field {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.edit-input {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    text-align: center;
    background: var(--surface, #F2F0EB);
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 8px;
    padding: 0.55rem 0.75rem;
    width: 100%;
    outline: none;
    color: var(--text, #1A1814);
    transition: border-color 0.15s;
}
.edit-input:focus { border-color: var(--accent, #E8471A); background: #fff; }

.edit-actions {
    display: flex;
    gap: 0.4rem;
}

.btn-save {
    flex: 1;
    padding: 0.45rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: #FAF9F6;
    background: var(--accent, #E8471A);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    transition: background 0.15s;
}
.btn-save:hover:not(:disabled) { background: var(--accent-dk, #CF3A12); }
.btn-save:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-cancel {
    flex: 1;
    padding: 0.45rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--text, #1A1814);
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.15s;
}
.btn-cancel:hover { background: var(--surface, #F2F0EB); }

.edit-error {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    color: var(--accent, #E8471A);
    text-align: left;
}

.identity-email {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    color: var(--muted, #6B6760);
    word-break: break-all;
}

.identity-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    color: #166534;
    background: #DCFCE7;
    border-radius: 20px;
    padding: 0.25rem 0.75rem;
}

.identity-badge--anon {
    color: var(--muted, #6B6760);
    background: var(--surface, #F2F0EB);
}

.badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #16A34A;
    flex-shrink: 0;
}

.btn-logout {
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.6rem;
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
    background: transparent;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 8px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.btn-logout:hover {
    color: #B83215;
    border-color: #F8C9C2;
    background: #FEF2F0;
}

/* ── Profile content ── */
.profile-content {
    animation: fadeUp 0.35s 0.05s ease both;
}

.section-header {
    margin-bottom: 1.25rem;
}

.eyebrow {
    font-family: 'Manrope', sans-serif;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--accent, #E8471A);
    margin-bottom: 0.25rem;
}

.section-header h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.35rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text, #1A1814);
}

/* Detail list */
.detail-list {
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 12px;
    overflow: hidden;
}

.detail-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.9rem 1.25rem;
    gap: 1rem;
    border-bottom: 1.5px solid var(--border, #EDEBE5);
}
.detail-row:last-child { border-bottom: none; }

.detail-key {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--muted, #6B6760);
    flex-shrink: 0;
    min-width: 100px;
}

.detail-val {
    font-family: 'Manrope', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text, #1A1814);
    text-align: right;
    word-break: break-all;
}

.detail-val--mono {
    font-family: 'Courier New', monospace;
    font-size: 0.75rem;
    color: var(--muted, #6B6760);
}

/* Quick links */
.quick-links {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
}

.quick-link-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    background: #fff;
    border: 1.5px solid var(--border, #EDEBE5);
    border-radius: 12px;
    text-decoration: none;
    transition: border-color 0.15s, transform 0.12s, box-shadow 0.15s;
}
.quick-link-card:hover {
    border-color: var(--accent, #E8471A);
    transform: translateX(3px);
    box-shadow: 0 4px 16px rgba(26, 24, 20, 0.06);
}

.ql-icon {
    font-size: 1.25rem;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: var(--surface, #F2F0EB);
    border-radius: 10px;
    display: grid;
    place-items: center;
}

.ql-title {
    font-family: 'Manrope', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text, #1A1814);
    margin-bottom: 0.15rem;
}

.ql-sub {
    font-family: 'Manrope', sans-serif;
    font-size: 0.8rem;
    color: var(--muted, #6B6760);
}

.ql-arrow {
    margin-left: auto;
    font-size: 1rem;
    color: var(--border, #EDEBE5);
    transition: color 0.15s, transform 0.15s;
    flex-shrink: 0;
}
.quick-link-card:hover .ql-arrow {
    color: var(--accent, #E8471A);
    transform: translateX(2px);
}

/* ── Shared ── */
.btn-primary {
    display: inline-flex;
    font-family: 'Manrope', sans-serif;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #FAF9F6;
    background: var(--accent, #E8471A);
    text-decoration: none;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: background 0.15s, transform 0.1s;
}
.btn-primary:hover { background: var(--accent-dk, #CF3A12); transform: translateY(-1px); }

.spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(250, 249, 246, 0.35);
    border-top-color: #FAF9F6;
    border-radius: 50%;
    animation: spin 0.65s linear infinite;
}
.spinner--dark {
    border-color: rgba(26, 24, 20, 0.12);
    border-top-color: var(--text, #1A1814);
    width: 28px;
    height: 28px;
    border-width: 3px;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>