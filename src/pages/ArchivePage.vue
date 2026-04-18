<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuth } from '../composables/useAuth';
import { useQuiz } from '../composables/useQuiz';

const router = useRouter();

const { user } = useAuth();
const { createQuiz } = useQuiz();

const title = ref<string>("");

const handleCreate = async () => {
    if(!user.value) return;

    const quiz_id = await createQuiz(title.value, user.value.uid);
    router.push(`/game/${quiz_id}`);
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
</template>