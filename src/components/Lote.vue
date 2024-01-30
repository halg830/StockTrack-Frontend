<script setup>

import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useStoreLotes } from '../stores/lote.js';

const $q = useQuasar();
const storeLote = useStoreLotes();

let presupuesto = ref(null);
let nombreLote = ref(null);

let pagination = ref({rowsPerPage: 0});

let text = ref('');
let dense =  ref(false);

let textAgregarEditar = ref("Agregar Lote")

let rows = ref([]);


async function obtenerLotes(){
    try {
        let response = await storeLote.getAll();
        console.log("Response:", response);
        rows.value = response;
    } catch (error) {
        console.log(error);
    }
   
}

onMounted(()=>{
    obtenerLotes();
})

</script>

<template>
    <div class="container-fichas">
        <section class="container-agregar-fichas">
            <h3>{{textAgregarEditar}}</h3>
            <article>
                <div class="q-pa-md" style="width: 400px">
                    <q-form @submit="agregarEditarLote" @reset="onReset" class="q-gutter-md">
                        
                        <q-input filled v-model="nombreFicha" label="Nombre Lote" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Digite el Nombre del Lote']" />

                        <q-input filled v-model="numeroFicha" type="number" label="Presupuesto" lazy-rules
                            :rules="[val => val && val.length > 0 || 'Digite el presupuesto']" />
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
                                  <q-btn color="white" text-color="black" label="🖋️" @click="EditarBus(props.row._id)" />
                                  <q-btn color="white" text-color="black" label="❌" @click="InactivarBus(props.row._id)"
                                    v-if="props.row.estado == 1" />
                                  <q-btn color="white" text-color="black" label="✅" @click="ActivarBus(props.row._id)" v-else />
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