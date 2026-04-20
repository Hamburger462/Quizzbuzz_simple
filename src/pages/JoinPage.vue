<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const sessionCode = ref<string>("");

const handleJoin = () => {
    router.push(`/session/${sessionCode.value}`);
}
</script>

<template>
    <h2>This is join page</h2>
    <label>
        <span>Enter the session code</span>
        <input type="text" name="sessionCode" v-model="sessionCode">
    </label>
    <div>
        <button @click="handleJoin">Enter the session</button>
    </div>
</template>