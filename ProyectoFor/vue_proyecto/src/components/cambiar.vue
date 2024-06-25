<script setup>
import { ref } from 'vue';
import axios from 'axios';

const email = ref('');
const requestPasswordReset = async () => {
    try {
        const response = await axios.post('http://localhost:3001/request-password-reset', { email: email.value });
        alert(response.data.message);
    } catch (error) {
        alert('Error al solicitar cambio de contraseña.');
    }
};
</script>

<template>
    <div>
        <h1>Solicitud de cambio de contraseña</h1>
        <form @submit.prevent="requestPasswordReset">
        <div>
            <label for="email">Correo electrónico:</label>
            <input type="email" id="email" v-model="email" required>
        </div>
        <p>Inicia sesion  <router-link to="/">Login</router-link></p>
        <div style="text-align: right; padding-top: 100px;">
        <button type="submit">Enviar</button>
    </div>
        </form>
    </div>
    </template>

<style scoped>

</style>
