import { createRouter, createWebHistory } from "vue-router";
import Registrar from "/src/components/registrar.vue";
import login from "./components/login.vue";
import Princi from "./components/principal.vue";
import PrinciProfe from "./components/principalProfesor.vue";
import cambi from "./components/cambiar.vue";
import verif from "./components/verificar.vue";
import actua from "./components/cambioPass.vue";
import editarA from "./components/editarAsignatura.vue";
import perfil from "./components/perfil.vue";
import notFound from "./components/notfound.vue";
import compartirUsuario from "./components/compartirUsuario.vue";

const routes = [
    {
        path: "/registrar",
        name: "Registrar",
        component: Registrar
    },
    {
        path: "",
        name: "login",
        component: login
    },
    {
        path: "/principal",
        name: "principal",
        component: Princi
    },
    {
        path: "/principalProfesor",
        name: "principalProfesor",
        component: PrinciProfe
    },
    {
        path: "/cambiar",
        name: "cambi",
        component: cambi
    },
    {
        path: "/verificar",
        name: "verificar",
        component: verif
    },
    {
        path: "/actualizar",
        name: "actualizar",
        component: actua
    },
    {
        path: "/editar-asignatura/:id",
        name: "editarAsignatura",
        component: editarA
    },
    {
        path: "/perfil",
        name: "perfil",
        component: perfil
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        component: notFound
    },
    {
        path: "/perfil/:token",
        name: "compartirUsuario",
        component: compartirUsuario
    }
    ];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
