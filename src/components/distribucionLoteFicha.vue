<script setup>

import { useQuasar } from 'quasar';
import { ref, watch } from 'vue';
import { useStoreFichas } from '../stores/ficha.js';
import { useStoreDisItemLote } from '../stores/distribucionItemLote.js'
import { useStoreDisLoteFicha } from '../stores/distribucionLoteFicha.js';
import { format } from "date-fns";
import helpersGenerales from '../helpers/generales';

const $q = useQuasar();
const storeFichas = useStoreFichas();
const storeDisItemLote = useStoreDisItemLote();
const storeDisLoteFicha = useStoreDisLoteFicha();

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
    { name: "presupuesto", label: "Presupuesto", field: "presupuesto", sortable: true, align: "left" },
    { name: "idItem", label: "Item Nombre", field: (row)=>{row.idDistribucionPresupuesto.presupuesto}, sortable: true, align: "left" },
    // { name: "presupuesto", label: "Presupuesto", field: "presupuesto", sortable: true, align: "left" },
    // { name: "presupuesto", label: "Presupuesto", field: "presupuesto", sortable: true, align: "left" },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

const rows = ref([]);

async function getInfo() {
    try {
        loadingTable.value = true
        const response = await storeDisLoteFicha.getAll()
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
getoptionsFicha();
getOptionsItemLote();
const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true
            console.log(data.value);
            let info = {
                ...data.value, idFicha: data.value.idFicha.value, idDistribucionPresupuesto: data.value.idDistribucionPresupuesto.value
            };
            const response = await storeDisLoteFicha.agregar(info)
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
                ...data.value, idFicha: data.value.idFicha.value, idDistribucionPresupuesto: data.value.idDistribucionPresupuesto.value
            };
            const response = await storeDisLoteFicha.editar(data.value._id, info);
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
            const response = await storeDisLoteFicha.activar(id)
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
            const response = await storeDisLoteFicha.inactivar(id)
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

let optionsFichas = ref([])

async function getoptionsFicha() {
    try {
        await storeFichas.getAll();
        const fichasActicas = storeFichas.fichas.filter(ficha => ficha.estado === true);

        optionsFichas.value = fichasActicas.map((ficha) => { return { label: ficha.nombre, value: ficha._id, disable: ficha.estado === 0 } });

        console.log(optionsFichas.value);
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
                    <q-toolbar-title>{{ helpersGenerales.primeraMayus(estado) }} Distribucion Lote Fichas</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input filled v-model="data.codigo" type="number" label="N° Ficha" lazy-rules :rules="[
                            val => val && val.length > 0 && val > 0 || 'Digite el numero de ficha (Solo números)',
                            val => /^\d+$/.test(val) || 'Ingrese solo números'
                        ]" />

                        <q-input filled v-model="data.nombre" label="Nombre Programa" lazy-rules :rules="[
                            val => val && val.length > 0 || 'Digite el Nombre del Programa',
                            val => !/\d/.test(val) || 'No se permiten números en el nombre'
                        ]" />

                        <q-select filled v-model="data.nivelFormacion" label="Nivel de Formación" lazy-rules
                            :options="niveles" :rules="[val => !!val || 'Seleccione un nivel de Formación']" />

                        <q-input filled v-model="data.fechaInicio" type="date" label="Fecha Inicio" lazy-rules :rules="[val => !!val || 'Seleccione la Fecha de Inicio',
                            // val => new Date(val) >= new Date(Date.now()) || 'Seleccione una fecha superior al dia de hoy'
                        ]" />

                        <q-input filled v-model="data.fechaFin" type="date" label="Fecha Fin" lazy-rules :rules="[
                            val => val !== null && val !== '' || 'Seleccione la Fecha de Finalización',
                            val => {
                                const startDate = new Date(data.fechaInicio);
                                const endDate = new Date(val);
                                const sixMonthsLater = new Date(startDate);
                                sixMonthsLater.setMonth(startDate.getMonth() + 6);
                                return endDate >= sixMonthsLater || 'La fecha de finalización debe ser al menos 6 meses después de la fecha de inicio';
                            }
                        ]" />

                        <q-select filled v-model:model-value="data.area" label="Area" lazy-rules :options="optionsArea"
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
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Distribución Lote Fichas" style="width: 90%;"
            no-data-label="No hay Distribución Lote Fichas registrados.">
            <template v-slot:top-left>
                <div style=" display: flex; gap: 10px;">
                    <h4 id="titleTable">Distribución Lote Fichas</h4>
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
                    <button class="editBtn" @click="opciones.editar(props.row)">
                        <svg height="1em" viewBox="0 0 512 512">
                            <path
                                d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z">
                            </path>
                        </svg>
                    </button>
                </q-td>
            </template>
        </q-table>
    </main>
</template>

<style scoped>
#titleTable {
    margin: auto;
}
.editBtn {
  width: 55px;
  height: 55px;
  border-radius: 20px;
  border: none;
  background-color: #39A900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.123);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}
.editBtn::before {
  content: "";
  width: 200%;
  height: 200%;
  background-color: #39A900;
  position: absolute;
  z-index: 1;
  transform: scale(0);
  transition: all 0.3s;
  border-radius: 50%;
  filter: blur(10px);
}
.editBtn:hover::before {
  transform: scale(1);
}
.editBtn:hover {
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.336);
}

.editBtn svg {
  height: 17px;
  fill: white;
  z-index: 3;
  transition: all 0.2s;
  transform-origin: bottom;
}
.editBtn:hover svg {
  transform: rotate(-15deg) translateX(5px);
}
.editBtn::after {
  content: "";
  width: 25px;
  height: 1.5px;
  position: absolute;
  bottom: 19px;
  left: -5px;
  background-color: white;
  border-radius: 2px;
  z-index: 2;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease-out;
}
.editBtn:hover::after {
  transform: scaleX(1);
  left: 0px;
  transform-origin: right;
}


.editBtn {
    width: 55px;
    height: 55px;
    border-radius: 20px;
    border: none;
    background-color: #39A900;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.123);
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
    margin: 0 auto;
}

.editBtn::before {
    content: "";
    width: 200%;
    height: 200%;
    background-color: #39A900;
    position: absolute;
    z-index: 1;
    transform: scale(0);
    transition: all 0.3s;
    border-radius: 50%;
    filter: blur(10px);
}

.editBtn:hover::before {
    transform: scale(1);
}

.editBtn:hover {
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.336);
}

.editBtn svg {
    height: 17px;
    fill: white;
    z-index: 3;
    transition: all 0.2s;
    transform-origin: bottom;
}

.editBtn:hover svg {
    transform: rotate(-15deg) translateX(5px);
}

.editBtn::after {
    content: "";
    width: 25px;
    height: 1.5px;
    position: absolute;
    bottom: 19px;
    left: -5px;
    background-color: white;
    border-radius: 2px;
    z-index: 2;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.5s ease-out;
}

.editBtn:hover::after {
    transform: scaleX(1);
    left: 0px;
    transform-origin: right;
}


/* #boxBuscar {} */
</style>
