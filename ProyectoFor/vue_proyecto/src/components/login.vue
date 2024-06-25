<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const username = ref('');
const password = ref('');
const loggedIn = ref(false);
const router = useRouter();

const login = async () => {
    try {
        const response = await axios.post('http://localhost:3001/login', {
            username: username.value,
            password: password.value
        });
        if (response.data.success) {
            loggedIn.value = true;
            const userId = response.data.userId;
            localStorage.setItem('userId', userId);
            alert(response.data.message);
            const roleResponse = await axios.get(`http://localhost:3001/user-role/${userId}`);
            if (roleResponse.data.success) {
                const role = roleResponse.data.role;
                if (role === 'alumno') {
                    router.push('/principal');
                } else if (role === 'profesor') {
                    router.push('/principalProfesor');
                } else {
                    alert('Rol no reconocido.');
                }
            } else {
                alert('Error al obtener el rol del usuario.');
            }
        } else {
            alert(response.data.message);
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        if (error.response) {
            alert(error.response.data.message);
        } else {
            alert('Error en el inicio de sesión.');
        }
    }
};
</script>

<template>
    <div>
        <h1>Iniciar sesión</h1>
        <form @submit.prevent="login">
            <div>
                <label for="username">Nombre de usuario:</label>
                <input type="text" id="username" v-model="username" required>
            </div>
            <div>
                <label for="password">Contraseña:</label>
                <input type="password" id="password" v-model="password" required>
                <p>Cambia tu contraseña <router-link to="/cambiar">Cambiar</router-link></p>
            </div>
            <p>No tienes cuenta? <router-link to="/registrar">Sign up</router-link></p>
            <p>Verifica tu cuenta <router-link to="/verificar">Verificar</router-link></p>
            <div style="text-align: right; padding-top: 100px;">
            <button>Iniciar sesión</button>
            </div>
        </form>
    </div>
</template>

<style scoped>

</style>
