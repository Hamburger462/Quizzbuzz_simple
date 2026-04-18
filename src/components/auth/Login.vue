<script setup lang="ts">
import { ref } from 'vue';

import { useAuth } from '../../composables/useAuth';

const { login } = useAuth();

const emailVal = ref<string>("");
const passVal = ref<string>("");

const handleInput = (event:PointerEvent) => {
    event.preventDefault();

    login(emailVal.value, passVal.value);
}
</script>

<template>
    <form>
        <label>
            <div>Email</div>
            <input type="text" name="email" v-model="emailVal">
        </label>
        <label>
            <div>Password</div>
            <input type="text" name="password" v-model="passVal">
        </label>

        <button @click="handleInput">Login</button>
    </form>
</template>