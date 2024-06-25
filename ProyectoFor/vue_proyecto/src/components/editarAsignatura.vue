<script>
import axios from 'axios';
export default {
    data() {
        return {
            union: {
                id: '',
                id_student: '',
                id_subject: ''
            },
            students: [],
            asignaturas: [] 
        };
    },
    async mounted() {
        const id_union = this.$route.params.id;
        try {
            const [unionResponse, studentsResponse, asignaturasResponse] = await Promise.all([
                axios.get(`http://localhost:3001/union/${id_union}`),
                axios.get('http://localhost:3001/users'),
                axios.get('http://localhost:3001/asignaturas')
            ]);
            this.union = unionResponse.data.union;
            this.students = studentsResponse.data.students;
            this.asignaturas = asignaturasResponse.data.asignaturas;
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    },
    methods: {
        volver() {
            this.$router.push('/principalProfesor');
        },
        async editarUnion() {
            if (!this.union.id_student || !this.union.id_subject) {
                alert('Por favor, complete todos los campos.');
                return;
            }
            try {
                const response = await axios.put('http://localhost:3001/editar/union', this.union);
                if (response.data.success) {
                    alert('Relación actualizada correctamente.');
                    this.$router.push('/principalProfesor');
                } else {
                    alert('Error al actualizar la relación: ' + response.data.message);
                }
            } catch (error) {
                console.error('Error al actualizar la relación:', error);
                alert('Error al actualizar la relación. Por favor, intenta nuevamente.');
            }
        }
    }
};
</script>

<template>
    <div>
        <h1>Editar Asignatura</h1>
        <form @submit.prevent="editarUnion">
            <div>
                <label>Estudiante:</label>
                <select v-model="union.id_student">
                    <option v-for="student in students" :key="student.id" :value="student.id">
                        {{ student.name }} {{ student.surenames }}
                    </option>
                </select>
            </div>
            <div>
                <label>Asignatura:</label>
                <select v-model="union.id_subject">
                    <option v-for="asignatura in asignaturas" :key="asignatura.id" :value="asignatura.id">
                        {{ asignatura.nombre }}
                    </option>
                </select>
            </div>
            <br>
            <button type="submit">Guardar Cambios</button>
        </form>
    </div>
    <br>
    <button @click="volver">Volver</button>
</template>

<style scoped>
</style>
