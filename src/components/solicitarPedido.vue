<script setup>
import { ref } from "vue";
import { useStoreDestinos } from "../stores/destino.js";
import { useStoreLotes } from "../stores/lote.js";
import { useStoreProductos } from "../stores/productos.js";
import { useStorePedidos } from "../stores/pedido.js";
import { useStoreDetallePedido } from "../stores/detallePedido.js";
import { useStoreUsuarios } from "../stores/usuarios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const router = useRouter();
const mostrarTabla = ref(false);
// Alertas notify
const $q = useQuasar();
function notificar(tipo, msg, posicion = "top") {
  $q.notify({
    type: tipo,
    message: msg,
    position: posicion,
  });
}

//
const usePedidos = useStorePedidos();
const numPedido = ref(0)
const useUsuario = useStoreUsuarios()
async function obtenerNumPedido() {
  try {
    const response = await usePedidos.getNumPedido();
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    numPedido.value = response
  } catch (error) {
    console.log(error);
  }
}
obtenerNumPedido();

//Data modal
const data = ref({
  idInstructorEncargado: obtenerInstructor(),
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


function obtenerInstructor() {
  const objUsuario = useUsuario.usuario
  console.log(objUsuario);
  return {
    label: objUsuario.nombre + " " + objUsuario.apellido,
    value: objUsuario._id,
  };
}

//Obtener destinos
const selectLoad = ref({
  destino: true,
  lote: true,
  producto: true,
});

const opcionesSelect = ref({});



const useDestino = useStoreDestinos();
async function obtenerOptions() {
  try {
    const responseDestinos = await useDestino.getAll();
    console.log(responseDestinos);

    if (!responseDestinos) return;

    if (responseDestinos.error) {
      notificar("negative", responseDestinos.error);
      return;
    }

    opcionesSelect.value.destinos = responseDestinos.map((destino) => {
      return {
        label:
          destino.codigo +
          " / " +
          (destino.abreviatura ? destino.abreviatura : destino.nombre) +
          `${destino.estado === 0 ? " - Inactivo" : ""}`,
        value: destino._id,
        disable: destino.estado === 0,
      };
    });
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.destino = false;
  }
}
obtenerOptions();

//Filtro de destinos
const opcionesFiltro = ref({
  destinos: opcionesSelect.value.destinos,
});
function filterFn(val, update) {
  val = val.trim();
  if (val === "") {
    update(() => {
      opcionesFiltro.value.destinos = opcionesSelect.value.destinos;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesFiltro.value.destinos =
      opcionesSelect.value.destinos.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1
      ) || [];
  });
}

//Lotes
const slide = ref(1);
const useLote = useStoreLotes();
async function obtenerLotes() {
  try {
    const response = await useLote.getAll();
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    const lotes = response.filter((lote) => lote.estado === true);

    const result = [];
    for (let i = 0; i < lotes.length; i += 4) {
      result.push(lotes.slice(i, i + 4));
    }

    opcionesSelect.value.lotes = result;
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.lote = false;
  }
}
obtenerLotes();

//Productos
const productoSeleccionar = ref({
  todos: [],
  //Lote
});
const useProducto = useStoreProductos();
async function obtenerProductos() {
  try {
    selectLoad.value.producto = true;
    const response = await useProducto.getAll();
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    const productos = response.filter((producto) => producto.estado === true);

    const productosIcon = productos.map(producto => {
      const agg = buscarIndexLocal(producto._id)
      if (agg >= 0) producto.icon = 'check'

      return producto
    })

    productoSeleccionar.value.todos = productosIcon;
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.producto = false;
  }
}

const productosAgg = ref([]); //Productos agregados
async function obtenerProductosPorLote(idLote, nombre) {
  try {
    selectLoad.value.producto = true;
    const response = await useProducto.getPorLote(idLote);
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    const productos = response.filter((producto) => producto.estado === true);

    const productosIcon = productos.map(producto => {
      const agg = buscarIndexLocal(producto._id)
      if (agg >= 0) producto.icon = 'check'

      return producto
    })

    productoSeleccionar.value[nombre] = productosIcon;
    console.log(productoSeleccionar.value[nombre]);
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.producto = false;
  }
}

//Modal
const modal = ref(false);
const loadBtnModal = ref(false);
const opcionLote = ref("todos");
function verTodosProductos() {
  obtenerProductos();
  opcionLote.value = "todos";
  modal.value = true;
}

function mostrarLotes(idLote, nombre) {
  try {
    obtenerProductosPorLote(idLote, nombre);
    opcionLote.value = nombre;
    modal.value = true;
  } catch (error) {
    console.log(error);
  }
}

//Manejo de productos
const detPedidos = ref([]);
function aggProductos(producto) {
  producto.icon = 'check'
  console.log(producto);
  mostrarTabla.value = true;
  const agregado = buscarIndexLocal(producto._id)
  if (agregado >= 0) {
    delete producto.icon
    productosAgg.value.splice(agregado, 1)
    if (productosAgg.value.length === 0) mostrarTabla.value = false;
    notificar("negative", "Producto eliminado de la lista");

    return
  }

  productosAgg.value.push({ ...producto });
  detPedidos.value.push({ idProducto: producto._id, cantidad: 1 });
  notificar("positive", "Producto agregado a la lista");
}

function quitarProducto(index) {
  productosAgg.value.splice(index, 1);
  if (productosAgg.value.length === 0) mostrarTabla.value = false;
  notificar("negative", "Producto eliminado", "bottom");
}

function buscarIndexLocal(id) {
  return productosAgg.value.findIndex((producto) => producto._id === id);
}

//Solicitar pedido
const loadBtnSolicitar = ref(false);
async function solicitarPedido() {
  try {
    loadBtnSolicitar.value = true;
    const info = {
      idInstructorEncargado: data.value.idInstructorEncargado.value,
      idDestino: data.value.idDestino.value,
    };
    const response = await usePedidos.agregar(info);
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    await detPedidos.value.forEach(async (detPedido) => {
      await crearDetPedido(detPedido)
    });
    notificar('Positive', 'Pedido generado con éxito')
    router.push('/historial-pedido')
  } catch (error) {
    console.log(error);
  } finally {
    loadBtnSolicitar.value = false;
  }
}

const useDetPedido = useStoreDetallePedido();
async function crearDetPedido(detPedido) {
  try {
    detPedido.idPedido = usePedidos.pedido._id
    const response = await useDetPedido.agregar(detPedido);
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

//Validaciones
function validarCampos() {
  const arrData = Object.values(data.value);
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

  if(detPedidos.value.length<=0) {
    notificar('negative', 'Ingrese al menos un producto')
    return
  }
  solicitarPedido()
}
</script>
<template>
  <main class="container">
    <div class="card">
      <div class="header">
        <div class="top">
          <div class="title">
            <h3 class="title2">Solicitar pedido</h3>
          </div>
        </div>
      </div>
      <div>
        <div>
          <q-form style="margin: 50px;" class="q-gutter-md">
            <section>
              <article>
                <div style="display: grid; grid-template-columns: repeat(2,1fr); justify-items: center; ">
                  <span class="spanns text-h4">Fecha: {{ fechaActual() }}</span>
                  <span class="spanns text-h4">N° pedido: {{ numPedido }}</span>
                </div>
                <div>
                  <div class="inputs"
                    style="display: grid; grid-template-columns: repeat(2,1fr); justify-items: center; margin-top: 65px;">
                    <div class="input-cont text-h4">
                      <span>Instructor: </span>
                      <q-select class="input3" outlined v-model:model-value="data.idInstructorEncargado" label="Nombre"
                        type="text" disable lazy-rules></q-select>
                    </div>
                    <div class="input-cont text-h4">
                      <span>Destino: </span>
                      <q-select class="input3" outlined v-model:model-value="data.idDestino" use-input
                        input-debounce="0" label="Codigo Destino" behavior="menu" @filter="filterFn"
                        :options="opcionesFiltro.destinos" :rules="[(val) => val != null || 'Seleccione una destino']"
                        :loading="selectLoad.destino" :disable="selectLoad.destino">
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

                <div class="q-pa-md lotes">
                  
                  <h5 style="margin: 10px;">Buscar producto por lote</h5>
                  <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left" swipeable
                    animated control-color="black" navigation padding arrows height="200px"
                    class="transparent shadow-2 rounded-borders" draggable="false">


                    <q-carousel-slide :name="index + 1" class="column no-wrap"
                      style="display: flex; align-items: center;" v-for="(loteGrupo, index) in opcionesSelect.lotes"
                      :key="index">
                      <div style="background-color: transparent; "
                        class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                        <button class="btnLote" v-for="lote in loteGrupo" :key="lote._id"
                          @click="mostrarLotes(lote._id, lote.nombre)">
                          {{ lote.nombre }}
                        </button>
                      </div>
                    </q-carousel-slide>
                  </q-carousel>
                  <div id="contTopLotes" style="display: flex; justify-content: flex-end;">
                    <q-btn class="bg-primary" style="margin: 0; margin-top: 30px; color: white;" @click="verTodosProductos">Ver todos los
                      productos</q-btn>
                  </div>
                </div>
                <div v-if="mostrarTabla" class="overfow" style="display: grid; justify-items:center;">
                  <span class="text-h4" style="margin-bottom: 30px;">Lista de Productos</span>
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
                        <q-input outlined v-model="detPedidos[index].cantidad" :rules="[val=>!!val || 'Ingrese una cantidad', val=>val.length>0 || 'Cantidad no válida']" type="number" />
                      </td>
                      <td>
                        <q-btn @click="quitarProducto(index)" class="eliminar">
                          <q-icon name="close" />
                        </q-btn>
                      </td>
                    </tr>
                  </table>
                </div>

                <div style="display: flex; flex-direction: row-reverse; margin: 25px;">
                  <q-btn class="solicitar-pedido bg-primary" style="margin-top: 100px; margin: 0 auto; color: white;" type="submit"
                    :loading="loadBtnSolicitar" @click="validarCampos">Solicitar pedido</q-btn>
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
  </main>
</template>

<style scoped>
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

.lotes{
  display: flex;
  flex-direction: column;
}

.btnLote {
  border-radius: 2%;
  background-color: white;
  margin: 10px;
  width: 100%;
  height: 100px;
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