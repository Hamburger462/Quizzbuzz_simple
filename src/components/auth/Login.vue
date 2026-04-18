<script setup lang="ts">
import { ref } from 'vue';

import { useAuth } from '../../composables/useAuth';

const { login } = useAuth();

const emailVal = ref<string>("");
const passVal = ref<string>("");

const handleInput = (event: PointerEvent) => {
    event.preventDefault();

    login(emailVal.value, passVal.value);
}
</script>

<template>
    <h3>This is login</h3>
    <form>
        <label>
            <div>Email</div>
            <input type="text" name="email" v-model="emailVal">
        </label>
        <label>
            <div>Password</div>
            <input type="text" name="password" v-model="passVal">
        </label>

        <div>
            <button @click="handleInput">Login</button>
        </div>
    </form>
</template>