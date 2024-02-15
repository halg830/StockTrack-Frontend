<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar';
import { useStorePedidos } from '../stores/pedido.js';
import { useStoreDetallePedido } from '../stores/detallePedido.js'
import { format } from "date-fns";

const rows = ref([]);
const usePedidos = useStorePedidos();
const useDetallePedidos = useStoreDetallePedido();
const loadingTable = ref(false);
const filter = ref("");
const modal = ref(false);

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

const columns = ref([
    {
        name: 'numpedido',
        label: 'N° de pedido',
        align: 'center',
        field: 'numpedido'
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



function verDetallesPedido(){
    modal.value = true; 
    obtenerDetallePedido();
}

async function obtenerDetallePedido(idPedido) {
  try {
    const response = await useDetallePedidos.getPorPedido(idPedido);
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    productoSeleccionar.value[nombre] = response;
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.producto = false;
  }
}
</script>


<template>
    <main>
        <q-dialog v-model="modal">
            <q-card class="modal" style="width: 450px;">
                <q-toolbar style="        background-color: #39A900;color: white">
                    <q-toolbar-title>Detalle Pedido</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <h1>ola</h1>

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
                        <button @click="verDetallesPedido(props.row)" class="editBtn">🗒️
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
</style>