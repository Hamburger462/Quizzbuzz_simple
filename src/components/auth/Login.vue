<script setup lang="ts">
import { ref } from 'vue';

import { useAuth } from '../../composables/useAuth';

const { login } = useAuth();

const email = ref<string>("");
const pass = ref<string>("");

const handleInput = (event: PointerEvent) => {
    event.preventDefault();

    login(email.value, pass.value);
}
</script>

<template>
    <h3>This is login</h3>
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
            <button @click="handleInput">Login</button>
        </div>
    </form>
</template>