<script setup lang="ts">
import { ref } from 'vue';

import { useAuth } from '../../composables/useAuth';

const { register } = useAuth();

const email = ref<string>("");
const pass = ref<string>("");

const handleInput = async (event:PointerEvent) => {
    event.preventDefault();
    await register(email.value, pass.value);
}
</script>

<template>
    <h3>This is register</h3>
    <form>
        <label>
            <div>Email</div>
            <input type="text" name="email" v-model="email">
        </label>
        <label>
            <div>Password</div>
            <input type="text" name="password" v-model="pass">
        </label>

        <div>
            <button @click="handleInput">Register</button>
        </div>
    </form>
</template>