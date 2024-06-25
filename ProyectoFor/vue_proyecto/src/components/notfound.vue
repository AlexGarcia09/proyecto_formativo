<template>
    <div>
    <h1>404 &nbsp PAGINA NO ENCONTRADA</h1>
    <p class="parrafo">La página que estás buscando no existe.</p>
    <router-link to="/"><button class="volver">Volver</button></router-link>
    </div>
</template>

<script>
export default {
    name: "notFound"
};
</script>

<style scoped>
h1 {
    color: #ff0000;
}
.volver{
    margin-top: 100px;
}
.parrafo{
    margin-top: 50px;
}
</style>