<script>
import axios from 'axios';
export default {
    data() {
        return {
            asignaturasProfesor: [],
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
            const response = await axios.get('http://localhost:3001/profesor/asignaturas', {
                params: { userId: userId }
            });
            this.asignaturasProfesor = response.data.asignaturasProfesor;
            const imageResponse = await axios.get(`http://localhost:3001/imagen/${userId}`, {
                responseType: 'blob'
            });
            this.profileImageUrl = URL.createObjectURL(imageResponse.data);
			const nombreResponse = await axios.get(`http://localhost:3001/perfil/${userId}`);
            this.usuarioNombre = nombreResponse.data.user.name;
        } catch (error) {
            console.error('Error al obtener asignaturas del profesor:', error);
        }
    },
    computed: {
        filteredAsignaturas() {
            return this.asignaturasProfesor.filter(asignatura => 
                asignatura.student.name.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        }
    },
    methods: {
        async eliminarUnion(id_union) {
            try {
                const response = await axios.delete('http://localhost:3001/eliminar/union', {
                    data: { id_union: id_union }
                });
                if (response.data.success) {
                    alert('Relación eliminada correctamente.');
                    this.asignaturasProfesor = this.asignaturasProfesor.filter(asignatura => asignatura.id !== id_union);
                } else {
                    alert('Error al eliminar la relación: ' + response.data.message);
                }
            } catch (error) {
                console.error('Error al eliminar la relación:', error);
                alert('Error al eliminar la relación');
            }
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
            <input type="text" v-model="searchQuery" placeholder="Buscar por nombre del alumno">
        </div>
        <table v-if="filteredAsignaturas.length">
            <thead>
                <tr>
                    <th>Alumno</th>
                    <th>Apellidos</th>
                    <th>Email</th>
                    <th>Asignatura</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="asignatura in filteredAsignaturas" :key="asignatura.id">
                    <td>{{ asignatura.student.name }}</td>
                    <td>{{ asignatura.student.surenames }}</td>
                    <td>{{ asignatura.student.email }}</td>
                    <td>{{ asignatura.Asignatura.nombre }}</td>
                    <td>
                        <router-link :to="'/editar-asignatura/' + asignatura.id">
                            <button><img src="../assets/img/Edit.png" width="25px" height="25px"/></button>
                        </router-link>
                        <button @click="eliminarUnion(asignatura.id)">
                            <img src="../assets/img/Trash.png" width="25px" height="25px"/>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-else>No tienes asignaturas asignadas.</p>
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
    padding-left: 20px;
    padding-right: 20px;
    text-align: left;
}
th {
    background-color: #000a38;
}
</style>