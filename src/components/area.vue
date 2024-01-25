<script setup>
import { onMounted } from 'vue';
import { useStoreFichas } from '../stores/ficha.js';


const storeFichas = useStoreFichas();

let fichas = ref([]);

async function obtenerFichas(){
    await storeFichas.getAll();
    fichas.value = storeFichas.fichas;
};


onMounted(async () => {
  await obtenerFichas();
});
</script>


<template>
    <div class="container-areas">
        <section class="container-agregar-areas">
            <h3>{{textAgregarEditar}}</h3>
            <article>
                <div class="q-pa-md" style="width: 400px">
                    <q-form @submit="agregarFicha" @reset="onReset" class="q-gutter-md">
                        <q-input filled v-model="nombreArea" type="text" label="Nombre Area" lazy-rules
                            :rules="[val => val !== null && val !== '' || 'Seleccione la Fecha de Finalización']" />

                        <q-select filled v-model="ficha" label="Ficha" lazy-rules :options=fichas
                            :rules="[val => val !== null && val !== '' || 'Seleccione un nivel de Formación']" />
                        <div>
                            <q-btn :label="textEditarAgregar" type="submit" color="primary" />
                            <q-btn label="Borrar" type="reset" color="primary" flat class="q-ml-sm" />
                        </div>
                    </q-form>

                </div>
            </article>
        </section>
        <section class="container-areas-existentes">
            <article>
                <div class="busquedas">
                    <h2>areas</h2>
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
.container-areas {
    display: flex;
    width: 100%;
    min-height: 100vh;
    align-items: center;
}

.container-areas-existentes {
    height: 100vh;
    background-color: #39A900;
    width: 50%;
}

.container-agregar-areas {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 50%;
}
.container-agregar-areas h3{
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

.areas{
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