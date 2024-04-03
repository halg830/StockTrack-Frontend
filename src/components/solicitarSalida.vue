<script setup>
import { ref } from "vue";
import { useStoreSalidas } from "../stores/salida.js";
import { useStoreUsuarios } from "../stores/usuarios";
import { useQuasar } from "quasar";
import { useRoute } from "vue-router";
import { useStorePedidos } from "../stores/pedido.js";

//Route
const route = useRoute()

// Alertas notify
const $q = useQuasar();
function notificar(tipo, msg, posicion = "top") {
  $q.notify({
    type: tipo,
    message: msg,
    position: posicion,
  });
}

//Stores 
const useSalidas = useStoreSalidas();
const useUsuario = useStoreUsuarios();
const usePedido = useStorePedidos();

//Data salida
const numSalida = ref(0)
async function obtenerNumSalida() {
  try {
    const response = await useSalidas.getNumSalida();
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    numSalida.value = response
  } catch (error) {
    console.log(error);
  }
}
obtenerNumSalida();

//Data modal
const data = ref({
  idAdmin: obtenerAdmin(),
});

function fechaActual() {
  const fecha = new Date();
  const formatoFecha = `${fecha.getDate().toString().padStart(2, "0")} / ${(
    fecha.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")} / ${fecha.getFullYear()}`;

  return formatoFecha;
}


function obtenerAdmin() {
  const objUsuario = useUsuario.usuario
  console.log(objUsuario);
  return {
    label: objUsuario.nombre + " " + objUsuario.apellido,
    value: objUsuario._id,
  };
}

//Obtener fichas
const selectLoad = ref({
  ficha: true,
  lote: true,
  producto: true,
});

//Modal
const modal = ref(false);
const loadBtnModal = ref(false);
const opcionLote = ref("todos");

//Manejo de productos
const detSalidas = ref([]);
const productosAgg = ref([]);
function aggProductos(producto) {
  producto.icon = 'check'
  console.log(producto);
  const agregado = buscarIndexLocal(producto._id)
  if (agregado >= 0) {
    delete producto.icon
    productosAgg.value.splice(agregado, 1)
    notificar("negative", "Producto eliminado de la lista");

    return
  }

  productosAgg.value.push({ ...producto });
  detSalidas.value.push({ idProducto: producto._id, cantidad: 1 });
  notificar("positive", "Producto agregado a la lista");
}

function quitarProducto(index) {
  productosAgg.value.splice(index, 1);
  notificar("negative", "Producto eliminado", "bottom");
}

function buscarIndexLocal(id) {
  return productosAgg.value.findIndex((producto) => producto._id === id);
}

//Obtener pedido

async function getPedido(){
  try {
    const idPedido = ref(route.params.idPedido);
    console.log(idPedido.value);
    const response = await usePedido.getById(idPedido.value);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
}
getPedido()
</script>
<template class="container">
  <div class="card">
    <div class="header">
      <div class="top">
        <div class="circle">
          <span class="red circle2"></span>
        </div>
        <div class="circle">
          <span class="yellow circle2"></span>
        </div>
        <div class="circle">
          <span class="green circle2"></span>
        </div>
        <div class="title">
          <p class="title2">Solicitar salida aqui </p>
        </div>
      </div>
    </div>
    <div class="code-container">
      <div class="area">
        <q-form style="margin: 50px;" class="q-gutter-md">
          <section>
            <article>
              <div style="display: grid; grid-template-columns: repeat(2,1fr); justify-items: center; ">
                <span class="spanns">Fecha: {{ fechaActual() }}</span>
                <span class="spanns">N° salida: {{ numSalida }}</span>
              </div>
              <div>
                <div class="inputs"
                  style="display: grid; grid-template-columns: repeat(2,1fr); justify-items: center; margin-top: 65px;">
                  <div class="input-cont">
                    <span>Instructor: </span>
                    <q-select class="input3" outlined v-model:model-value="data.idInstructorEncargado" label="Nombre"
                      type="text" disable lazy-rules></q-select>
                  </div>
                  <div class="input-cont">
                    <span>Ficha: </span>
                    <!-- <q-select class="input3" outlined v-model:model-value="data.idFicha" use-input input-debounce="0"
                      label="Codigo Ficha" behavior="menu" @filter="filterFn" :options=""
                      :rules="[(val) => val != null || 'Seleccione una ficha']" :loading="selectLoad.ficha"
                      :disable="selectLoad.ficha">
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey">
                            Sin resultados
                          </q-item-section>
                        </q-item>
                      </template>
</q-select> -->
                  </div>
                </div>
              </div>
            </article>
            <article>
              <div class="overfow">
                <table class="tabla">
                  <thead>
                    <td>N°</td>
                    <td>Código</td>
                    <td>Producto</td>
                    <td>Unidad Medida</td>
                    <td>Cantidad</td>
                    <td>Opciones</td>
                  </thead>
                  <tr v-for="(producto, index) in productosAgg" :key="producto._id">
                    <td> {{ index + 1 }}</td>
                    <td>
                      {{ producto.codigo }}
                    </td>
                    <td>{{ producto.nombre }}</td>
                    <td>{{ producto.unidadMedida }}</td>
                    <td>
                      <input outlined v-model="detSalidas[index].cantidad" type="number" />
                    </td>
                    <td>
                      <q-btn @click="quitarProducto(index)">
                        <q-icon name="close" />
                      </q-btn>
                    </td>
                  </tr>
                </table>
              </div>

              <div style="display: flex; flex-direction: row-reverse; margin: 25px;">
                <q-btn class="solicitar-salida" style="margin-top: 100px; margin: 0 auto;" type="submit"
                  :loading="loadBtnSolicitar" @click="solicitarSalida">Solicitar salida</q-btn>
              </div>
            </article>
          </section>
        </q-form>

        <q-dialog v-model="modal">
          <q-card class="modal" style="width: 450px">
            <q-toolbar style="background-color: #39a900; color: white">
              <q-toolbar-title>Agregar producto</q-toolbar-title>
              <q-btn class="botonv1" flat dense icon="close" v-close-popup />
            </q-toolbar>

            <q-card-section class="q-gutter-md">
              <q-spinner color="primary" size="5em" :thickness="10" v-if="selectLoad.producto" />

              <div v-if="!selectLoad.producto &&
                  productoSeleccionar[opcionLote].length <= 0
                  ">
                <span>No hay productos disponibles</span>
              </div>

              <div v-if="!selectLoad.producto">
                <div>
                  <!-- Agregar animacion de agregado en el btn y que se quede con el icon de agregado, quitar notify -->
                  <q-btn v-for="producto in productoSeleccionar[opcionLote]" :key="producto._id"
                    @click="aggProductos(producto);">
                    {{ producto.nombre }} <q-icon v-if="producto.icon" :name="producto.icon" />
                  </q-btn>
                </div>
                <div style="display: flex; width: 96%; justify-content: flex-end">
                  <q-btn :loading="loadBtnModal" padding="10px" :color="'primary'" label="Terminar" v-close-popup />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overfow {
  height: 200px;
  overflow-y: scroll;
}

.shadow-2 {
  box-shadow: none;
}

.tabla {
  width: 100%;
  margin: 10px;
  margin-left: 50px;
}


td {
  margin: 50px;
}

.container {
  width: 100%;
  justify-content: center;

}

/* .card {
  margin: 0 auto;
  width: 60%;
  height: 780px;
  background: rgb(236, 236, 236);
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  margin-top: -45px;
} */

.input3 {
  display: flex;
  width: 250px;
  height: 60px;
}

.solicitar-salida {
  background-color: black;
  color: white;
  border-radius: 50px;
}

.image {
  border-radius: 50px;

}

#contTopLotes {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Oculta los botones de aumento y disminución en inputs de tipo number */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.card {
  width: 60%;
  height: 850px;
  margin: 0 auto;
  background-color: #d1d1d1;
  border-radius: 8px;
  z-index: 1;
  box-shadow: 0px 10px 10px rgb(121, 121, 121);
  transition: 0.5s;
}

.card:hover {
  transform: translateY(-7px);
  box-shadow: 0px 10px 10px rgb(94, 93, 93);
}

.top {
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.circle {
  padding: 0 4px;
}

.circle2 {
  display: inline-block;
  align-items: center;
  width: 10px;
  height: 10px;
  padding: 1px;
  border-radius: 5px;
}

.red {
  background-color: #ff605c;
}

.yellow {
  background-color: #ffbd44;
}

.green {
  background-color: #00ca4e;
}

.header {
  margin: 5px;
  margin-top: 5px;
  border-radius: 5px;
}

.title2 {
  align-items: center;
  justify-content: center;
  display: flex;

}

.top[data-v-d258ccf8] {
  display: flex;
  justify-content: center;
  align-items: center;
}

.code-container {
  text-align: center;
}

.area {
  width: 100%;
  height: 800px;
  resize: none;
  background-color: rgb(235, 235, 235);
  border-radius: 5px;
  border: none;
  color: rgb(0, 0, 0);
  padding: 10px;
}

#code:focus {
  outline: none !important;
}


/* SECCION RESPONSIVE */
</style>
