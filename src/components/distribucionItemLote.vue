<script setup>

import { useQuasar } from 'quasar';
import { ref , watch } from 'vue';
import { useStoreLotes } from '../stores/lote.js';
import { useStorePrograma } from '../stores/programa.js';
import { format } from "date-fns";
import helpersGenerales from '../helpers/generales';

const $q = useQuasar();
const storeItem = useStorePrograma();
const storeLotes = useStoreLotes();

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

const estado = ref('agregar')
const data = ref({});


const columns = [
    { name: "item", label: "Nombre", field: "nombre", sortable: true, align: "left" },
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
getOptionsLote();
getOptionsItem();
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

let optionsLotes = ref([])

async function getOptionsLote() {
    try {
        await storeLotes.getAll();
        const lotesActivos = storeLotes.lotes.filter(lote => lote.estado === true);

        optionsLotes.value = lotesActivos.map((lote) => { return { label: lote.nombre, value: lote._id, disable: lote.estado === 0 } });

    } catch (error) {
        console.log(error);
    };
};

let optionsPresupuesto = ref([]);

async function getOptionsItem() {
    try {
        await storeItem.getAll();
        const presupuestosActivos = storeItem.items.filter(item => item.estado === true);

        optionsPresupuesto.value = presupuestosActivos.map((item) => { return { label: item.nombre, value: item._id, disable: item.estado === 0 } });

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
                    <q-toolbar-title>{{ helpersGenerales.primeraMayus(estado) }} Distribución item lote</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        
                        

                        <q-select filled v-model:model-value="data.idItem" label="Presupuesto Global" lazy-rules :options="optionsPresupuesto"
                        :rules="[val => !!val  || 'Seleccione un nivel de Formación']" />
                        
                        <q-select filled v-model:model-value="data.idLote" label="Lote" lazy-rules :options="optionsLotes"
                        :rules="[val => !!val  || 'Seleccione un nivel de Formación']" />

                        <q-input filled v-model="data.presupuesto" type="number" label="Presupuesto" lazy-rules
                        :rules="[
                            val => val && val.length > 0 && val > 0 || 'Digite el numero de ficha (Solo números)',
                            val => /^\d+$/.test(val) || 'Ingrese solo números'   
                        ]" />
                        

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
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Distribución Item Lote" style="width: 90%;"
            no-data-label="No hay Distribución Item Lote registrados.">
            <template v-slot:top-left>
                <div style=" display: flex; gap: 10px;">
                    <h4 id="titleTable">Distribución Item Lote</h4>
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
