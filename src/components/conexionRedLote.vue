<script setup>
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreConexRedLote } from '../stores/conexionRedLote.js';
import { useStoreLotes } from '../stores/lote.js';
import { useStoreRedConocimiento } from '../stores/redConocimiento.js'
import helpersGenerales from '../helpers/generales';
import { format } from "date-fns";
import { useRoute, useRouter } from 'vue-router';

const data = ref({ idLote: {} })
const tipoConex = ref('')
const selectLoad = ref({
  lote: true,
  red: true,
});
const useLote = useStoreLotes();
const useRedConocimiento = useStoreRedConocimiento();


// Variables modal
const modal = ref(false)
const loadingModal = ref(false)

// Alertas notify
const $q = useQuasar()
function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

// Variables tabla
const columns = ref([{}]);
const rows = ref([]);
const loadTable = ref(false);
const filter = ref("");
const router = useRouter();
const route = useRoute();

// Get datos tablas
const useConexRedLote = useStoreConexRedLote()
async function getInfo() {

}
getInfo()


const conexion = ref('')
const obtener = {
  lote: async () => {
    try {
      loadTable.value = true

      const response = await useConexRedLote.getPorLote(route.params.id)
      tipoConex.value = 'Conexión Lote-Red'
      console.log("hola soy data conexiones", response);
      if (!response) return;
      if (response.error) {
        notificar('negative', response.error)
        return
      }

      opciones.value = {
        agregar: () => {
          data.value = { idLote: data.value.idLote }
          estado.value = 'agregar'
          cambio.value = 0
          modal.value = true
        },
        editar: (info) => {
          data.value = { ...info, idLote: { label: info.idLote.nombre, value: info.idLote._id }, idRed: { label: info.idRed.nombre, value: info.idRed._id } }
          estado.value = 'editar'
          cambio.value = 0
          modal.value = true
          console.log(data)
        },
      }

      columns.value = [
        {
          name: 'codigo',
          label: 'Codigo',
          align: 'center',
          field: 'codigo'
        },
        {
          name: 'nombre',
          label: 'Red',
          align: 'center',
          field: (row) => row.idRed.nombre
        },

        {
          name: 'estado',
          label: 'Estado',
          align: 'center',
          field: 'estado'
        },
        {
          name: 'opciones',
          label: 'Opciones',
          align: 'center',
          field: 'opciones'
        },
      ]

      const conexion = response.find(conexion => conexion.idLote._id === route.params.id)
      console.log(conexion);
      data.value.idLote = { label: conexion.idLote.nombre, value: conexion.idLote._id }
      console.log("hola soy id lote", data.value.idLote)

      rows.value = response.reverse();

    } catch (error) {
      console.log(error);
    }
    finally {
      loadTable.value = false
    }
  },
  red: async () => {
    try {
      loadTable.value = true

      const response = await useConexRedLote.getPorRed(route.params.id)
      tipoConex.value = 'Conexión Red-Lote'
      console.log("hola soy data conexiones2", response);
      if (!response) return;
      if (response.error) {
        notificar('negative', response.error)
        return
      }

      opciones.value = {
        agregar: () => {
          data.value = { idRed: data.value.idRed }
          estado.value = 'agregar'
          cambio.value = 0
          modal.value = true
        },
        editar: (info) => {
          data.value = { ...info, idLote: { label: info.idLote.nombre, value: info.idLote._id }, idRed: { label: info.idRed.nombre, value: info.idRed._id } }
          estado.value = 'editar'
          cambio.value = 0
          modal.value = true
          console.log(data)
        },
      }

      columns.value = [
        {
          name: 'codigo',
          label: 'Codigo',
          align: 'center',
          field: 'codigo'
        },
        {
          name: 'nombre',
          label: 'Lote',
          align: 'center',
          field: (row) => row.idLote.nombre
        },

        {
          name: 'estado',
          label: 'Estado',
          align: 'center',
          field: 'estado'
        },
        {
          name: 'opciones',
          label: 'Opciones',
          align: 'center',
          field: 'opciones'
        },
      ]

      const conexion = response.find(conexion => conexion.idRed._id === route.params.id)
      console.log(conexion);
      data.value.idRed = { label: conexion.idRed.nombre, value: conexion.idRed._id }
      console.log("hola soy id lote", data.value.idRed)
      rows.value = response.reverse();

    } catch (error) {
      console.log(error);
    }
    finally {
      loadTable.value = false
    }
  }
}

const conex = ref('')
const id = ref('')

onMounted(() => {
  const conexion = route.params.conexion
  conex.value = conexion
  id.value = route.params.id
  obtener[conexion]()
})

const opcionesSelect = ref({});



async function obtenerOptions() {
  try {
    const responseLotes = await useLote.getAll();
    console.log(responseLotes);

    if (!responseLotes) return;

    if (responseLotes.error) {
      notificar("negative", responseLotes.error);
      return;
    }

    console.log(conex.value);
    if (conex.value === 'lote') {
      const lote = responseLotes.find(l => l._id === id.value)
      console.log(lote);
      data.value.idLote = { label: lote.nombre, value: lote._id }
      opcionesSelect.value.lotes = [{ label: lote.nombre, value: lote._id }]
      return
    }

    const lotesActivos = responseLotes.filter(lote => lote.estado === true);

    opcionesSelect.value.lotes = lotesActivos.map((lote) => {
      return {
        label:
          lote.nombre,
        value: lote._id,
        disable: lote.estado === 0,
      };
    });

  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.lote = false;
  }
}
obtenerOptions();

async function obtenerOptionsRed() {
  try {
    const responseRed = await useRedConocimiento.getAll();
    console.log(responseRed);

    if (!responseRed) return;

    if (responseRed.error) {
      notificar("negative", responseRed.error);
      return;
    }

    const redesActivas = responseRed.filter(red => red.estado === true);

    opcionesSelect.value.redes = redesActivas.map((red) => {
      return {
        label:
          red.nombre,
        value: red._id,
        disable: red.estado === 0,
      };
    });

  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.red = false;
  }
}
obtenerOptionsRed();

// Opciones tabla
const estado = ref('agregar')
const opciones = ref({});

let cambio = ref(0)

const enviarInfo = {
  agregar: async () => {
    try {
      loadingModal.value = true

      const response = await useConexRedLote.agregar({ ...data.value, idLote: data.value.idLote.value, idRed: data.value.idRed.value })
      console.log(response);
      getInfo();
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }

      rows.value.unshift(response)
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
      console.log(data.value);
      const response = await useConexRedLote.editar(data.value._id, { ...data.value, idLote: data.value.idLote.value, idRed: data.value.idRed.value });
      console.log(response);
      getInfo();
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
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
  console.log(data.value);
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

//Filtro q-select

const opcionesFiltro = ref({
  lotes: opcionesSelect.value.lotes,
  redes: opcionesSelect.value.redes,
});

function filterFn(val, update) {
  val = val.trim();
  if (val === "") {
    update(() => {
      opcionesFiltro.value.lotes = opcionesSelect.value.lotes;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesFiltro.value.lotes =
      opcionesSelect.value.lotes.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1
      ) || [];
  });
}

function filterFnRedes(val, update) {
  val = val.trim();
  if (val === "") {
    update(() => {
      opcionesFiltro.value.redes = opcionesSelect.value.redes;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesFiltro.value.redes =
      opcionesSelect.value.redes.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1
      ) || [];
  });
}

// Activar - Inactivar conexion-red
const loadIn_activar = ref(false)
const in_activar = {
  activar: async (id) => {
    loadIn_activar.value = true
    try {
      const response = await useConexRedLote.activar(id)
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
      const response = await useConexRedLote.inactivar(id)
      console.log("hola soy inactivo", response);
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

function goToBack() {
  let routeName = '/'; 
  if (conex.value === 'lote') {
    routeName = '/lotes'; 
  } else if (conex.value === 'red') {
    routeName = '/red-conocimiento'; 
  }
  router.push(routeName);
}



</script>
<template>
  <main style="  width: 100%; display: flex; justify-content: center; flex-direction: column; align-items: center; ">
    <!-- MODAL -->
    <q-dialog v-model="modal">
      <q-card class="modal" style="width: 450px;">
        <q-toolbar style="background-color:#39A900;">
          <q-toolbar-title style="color: white;">{{ helpersGenerales.primeraMayus(estado) }} {{ tipoConex
            }}</q-toolbar-title>
          <q-btn class="botonv1" flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-form @submit="validarCampos" class="q-gutter-md">
            <q-input filled v-model.trim="data.codigo" label="Codigo" type="text"
              :rules="[val => !!val || 'Ingrese un código']"></q-input>

            <q-select class="input3" outlined v-model:model-value="data.idLote" use-input input-debounce="0"
              label="Seleccione un lote" behavior="menu" @filter="filterFn" :options="opcionesFiltro.lotes"
              :rules="[(val) => val != null || 'Seleccione un lote']" :loading="selectLoad.lote"
              :disable="selectLoad.lote || conex === 'lote'">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select class="input3" outlined v-model:model-value="data.idRed" use-input input-debounce="0"
              label="Seleccione una red de conocimiento" behavior="menu" @filter="filterFnRedes"
              :options="opcionesFiltro.redes" :rules="[(val) => val != null || 'Seleccione una red']"
              :loading="selectLoad.red" :disable="selectLoad.lote || conex === 'red'">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <div style=" display: flex; width: 96%; justify-content: flex-end;">
              <q-btn :loading="loadingModal" padding="10px" type="submit" color="primary" :label="estado" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- TABLA -->
    <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadTable" loading-label="Cargando..."
      :filter="filter" rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
      no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Dependencias" style="width: 90%;"
      no-data-label="No hay conexiones registradas." class="my-sticky-header-column-table">
      <template v-slot:top-left>
        <div style=" display: flex; gap: 10px;">
          <h4 id="titleTable">{{ tipoConex }}</h4>
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
        <q-td :props="props" class="estados">
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
    <div style="width: 90%;">
      <button class="btn-back" @click="goToBack">
        <i class="fa-solid fa-backward"></i> Volver
      </button>
    </div>
  </main>
</template>
<style scoped>
#titleTable {
  margin: auto;
}

.botones {
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
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
  margin: 0 10px;
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

.btn-go,
.btn-asignar {
  width: 9em;
  height: 55px;
  border-radius: 15px;
  font-size: 15px;
  font-family: inherit;
  border: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 6px 6px 12px #c5c5c5,
    -6px -6px 12px #ffffff;
}

.btn-go::before,
.btn-asignar::before {
  content: '';
  width: 0;
  height: 55px;
  border-radius: 15px;
  position: absolute;
  top: 0;
  left: 0;
  background-image: linear-gradient(to right, #39A900 0%, #39A900 100%);
  transition: .5s ease;
  display: block;
  z-index: -1;
}

.btn-go:hover::before,
.btn-asignar:hover::before {
  width: 9em;
}

.btn-back {
  margin-top: 5px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 9em;
  height: 55px;
  border-radius: 15px;
  font-size: 15px;
  font-family: inherit;
  border: none;
  position: relative;
  overflow: hidden;
  z-index: 1;
  box-shadow: 6px 6px 12px #c5c5c5,
    -6px -6px 12px #ffffff;
}

.btn-back::before {
  content: '';
  width: 0;
  height: 55px;
  border-radius: 15px;
  position: absolute;
  top: 0;
  right: 0;
  background-image: linear-gradient(to left, red 100%, red 0%);
  transition: .5s ease;
  display: block;
  z-index: -1;
}

.btn-back:hover::before {
  width: 9em;
}
</style>