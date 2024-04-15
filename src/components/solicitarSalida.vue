<script setup>
import { ref } from "vue";
import { useStoreSalidas } from "../stores/salida.js";
import { useStoreUsuarios } from "../stores/usuarios";
import { useQuasar } from "quasar";
import { useRoute, useRouter } from "vue-router";
import { useStorePedidos } from "../stores/pedido.js";
import moment from 'moment-timezone'

//Route
const route = useRoute()
const router = useRouter()

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

function fechaActual() {
  return moment().format('DD/MM/YYYY');
}


function obtenerAdmin() {
  const objUsuario = useUsuario.usuario
  console.log(objUsuario);
  return objUsuario._id
}

//Obtener destinos
const selectLoad = ref({
  destino: true,
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
  if(productosAgg.value.length===1){
    notificar("negative", "La salida no se puede quedar sin productos")
    return
  }
  productosAgg.value.splice(index, 1);
  notificar("negative", "Producto eliminado", "bottom");
}

function buscarIndexLocal(id) {
  return productosAgg.value.findIndex((producto) => producto._id === id);
}

//Obtener pedido
const dataPedido = ref({ idInstructorEncargado: "", idDestino: "" })
const detPedido = ref({})
async function getPedido() {
  try {
    selectLoad.value.pedido = true
    const idPedido = ref(route.params.idPedido);
    console.log(idPedido.value);
    const response = await usePedido.getById(idPedido.value);
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    dataPedido.value = { ...response.pedido }
    detPedido.value = response.detPedidos.map(detPedido=> {return {...detPedido}})
    detSalidas.value = response.detPedidos
    productosAgg.value = response.detPedidos.map(detPedido => detPedido.idProducto)
    console.log(detPedido.value);
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.pedido = false
  }
}
getPedido()

//Solicitar salida
const dataSalida = ref({idAdmin: obtenerAdmin(), idPedido: route.params.idPedido, detSalidas, detPedido})
async function solicitarSalida() {
  try {
    selectLoad.value.salida = true
    console.log(dataSalida.value);
    const response = await useSalidas.agregar(dataSalida.value)
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    notificar('positive', 'Salida generada con éxito')
    router.push('/historial-salida')
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.salida = false
  }
}

//Validaciones
function validarCampos() {
  console.log(dataSalida.value);
  const arrData = Object.values(dataSalida.value);
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d === null) {
      notificar('negative', "Por favor complete todos los campos");
      return;
    }
    if (typeof d === "string") {
      if (d.trim() === "") {
        notificar('negative', "Por favor complete todos los campos");
        return;
      }
    }
  }

  if(!dataSalida.value.fechaEntrega) {
    return
  }
  solicitarSalida()
}

function convertirFormato(fecha) {
  const fechaOriginal = moment(fecha, 'DD/MM/YYYY');
  const nuevaFecha = fechaOriginal.format('YYYY/MM/DD');
  return nuevaFecha;
}

function optionsFn(date){
  console.log(convertirFormato(date), convertirFormato(fechaActual()), convertirFormato(date) >= convertirFormato(fechaActual()));
  return date >= convertirFormato(fechaActual())
}
</script>
<template>
  <div class="container">
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
            <h5 class="title2" style="font-weight: bold; font-size: xx-large">Solicitar salida</h5>
          </div>
        </div>
      </div>
      <div class="code-container">
        <div class="area">
          <q-form style="margin: 50px;" class="q-gutter-md">
            <section>
              <article>
                <div style="display: grid; grid-template-columns: repeat(3,1fr); justify-items: center; ">
                  <span class="spanns">Fecha: {{ fechaActual() }}</span>
                  <span class="spanns">N° salida: {{ numSalida }}</span>
                  <span>Pedido: {{ dataPedido.numero }}</span>
                </div>
  
                <div style="margin-top: 20px;">
                  <q-input mask="date" outlined  v-model="dataSalida.fechaEntrega" :rules="[val=>!!val || 'Ingrese una fecha']" label="Fecha de entrega" >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date  today-btn v-model="dataSalida.fechaEntrega" :options="optionsFn">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div>
                  <div class="inputs"
                    style="display: grid; grid-template-columns: repeat(2,1fr); justify-items: center; margin-top: 65px;">
                    <div class="input-cont">
                      <span>Instructor: </span>
                      <q-select class="input3" outlined v-model:model-value="dataPedido.idInstructorEncargado.nombre"
                        :loading="selectLoad.pedido" label="Nombre" type="text" disable lazy-rules></q-select>
                    </div>
                    <div class="input-cont">
                      <span>Destino: </span>
                      <q-select class="input3" outlined v-model:model-value="dataPedido.idDestino.nombre" use-input
                        input-debounce="0" label="Codigo Destino" behavior="menu" @filter="filterFn"
                        :rules="[(val) => val != null || 'Seleccione una destino']" :loading="selectLoad.pedido"
                        :disable="true">
                        <template v-slot:no-option>
                          <q-item>
                            <q-item-section class="text-grey">
                              Sin resultados
                            </q-item-section>
                          </q-item>
                        </template>
                      </q-select>
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
                  <q-btn class="solicitar-salida bg-primary" style="margin-top: 100px; margin: 0 auto; color: white" type="submit"
                    :loading="loadBtnSolicitar" @click="validarCampos">Solicitar salida</q-btn>
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
  </div>
</template>

<style scoped>
*{
  font-size: x-large;
}
.container {
  display: flex;
  justify-content: center;
}

.title2 {
  margin: 1rem;
}

.input-cont {
  display: flex;
  align-items: baseline;
  gap: 13px;
}

.card {
  border: 1px solid black;
  margin: 2rem;
  border-radius: 2rem;
  width: 70%;
  max-width: 100vw;
}

.header {
  display: flex;
  justify-content: center;
  padding-top: 1rem;
}

.btnLote {
  border-radius: 30%;
  background-color: white;
  margin-left: 20px;
  width: 40%;
  height: 80%;
}

.eliminar:hover {
  background-color: red;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla th,
.tabla td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.tabla th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.tabla tr:nth-child(even) {
  background-color: #f2f2f2;
}

.tabla tr:hover {
  background-color: #ddd;
}
</style>
