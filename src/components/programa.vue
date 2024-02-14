<script setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useStorePrograma } from '../stores/programa.js'
import helpersGenerales from '../helpers/generales';

// Variables modal
const modal = ref(false)
const loadModal = ref(false)

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
    name: 'nombre',
    label: 'Nombre',
    align: 'center',
    field: 'nombre'
  },
  {
    name: 'presupuesto',
    label: 'Presupuesto',
    align: 'center',
    field: 'presupuesto'
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
const usePrograma = useStorePrograma()
async function getInfo() {
  try {
    loadTable.value = true

    const response = await usePrograma.getAll()
    console.log(response);

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
    loadTable.value = false
  }
}
getInfo()

// Opciones tabla
const estado = ref('agregar')
const opciones = {
  agregar: () => {
    data.value = {}
    estado.value = 'agregar'
    modal.value = true
  },
  editar: (info) => {
    data.value = { ...info }
    estado.value = 'editar'
    modal.value = true
  }
}

const data = ref({})
const enviarInfo = {
  agregar: async () => {
    try {
      loadModal.value = true

      const response = await usePrograma.agregar(data.value)
      console.log(response);

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
      loadModal.value = false
    }
  },
  editar: async () => {
    loadModal.value = true
    try {
      console.log(data.value);
      const response = await usePrograma.editar(data.value._id, data.value);
      console.log(response);
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
      loadModal.value = false;
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
      const response = await usePrograma.activar(id)
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
      const response = await usePrograma.inactivar(id)
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

</script>
<template>
  <main style="margin-left: 100px; margin-right: 100px;">
    <q-dialog v-model="modal">
      <q-card class="modal" style="width: 450px;">
        <q-toolbar style="background-color:#39A900;">
          <q-toolbar-title style="color: white;">{{ helpersGenerales.primeraMayus(estado) }} programa</q-toolbar-title>
          <q-btn class="botonv1" flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-form @submit="validarCampos" class="q-gutter-md">
            <q-input outlined v-model="data.nombre" label="Nombre" type="text"
              :rules="[val => !!val || 'Ingrese un nombre']"></q-input>

            <q-input outlined v-model="data.presupuesto" label="Presupuesto" type="number"
              :rules="[val => !!val || 'Ingrese el presupuesto']"></q-input>

              <div style=" display: flex; width: 96%; justify-content: flex-end;">
                <q-btn :loading="loadingModal" padding="10px" type="submit"
                    :color="estado == 'editar' ? 'warning' : 'primary'" :label="estado" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- TABLA -->
      <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadTable" loading-label="Cargando..."
        :filter="filter" rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Programas" style="width: 90%;"
        no-data-label="No hay programa registrados." class="my-sticky-header-column-table">
        <template v-slot:top-left>
          <div style=" display: flex; gap: 10px;">
            <h4 id="titleTable">Programas</h4>
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
            <button class="Btn" @click="opciones.editar(props.row)">Edit
              <svg class="svg" viewBox="0 0 512 512">
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

.Btn {
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100px;
  height: 40px;
  border: none;
  padding: 0px 20px;
  background-color: #39A900;
  color: white;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 5px 5px 0px #64aa41;
  transition-duration: .3s;
}

.svg {
  width: 13px;
  position: absolute;
  right: 0;
  margin-right: 20px;
  fill: white;
  transition-duration: .3s;
}

.Btn:hover {
  color: transparent;
}

.Btn:hover svg {
  right: 43%;
  margin: 0;
  padding: 0;
  border: none;
  transition-duration: .3s;
}

.Btn:active {
  transform: translate(3px, 3px);
  transition-duration: .3s;
  box-shadow: 2px 2px 0px rgb(140, 32, 212);
}
</style>

  