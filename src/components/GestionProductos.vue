<script setup>
import { ref } from 'vue'
const loadingTable = ref(false);
const filter = ref("");

const columns = ref([
    {
        name: 'codigo',
        label: 'Código',
        align: 'center',
        field: 'codigo'
    },
    {
        name: 'nombre',
        label: 'Nombre',
        align: 'center',
        field: 'nombre'
    },
    {
        name: 'descripcion',
        label: 'Descripción',
        align: 'center',
        field: 'descripcion'
    },
    {
        name: 'unidadMedida',
        label: 'Unidad Medida',
        align: 'center',
        field: 'unidadMedida'
    },
    {
        name: 'precioUnitario',
        label: 'Precio unitario',
        align: 'center',
        field: 'precioUnitario'
    },
    {
        name: 'tipoProducto',
        label: 'Tipo de producto',
        align: 'center',
        field: 'tipoProducto'
    },
    {
        name: 'iva',
        label: 'Iva',
        align: 'center',
        field: 'iva'
    },
    {
        name: 'estado',
        label: 'Estado',
        align: 'center',
        field: 'estado'
    },
    {
        name: "opciones",
        label: "Opciones",
        align: 'center',
        field: "opciones",
    },
]);
const rows = ref([]);

</script>

<template>
    <main>
        <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadingTable" loading-label="Cargando..."
            :filter="filter" rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" title="Productos"
            no-data-label="No hay productos registrados.">
            <template v-slot:top>
                <q-input borderless dense debounce="300" color="primary" v-model="filter" class="buscar"
                    placeholder="Buscar cualquier campo">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>
        </q-table>
    </main>
</template>