<script setup>

import { useQuasar } from 'quasar';
import { onMounted, ref, watch } from 'vue';
import { useStoreFichas } from '../stores/ficha.js';
import { useStoreAreas } from '../stores/area.js';
import { format } from "date-fns";


const $q = useQuasar();
const storeFichas = useStoreFichas();
const storeAreas = useStoreAreas();

let fichas = ref([]);

let codigo = ref(null);
let nombreFicha = ref(null);
let nivelFormacion = ref(null);
let fechaInicio = ref(null);
let fechaFin = ref(null);
let area = ref(null)
let pagination = ref({rowsPerPage: 0});
let text = ref('');
let dense =  ref(false);

let textAgregarEditar = ref("Agregar Fichas");
let textEditarAgregar = ref("Agregar");
let cambio = ref(0);

let niveles = ref([
    "Técnico", "Tecnólogo"
]);

const columns = [
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align: "left"},
  { name: "codigo", label: "Codigo", field: "codigo", sortable: true, align: "left"},
  { name: "nivelFormacion", label: "Nivel de Formación", field: "nivelFormacion", sortable: true, align: "left"},
  { name: "fechaInicio", label: "Fecha Inicio", field: (row) => `${format(new Date(row.fechaInicio), "yyyy-MM-dd")}` , sortable: true, align: "left"},
  { name: "fechaFin", label: "Fecha Fin", field:(row)=>`${format(new Date(row.fechaFin), "yyyy-MM-dd")}`},
  { name: "estado", label: "Estado", field: "estado", sortable: true, align: "left"},
  { name: "createAT", label: "Fecha de Creación", field: (row) => `${format(new Date(row.createAT), "yyyy-MM-dd")} - ${format(new Date(row.createAT), 'HH:mm:ss')}`, sortable: true, align: "center" },
  { name: "opciones", label: "Opciones", field: (row) => null, sortable: false, align: "center"},
];


function notificar(tipo, msg) {
    $q.notify({
        type: tipo,
        message: msg,
        position: "top",
    });
};


let rows = ref([]);

async function getInfoFichas(){
    textEditarAgregar.value = "Agregar"
    try {
        await storeFichas.getAll();
        fichas.value = storeFichas.fichas;
        rows.value = storeFichas.fichas;
        // notificar('positive', "Fichas Obtenidas")
    } catch (error) {
        console.log(error);
    };
};

let optionsArea = ref([])

async function getOptionsArea(){
  try {
    await storeAreas.getAll();
    const areasActicas = storeAreas.areas.filter(area => area.estado === true);

    optionsArea.value = areasActicas.map((area) => ({
      label: `${area.nombre}`,
      value: String(area._id),
    }));
  } catch (error) {
    console.log(error);
  };
};

onMounted(async () => {
  getInfoFichas();
  getOptionsArea();
});

async function agregarEditarFicha(){
    if (cambio.value === 0) {
        try {
            await storeFichas.agregar({
                codigo: codigo.value,
                nombre: nombreFicha.value,
                nivelFormacion: nivelFormacion.value,
                fechaInicio: fechaInicio.value,
                fechaFin: fechaFin.value,
                idArea: area._rawValue.value
            })
            onReset();
            getInfoFichas();
        } catch (error) {
            console.log(error);
            notificar('negative', error)
        };
    }else{
        try {
            const id = idFicha.value;
            await storeFichas.editar(id,{
                codigo: codigo.value,
                nombre: nombreFicha.value,
                nivelFormacion: nivelFormacion.value,
                fechaInicio: fechaInicio.value,
                fechaFin: fechaFin.value,
                idArea: area._rawValue.value
            })
            getInfoFichas();
            onReset();
            cambio.value == 0;
            textAgregarEditar.value = "Agregar Ficha";

        } catch (error) {
            console.log(error);
        };
    };
};

watch(fechaFin,() =>{
    console.log(fechaFin.value);
  }
)

let idFicha = ref("")
function editarFicha(id){
    textAgregarEditar.value = "Editar Ficha";
    cambio.value = 1
    const fichaSelected = fichas.value.find((ficha) => ficha._id === id);
  if (fichaSelected) {
    console.log(fichaSelected._id);
    idFicha.value = String(fichaSelected._id)
    textEditarAgregar.value = "Guardar";
    codigo.value = fichaSelected.codigo;
    nombreFicha.value = fichaSelected.nombre;
    nivelFormacion.value = fichaSelected.nivelFormacion;
    fechaInicio.value = fichaSelected.fechaInicio;
    fechaFin.value = fichaSelected.fechaFin;
    area.value = {
      label: `${fichaSelected.idArea.nombre}`,
      value: String(fichaSelected.idArea._id),
    }
  };
}
function buscarFicha(){
    console.log("Buscando Ficha");
};


function onReset() {
    codigo.value = "";
    nombreFicha.value = "";
    nivelFormacion.value = "";
    fechaInicio.value = "";
    fechaFin.value = "";
    area.value = "";
};


async function inactivarFicha(id){
    try {
        await storeFichas.inactivar(id);
        onReset();
        getInfoFichas();
    } catch (error) {
        console.log(error);
    }
}

async function activarFicha(id){
    try {
        await storeFichas.activar(id);
        onReset();
        getInfoFichas();
    } catch (error) {
        console.log(error);
    }
}
</script>

<template>
    <div class="container-fichas">
        <section class="container-agregar-fichas">
            <h3>{{textAgregarEditar}}</h3>
            <article>
                <div class="q-pa-md" style="width: 400px">
                    <q-form @submit="agregarEditarFicha" @reset="onReset" class="q-gutter-md">
                        <q-input filled v-model="codigo" type="number" label="N° Ficha" lazy-rules
                            :rules="[val => val && val.length > 0 && val>0 || 'Digite el numero de ficha']" />

                        <q-input filled v-model="nombreFicha" label="Nombre Programa" lazy-rules
                            :rules="[val => val && val.length > 0  || 'Digite el Nombre del Programa']" />

                        <q-select filled v-model="nivelFormacion" label="Nivel de Formación" lazy-rules :options=niveles
                            :rules="[val => val !== null && val !== '' || 'Seleccione un nivel de Formación']" />

                        <q-input filled v-model="fechaInicio" type="date" label="Fecha Inicio" lazy-rules
                            :rules="[val => val !== null && val !== '' || 'Seleccione la Fecha de Inicio']" />

                        <q-input filled v-model="fechaFin" type="date" label="Fecha Fin" lazy-rules
                            :rules="[val => val !== null && val !== '' || 'Seleccione la Fecha de Finalización']" />

                        <q-select filled v-model="area" label="Area" lazy-rules :options=optionsArea
                            :rules="[val => val !== null && val !== '' || 'Seleccione un area']" />
                        <div>
                            <q-btn :label="textEditarAgregar" type="submit" color="primary" />
                            <q-btn label="Borrar" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                    </q-form>

                </div>
            </article>
        </section>
        <section class="container-fichas-existentes">
            <article>
                <div class="busquedas">
                    <h2>Fichas</h2>
                    <q-input filled bottom-slots v-model="text" label="Buscar Ficha" :dense="dense" style="width: 400px; color: white" bg-color="white">
                        <template v-slot:append>
                          <q-icon v-if="text !== ''" name="delete" @click="text = ''" class="cursor-pointer" />
                          <q-icon name="search" @click="buscarFicha()" />
                        </template>
                      </q-input>
                      
                        <div class="q-pa-md" style="max-width: 90%; overflow: auto;">
                            <q-table
                              class="my-sticky-virtscroll-table"
                              virtual-scroll
                              flat bordered
                              v-model:pagination="pagination"
                              :rows-per-page-options="[0]"
                              :virtual-scroll-sticky-size-start="48"
                              row-key="index"
                              :rows="rows"
                              :columns="columns"
                              style="height: 52vh;"
                            >
                            <template v-slot:body-cell-estado="props">
                                <q-td :props="props">
                                  <label for="" v-if="props.row.estado == 1" style="color: green"  >Activo</label>
                                  <label for="" v-else style="color: red">Inactivo</label>
                                </q-td>
                              </template>
                            <template v-slot:body-cell-opciones="props">
                                <q-td :props="props" class="botones">
                                  <q-btn color="white" text-color="black" label="🖋️" @click="editarFicha(props.row._id)" />
                                  <q-btn color="white" text-color="black" label="❌" @click="inactivarFicha(props.row._id)"
                                    v-if="props.row.estado == 1" />
                                  <q-btn color="white" text-color="black" label="✅" @click="activarFicha(props.row._id)" v-else />
                                </q-td>
                              </template>
                            </q-table>
                        </div>
                </div>
            </article>
        </section>
    </div>
</template>

<style scoped>
.container-fichas {
    display: flex;
    width: 100%;
    min-height: 100vh;
    align-items: center;
}

.container-fichas-existentes {
    height: 100vh;
    background-color: #39A900;
    width: 60%;
}

.container-agregar-fichas {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 40%;
}
.container-agregar-fichas h3{
    padding: 0;
    margin: 5px;
}
.busquedas{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.fichas{
    background-color: white;
    border-radius: 5px;
    margin: 0;
    
}
</style>

<style lang="sass">
.my-sticky-virtscroll-table
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: #21BA45

  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>