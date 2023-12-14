<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar';
import { useStoreProductos } from '../Stores/productos.js'
import helpersGenerales from '../helpers/generales';
const useProductos = useStoreProductos()
const loadingTable = ref(false);
const loadingModal = ref(false)
const loadIn_activar = ref(false)
const filter = ref("");
const modal = ref(false)
const $q = useQuasar()

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
}

const estado = ref('agregar')
const data = ref({})

const unidadesMedida = ['lb', 'kg', 'cm', 'm', 'ml', 'L', 'No aplica']

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
            notificar('negative', response.error)
            return
        }

        rows.value = response

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
                notificar('negative', response.error)
                return
            }

            rows.value.unshift(response)
            modal.value = false
            notificar('positive', 'Guardado exitosamente')
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false
        }
    },
    editar: async () => {
        loadingModal.value = true
        try {
            console.log(data.value);
            const response = await useProductos.editar(data.value._id, data.value);
            console.log(response);
            if (!response) return
            if (response.error) {
                notificar('negative', response.error)
                return
            }
            rows.value.splice(buscarIndexLocal(response._id), 1, response);
            modal.value = false
            notificar('positive', 'Editado exitosamente')
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    }
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

const in_activar = {
    activar: async (id) => {
        loadIn_activar.value = true
        try {
            const response = await useProductos.activar(id)
            console.log(response);
            if (!response) return
            if (response.error) {
                notificar('negative', response.error)
                return
            }
            rows.value.splice(buscarIndexLocal(response._id), 1, response)

        } catch (error) {
            console.log(error);
        } finally {
            loadIn_activar.value = false
        }
    },
    inactivar: async (id) => {
        loadIn_activar.value = true
        try {
            const response = await useProductos.inactivar(id)
            console.log(response);
            if (!response) return
            if (response.error) {
                notificar('negative', response.error)
                return
            }
            rows.value.splice(buscarIndexLocal(response._id), 1, response)

        } catch (error) {
            console.log(error);
        } finally {
            loadIn_activar.value = false
        }
    }
}

function buscarIndexLocal(id) {
    return rows.value.findIndex((r) => r._id === id);
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
            <template v-slot:body-cell-estado="props">
                <q-td :props="props" class="botones">
                    <q-btn class="botonv1" text-size="1px" padding="10px" :loading="loadIn_activar" :label="props.row.estado
                        ? 'Activo'
                        : !props.row.estado
                            ? 'Inactivo'
                            : '‎  ‎   ‎   ‎   ‎ '
                        " :color="props.row.estado ? 'positive' : 'accent'" loading-indicator-size="small"
                        @click="props.row.estado ? in_activar.inactivar(props.row._id) : in_activar.activar(props.row._id);" />
                </q-td>
            </template>
            <template v-slot:body-cell-opciones="props">
                <q-td :props="props" class="botones">
                    <q-btn color="warning" icon="edit" class="botonv1" @click="opciones.editar(props.row)" />
                </q-td>
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