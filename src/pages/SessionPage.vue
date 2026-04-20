<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuth } from '../composables/useAuth';
import { useSession, shuffleQuestions } from '../composables/useSession';
import { useQuiz } from '../composables/useQuiz';
import { usePlayers } from '../composables/usePlayer';
import type { Quiz, Question } from '../types';

const route = useRoute();
const router = useRouter();
const sessionCode = route.params.id;

const { user, loginAnonymously } = useAuth();
const { useSessionByCode } = useSession();
const { addPlayer, usePlayersBySession } = usePlayers();
const { readQuiz } = useQuiz();

const { session, loading } = useSessionByCode(sessionCode as string);
let quiz: Quiz | null;
let questions: Question[] = [];
const { players } = usePlayersBySession(sessionCode as string);

watch(loading, () => {
    if (loading.value) return;

    if (session.value != null) return;

    router.push({
        path: "/session",
        query: { error: "incorrect_code" }
    });
})

watch(loading, async () => {
    if (loading.value) return;

    if (session.value == null) return;

    quiz = await readQuiz(session.value?.quizId);

    if(!quiz) return;

    questions = shuffleQuestions(quiz.questions);
})

const tempUserName = ref<string>("");

const handleCreateTempUser = async () => {
    await loginAnonymously();
    addPlayer(sessionCode as string, tempUserName.value);
}
</script>

<template>
    <h2>This is session page</h2>
    <template v-if="session != null">
        <template v-if="session.status == 'waiting'">
            <div>Session code:</div>
            <div>{{ sessionCode }}</div>
            <template v-if="user != null">
                <div>Players: </div>
                <div>
                    <div v-for="player in players">
                        {{ player.nickname }}
                    </div>
                </div>
            </template>
            <template v-else>
                <label>
                    <div>Enter your username</div>
                    <input type="text" name="username" v-model="tempUserName">
                </label>
                <div>
                    <button @click="handleCreateTempUser">Join</button>
                </div>
            </template>
        </template>

        <template v-else-if="session.status == 'active'">
            <div>
                <div v-for="question in questions">
                    {{ question.text }}
                </div>
            </div>
        </template>

        <template v-else-if="session.status == 'finished'">

        </template>
    </template>
    <template v-else>
        <div>Incorrect session code. Returning to the join page.</div>
    </template>
</template>