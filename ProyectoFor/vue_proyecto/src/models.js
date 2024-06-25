const { DataTypes } = require("sequelize");
const sequelize = require('./database');

const User = sequelize.define("User", {
    username: DataTypes.STRING,
    name: DataTypes.STRING,
    surenames: DataTypes.STRING,
    email: DataTypes.STRING,
    password_token: DataTypes.STRING,
    role: DataTypes.INTEGER,
    access_token: DataTypes.STRING,
    imagen: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
    },
    active: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: "users",
    timestamps: false
});

const Union = sequelize.define("Union", {
    id_student: DataTypes.INTEGER,
    id_teacher: DataTypes.INTEGER,
    id_subject: DataTypes.INTEGER
}, {
    tableName: "students_teachers_relation",
    timestamps: false
});

const Roles = sequelize.define("Roles", {
    role_name: DataTypes.STRING
}, {
    tableName: "roles",
    timestamps: false
});

const Asignatura = sequelize.define("Asignatura", {
    nombre: DataTypes.STRING
}, {
    tableName: "asignatura",
    timestamps: false
});
User.hasMany(Union, { foreignKey: 'id_student' });
Union.belongsTo(User, { foreignKey: 'id_student', as: 'student' });

User.hasMany(Union, { foreignKey: 'id_teacher', as: 'teacher' });
Union.belongsTo(User, { foreignKey: 'id_teacher', as: 'teacher' });

Roles.hasMany(User, { foreignKey: 'role' });
User.belongsTo(Roles, { foreignKey: 'role' });

Asignatura.hasMany(Union, { foreignKey: 'id_subject' });
Union.belongsTo(Asignatura, { foreignKey: 'id_subject' });

sequelize.sync().then(() => {
    console.log("Modelos sincronizados con la base de datos");
}).catch(err => {
    console.error("Error al sincronizar los modelos:", err);
});
module.exports = {
    User,
    Union,
    Roles,
    Asignatura
};
