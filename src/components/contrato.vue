<script setup>
import { ref, onMounted, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useStoreContrato } from '../stores/contrato.js'
import helpersGenerales from '../helpers/generales';
import { useRoute, useRouter } from 'vue-router';
import { useStoreUsuarios } from '../stores/usuarios.js';
import {useStoreProveedores} from '../stores/proveedor.js';
import { useStoreProceso } from '../stores/proceso.js';

const router = useRouter();


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
const columns = [
{
    name: 'codigo',
    label: 'Código',
    align: 'center',
    field: 'codigo'
  },
  {
    name: 'nombre',
    label: 'Nombre',
    align: 'center',
    field: 'nombre'
  },
  {
    name: 'presupuesto',
    label: 'Presupuesto Inicial',
    align: 'center',
    field: (row) => helpersGenerales.formatearMoneda(row.presupuestoAsignado)
  },
  {
    name: 'presupuestoDisponible',
    label: 'Presupuesto Diponible',
    align: 'center',
    field: (row) => helpersGenerales.formatearMoneda(row.presupuestoDisponible)

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
const rows = ref([])
const loadTable = ref(false)
const filter = ref("")

// Get datos tabla
const useContrato = useStoreContrato()


const id = ref([]);
const route = useRoute();

const procesoID = async () => {
  id.value = route.params.id;
};

onMounted(procesoID);


async function getContratos() {
  try {
    await procesoID()
    loadTable.value = true

    const response = await useContrato.getPorProceso(id.value)

    if (!response) return;
    if (response.error) {
      notificar('negative', response.error)
      return
    }

    rows.value = response.reverse();

  } catch (error) {
    console.log(error);
  }
  finally {
    loadTable.value = false
  }
}
getContratos();

// Opciones tabla
const estado = ref('agregar')
const opciones = {
  agregar: () => {
    if (!opcionesSelect.value.proceso || !opcionesSelect.value.proceso.length ) {
      notificar('negative', 'No hay procesos disponibles para agregar un contrato.');
    } else {
      data.value = {
        idProceso: {
          label: opcionesSelect.value.proceso[0].label,
          value: String(opcionesSelect.value.proceso[0].value)
        }
      };
      estado.value = 'agregar';
      modal.value = true;
    }
  },
  editar: (info) => {
    data.value = {
      ...info, idSupervisor: {label: info.idSupervisor.nombre, value: info.idSupervisor._id}, idProveedor: {label: info.idProveedor.nombre, value: info.idProveedor._id}, idProceso: {label: info.idProceso.codigo, value: info.idProceso._id}
    }
    estado.value = 'editar'
    modal.value = true
  }
}

const data = ref({})
const enviarInfo = {
  agregar: async () => {
    try {
      loadingModal.value = true

      const info = {...data.value, idSupervisor: data.value.idSupervisor.value, idProveedor: data.value.idProveedor.value, idProceso: data.value.idProceso.value}
      const response = await useContrato.agregar(info)
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }

      rows.value.unshift(response)
      modal.value = false
      getContratos();
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
      const info = {...data.value, idSupervisor: data.value.idSupervisor.value, idProveedor: data.value.idProveedor.value, idProceso: data.value.idProceso.value}

      const response = await useContrato.editar(data.value._id, info);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      modal.value = false
      getContratos();
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

const loadIn_activar = ref(false)
const in_activar = {
  activar: async (id) => {
    loadIn_activar.value = true
    try {
      const response = await useContrato.activar(id)
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
      const response = await useContrato.inactivar(id)
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

function goToProceso() {
  router.push(`/proceso`);
}

function goDisContratoLote(idContrato) {
  router.push(`/distribucion-contrato-lote/${idContrato}`);
}

const opcionesSelect = ref({})
const selectLoad = ref({ supervisor: true, proveedor: true })
const useUsuario = useStoreUsuarios()
async function obtenerOptions() {
  try {
    const response = await useUsuario.getAll();
    
    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    const usuariosActivos = response.filter(usuario => usuario.estado === true && usuario.rol == 'supervisor');

    opcionesSelect.value.supervisor = usuariosActivos.map((usuario) => {
      return {
        label:
          usuario.nombre,
        value: usuario._id,
      };
    });
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.supervisor = false;
  }
}
obtenerOptions();

const useProveedor = useStoreProveedores()
async function obtenerOptionsProveedor() {
  try {
    const response = await useProveedor.getAll();

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    const proveedorsActivos = response.filter(proveedor => proveedor.estado === true);

    opcionesSelect.value.proveedor = proveedorsActivos.map((proveedor) => {
      return {
        label:
          proveedor.nombre,
        value: proveedor._id,
      };
    });


  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.proveedor = false;
  }
}
obtenerOptionsProveedor();

const useProceso = useStoreProceso()
async function obtenerOptionsProceso() {
  try {
    await procesoID();

    const response = await useProceso.getById(id.value);

    if (!response) {
      return; 
    }

    if (response.error) {
      notificar("negative", response.error);
      return; 
    }

    opcionesSelect.value.proceso = response.estado === true
      ? [{ label: `${response.codigo } - P. Disponible: ${helpersGenerales.formatearMoneda(response.presupuestoDisponible)}`, value: response._id }]
      : [];

  } catch (error) {
    console.error("Error fetching process options:", error);
  } finally {
    selectLoad.value.proceso = false;
  }
}

obtenerOptionsProceso();

const opcionesFiltro = ref({
  
})

function filterFnSupervisor(val, update) {
  val = val.trim();
  if (val === "") {
    update(() => {
      opcionesFiltro.value.supervisor = opcionesSelect.value.supervisor;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesFiltro.value.supervisor =
      opcionesSelect.value.supervisor.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1
      ) || [];
  });
}

function filterFnProveedor(val, update) {
  val = val.trim();
  if (val === "") {
    update(() => {
      opcionesFiltro.value.proveedor = opcionesSelect.value.proveedor;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesFiltro.value.proveedor =
      opcionesSelect.value.proveedor.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1
      ) || [];
  });
}




</script>
<template>
  <main style=" width: 100%; display: flex; justify-content: center; flex-direction: column; align-items: center;">
    <!-- MODAL -->
    <q-dialog v-model="modal">
      <q-card class="modal" style="width: 450px;">
        <q-toolbar class="bg-primary" style="color: white">
          <q-toolbar-title style="color: white;">{{ helpersGenerales.primeraMayus(estado) }} Contrato</q-toolbar-title>
          <q-btn class="botonv1" flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-form @submit="validarCampos" class="q-gutter-md">
            <q-input outlined v-model.trim="data.codigo" label="Código" type="text"
              :rules="[val => !!val || 'Ingrese un codigo']"></q-input>
            <q-input outlined v-model.trim="data.nombre" label="Nombre" type="text"
              :rules="[val => !!val || 'Ingrese un nombre']"></q-input>

            <q-input v-if="estado!='editar'" outlined v-model="data.presupuestoAsignado" label="Presupuesto" mask="##########"
              :rules="[val => !!val || 'Ingrese el presupuesto (solo números)']"
              ></q-input>

            <q-select class="input3" outlined v-model:model-value="data.idSupervisor" use-input input-debounce="0"
              label="Seleccione un supervisor" behavior="menu" @filter="filterFnSupervisor"
              :options="opcionesFiltro.supervisor" :rules="[(val) => val != null || 'Seleccione una opción']"
              :loading="selectLoad.supervisor" :disable="selectLoad.supervisor">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select class="input3" outlined v-model:model-value="data.idProveedor" use-input input-debounce="0"
              label="Seleccione un proveedor" behavior="menu" @filter="filterFnProveedor"
              :options="opcionesFiltro.proveedor" :rules="[(val) => val != null || 'Seleccione una opción']"
              :loading="selectLoad.proveedor" :disable="selectLoad.proveedor">
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Sin resultados
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <q-select v-if="estado!='editar'" class="input3" outlined v-model:model-value="data.idProceso" use-input input-debounce="0"
              label="Seleccione un proceso" behavior="menu" disable
              :options="opcionesFiltro.proceso" :rules="[(val) => val != null || 'Seleccione una opción']"
              :loading="selectLoad.proceso">
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
      no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Contratos" style="width: 90%;"
      no-data-label="No hay programa registrados." class="my-sticky-header-column-table">
      <template v-slot:top-left>
        <div style=" display: flex; gap: 10px;">
          <h4 id="titleTable">Contrato</h4>
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
          <button class="editBtn bg-primary" @click="opciones.editar(props.row)">
            <svg height="1em" viewBox="0 0 512 512">
              <path
                d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z">
              </path>
            </svg>
          </button>
          <button class="btn-go" @click="goDisContratoLote(props.row._id)">Distribur <i class="fa-solid fa-arrow-right"></i></button>
        </q-td>
      </template>
    </q-table>
    <div style="width: 90%;">
      <button class="btn-back" @click="goToProceso()">
        <i class="fa-solid fa-backward"></i> Volver
      </button> 
   </div>
  </main>
</template>
<style scoped>
#titleTable {
  margin: auto;
}

.botones{
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

.btn-go {
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

.btn-go::before {
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

.btn-go:hover::before {
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
/* #boxBuscar {} */
</style>