<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar';
import helpersGenerales from '../helpers/generales';
import { useStoreLotes } from '../stores/lote.js';
// import { format } from "date-fns";

const useLotes = useStoreLotes();
const loadingTable = ref(false);
const loadingModal = ref(false);
const loadIn_activar = ref(false);
const filter = ref("");
const modal = ref(false);
const $q = useQuasar();

function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
};

const estado = ref('agregar');
const data = ref({});

const columns = [
  { name: "codigo", label: "Codigo", field: "codigo", sortable: true, align: "left"},
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align: "left"},
  { name: "descripcion", label: "Descripción", field: "descripcion", sortable: true, align: "left"},
  { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center"},
  { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center"},
];

const rows = ref([]);

async function getInfo() {
  try {
    loadingTable.value = true

    const response = await useLotes.getAll()
    console.log(response);

    if (!response) return;
    if (response.error) {
      notificar('negative', response.error)
      return
    };

    rows.value = response.reverse();

  } catch (error) {
    console.log(error);
  }
  finally {
    loadingTable.value = false
  };
};

getInfo();

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
};

const enviarInfo = {
  agregar: async () => {
    try {
      loadingModal.value = true;

      const response = await useLotes.agregar(data.value);
      console.log(response);

      if (!response) return
      if (response.error) {
        notificar('negative', response.error);
        return
      };
      rows.value.unshift(response);

      modal.value = false;
      notificar('positive', 'Guardado exitosamente');

    } catch (error) {
      console.log(error);
    } finally {
      loadingModal.value = false;
    };
  },
  editar: async () => {
    loadingModal.value = true;
    try {
      console.log(data.value);
      const response = await useLotes.editar(data.value._id, data.value);
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      modal.value = false;
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
      };
    };
  };
  enviarInfo[estado.value]()
};

const in_activar = {
  activar: async (id) => {
    loadIn_activar.value = true
    try {
      const response = await useLotes.activar(id)
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      };
      rows.value.splice(buscarIndexLocal(response._id), 1, response)

    } catch (error) {
      console.log(error);
    } finally {
      loadIn_activar.value = false
    };
  },
  inactivar: async (id) => {
    loadIn_activar.value = true
    try {
      const response = await useLotes.inactivar(id)
      console.log(response);
      if (!response) return
      if (response.error) {
        notificar('negative', response.error)
        return
      };
      rows.value.splice(buscarIndexLocal(response._id), 1, response)

    } catch (error) {
      console.log(error);
    } finally {
      loadIn_activar.value = false
    };
  }
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
};

</script>

<template>
    <main style=" width: 100%; display: flex; justify-content: center;">
        <!-- Modal -->
        <q-dialog v-model="modal">
            <q-card class="modal" style="width: 450px;">
                <q-toolbar style="background-color: #39A900;color: white">
                    <q-toolbar-title>{{ helpersGenerales.primeraMayus(estado) }} Ficha</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">
                        <q-input filled v-model="data.codigo" type="number" label="Codigo Lote" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Digite el Codigo del Lote']" />

                        <q-input filled v-model="data.nombre"  label="Nombre Lote" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Digite el nombre']" />

                        <q-input filled v-model="data.descripcion" label="Descripción" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Digite la descrición']" />
                        <div style=" display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit"
                                :color="estado == 'editar' ? 'warning' : 'primary'" :label="estado" />
                        </div>

                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Tabla -->
        <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadingTable" loading-label="Cargando..."
            :filter="filter" rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Lotes" style="width: 90%;"
            no-data-label="No hay Lotes registrados.">
            <template v-slot:top-left>
                <div style=" display: flex; gap: 10px;">
                    <h4 id="titleTable">Lotes</h4>
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
                    <q-btn color="warning" icon="edit" class="botonv1" @click="opciones.editar(props.row)" />
                </q-td>
            </template>
        </q-table>
    </main>
</template>

<style scoped>
#titleTable {
    margin: auto;
}

/* #boxBuscar {} */
</style>