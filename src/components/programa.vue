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
  <main>
    <q-dialog v-model="modal">
      <q-card class="modal">
        <q-toolbar>
          <q-toolbar-title>{{ helpersGenerales.primeraMayus(estado) }} programa</q-toolbar-title>
          <q-btn class="botonv1" flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="q-gutter-md">
          <q-form @submit="validarCampos" class="q-gutter-md">
            <q-input outlined v-model="data.nombre" label="Nombre" type="text"
              :rules="[val => !!val || 'Ingrese un nombre']"></q-input>

            <q-input outlined v-model="data.presupuesto" label="Presupuesto" type="number"
              :rules="[val => !!val || 'Ingrese el presupuesto']"></q-input>

            <q-btn :loading="loadingModal" padding="10px" type="submit"
              :color="estado == 'editar' ? 'warning' : 'secondary'" :label="estado">
            </q-btn>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <section>
      <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadTable" loading-label="Cargando..."
        :filter="filter" rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Programas"
        no-data-label="No hay programa registrados." class="my-sticky-header-column-table">
        <template v-slot:top-left style="margin: 100px; background-color:aqua">
          <h4 id="titleTable">Programas</h4>
          <q-btn @click="opciones.agregar" color="primary">
            <q-icon name="add" color="white" center />
          </q-btn>
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
            <q-btn class="botonv1" text-size="1px" padding="10px" :loading="loadIn_activar" :label="props.row.estado
              ? 'Activo'
              : !props.row.estado
                ? 'Inactivo'
                : '‎  ‎   ‎   ‎   ‎ '
              " :color="props.row.estado ? 'positive' : 'accent'" loading-indicator-size="small"
              @click="props.row.estado ? in_activar.inactivar(props.row._id) : in_activar.activar(props.row._id);" />
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn color="warning" icon="edit" class="botonv1" @click="opciones.editar(props.row)" />
          </q-td>
        </template>
      </q-table>
    </section>
  </main>
</template>
<style scoped>
#titleTable {
  margin: auto;
}
</style>

<style lang="sass">
.my-sticky-header-column-table
  

  tr th
    background: #00b4ff
  
  

</style>