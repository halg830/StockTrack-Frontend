<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar';
import { useStoreSalidas } from '../stores/salida.js';
import { useStoreDetalleSalida } from '../stores/detalleSalida.js'
import { format } from "date-fns";
import { useRouter } from 'vue-router';
import logoSena from '../assets/logoSena.png'

const rows = ref([]);
const rowsdetails = ref([]);
const useSalidas = useStoreSalidas();
const useDetalleSalidas = useStoreDetalleSalida();
const salidaSeleccionado = ref(null);
const loadingTable = ref(false);
const filter = ref("");
const modal = ref(false);
const $q = useQuasar();
const subTotal = ref();
const iva = ref();
const router = useRouter();

function notificar(tipo, msg, posicion = "top") {
    $q.notify({
        type: tipo,
        message: msg,
        position: posicion,
    });
}



const columns = ref([
    {
        name: 'numsalida',
        label: 'Nro salida',
        align: 'center',
        field: 'numero'
    },
    {
        name: 'destino',
        label: 'Destino',
        align: "center",
        field: (row) => row.idPedido.idDestino.codigo
    },
    {
        name: 'fechasalida',
        label: 'Fecha Creación',
        align: "center",
        field: (row) => `${format(new Date(row.createAT), "yyyy-MM-dd")}`
    },
/*     {
        name: 'Estado',
        label: 'Estado',
        align: 'center',
        field: 'estado'
    }, */
    {
        name: 'Entregado',
        label: 'Entregado',
        align: 'center',
        field: (row) => row.entregado ? 'Sí' : 'No',
    },
    {
        name: "opciones",
        label: "Opciones",
        field: (row) => null, sortable: false,
        align: "center"
    },
]);

const columnsdetails = ref([
    // {
    //     name: 'numProducto',
    //     label: 'Nro',
    //     align: 'center',
    //     field: 'numero'
    // },
    {
        name: 'codigo',
        label: 'Item',
        align: 'center',
        field: (row) => row.idProducto.codigo
    },
    {
        name: 'producto',
        label: 'Producto',
        align: "center",
        field: (row) => row.idProducto.nombre
    },
    {
        name: 'descripcion',
        label: 'Descripción',
        align: 'center',
        field: (row) => row.idProducto.descripcion
        ,
    },
    {
        name: 'cantidadEntregada',
        label: 'Cantidad Entregada',
        align: 'center',
        field: 'cantidadEntregada',
    },
    {
        name: 'cantidadPendiente',
        label: 'Cantidad Pendiente',
        align: 'center',
        field: 'cantidadPendiente',
    },
    {
        name: 'unidadmedida',
        label: 'Unidad de Medida',
        align: 'center',
        field: (row) => row.idProducto.unidadMedida
    },
]);

async function getInfo() {
    try {
        loadingTable.value = true
        const response = await useSalidas.getAll()
        console.log("Hola soy salidas", response);

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
getInfo()


function verDetallesSalida(idSalida) {
    rowsdetails.value = []
    modal.value = true;
    obtenerDetalleSalida(idSalida);
    salidaSeleccionado.value = rows.value.find(salida => salida._id === idSalida);
}

async function obtenerDetalleSalida(idSalida) {
    try {
        const response = await useDetalleSalidas.getPorSalida(idSalida);
        console.log("Hola soy detalle salida", response);

        if (!response) return;
        if (response.error) {
            notificar('negative', response.error)
            return
        }

        rowsdetails.value = response
        if (!response) return;

        if (response.error) {
            notificar("negative", response.error);
            return;
        }
    } catch (error) {
        console.log(error);
    }
}

function formatearFecha(fecha) {
    return fecha ? format(new Date(fecha), 'yyyy-MM-dd HH:mm') : '';
}

function buscarIndexLocal(id) {
    return rows.value.findIndex((r) => r._id === id);
}

const loadIn_activar = ref(false)
const in_activar = {
    activar: async (id) => {
        loadIn_activar.value = true
        try {
            const response = await useSalidas.activar(id)
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
            const response = await useSalidas.inactivar(id)
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

const entregar = {
    si: async (id) => {
        loadIn_activar.value = true
        try {
            const response = await useSalidas.entregado(id)
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
    no: async (id) => {
        loadIn_activar.value = true
        try {
            const response = await useSalidas.noEntregado(id)
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
</script>


<template>
    <main>
        <q-dialog v-model="modal">
            <q-card class="modal">
                <q-card-section class="q-gutter-md">
                    <q-form class="q-gutter-md">
                        <div class="row justify-center items-center" style="width: 100%;">
                            <div>
                                <img :src="logoSena" alt="Imagen" class="img1">
                                
                            </div>
                            <div  class="title-modal">
                                <h3 class="title-details">Servicio Nacional de Aprendizaje</h3>
                                <q-card-actions  class="q-gutter-md row  justify-end">
                                <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                            </q-card-actions>
                            </div>
                           
                        </div>

                        <div style="display: flex; flex-wrap: wrap;" id="container-details">
                            <div style="flex: 1; margin-right: 20px; margin-left: 5%;">
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Número salida: </p>
                                    <p class="text-h5">{{ salidaSeleccionado ? salidaSeleccionado.numero : '' }}</p>
                                </div>
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Instructor: </p>
                                    <p class="text-h5" id="text">{{ salidaSeleccionado ?
                                        salidaSeleccionado.idPedido.idInstructorEncargado.nombre : '' }}</p>
                                </div>
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Código Destino: </p>
                                    <p class="text-h5" id="text">{{ salidaSeleccionado ? salidaSeleccionado.idPedido.idDestino.codigo :
                                        '' }}</p>
                                </div>
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Destino: </p>
                                    <p class="text-h5" id="text">{{ salidaSeleccionado ? salidaSeleccionado.idPedido.idDestino.nombre :
                                        '' }}</p>
                                </div>
                            </div>
                            <div style="flex: 1;">
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Estado: </p>
                                    <p class="text-h5" id="text">{{ salidaSeleccionado ? (salidaSeleccionado.estado ?
                                        'Aprobado' : 'En revisión') : '' }}
                                    </p>
                                </div>
                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Entregado: </p>
                                    <p class="text-h5" id="text">{{ salidaSeleccionado ? (salidaSeleccionado.entregado ?
                                        'Sí' : 'No') : '' }}</p>
                                </div>

                                <div class="text">
                                    <p class="text-h5 text-weight-bold">Fecha Creación: </p>
                                    <p class="text-h5" id="text">{{ salidaSeleccionado ?
                                        formatearFecha(salidaSeleccionado.createAT) : '' }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="q-pa-sm" style="flex-basis: 100%;">
                            <q-table flat bordered :rows="rowsdetails" :columns="columnsdetails" row-key="name" hide-bottom
                                class="table-details">
                            </q-table>
                        </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>



        <section id="primeraseccion">
            <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadingTable" loading-label="Cargando..."
                :filter="filter" rows-per-page-label="Visualización de filas" page="2" id="tabla"
                :rows-per-page-options="[10, 20, 40, 0]" no-results-label="No hay resultados para la búsqueda."
                wrap-cells="false" label="Productos" no-data-label="No hay productos registrados.">
                <template v-slot:top-left>
                    <div style=" display: flex; gap: 10px;">
                        <h4 id="titleTable">Salidas</h4>
                    </div>

                </template>
                <template v-slot:top-right>
                    <q-input outlined dense debounce="300" color="primary" v-model="filter" class="buscar"
                        placeholder="Buscar cualquier campo" id="boxBuscar">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>
                <template v-slot:body-cell-Entregado="props">
                    <q-td :props="props" class="botones">
                        <q-btn class="botonv1" text-size="1px" padding="10px" :loading="props.row.estado === 'load'" :label="props.row.entregado
                            ? 'Sí'
                            : !props.row.entregado
                                ? 'No'
                                : '‎  ‎   ‎   ‎   ‎ '
                            " :color="props.row.entregado ? 'positive' : 'accent'" loading-indicator-size="small"
                            @click="props.row.entregado ? entregar.no(props.row._id) : entregar.si(props.row._id); props.row.entregado = 'load'" />
                    </q-td>
                </template>
<!--                 <template v-slot:body-cell-Estado="props">
                    <q-td :props="props" class="botones">
                        {{ console.log(props) }}
                        <q-btn class="botonv1" text-size="1px" padding="10px" :loading="props.row.estado === 'load'" :label="props.row.estado
                            ? 'Activo'
                            : !props.row.estado
                                ? 'Inactivo'
                                : '‎  ‎   ‎   ‎   ‎ '
                            " :color="props.row.estado ? 'positive' : 'accent'" loading-indicator-size="small"
                            @click="props.row.estado ? in_activar.inactivar(props.row._id) : in_activar.activar(props.row._id); props.row.estado = 'load'" />
                    </q-td>
                </template> -->
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props" class="botones">
                        <q-btn @click="verDetallesSalida(props.row._id)" icon="description" color="secondary">  </q-btn>
                    </q-td>
                </template>
            </q-table>
        </section>
    </main>
</template>

<style scoped>
main {
    width: 100%;
}

#primeraseccion {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#tabla {
    width: 90%;
}

#segundaseccion {
    width: 80%;
    display: flex;
    justify-content: flex-end;
}

#button {
    width: 8%;
    background-color: #39A900;
    color: white;
    border: none;
    height: 8%;
    border-radius: 10px;
    font-weight: bolder;
}

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
.title-modal{
    width: 85%;
    display: flex;
    justify-content: space-between;
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

.modal {
    max-width: 95%;
    width: 100%;
    max-height: 95%;
    height: auto;
}



.text {
    display: flex;
    align-items: center;
}

#text {
    margin-left: 12px;
}

.img1 {
    border-radius: 50%;
    max-width: 175px;
}

#container-details {
    width: 98%;
    padding: 20px;
    display: flex;
    border: 3px solid black;
}

.table-details {
    background-color: white;
    border: 1px solid #ccc;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

.table-details thead {
    background-color: #f2f2f2;
}

.table-details th {
    font-weight: bold;
    text-align: center;
}

.table-details td,
.table-details th {
    padding: 10px;
    border-bottom: 1px solid #ddd;
}

.table-details td:last-child,
.table-details th:last-child {
    border-right: none;
}

.table-details th {
    font-size: 14px;
}

::-webkit-scrollbar {
  width: 10px; 
}

::-webkit-scrollbar-track {
  background: #f1f1f1; 
}

::-webkit-scrollbar-thumb {
  background: #888; 
}

::-webkit-scrollbar-thumb:hover {
  background: #555; 
}


</style>