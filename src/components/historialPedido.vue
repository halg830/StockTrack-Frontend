<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar';
import { useStorePedidos } from '../stores/pedido.js';
import { useStoreDetallePedido } from '../stores/detallePedido.js'
import { format } from "date-fns";

const rows = ref([]);
const rowsdetails = ref([]);
const usePedidos = useStorePedidos();
const useDetallePedidos = useStoreDetallePedido();
const loadingTable = ref(false);
const filter = ref("");
const modal = ref(false);
const $q = useQuasar();
const subTotal = ref();
const iva = ref();

function notificar(tipo, msg, posicion = "top") {
    $q.notify({
        type: tipo,
        message: msg,
        position: posicion,
    });
}



const columns = ref([
    {
        name: 'numpedido',
        label: 'Nro pedido',
        align: 'center',
        field: 'numpedido'
    },
    {
        name: 'ficha',
        label: 'Ficha',
        align: "center",
        field: (row) => row.idFicha.codigo
    },
    {
        name: 'fechapedido',
        label: 'Fecha Creación',
        align: "center",
        field: (row) => `${format(new Date(row.createAT), "yyyy-MM-dd")}`
    },
    {
        name: 'total',
        label: 'Total',
        align: 'center',
        field: 'total',
    },
    {
        name: 'Estado',
        label: 'Estado',
        align: 'center',
        field: (row) => row.estado ? 'Aprobado' : 'Por aprobar'
    },
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
    {
        name: 'numProducto',
        label: 'Nro',
        align: 'center',
        field: 'numProducto'
    },
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
        name: 'cantidad',
        label: 'Cantidad',
        align: 'center',
        field: 'cantidad',
    },
    {
        name: 'unidadmedida',
        label: 'Unidad de Medida',
        align: 'center',
        field: (row) => row.idProducto.unidadMedida
    },
    {
        name: 'precioUnitario',
        label: 'Precio Unitario',
        align: 'center',
        field: (row) => row.idProducto.precioUnitario
    },
    {
        name: 'precioUniconIva',
        label: 'Precio U + IVA',
        align: 'center',
        field: 'precioUniconIva',
    },
]);

async function getInfo() {
    try {
        loadingTable.value = true
        const response = await usePedidos.getAll()
        console.log("Hola soy pedidos", response);

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


function verDetallesPedido(idPedido) {
    modal.value = true;
    obtenerDetallePedido(idPedido);
}

async function obtenerDetallePedido(idPedido) {

    try {

        const response = await useDetallePedidos.getPorPedido(idPedido);
        console.log("Hola soy detalle pedido", response);

        if (!response) return;
        if (response.error) {
            notificar('negative', response.error)
            return
        }

        rowsdetails.value = response
        subTotal.value = response[0].subTotal
        iva.value = (response[0].idProducto.precioUnitario * response[0].idProducto.iva) / 100
        if (!response) return;

        if (response.error) {
            notificar("negative", response.error);
            return;
        }
    } catch (error) {
        console.log(error);
    }
}




</script>


<template>
    <main>
        <q-dialog v-model="modal">
            <q-card class="modal">
                <q-toolbar style="        background-color: #39A900;color: white">
                    <q-toolbar-title>Detalle Pedido</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section class="q-gutter-md">
                    <q-form class="q-gutter-md">
                        <div class="q-pa-md">
                            <q-table flat bordered :rows="rowsdetails" :columns="columnsdetails" row-key="name" hide-bottom>
                            </q-table>
                        </div>
                        <div class="text-container">
                            <div>
                                <p>Subtotal: {{ subTotal }}</p>
                            </div>
                            <div>
                                <p>IVA: {{ iva }}</p>
                            </div>
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
                    <h4 id="titleTable">Historial de pedidos</h4>
                </template>
                <template v-slot:top-right>
                    <q-input borderless dense debounce="300" color="primary" v-model="filter" class="buscar"
                        placeholder="Buscar cualquier campo" id="boxBuscar">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>
                <template v-slot:body-cell-opciones="props">
                    <q-td :props="props" class="botones">
                        <button @click="verDetallesPedido(props.row._id)" class="editBtn">🗒️
                        </button>
                    </q-td>
                </template>
            </q-table>
        </section>
    </main>
</template>

<style scoped>
main {
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
}

#primeraseccion {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#tabla {
    width: 70%;
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

.editBtn {
    width: 55px;
    font-size: 25px;
    width: 55px;
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

.modal {
    width: 100%;
    height: auto;
}

.text-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-weight: bolder;
}
</style>