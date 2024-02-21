<script setup>
import { ref } from "vue";
import Cookies from "js-cookie";
import { useStoreFichas } from "../stores/ficha.js";
import { useStoreLotes } from "../stores/lote.js";
import { useStoreProductos } from "../stores/productos.js";
import { useStorePedidos } from "../stores/pedido.js";
import { useStoreDetallePedido } from "../stores/detallePedido.js";
import { useQuasar } from "quasar";

// Alertas notify
const $q = useQuasar();
function notificar(tipo, msg, posicion = "top") {
  $q.notify({
    type: tipo,
    message: msg,
    position: posicion,
  });
}

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
  const usuario = Cookies.get("usuario");
  const objUsuario = JSON.parse(usuario);
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

const opcionesSelect = ref({});

const useFicha = useStoreFichas();
async function obtenerOptions() {
  try {
    const responseFichas = await useFicha.getAll();
    console.log(responseFichas);

    if (!responseFichas) return;

    if (responseFichas.error) {
      notificar("negative", responseFichas.error);
      return;
    }

    opcionesSelect.value.fichas = responseFichas.map((ficha) => {
      return {
        label:
          ficha.codigo +
          " / " +
          (ficha.abreviatura ? ficha.abreviatura : ficha.nombre) +
          `${ficha.estado === 0 ? " - Inactivo" : ""}`,
        value: ficha._id,
        disable: ficha.estado === 0,
      };
    });
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.ficha = false;
  }
}
obtenerOptions();

//Filtro de fichas
const opcionesFiltro = ref({
  fichas: opcionesSelect.value.fichas,
});
function filterFn(val, update) {
  val = val.trim();
  if (val === "") {
    update(() => {
      opcionesFiltro.value.fichas = opcionesSelect.value.fichas;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesFiltro.value.fichas =
      opcionesSelect.value.fichas.filter(
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

    productoSeleccionar.value.todos = response;
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.producto = false;
  }
}

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

    productoSeleccionar.value[nombre] = productos;
    console.log(productoSeleccionar.value[nombre].length);
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
const productosAgg = ref([]); //Productos agregados
function aggProductos(producto) {
  console.log(producto);
  productosAgg.value.push({ ...producto });
  detPedidos.value.push({ idProducto: producto._id, cantidad: 1 });
  notificar("positive", "Producto agregado a la lista");
}

function quitarProducto(index) {
  productosAgg.value.splice(index, 1);
  notificar("negative", "Producto eliminado", "bottom");
}

//Solicitar pedido
const loadBtnSolicitar = ref(false);
const usePedidos = useStorePedidos();
async function solicitarPedido() {
  try {
    loadBtnSolicitar.value = true;
    const info = {
      idInstructorEncargado: data.value.idInstructorEncargado.value,
      idFicha: data.value.idFicha.value,
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
    })
    notificar('Positive', 'Pedido generado con éxito')
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
</script>
<template class="container">
  <div class="card">
    <q-form style="margin: 50px;" class="q-gutter-md">
      <section>
        <article>
          <div>
            <span class="spanns">Fecha: {{ data.fechaCreacion }}</span>
            <span class="spanns">N° pedido: </span>
          </div>
          <div>
            <div class="inputs" style="display: grid; grid-template-columns: repeat(2,1fr); justify-items: center; margin-top: 65px;">
              <div class="input-cont">
                <span>Instructor: </span>
                <q-select class="input3" outlined v-model:model-value="data.idInstructorEncargado" label="Nombre"
                  type="text" disable lazy-rules></q-select>
              </div>
              <div class="input-cont">
                <span>Ficha: </span>
                <q-select class="input3" outlined v-model:model-value="data.idFicha" use-input input-debounce="0"
                  label="Codigo Ficha" behavior="menu" @filter="filterFn" :options="opcionesFiltro.fichas"
                  :rules="[(val) => val != null || 'Seleccione una ficha']" :loading="selectLoad.ficha"
                  :disable="selectLoad.ficha">
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
          <div id="contTopLotes">
            <q-btn style="margin: 0 auto; margin-top: 50px;" @click="verTodosProductos">Ver todos los productos</q-btn>
          </div>
          <div class="q-pa-md">
            <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left" swipeable animated
              control-color="black" navigation padding arrows height="200px" class="transparent shadow-2 rounded-borders"
              draggable="false">
              <q-carousel-slide :name="index + 1" class="column no-wrap  "
                v-for="(loteGrupo, index) in opcionesSelect.lotes" :key="index">
                <div style="background-color: transparent; margin-left: 50px;"
                  class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                  <button class="image" v-for="lote in loteGrupo" :key="lote._id" style="
                      background-color: white;
                      margin-left: 20px;
                      width: 40%;
                      height: 80%;
                    " @click="mostrarLotes(lote._id, lote.nombre)">
                    {{ lote.nombre }}
                  </button>
                  <!-- <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/mountains.jpg" />
                  <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/parallax1.jpg" />
                  <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/material.png" />
                  <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/donuts.png" /> -->
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div>

          <table class="tabla">
            <thead>
              <td>N°</td>
              <td>Producto</td>
              <td>Unidad Medida</td>
              <td>Cantidad</td>
              <td>Opciones</td>
            </thead>
            <tr v-for="(producto, index) in productosAgg" :key="producto._id">
              <td>
                {{ producto.codigo }}
              </td>
              <td>{{ producto.nombre }}</td>
              <td>{{ producto.unidadMedida }}</td>
              <td>
                <input outlined v-model="detPedidos[index].cantidad" type="number" />
              </td>
              <td>
                <q-btn @click="quitarProducto(index)">
                  <q-icon name="close" />
                </q-btn>
              </td>
            </tr>
          </table>
          <div style="display: flex; flex-direction: row-reverse; ">
            <q-btn class="solicitar-pedido" style="display: flex; margin-right: 100px;margin-top: 25px; " type="submit" :loading="loadBtnSolicitar"
              @click="solicitarPedido">Solicitar pedido</q-btn>
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
                @click="aggProductos(producto)">
                {{ producto.nombre }}
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
</template>

<style scoped>
.shadow-2 {
    box-shadow: none;
}
.tabla {
  width: 100%;
 margin: 0 auto;
 margin-left: 50px;
}

td {
  margin: 50px;
}

.container {
  width: 100%;
  justify-content: center;
}

.card {
  margin: 0 auto;
  width: 60%;
  height: 700px;
  background: rgb(236, 236, 236);
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}



.input3 {
  display: flex;
  width: 250px;
  height: 60px;
}

.solicitar-pedido {
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

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
