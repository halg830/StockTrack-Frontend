<script setup>

import { useQuasar } from 'quasar';
import { onMounted, ref, watch } from 'vue';
import { useStoreLotes } from '../stores/lote.js';
import { format } from "date-fns";


const $q = useQuasar();
const storeLote = useStoreLotes();

let lotes = ref([]);

let codigo = ref(null);
let nombre = ref(null);
let descrición = ref(null)
let fechaFin = ref(null);
let pagination = ref({rowsPerPage: 0});
let text = ref('');
let dense =  ref(false);

let textAgregarEditar = ref("Agregar Fichas");
let textEditarAgregar = ref("Agregar");
let cambio = ref(0);


const columns = [
  { name: "codigo", label: "Codigo", field: "codigo", sortable: true, align: "left"},
  { name: "nombre", label: "Nombre", field: "nombre", sortable: true, align: "left"},
  { name: "descripcion", label: "Descripción", field: "decripcion", sortable: true, align: "left"},
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

async function getInfoLotes(){
    textEditarAgregar.value = "Agregar"
    try {
        let response = await storeLote.getAll();
        console.log(response.data);
        lotes.value = storeLote.lotes;
        rows.value = storeLote.lotes;
        // notificar('positive', "Fichas Obtenidas")
    } catch (error) {
        console.log(error);
    };
};


onMounted(async () => {
  getInfoLotes();
});

async function agregarEditarLote(){
    if (cambio.value === 0) {
        try {
            await storeLote.agregar({
                codigo: codigo.value,
                nombre: nombre.value,
                descripcion: descripcion.value
            })
            onReset();
            getInfoLotes();
        } catch (error) {
            console.log(error);
            notificar('negative', error)
        };
    }else{
        try {
            const id = idLote.value;
            await storeLote.editar(id,{
                codigo: codigo.value,
                nombre: nombre.value,
                descripcion: descripcion.value
            })
            getInfoLotes();
            onReset();
            cambio.value == 0;
        } catch (error) {
            console.log(error);
        };
    };
};

watch(fechaFin,() =>{
    console.log(fechaFin.value);
  }
)

let idLote = ref("")
function editarLote(id){
    cambio.value = 1
    const loteSelected = lotes.value.find((lote) => lote._id === id);
  if (loteSelected) {
    console.log(loteSelected._id);
    idFicha.value = String(loteSelected._id)
    textEditarAgregar.value = "Guardar";
    codigo.value = loteSelected.codigo;
    nombre.value = loteSelected.nombre;
    descripcion.value = loteSelected.descripcion;
  };
}
function buscarLote(){
    console.log("Buscando Ficha");
};


function onReset() {
    codigo.value = "";
    nombre.value = "";
    descripcion.value = "";
};


async function inactivarLote(id){
    try {
        await storeLote.inactivar(id);
        onReset();
        getInfoLotes();
    } catch (error) {
        console.log(error);
    }
}

async function activarLote(id){
    try {
        await storeLote.activar(id);
        onReset();
        getInfoLotes();
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
                    <q-form @submit="agregarEditarLote" @reset="onReset" class="q-gutter-md">
                        
                        <q-input filled v-model="codigo" type="number" label="Codigo Lote" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Digite el Codigo del Lote']" />

                        <q-input filled v-model="nombre"  label="Nombre Lote" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Digite el nombre']" />

                        <q-input filled v-model="descripcion" label="Descripción" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Digite la descrición']" />
                        <div>
                            <q-btn label="Submit" type="submit" color="primary" />
                            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                    </q-form>

                </div>
            </article>
        </section>
        <section class="container-fichas-existentes">
            <article>
                <div class="busquedas">
                    <h2>Lotes</h2>
                    <q-input filled bottom-slots v-model="text" label="Buscar Lote" :dense="dense" style="width: 400px; color: white" bg-color="white">
                        <template v-slot:append>
                          <q-icon v-if="text !== ''" name="delete" @click="text = ''" class="cursor-pointer" />
                          <q-icon name="search" @click="buscarLote()" />
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
                                  <q-btn color="white" text-color="black" label="🖋️" @click="editarLote(props.row._id)" />
                                  <q-btn color="white" text-color="black" label="❌" @click="inactivarLote(props.row._id)"
                                    v-if="props.row.estado == 1" />
                                  <q-btn color="white" text-color="black" label="✅" @click="activarLote(props.row._id)" v-else />
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
    width: 50%;
}

.container-agregar-fichas {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 50%;
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