<script>
import axios from 'axios';

export default {
    data() {
        return {
            asignaturas: [],
            searchQuery: '',
            profileImageUrl: null ,
			usuarioNombre: ''
        };
    },
    async mounted() {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('No se encontró el ID del usuario.');
            return;
        }
        try {
            const response = await axios.get('http://localhost:3001/alumno/asignaturas', {
                params: { userId: userId }
            });
            this.asignaturas = response.data.asignaturas;
            const imageResponse = await axios.get(`http://localhost:3001/imagen/${userId}`, {
                responseType: 'blob'
            });
            this.profileImageUrl = URL.createObjectURL(imageResponse.data);
			const nombreResponse = await axios.get(`http://localhost:3001/perfil/${userId}`);
            this.usuarioNombre = nombreResponse.data.user.name;

        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    },
    computed: {
        filteredAsignaturas() {
            return this.asignaturas.filter(asignatura =>
                asignatura.teacher.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    }
};
</script>

<template>
<div>
    <h1>Asignaturas</h1>
	<div v-if="profileImageUrl">
        <h2>{{usuarioNombre}}</h2>
		<img :src="profileImageUrl" alt="Imagen de perfil" style="width: 100px;"/>
    </div>
    <div style="text-align: left; padding-top: 10px;">
        <router-link to="/perfil"><button class="perfil">Mi perfil</button></router-link>
    </div>
    <div style="padding: 10px 0;">
        <input type="text" v-model="searchQuery" placeholder="Buscar por nombre del profesor">
    </div>
    <table v-if="filteredAsignaturas.length">
        <thead>
            <tr>
                <th>Profesor</th>
                <th>Apellidos</th>
                <th>Email</th>
                <th>Asignatura</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="asignatura in filteredAsignaturas" :key="asignatura.id">
                <td>{{ asignatura.teacher.name }}</td>
                <td>{{ asignatura.teacher.surenames }}</td>
                <td>{{ asignatura.teacher.email }}</td>
                <td>{{ asignatura.Asignatura.nombre }}</td>
            </tr>
        </tbody>
    </table>
    <p v-else>No tienes asignaturas.</p>
</div>
<div style="text-align: right; padding-top: 100px;">
    <router-link to="/"><button class="cerrar">Cerrar Sesion</button></router-link>
</div>
</template>

<style scoped>
table {
    border-collapse: collapse;
    width: 100%;
}
th, td {
    border: 2px solid rgb(255, 255, 255);
    text-align: left;
}
th {
    background-color: #000a38;
    padding-left: 20px;
    padding-right: 20px;
}
td {
    padding: 20px;
}
</style>
