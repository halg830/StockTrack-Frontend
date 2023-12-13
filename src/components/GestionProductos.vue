<script setup>
import { ref } from 'vue'
import { useStoreProductos } from '../Stores/productos.js'
import helpersGenerales from '../helpers/generales';
const useProductos = useStoreProductos()
const loadingTable = ref(false);
const loadingModal = ref(false)
const filter = ref("");
const modal = ref(false)

const estado = ref('agregar')
const data = ref({})

const unidadesMedida = ['lb', 'kg', 'cm', 'm', 'ml', 'L', 'no aplica']

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
        field: (row) => helpersGenerales.formatearMoneda(row.precioUnitario)
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

async function getInfo() {
    try {
        loadingTable.value = true

        const response = await useProductos.getAll()
        console.log(response);

        if (!response) return;
        if (response.error) {
            helpersGenerales.notificar('negative', response.error)
            return
        }

        rows.value = response.data

    } catch (error) {
        console.log(error);
    }
    finally {
        loadingTable.value = false
    }
}
getInfo()

const opciones = {
    agregar: () => {
        data.value = {}
        estado.value = 'agregar'
        modal.value = true
    },
    editar: (info) => {
        data.value = { ...info }
        estado.value = 'editar'
        modal.value = true
    }
}

const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true

            const response = await useProductos.agregar(data.value)
            console.log(response);

            if (!response) return
            if (response.error) {
                helpersGenerales.notificar('negative', response.error)
                return
            }

            rows.value.unshift(response)
            modal.value = false
            helpersGenerales.notificar('positive', 'Guardado exitosamente')
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false
        }
    },
    editar: async () => { }
}

function validarCampos() {
    console.log(data.value);
    const arrData = Object.values(data.value);
    console.log(arrData);
    for (const d of arrData) {
        console.log(d);
        if (d === null) {
            errorCamposVacios();
            return;
        }
        if (typeof d === "string") {
            if (d.trim() === "") {
                errorCamposVacios();
                return;
            }
        }
    }
    enviarInfo[estado.value]()
}

</script>

<template>
    <main>
        <q-dialog v-model="modal">
            <q-card class="modal">
                <q-toolbar>
                    <q-toolbar-title>{{ helpersGenerales.primeraMayus(estado) }} producto</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input outlined v-model="data.codigo" label="Código" type="text"
                            :rules="[val => !!val || 'Ingrese un código']"></q-input>

                        <q-input outlined v-model="data.nombre" label="Nombre" type="text"
                            :rules="[val => !!val || 'Ingrese un nombre']"></q-input>

                        <q-input outlined v-model="data.descripcion" label="Descripción" type="textarea"
                            :rules="[val => !!val || 'Ingrese una descripción']"></q-input>

                        <q-select outlined v-model="data.unidadMedida" label="Unidad medida" behavior="menu"
                            :options="unidadesMedida"></q-select>

                        <q-input outlined v-model="data.iva" label="Iva" type="number"
                            :rules="[val => !!val || 'Ingrese el iva']"></q-input>

                        <q-input outlined v-model="data.tipoProducto" label="Tipo de producto" type="text"
                            :rules="[val => !!val || 'Ingrese el tipo']"></q-input>

                        <q-input outlined v-model="data.precioUnitario" label="Precio unitario" type="number"
                            :rules="[val => !!val || 'Ingrese el precio unitario']"></q-input>

                        <q-btn :loading="loadingModal" padding="10px" type="submit"
                            :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
                        </q-btn>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadingTable" loading-label="Cargando..."
            :filter="filter" rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Productos"
            no-data-label="No hay productos registrados.">
            <template v-slot:top-left>
                <h4 id="titleTable">Productos</h4>
                <q-btn @click="opciones.agregar" color="primary">
                    <q-icon name="add" color="white" center />
                </q-btn>
            </template>
            <template v-slot:top-right>
                <q-input borderless dense debounce="300" color="primary" v-model="filter" class="buscar"
                    placeholder="Buscar cualquier campo" id="boxBuscar">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>
        </q-table>
    </main>
</template>

<style scoped>
#titleTable {
    margin: auto;
}

/* #boxBuscar {} */
</style>