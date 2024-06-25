<script setup>
import { ref } from 'vue';
import axios from 'axios';

const nombre = ref('');
const apellidos = ref('');
const username = ref('');
const correo = ref('');
const password = ref('');
const reppassword = ref('');
const selectedRole = ref('');
const token = ref('');
const tokenver = '3rhb23uydb238ry6g2429hrh';
const isProfesor = ref(false);

async function registrarUsuario() {
    if (!nombre.value || !apellidos.value || !username.value || !correo.value || !password.value || !reppassword.value || !selectedRole.value) {
        alert('Por favor complete todos los campos');
        return;
    }
    if (password.value !== reppassword.value) {
        alert('Las contraseñas no coinciden');
        return;
    }

    if (isProfesor.value && token.value !== tokenver) {
        alert('Token inválido');
        return;
    }
    const userData = {
        username: username.value,
        name: nombre.value,
        surenames: apellidos.value,
        email: correo.value,
        password: password.value,
        role: selectedRole.value
    };
    try {
        const response = await axios.post('http://localhost:3001/registrar', userData);
        alert(response.data);
        resetForm();
    } catch (error) {
        if (error.response && error.response.status === 400) {
            alert('El nombre de usuario ya está en uso.');
        } else if(error.response && error.response.status === 430){
            alert('Error correo no valido');
        }else{
            alert('Error al registrar usuario');
        }
    }
} 
function handleRoleChange() {
    isProfesor.value = selectedRole.value === '1';
}
function resetForm() {
    nombre.value = '';
    apellidos.value = '';
    username.value = '';
    correo.value = '';
    password.value = '';
    reppassword.value = '';
    selectedRole.value = '';
    token.value = '';
}
</script>

<template>
    <h1>Registro</h1>
    <div>
        <label for="nombre">Nombre:</label>
        <input type="text" id="nombre" v-model="nombre">
    </div>
    <div>
        <label for="apellidos">Apellidos:</label>
        <input type="text" id="apellidos" v-model="apellidos">
    </div>
    <div>
        <label for="username">Nombre de usuario:</label>
        <input type="text" id="username" v-model="username">
    </div>
    <div>
        <label for="correo">Correo:</label>
        <input type="email" id="correo" v-model="correo" >
    </div>
    <div>
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password">
    </div>
    <div>
        <label for="reppassword">Repetir contraseña:</label>
        <input type="password" id="reppassword" v-model="reppassword" >
    </div>
    <div>
        <label for="rol">Rol:</label>
        <select v-model="selectedRole" @change="handleRoleChange">
            <option value="" disabled>Rol</option>
            <option value="2">Alumno</option>
            <option value="1">Profesor</option>
        </select>
    </div>
    <div v-if="isProfesor">
        <label for="token">Token:</label>
        <input type="text" id="token" v-model="token" >
    </div>
    
    <p>¿Ya tienes cuenta?  <router-link to="/">Login</router-link></p>
    <div style="text-align: right; padding-top: 100px;">
    <button @click="registrarUsuario">Registrar</button>
    </div>
</template>

<style scoped>
    
</style>
