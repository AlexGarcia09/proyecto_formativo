<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const newPassword = ref('');
const confirmPassword = ref('');
const route = useRoute();
const router = useRouter();
const resetPassword = async () => {
if (newPassword.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden.');
    return;
}
try {
    const response = await axios.post('http://localhost:3001/reset-password', {
    token: route.query.token,
    newPassword: newPassword.value
    });
    alert(response.data.message);
    if (response.data.success) {
    router.push('/');
    }
} catch (error) {
    console.error('Error en la actualización de la contraseña:', error);
    alert('Error en la actualización de la contraseña. Por favor, intenta nuevamente.');
}
};
</script>

<template>
<div>
    <h1>Cambiar contraseña</h1>
    <form @submit.prevent="resetPassword">
    <div>
        <label for="newPassword">Nueva contraseña:</label>
        <input type="password" id="newPassword" v-model="newPassword" required>
    </div>
    <div>
        <label for="confirmPassword">Confirmar nueva contraseña:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required>
    </div>
    <div style="text-align: right; padding-top: 100px;">
    <button type="submit">Actualizar contraseña</button>
</div>
    </form>
</div>
</template>

<style scoped>

</style>
