<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useQuiz, encodeChoice } from '../composables/useQuiz';
import { useAuth } from '../composables/useAuth';
import { useSession } from '../composables/useSession';

import { type Question } from '../types';

const { useQuizById, deleteQuiz, updateQuiz } = useQuiz();
const { user } = useAuth();
const { createSession } = useSession();

const route = useRoute();
const router = useRouter();

const quizId = route.params.id as string;
const { quiz } = useQuizById(quizId);
const questions = ref<Array<Question>>([]);

const handleDelete = () => {
    deleteQuiz(quizId);
}

const handleUpdate = () => {
    updateQuiz(quizId, {
        questions: questions.value
    })
}

const handleSession = async () => {
    if (!user.value) return;

    const sessionId = await createSession(quizId, user.value?.uid);
    router.push(`/session/${sessionId}`);
}

const handleQuestion = () => {
    const newQuestion: Question = {
        id: crypto.randomUUID(),
        text: `Question N${questions.value.length}`,
        choices: [
            "Answer 1",
            "Answer 2",
            "Answer 3",
            "Answer 4",
        ],
        correctChoice: null,
        timeLimit: 10000,
    }

    questions.value.push(newQuestion);
}

const handleCorrectChoice = (id: string, choiceId: number) => {
    const question = questions.value.find((value) => id == value.id);
    if (!question) return;

    question.correctChoice = encodeChoice(question?.choices[choiceId], quizId);
}
</script>

<template>
    <template v-if="quiz != null">
        <h2>This is game page</h2>
        <h3>{{ quiz.title }}</h3>
        <div>
            <button @click="handleQuestion">Add a question</button>
        </div>
        <div>
            <form v-for="(question, qIndex) in questions" :key="question.id || qIndex">
                <span>{{ qIndex + 1 }}. {{ question.text }}</span>

                <div>
                    <label v-for="(choice, cIndex) in question.choices" :key="cIndex">
                        <input type="radio" :name="`question-${qIndex}`" :value="cIndex"
                            @change="() => handleCorrectChoice(question.id as string, cIndex)" />
                        <span>{{ choice }}</span>
                    </label>
                </div>

            </form>
        </div>
        <div>
            <button @click="handleSession">Create a session</button>
        </div>
        <div>
            <button @click="handleUpdate">Update quiz</button>
            <button @click="handleDelete">Delete quiz</button>
        </div>
    </template>
</template>