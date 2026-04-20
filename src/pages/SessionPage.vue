<script setup lang="ts">
import { watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuth } from '../composables/useAuth';
import { useSession, shuffleQuestions } from '../composables/useSession';
import { useQuiz, decodeChoice } from '../composables/useQuiz';
import { usePlayers } from '../composables/usePlayer';
import type { Quiz, Question } from '../types';

const route = useRoute();
const router = useRouter();
const sessionCode = route.params.id;

const { user, loginAnonymously } = useAuth();
const { useSessionByCode, changeSessionStatus } = useSession();
const { addPlayer, usePlayersBySession, addPlayerAnswer, addPlayerScore, changePlayerStatus, usePlayerById } = usePlayers();
const { readQuiz } = useQuiz();

const { session, loading } = useSessionByCode(sessionCode as string);
let quiz: Quiz | null;
const questions = ref<Array<Question> | null>([]);
const answers = ref<Record<string, string>>({});
const score = ref<number>(0);
const questionOrder = ref<number>(0);
const { players } = usePlayersBySession(sessionCode as string);
const { player } = usePlayerById(
  sessionCode as string,
  user.value?.uid ?? ""
);

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

    if (!quiz) return;

    questions.value = shuffleQuestions(quiz.questions);
})

const tempUserName = ref<string>("");

const handleCreateTempUser = async () => {
    await loginAnonymously();
    addPlayer(sessionCode as string, tempUserName.value);
}

const handleStartSession = () => {
    changeSessionStatus(sessionCode as string, "active")
}

const handleAnswerQuestion = (questionId: string, choice: string) => {
    if (!user.value) return;
    answers.value[questionId] = choice;
    addPlayerAnswer(sessionCode as string, user.value?.uid, answers.value);
    if (validateAnswer(questionId, choice)) {
        score.value += 1000;
        addPlayerScore(sessionCode as string, user.value.uid, score.value);
    }
    questionOrder.value++;
}

const validateAnswer = (questionId: string, choice: string): boolean => {
    const targetQuestion = quiz?.questions.find((q) => q.id == questionId);
    if (!targetQuestion) return false;
    if (!targetQuestion.correctChoice) return false;

    if (decodeChoice(targetQuestion.correctChoice) == choice) return true;
    else return false;
}

watch(questionOrder, () => {
    if (!user.value) return;
    if(questionOrder.value == questions.value?.length){
        changePlayerStatus(sessionCode as string, user.value.uid, true);
    }
})
</script>

<template>
    <h2>This is session page</h2>
    <template v-if="session != null">
        <template v-if="user != null">
            <template v-if="session.status == 'waiting'">
                <div>Session code:</div>
                <div>{{ sessionCode }}</div>
                <div>Players: </div>
                <div>
                    <div v-for="player in players">
                        {{ player.nickname }}
                    </div>
                </div>

                <!-- Host ui -->
                <template v-if="user.uid == session.hostUid">
                    <button @click="handleStartSession">Start a session</button>
                </template>
            </template>

            <template v-else-if="session.status == 'active'">
                <template v-if="user.uid == session.hostUid">
                    <div>This is a host page</div>
                </template>
                <template v-else>
                    <div v-if="player?.finished != true">
                        <div v-for="question, qIndex in questions" v-show="questionOrder == qIndex">
                            <div>{{ question.text }}</div>

                            <div>
                                <label v-for="(choice, cIndex) in question.choices" :key="cIndex">
                                    <input type="radio" :name="`question-${qIndex}`" :value="cIndex"
                                        @change="() => handleAnswerQuestion(question.id, choice)" />
                                    <span>{{ choice }}</span>
                                </label>
                            </div>

                        </div>
                    </div>
                    <div v-else>
                        <span>You have finished a quiz</span>
                    </div>
                </template>
            </template>

            <template v-else-if="session.status == 'finished'">

            </template>
        </template>


        <!-- Template for joining user -->
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
    <template v-else>
        <div>Incorrect session code. Returning to the join page.</div>
    </template>
</template>