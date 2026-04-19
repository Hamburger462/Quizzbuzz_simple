<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

import { useQuiz } from '../composables/useQuiz';
import { useAuth } from '../composables/useAuth';
import { useSession } from '../composables/useSession';

const { useQuizById, deleteQuiz, updateQuiz } = useQuiz();
const { user } = useAuth();
const { createSession } = useSession();

const route = useRoute();
const router = useRouter();

const quizId = route.params.id as string;
const { quiz } = useQuizById(quizId);

const handleDelete = () => {
    deleteQuiz(quizId);
}

const handleUpdate = () => {
    // updateQuiz(quizId, )
}

const handleSession = () => {

}
</script>

<template>
    <h2>This is game page</h2>
    <h3>{{ quiz.title }}</h3>
    <div>
        <button @click="handleSession">Create a session</button>
    </div>
    <div>
        <button @click="handleUpdate">Update quiz</button>
        <button @click="handleDelete">Delete quiz</button>
    </div>
</template>