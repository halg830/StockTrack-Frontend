<script setup>

import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useStoreFichas } from '../stores/ficha.js';


const $q = useQuasar();
const storeFichas = useStoreFichas();

let fichas = ref([]);

let codigo = ref(null);
let nombreFicha = ref(null);
let nivelFormacion = ref(null);
let fechaInicio = ref(null);
let fechaFin = ref(null);

let pagination = ref({rowsPerPage: 0});
let text = ref('');
let dense =  ref(false);

let textAgregarEditar = ref("Agregar Fichas");
let textEditarAgregar = ref("Agregar");
let cambio = ref(null);

let niveles = ref([
    "Técnico", "Tecnólogo"
]);

const columns = [
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align: "left"},
  { name: "codigo", label: "Codigo", field: "codigo", sortable: true, align: "left"},
  { name: "nivelFormacion", label: "Nivel de Formación", field: "nivelFormacion", sortable: true, align: "left"},
  { name: "fechaInicio", label: "Fecha Inicio", field: "fechaInicio", sortable: true, align: "left"},
  { name: "fechaFin", label: "Fecha Fin", field: "fechaFin", sortable: true, align: "left"},
  { name: "estado", label: "Estado", field: "estado", sortable: true, align: "left"},
  { name: "createAT", label: "Fecha de Creación", field: "createAT", sortable: true, format: (val) => format(new Date(val), "yyyy-MM-dd"),align: "center"},
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
        rows.value = storeFichas.fichas.reverse();
        notificar('positive', "Fichas Obtenidas")
    } catch (error) {
        console.log(error);
    };
};

onMounted(async () => {
  getInfoFichas();
  
});

async function agregarEditarFicha(){
    if (cambio.value === 0) {
        try {
            await storeFichas.agregar({
                codigo: codigo.value,
                nombre: nombreFicha.value,
                nivelFormacion: nivelFormacion.value,
                fechaInicio: fechaInicio.value,
                fechaFin: fechaFin.value
            })
            onReset();
        } catch (error) {
            console.log(error);
            notificar('negative', error)
        };
    }else{
        try {
            await storeFichas.editar(id,{
                codigo: codigo.value,
                nombre: nombreFicha.value,
                nivelFormacion: nivelFormacion.value,
                fechaInicio: fechaInicio.value,
                fechaFin: fechaFin.value
            })
        } catch (error) {
            console.log(error);
        };
    };
};





function agregarFicha() {
    cambio.value = 0
    agregarEditarFicha();
    onReset();
};

function editarFicha(id){
    const fichaSelected = fichas.value.find((ficha) => ficha._id === id);
  if (fichaSelected) {
    fixed.value = true;
    textEditarAgregar.value = "Guardar";
    codigo.value = fichaSelected.codigo;
    nombre.value = fichaSelected.nombre;
    nivelFormacion.value = fichaSelected.nivelFormacion;
    fechaInicio.value = fichaSelected.fechaInicio;
    fechaFin.value = fichaSelected.fechaFin;
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
};

</script>

<template>
    <div class="container-fichas">
        <section class="container-agregar-fichas">
            <h3>{{textAgregarEditar}}</h3>
            <article>
                <div class="q-pa-md" style="width: 400px">
                    <q-form @submit="agregarFicha" @reset="onReset" class="q-gutter-md">
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

                        <q-select filled v-model="nivelFormacion" label="Area" lazy-rules :options=niveles
                            :rules="[val => val !== null && val !== '' || 'Seleccione un nivel de Formación']" />
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
                      
                        <div class="q-pa-md">
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