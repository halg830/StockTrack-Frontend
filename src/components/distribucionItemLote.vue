<script setup>

import { useQuasar } from 'quasar';
import { ref , watch } from 'vue';
import { useStoreFichas } from '../stores/ficha.js';
import { useStoreAreas } from '../stores/area.js';
import { format } from "date-fns";
import helpersGenerales from '../helpers/generales';

const $q = useQuasar();
const storeFichas = useStoreFichas();
const storeAreas = useStoreAreas();

const loadingTable = ref(false);
const loadingModal = ref(false);
const loadIn_activar = ref(false);
const filter = ref("");
const modal = ref(false);

function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
}
let niveles = ref([
    "Técnico", "Tecnólogo"
]);

const estado = ref('agregar')
const data = ref({});


const columns = [
    { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align: "left" },
    { name: "codigo", label: "Codigo", field: "codigo", sortable: true, align: "left" },
    { name: "nivelFormacion", label: "Nivel de Formación", field: "nivelFormacion", sortable: true, align: "left" },
    { name: "fechaInicio", label: "Fecha Inicio", field: (row) => `${format(new Date(row.fechaInicio), "yyyy-MM-dd")}`, align: "left" },
    { name: "fechaFin", label: "Fecha Fin", field: (row) => `${format(new Date(row.fechaFin), "yyyy-MM-dd")}` , align: "left" },
    { naem: "idArea", label: "Area Asignada",field: (row) => row.idArea.nombre ,align: "left" },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

const rows = ref([]);

async function getInfo() {
    try {
        loadingTable.value = true
        const response = await storeFichas.getAll()
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error)
            return
        }

        rows.value = response.reverse()

    } catch (error) {
        console.log(error);
    }
    finally {
        loadingTable.value = false
    }
}
getInfo();
const opciones = {
    agregar: () => {
        data.value = {};
        estado.value = 'agregar';
        modal.value = true;
    },
    editar: (info) => {
        data.value = { 
            ...info, 
            fechaInicio: format(new Date(info.fechaInicio), "yyyy-MM-dd"), 
            fechaFin: format(new Date(info.fechaFin), "yyyy-MM-dd"),
            area: {
                label: `${info.idArea.nombre}`,
                value: String(info.idArea._id)
            }
        };
        estado.value = 'editar';
        modal.value = true;
    }
}
getOptionsArea();
const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true
            console.log(data.value);
            let info = {
                ...data.value, idArea: data.value.area.value
            };
            const response = await storeFichas.agregar(info)
            console.log(response);

            if (!response) return
            if (response.error) {
                notificar('negative', response.error)
                return
            }
            // rows.value.unshift(response)
            getInfo();

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
            let info = {
                ...data.value, idArea: data.value.area.value
            };
            const response = await storeFichas.editar(data.value._id, info);
            if (!response) return
            if (response.error) {
                notificar('negative', response.error)
                return
            }
            // rows.value.splice(buscarIndexLocal(response._id), 1, response);
            getInfo()
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
            const response = await storeFichas.activar(id)
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
            const response = await storeFichas.inactivar(id)
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

let optionsArea = ref([])

async function getOptionsArea() {
    try {
        await storeAreas.getAll();
        const areasActicas = storeAreas.areas.filter(area => area.estado === true);

        optionsArea.value = areasActicas.map((area) => { return { label: area.nombre, value: area._id, disable: area.estado === 0 } });

        // optionsArea.value = areasActicas.map((area) => ({
        //     label: `${area.nombre}`,
        //     value: String(area._id),
        // }));
        console.log(optionsArea.value);
    } catch (error) {
        console.log(error);
    };
};


watch(data, () => {
  console.log(data);
});


</script>


<template>
    <main style=" width: 100%; display: flex; justify-content: center;">
        <!-- Modal -->
        <q-dialog v-model="modal">
            <q-card class="modal" style="width: 450px;">
                <q-toolbar style="        background-color: #39A900;color: white">
                    <q-toolbar-title>{{ helpersGenerales.primeraMayus(estado) }} Ficha</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input filled v-model="data.codigo" type="number" label="N° Ficha" lazy-rules
                        :rules="[
                            val => val && val.length > 0 && val > 0 || 'Digite el numero de ficha (Solo números)',
                            val => /^\d+$/.test(val) || 'Ingrese solo números'   
                        ]" />

                    <q-input filled v-model="data.nombre" label="Nombre Programa" lazy-rules
                        :rules="[ 
                            val => val && val.length > 0 || 'Digite el Nombre del Programa',
                            val => !/\d/.test(val) || 'No se permiten números en el nombre'
                        ]" />

                    <q-select filled v-model="data.nivelFormacion" label="Nivel de Formación" lazy-rules :options="niveles"
                        :rules="[val => !!val  || 'Seleccione un nivel de Formación']" />

                    <q-input filled v-model="data.fechaInicio" type="date" label="Fecha Inicio" lazy-rules
                        :rules="[val => !!val  || 'Seleccione la Fecha de Inicio',
                            // val => new Date(val) >= new Date(Date.now()) || 'Seleccione una fecha superior al dia de hoy'
                        ]" />

                    <q-input filled v-model="data.fechaFin" type="date" label="Fecha Fin" lazy-rules
                        :rules="[
                            val => val !== null && val !== '' || 'Seleccione la Fecha de Finalización',
                            val => {
                                const startDate = new Date(data.fechaInicio);
                                const endDate = new Date(val);
                                const sixMonthsLater = new Date(startDate);
                                sixMonthsLater.setMonth(startDate.getMonth() + 6);
                                return endDate >= sixMonthsLater || 'La fecha de finalización debe ser al menos 6 meses después de la fecha de inicio';
                            }
                        ]" />

                    <q-select filled v-model:model-value="data.area"  label="Area" lazy-rules :options="optionsArea"
                        :rules="[val => val !== null && val !== '' || 'Seleccione un area']" />


                        <div style=" display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit"
                                :color="estado == 'editar' ? 'warning' : 'primary'" :label="estado" />
                        </div>

                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Tabla -->
        <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadingTable" loading-label="Cargando..."
            :filter="filter" rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Fichas" style="width: 90%;"
            no-data-label="No hay Fichas registrados.">
            <template v-slot:top-left>
                <div style=" display: flex; gap: 10px;">
                    <h4 id="titleTable">Fichas</h4>
                    <q-btn @click="opciones.agregar" color="primary">
                        <q-icon name="add" color="white" center />
                    </q-btn>
                </div>

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
                    <q-btn class="botonv1" text-size="1px" padding="10px" :loading="props.row.estado === 'load'" :label="props.row.estado
                        ? 'Activo'
                        : !props.row.estado
                            ? 'Inactivo'
                            : '‎  ‎   ‎   ‎   ‎ '
                        " :color="props.row.estado ? 'positive' : 'accent'" loading-indicator-size="small"
                        @click="props.row.estado ? in_activar.inactivar(props.row._id) : in_activar.activar(props.row._id); props.row.estado = 'load'" />
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
