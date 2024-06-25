<script>
import axios from 'axios';

const tokenver = '3rhb23uydb238ry6g2429hrh';

export default {
    data() {
        return {
            user: {
                role: '' 
            },
            profileImageUrl: null,
            selectedFile: null,
            shareLink: '',
            isProfesor: false,
            roles: [
                { value: '2', text: 'Alumno' },
                { value: '1', text: 'Profesor' }
            ],
            token: ''
        };
    },
    async mounted() {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                console.error('No se encontró el ID del usuario.');
                return;
            }
            const response = await axios.get(`http://localhost:3001/perfil/${userId}`);
            this.user = response.data.user;
            this.isProfesor = this.user.role === '1';
            this.loadProfileImage(userId);
        } catch (error) {
            console.error('Error al obtener la información del usuario:', error);
        }
    },
    methods: {
        volver() {
            if (this.user) {
                const roleName = this.user.Role.role_name;
                if (roleName === 'alumno') {
                    this.$router.push('/principal');
                } else if (roleName === 'profesor') {
                    this.$router.push('/principalprofesor');
                } else {
                    console.error('Rol del usuario no reconocido.');
                }
            } else {
                console.error('Usuario no encontrado.');
            }
        },
        onFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async uploadImage() {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.error('No se encontró el ID del usuario.');
                    return;
                }
                const formData = new FormData();
                formData.append('imagen', this.selectedFile);
                const response = await axios.post(`http://localhost:3001/perfil/${userId}/imagen`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.data.success) {
                    alert('Imagen de perfil subida correctamente.');
                    this.loadProfileImage(userId);
                } else {
                    alert('Error al subir la imagen de perfil.');
                }
            } catch (error) {
                console.error('Error al subir la imagen de perfil:', error);
                alert('Error al subir la imagen de perfil.');
            }
        },
        async loadProfileImage(userId) {
            try {
                const response = await axios.get(`http://localhost:3001/perfil/${userId}/imagen`, { responseType: 'blob' });
                if (response.status === 200) {
                    this.profileImageUrl = URL.createObjectURL(response.data);
                }
            } catch (error) {
                console.error('Error al cargar la imagen de perfil:', error);
            }
        },
        async updateProfile() {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) {
                    console.error('No se encontró el ID del usuario.');
                    return;
                }
                if (this.isProfesor && this.token !== tokenver) {
                    alert('Token inválido');
                    return;
                }
                const response = await axios.put(`http://localhost:3001/perfil/${userId}`, this.user);
                if (response.data.success) {
                    alert('Perfil actualizado correctamente.');
                } else {
                    alert('Error al actualizar el perfil.');
                }
            } catch (error) {
                console.error('Error al actualizar el perfil:', error);
                alert('Error al actualizar el perfil.');
            }
        },
        generateShareLink() {
            const userId = localStorage.getItem('userId');
            if (userId && this.user && this.user.access_token) {
                this.shareLink = `http://localhost:5173/perfil/${this.user.access_token}`;
                
                navigator.clipboard.writeText(this.shareLink).then(() => {
                    alert("El enlace para compartir tu perfil ha sido copiado al portapapeles: " + this.shareLink);
                }).catch(err => {
                    console.error('No se pudo copiar el enlace al portapapeles', err);
                });
            } else {
                console.error('No se pudo generar el enlace de compartir.');
            }
        },
        handleRoleChange() {
            this.isProfesor = this.user.role === '1';
        }
    },
};
</script>

<template>
    <div>
        <h1>Perfil del Usuario</h1>
        <div>
            <img :src="profileImageUrl" alt="Imagen de perfil" v-if="profileImageUrl" style="width: 100px;" />
            <form @submit.prevent="uploadImage">
                <input type="file" @change="onFileChange" accept="image/*" required />
                <button type="submit">Cambiar imagen</button>
            </form>
        </div>
        <div v-if="user">
            <form @submit.prevent="updateProfile">
                <ul>
                    <li>
                        <strong>Nombre de usuario:</strong>
                        <input v-model="user.username" type="text" />
                    </li>
                    <li>
                        <strong>Nombre:</strong>
                        <input v-model="user.name" type="text" />
                    </li>
                    <li>
                        <strong>Apellidos:</strong>
                        <input v-model="user.surenames" type="text" />
                    </li>
                    <li>
                        <strong>Email:</strong>
                        <input v-model="user.email" type="email" />
                    </li>
                    <li>
                        <strong>Rol:</strong>
                        <select v-model="user.role" @change="handleRoleChange">
                            <option v-for="role in roles" :key="role.value" :value="role.value">{{ role.text }}</option>
                        </select>
                    </li>
                    <li v-if="isProfesor">
                        <strong>Token:</strong>
                        <input v-model="token" type="text" />
                    </li>
                </ul>
                <button type="submit">Guardar cambios</button>
            </form>
        </div>
        <br>
        <button @click="generateShareLink">Compartir perfil</button>
        <br>
        <button @click="volver">Volver</button>
    </div>
</template>

<style scoped>
div {
    padding: 20px;
}
h1 {
    margin-bottom: 20px;
}
p {
    margin: 10px 0;
}
form {
    margin-top: 20px;
}
button {
    margin-top: 10px;
    margin-right: 10px;
}
</style>