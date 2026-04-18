<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuth } from '../composables/useAuth';
import { useQuiz, subscribeToUserQuizzes } from '../composables/useQuiz';

const router = useRouter();

const { user } = useAuth();
const { createQuiz } = useQuiz();

const title = ref<string>("");
const quizzes = ref<any>([]);

const unsubscribe = subscribeToUserQuizzes(user.value?.uid as string, (data: any) => {
    quizzes.value = data;
});

onUnmounted(() => {
    unsubscribe();
})

const handleCreate = async (event: PointerEvent) => {
    event.preventDefault();

    if (!user.value) return;

    const quiz_id = await createQuiz(title.value, user.value.uid);
    // router.push(`/game/${quiz_id}`);
}
</script>

<template>
    <h2>This is archive page</h2>

    <form>
        <label>
            <div>Title</div>
            <input type="text" v-model="title">
        </label>

        <div>
            <button @click="handleCreate">Create quiz</button>
        </div>
    </form>

    <div v-for="quiz in quizzes">
        <span>{{ quiz.title }}</span>
    </div>
</template>