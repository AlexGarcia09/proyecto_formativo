<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const token = ref('');
const router = useRouter();
const verifyToken = async () => {
    try {
        const response = await axios.post('http://localhost:3001/verificar', { token: token.value });
        alert(response.data);
        router.push('/');
    } catch (error) {
        alert('Error al verificar el token.');
    }
};
</script>

<template>
    <h1>Verificar</h1>
    <p>Verifica tu cuenta, tienes el token en tu correo!!</p> 
    <div>
        <label for="token">Token:</label>
        <input type="text" id="token" v-model="token" >
    </div>
    <div style="text-align: right; padding-top: 100px;">
    <button @click="verifyToken">Verificar</button>
</div>
    <p>Inicia sesión! <router-link to="/">Login</router-link></p>
</template>

<style scoped>  
</style>
