<script setup>

import { useQuasar } from 'quasar';
import { ref, onMounted } from 'vue';
import { useStoreDependencia } from '../stores/dependencia.js';
import { useStoreDisLoteDependencia } from '../stores/distribucionLoteDependencia.js';
import { useStoreDisContratoLote } from '../stores/distribucionContratoLote.js';
import helpersGenerales from '../helpers/generales';
import { useRouter, useRoute } from 'vue-router';


// Obtener Id del header
const router = useRouter();
const route = useRoute();

const idDependencia = ref("");

const dependenciaID = async () => {
  idDependencia.value = route.params.idDependencia;
};

onMounted(dependenciaID);

const $q = useQuasar();

//Tiendas
const storeDependencia = useStoreDependencia();
const storeDisLoteDependencia = useStoreDisLoteDependencia();
const storeDisContratoLote = useStoreDisContratoLote();

//Variables 
const loadingTable = ref(false);
const loadingModal = ref(false);
const loadIn_activar = ref(false);
const filter = ref("");
const modal = ref(false);
const estado = ref('agregar')
const data = ref({});
const rows = ref([]);

//Notficacion 
function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
}

//Columnas Tabla
const columns = [
    { name: "idDependencia", label: "Nombre Dependencia", field: (row) => row.idDependencia.nombre, sortable: true, align: "left" },
    { name: "idDisContratoLote", label: "Contrato Lote", field: (row) => `${row.idDisContratoLote.idContrato.nombre} - ${row.idDisContratoLote.idLote.nombre}`, sortable: true, align: "left" },
    { name: "presupuestoAsignado", label: "Presupuesto Asignado",field: (row) => helpersGenerales.formatearMoneda(row.presupuestoAsignado), sortable: true, align: "left" },
    { name: "presupuestoDisponible", label: "Presupuesto Disponible", field: (row) => helpersGenerales.formatearMoneda(row.presupuestoDisponible), sortable: true, align: "left" },
    { name: "estado", label: "Estado", field: "estado", sortable: true, align: "center" },
    { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center" },
];

// Obtener Datos de para la tabla
async function getInfo() {
    try {
        await dependenciaID();
        loadingTable.value = true
        const response = await storeDisLoteDependencia.getDistribucionesById(idDependencia.value);
        if (!response) return;
        if (response.error) {
            notificar('negative', response.error)
            return
        }

        rows.value = response.reverse()

    } catch (error) {
        console.log(error);
    }
    finally {
        loadingTable.value = false
    }
}
getInfo();

// Opciones Agregar Editar
const opciones = {
    agregar: () => {
        if (!opcionesSelect.value.dependencia || !opcionesSelect.value.dependencia.length ) {
            notificar('negative', 'No hay dependencias disponibles para agregar una distribución.');
        } else {
        data.value = {
            idDependencia: {
                label: opcionesSelect.value.dependencia[0].label,
                value: String(opcionesSelect.value.dependencia[0].value)
            }
        };
        estado.value = 'agregar';
        modal.value = true;
        }
    },
    editar: (info) => {
        console.log(info);
        data.value = {
            ...info,
            idDependencia: {
                label: `${dependencia.value.nombre} - ${dependencia.value.codigo} `,
                value: String(dependencia.value._id)   
            },
            idDisContratoLote:{
                label: `${info.idDisContratoLote.idContrato.nombre} - ${info.idDisContratoLote.idLote.nombre} - P. Disponible: ${helpersGenerales.formatearMoneda(info.idDisContratoLote.presupuestoDisponible)}`,
                value: String(info.idDisContratoLote._id)
            }
        };
        estado.value = 'editar';
        modal.value = true;
    }
}

//Funcionamiento de peticiones Agregar y Editar
const enviarInfo = {
    agregar: async () => {
        try {
            loadingModal.value = true;
            let info = {
                ...data.value,
                idDependencia: data.value.idDependencia.value,
                idDisContratoLote: data.value.idDisContratoLote.value
            };
            
            const contratoLoteSeleccionado = disContratoLote.value.find(item => item._id === info.idDisContratoLote);
            if (!contratoLoteSeleccionado) {
                notificar('negative', 'El contrato lote seleccionado no es válido.');
                return;
            }

            if (parseFloat(info.presupuestoAsignado) > parseFloat(contratoLoteSeleccionado.presupuestoDisponible)) {
                notificar('negative', 'El presupuesto ingresado es mayor que el presupuesto disponible del contrato lote.');
                return;
            }

            const response = await storeDisLoteDependencia.agregar(info);
            
            if (!response) return;
            if (response.error) {
                notificar('negative', response.error);
                return;
            }
            ajustarPresupuesto(info);
            getInfo();
            rows.value.unshift(response);
            modal.value = false;
            notificar('positive', 'Guardado exitosamente');
            
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    },
    editar: async () => {
        loadingModal.value = true
        try {
            let info = {
                ...data.value,
                idDependencia: data.value.idDependencia.value,
                idDisContratoLote: data.value.idDisContratoLote.value
            };

            const contratoLoteSeleccionado = disContratoLote.value.find(item => item._id === info.idDisContratoLote);
            if (!contratoLoteSeleccionado) {
                notificar('negative', 'El contrato lote seleccionado no es válido.');
                return;
            }

            if (parseFloat(info.presupuestoAsignado) > parseFloat(contratoLoteSeleccionado.presupuestoDisponible)) {
                notificar('negative', 'El presupuesto ingresado es mayor que el presupuesto disponible del contrato lote.');
                return;
            }

            const response = await storeDisLoteDependencia.editar(data.value._id, info);
            if (!response) return
            if (response.error) {
                notificar('negative', response.error)
                return
            }
            getInfo();
            ajustarPresupuesto(info);
            modal.value = false
            notificar('positive', 'Editado exitosamente')
        } catch (error) {
            console.log(error);
        } finally {
            loadingModal.value = false;
        }
    }
}


// Validar Campos
function validarCampos() {
    const arrData = Object.values(data.value);
    for (const d of arrData) {
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


// Funcionamiento Inactivar y Activar 
const in_activar = {
    activar: async (id) => {
        loadIn_activar.value = true
        try {
            const response = await storeDisLoteDependencia.activar(id)
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
            const response = await storeDisLoteDependencia.inactivar(id)
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


// Ajustar presupuesto de la DisContratoLote
async function ajustarPresupuesto(data) {
    try {
        const response = await storeDisContratoLote.ajustarPresupuesto(data.idDisContratoLote, {presupuestoAsignado:data.presupuestoAsignado})
        if (!response) return
        if (response.error) { 
            notificar('negative', response.error)
            return
        }
        notificar('positive', 'Presupuesto Actualizado')
    } catch (error) {
        console.log(error);
    }

}

//Obtener la Dependencias 
const opcionesSelect = ref({})
let dependencia = ref([]);
async function getOptionDependencia(){
    try {
        await dependenciaID();
        let response = await storeDependencia.getById(idDependencia.value);
        dependencia.value = response
        opcionesSelect.value.dependencia = response.estado === true
        ? [{ label: `${response.nombre} - ${response.codigo}`, value: response._id }]
        : [];

    } catch (error) {
        console.log(error);
    };
};
getOptionDependencia();

let disContratoLote = ref([]);
async function getOptionsContratoLote(){
  try {
    let response = await storeDisContratoLote.getAll();
    disContratoLote.value = response;
    opcionesSelect.value.disContratoLote =  response
      ? response.map(item => ({
          label: `${item.idContrato.nombre} - ${item.idLote.nombre} - P. Disponible: ${helpersGenerales.formatearMoneda(item.presupuestoDisponible)}`,
          value: item._id
        }))
      : [];

  } catch (error) {
    console.log(error);
  }
};
getOptionsContratoLote();


const opcionesFiltro = ref({
  
})

function filterFn(val, update) {
  val = val.trim();
  if (val === "") {
    update(() => {
      opcionesFiltro.value.disContratoLote = opcionesSelect.value.disContratoLote;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesFiltro.value.disContratoLote =
      opcionesSelect.value.disContratoLote.filter(
        (v) => v.label.toLowerCase().indexOf(needle) > -1
      ) || [];
  });
}
// Buscar Id
function buscarIndexLocal(id) {
    return rows.value.findIndex((r) => r._id === id);
}

// Ir a Distribucion Con Red de Conocimiento
function goDisDependenciaRed(idDistribucionDependendencia){
    router.push(`/distribucion-dependencia-red/${idDistribucionDependendencia}`);
}

// Volver
function goToDependencia(){
    router.push(`/dependencia`);
}
</script>


<template>
    <main style=" width: 100%; display: flex; justify-content: center; flex-direction: column; align-items: center;">
        <!-- Modal -->
        <q-dialog v-model="modal">
            <q-card class="modal" style="width: 450px;">
                <q-toolbar style="        background-color: #39A900;color: white">
                    <q-toolbar-title>{{ helpersGenerales.primeraMayus(estado) }} Distribución Dependencia</q-toolbar-title>
                    <q-btn class="botonv1" flat dense icon="close" v-close-popup />
                </q-toolbar>

                <q-card-section class="q-gutter-md">
                    <q-form @submit="validarCampos" class="q-gutter-md">

                        <q-select filled use-input behavior="menu" hide-selected fill-input
                            input-debounce="0"  v-model="data.idDependencia" label="Dependencia" disable
                            lazy-rules
                            :rules="[val => val !== null && val !== '' || 'Seleccione una dependencia']" >
                        </q-select>
                        <!-- <q-select filled use-input behavior="menu" hide-selected fill-input
                            input-debounce="0"  v-model="data.idDisContratoLote" label="Contrato" 
                            lazy-rules
                            :rules="[val => val !== null && val !== '' || 'Seleccione un Contrato']" >
                        </q-select> -->

                        <q-select filled  v-model:model-value="data.idDisContratoLote" use-input input-debounce="0"
                        label="Seleccione un contrato lote" behavior="menu" @filter="filterFn"
                        :options="opcionesFiltro.disContratoLote" :rules="[(val) => val != null || 'Seleccione una opción']">
                        <template v-slot:no-option>
                            <q-item>
                            <q-item-section class="text-grey">
                                Sin resultados
                            </q-item-section>
                            </q-item>
                        </template>
            </q-select>

                        <q-input filled v-model="data.presupuestoAsignado" mask="#########################" label="Presupuesto" lazy-rules :rules="[
                            //val => val.length == 0|| 'Digite el presupuesto (Solo números)',
                            val => /^\d+$/.test(val) || 'Ingrese solo números'
                        ]" />


                        <div style=" display: flex; width: 96%; justify-content: flex-end;">
                            <q-btn :loading="loadingModal" padding="10px" type="submit"
                              color="primary" :label="estado" />
                          </div>
                    </q-form>
                </q-card-section>
            </q-card>
        </q-dialog>

        <!-- Tabla -->
        <q-table :rows="rows" :columns="columns" row-key="name" :loading="loadingTable" loading-label="Cargando..."
            :filter="filter" rows-per-page-label="Visualización de filas" page="2" :rows-per-page-options="[10, 20, 40, 0]"
            no-results-label="No hay resultados para la búsqueda." wrap-cells="false" label="Distribucion Dependencia Lote"
            style="width: 90%;" no-data-label="No hay Distribucion Dependencia Lote registrados.">
            <template v-slot:top-left>
                <div style=" display: flex; gap: 10px;">
                    <h4 id="titleTable">Distribución Dependencia Lote</h4>
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
                  <button class="btn-go" @click="goDisDependenciaRed(props.row._id)">Redes de conocimiento <i class="fa-solid fa-forward"></i></button>
                </q-td>
              </template>
        </q-table>
        <div style="width: 90%;">
           <button class="btn-back" @click="goToDependencia">
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

/* #boxBuscar {} */</style>../stores/distribucionLoteDependencia.js