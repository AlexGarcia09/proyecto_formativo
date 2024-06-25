<template>
    <div v-if="user">
        <h1>Perfil de Usuario</h1>
        <ul>
            <li><strong>Nombre de usuario: </strong> {{ user.username }}</li>
            <li><strong>Nombre: </strong> {{ user.name }}</li>
            <li><strong>Apellidos: </strong> {{ user.surenames }}</li>
            <li><strong>Email: </strong> {{ user.email }}</li>
            <li>
                <strong>Role: </strong> 
                <span v-if="user.role === 1">Profesor</span>
                <span v-else-if="user.role === 2">Alumno</span>
            </li>
        </ul>
    
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            user: null
        };
    },
    async mounted() {
        const token = this.$route.params.token;
        try {
            const response = await axios.get(`http://localhost:3001/usuario/${token}`);
            if (response.data.success) {
                this.user = response.data.user;
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error('Error al obtener los datos del usuario:', error);
        }
    }
};
</script>

<style scoped>
li{
    font-size: larger;
    padding-top: 20px;
}
</style>
