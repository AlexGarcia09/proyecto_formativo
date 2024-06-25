const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const multer = require('multer');
const { User, Union, Roles, Asignatura } = require('./models');

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const PORT = 3001;
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'alexgrlp61@gmail.com',
        pass: 'hbeukuxzftkrrpqp'
    }
});
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const getUserRole = async (userId) => {
    try {
        const user = await User.findByPk(userId, {
            include: {
                model: Roles,
                attributes: ['role_name']
            }
        });
        if (!user) {
            throw new Error('Usuario no encontrado.');
        }
        return user.Role.role_name;
    } catch (error) {
        console.error('Error al obtener el rol del usuario:', error);
        throw error;
    }
};
app.get('/user-role/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const role = await getUserRole(userId);
        res.status(200).json({ success: true, role });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener el rol del usuario.' });
    }
});
app.post("/registrar", async (req, res) => {
    if (!emailRegex.test(req.body.email)) {
        return res.status(430).send("Correo electrónico no válido.");
    }
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const validationToken = Math.random().toString(36).substr(2, 9);
        const nuevoUsuario = await User.create({
            username: req.body.username,
            name: req.body.name,
            surenames: req.body.surenames,
            email: req.body.email,
            password_token: hashedPassword,
            role: req.body.role,
            access_token: validationToken,
            active: false
        });
        const mailOptions = {
            from: 'alexgrlp61@gmail.com',
            to: nuevoUsuario.email,
            subject: 'Confirmación de cuenta',
            text: `Por favor, valida tu cuenta usando el siguiente código: ${validationToken}`
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send("Error al enviar correo de validación.");
            } else {
                console.log("Correo enviado: " + info.response);
                res.status(200).send("Usuario registrado correctamente. Revisa tu correo para validar tu cuenta.");
            }
        });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            res.status(400).send("El nombre de usuario ya está en uso.");
        } else {
            res.status(500).send("Error al registrar usuario.");
        }
    }
});
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(400).json({ success: false, message: "Nombre de usuario incorrecto." });
        }
        if (!user.active) {
            return res.status(400).json({ success: false, message: "Usuario no activo. Por favor, verifica tu cuenta." });
        }
        const isMatch = await bcrypt.compare(password, user.password_token);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Contraseña incorrecta." });
        }
        res.status(200).json({ success: true, message: "Inicio de sesión exitoso.", userId: user.id });
    } catch (error) {   
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ success: false, message: "Error en el inicio de sesión. Por favor, intenta nuevamente." });
    }
});
app.post("/verificar", async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User.findOne({ where: { access_token: token } });

        if (!user) {
            return res.status(400).send("Token inválido.");
        }
        user.active = true;
        await user.save();
        res.status(200).send("Cuenta validada correctamente.");
    } catch (error) {
        res.status(500).send("Error al validar cuenta.");
    }
});
app.post('/request-password-reset', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Correo electrónico no encontrado.' });
        }
        if (!user.active) {
            return res.status(400).json({ success: false, message: 'Cuenta no activa. Por favor, verifica tu cuenta.' });
        }
        const resetLink = `http://localhost:5173/actualizar?token=${user.access_token}`; 
        const mailOptions = {
            to: email,
            from: 'alexgrlp61@gmail.com',
            subject: 'Cambio de contraseña',
            text: `Haz clic en el siguiente enlace para cambiar tu contraseña: ${resetLink}`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Enlace de cambio de contraseña enviado.' });
    } catch (error) {
        console.error('Error en la solicitud de cambio de contraseña:', error);
        res.status(500).json({ success: false, message: 'Error en la solicitud de cambio de contraseña.' });
    }
});
app.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const user = await User.findOne({ where: { access_token: token } });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Token de cambio de contraseña no válido o expirado.' });
        }
        user.password_token = await bcrypt.hash(newPassword, 10);
        await user.save();

        return res.status(200).json({ success: true, message: 'Contraseña actualizada exitosamente.' });
    } catch (error) {
        console.error('Error en la actualización de la contraseña:', error);
        return res.status(500).json({ success: false, message: 'Error en la actualización de la contraseña.' });
    }
});
app.get('/alumno/asignaturas', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'ID de usuario faltante.' });
        }
        const asignaturas = await Union.findAll({
            where: { id_student: userId },
            include: [
                {
                    model: Asignatura,
                    attributes: ['nombre']
                },
                {
                    model: User,
                    as: 'teacher',
                    attributes: ['name', 'surenames', 'email']
                }
            ]
        });
        if (!asignaturas.length) {
            return res.status(404).json({ success: false, message: 'No se encontraron asignaturas para este alumno.' });
        }
        res.status(200).json({ success: true, asignaturas });
    } catch (error) {
        console.error('Error al obtener asignaturas del alumno:', error);
        res.status(500).json({ success: false, message: 'Error al obtener asignaturas del alumno.' });
    }
});
app.get('/profesor/asignaturas', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'ID de usuario faltante.' });
        }
        const asignaturasProfesor = await Union.findAll({
            where: { id_teacher: userId },
            include: [
                {
                    model: Asignatura,
                    attributes: ['nombre']
                },
                {
                    model: User,
                    as: 'student',
                    attributes: ['name', 'surenames', 'email'] 
                }
            ]
        });
        if (!asignaturasProfesor.length) {
            return res.status(404).json({ success: false, message: 'No se encontraron asignaturas para este profesor.' });
        }
        res.status(200).json({ success: true, asignaturasProfesor });
    } catch (error) {
        console.error('Error al obtener asignaturas del profesor:', error);
        res.status(500).json({ success: false, message: 'Error al obtener asignaturas del profesor.' });
    }
});
app.delete('/eliminar/union', async (req, res) => {
    try {
        const { id_union } = req.body;
        if (!id_union) {
            return res.status(400).json({ success: false, message: 'Faltan parámetros necesarios.' });
        }
        const result = await Union.destroy({
            where: {
                id: id_union
            }
        });
        if (result === 0) {
            return res.status(404).json({ success: false, message: 'No se encontró la relación para eliminar.' });
        }
        res.status(200).json({ success: true, message: 'Relación eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar la relación:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar la relación.' });
    }
});
app.put('/editar/union', async (req, res) => {
    const { id, id_student, id_teacher, id_subject } = req.body;

    console.log(req.body);
    if (!id || !id_student || !id_teacher || !id_subject) {
        return res.status(400).json({ success: false, message: 'Faltan parámetros necesarios.' });
    }
    try {
        const union = await Union.findByPk(id);

        if (!union) {
            return res.status(404).json({ success: false, message: 'No se encontró la relación.' });
        }
        union.id_student = id_student;
        union.id_teacher = id_teacher;
        union.id_subject = id_subject;
        await union.save();

        res.status(200).json({ success: true, message: 'Relación actualizada correctamente.' });
    } catch (error) {
        console.error('Error al actualizar la relación:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar la relación.' });
    }
});
app.get('/users', async (req, res) => {
    try {
        const students = await User.findAll({ where: { role: '2' }, attributes: ['id', 'name', 'surenames'] });
        res.status(200).json({ success: true, students });
    } catch (error) {
        console.error('Error al obtener los estudiantes:', error);
        res.status(500).json({ success: false, message: 'Error al obtener los estudiantes.' });
    }
});
app.get('/asignaturas', async (req, res) => {
    try {
        const asignaturas = await Asignatura.findAll({ attributes: ['id', 'nombre'] });
        res.status(200).json({ success: true, asignaturas });
    } catch (error) {
        console.error('Error al obtener las asignaturas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener las asignaturas.' });
    }
});
app.get('/union/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const union = await Union.findByPk(id, {
            include: [
                { model: User, as: 'student', attributes: ['id', 'name', 'surenames', 'email'] },
                { model: Asignatura, attributes: ['id', 'nombre'] }
            ]
        });
        if (!union) {
            return res.status(404).json({ success: false, message: 'No se encontró la relación.' });
        }
        res.status(200).json({ success: true, union });
    } catch (error) {
        console.error('Error al obtener la relación:', error);
        res.status(500).json({ success: false, message: 'Error al obtener la relación.' });
    }
});
app.get('/perfil/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId, {
            attributes: ['id', 'username', 'name', 'surenames', 'email', 'role', 'access_token'],
            include: [
                {
                    model: Roles,
                    attributes: ['role_name']
                }
            ]
        });
        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ success: false, message: 'Error al obtener el usuario.' });
    }
});
app.post('/perfil/:userId/imagen', upload.single('imagen'), async (req, res) => {
    try {
        const { userId } = req.params;
        const imagen = req.file.buffer;
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ success: false, message: 'Usuario no encontrado.' });
        }
        user.imagen = imagen;
        await user.save();

        res.status(200).send({ success: true, message: 'Imagen de perfil actualizada correctamente.' });
    } catch (error) {
        console.error('Error al subir la imagen de perfil:', error);
        res.status(500).send({ success: false, message: 'Error al subir la imagen de perfil.' });
    }
});
app.get('/perfil/:userId/imagen', async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);

        if (!user || !user.imagen) {
            return res.status(404).send({ success: false, message: 'Imagen no encontrada.' });
        }
        res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        res.end(user.imagen);
    } catch (error) {
        console.error('Error al obtener la imagen de la base de datos:', error);
        res.status(500).send({ success: false, message: 'Error al obtener la imagen de la base de datos.' });
    }
});
app.put('/perfil/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { username, name, surenames, email, role } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
        return res.status(404).send({ error: 'Usuario no encontrado' });
        }
        user.username = username;
        user.name = name;
        user.surenames = surenames;
        user.email = email;
        user.role = role;

        await user.save();

        res.send({ success: true, user: user.toJSON() });
    } catch (error) {
        console.error('Error al actualizar el perfil del usuario:', error);
        res.status(500).send({ error: 'Error al actualizar el perfil del usuario' });
    }
});
app.get('/usuario/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const user = await User.findOne({ where: { access_token: token } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ success: false, message: 'Error al obtener el usuario' });
    }
});
app.get('/imagen/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: ['imagen']
        });

        if (!user || !user.imagen) {
            return res.status(404).send('Imagen no encontrada.');
        }

        const imagen = user.imagen;
        res.writeHead(200, {
            'Content-Type': 'image/jpeg',
            'Content-Length': imagen.length
        });
        res.end(imagen);
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        res.status(500).send('Error al obtener la imagen.');
    }
});
app.get('/conexion/:id', async (req, res) => {
    try{
        
    }catch(error){
        console.error('Error al obtener la ultima conexion:', error);
        res.status(500).send('Error al obtener la ultima conexion.');
    }

});
app.listen(PORT, () => {
    console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
