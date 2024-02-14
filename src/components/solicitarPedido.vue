<script setup>
import { ref } from "vue";
import Cookies from "js-cookie";
import { useStoreFichas } from "../stores/ficha.js";
import { useStoreLotes } from "../stores/lote.js";

//Data modal
const data = ref({
  fechaCreacion: fechaActual(),
  idInstructorEncargado: obtenerInstructor(),
});

function fechaActual() {
  const fecha = new Date();
  const formatoFecha = `${fecha.getDate().toString().padStart(2, "0")} / ${(
    fecha.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")} / ${fecha.getFullYear()}`;

  return formatoFecha;
}

function obtenerInstructor() {
  const usuario = Cookies.get("usuario");
  const objUsuario = JSON.parse(usuario);
  console.log(objUsuario);
  return {
    label: objUsuario.nombre + " " + objUsuario.apellido,
    value: objUsuario._id,
  };
}

//Obtener fichas
const selectLoad = ref({
  ficha: true,
});

const opcionesSelect = ref({});

const useFicha = useStoreFichas();
async function obtenerOptions() {
  try {
    const responseFichas = await useFicha.getAll();
    console.log(responseFichas);

    if (!responseFichas) return;

    if (responseFichas.error) {
      notificar("negative", responseFichas.error);
      return;
    }

    opcionesSelect.value.fichas = responseFichas.map((ficha) => {
      return {
        label:
          ficha.codigo + " / " + (ficha.abreviatura
            ? ficha.abreviatura
            : ficha.nombre) + `${ficha.estado === 0 ? " - Inactivo" : ""}`,
        value: ficha._id,
        disable: ficha.estado === 0,
      };
    });
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.ficha = false;
  }
}
obtenerOptions();

//Filtro de fichas
const opcionesFiltro = ref({
  fichas: opcionesSelect.value.fichas
})
function filterFn(val, update) {
  val = val.trim()
  if (val === '') {
    update(() => {
      opcionesFiltro.value.fichas = opcionesSelect.value.fichas
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opcionesFiltro.value.fichas = opcionesSelect.value.fichas.filter(v => v.label.toLowerCase().indexOf(needle) > -1) || []
  })
}

//Lotes
const slide = ref(1)
const useLote = useStoreLotes()
async function obtenerLotes() {
  try {
    const response = await useLote.getAll();
    console.log(response);

    if (!response) return;

    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    const result = [];
    for (let i = 0; i < response.length; i += 4) {
      result.push(response.slice(i, i + 4));
    }

    opcionesSelect.value.lotes = result
  } catch (error) {
    console.log(error);
  } finally {
    selectLoad.value.lote = false;
  }
}
obtenerLotes()

//Productos


function onSubmit() { }
</script>
<template>
  <main>
    <q-form @submit="onSubmit" class="q-gutter-md">
      <section>
        <article>
          <div>
            <span>Fecha: {{ data.fechaCreacion }}</span>
            <span>N° pedido: </span>
          </div>
          <div>
            <div>
              <div>
                <span>Instructor: </span>
                <q-select class="input3" outlined v-model:model-value="data.idInstructorEncargado" label="Nombre"
                  type="text" disable lazy-rules></q-select>
              </div>
              <div>
                <span>Ficha: </span>
                <q-select outlined v-model:model-value="data.ficha" use-input input-debounce="0" label="Codigo Ficha"
                  behavior="menu" @filter="filterFn" :options="opcionesFiltro.fichas"
                  :rules="[(val) => val != null || 'Seleccione una ficha']" :loading="selectLoad.ficha"
                  :disable="selectLoad.ficha">
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        Sin resultados
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </div>
        </article>
        <article>
          <span>Escoger productos:</span>
          <div class="q-pa-md">
            <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left" swipeable animated
              control-color="amber" navigation padding arrows height="300px" class="bg-grey-9 shadow-2 rounded-borders"
              draggable="false">
              <q-carousel-slide :name="index + 1" class="column no-wrap"
                v-for="(loteGrupo, index) in opcionesSelect.lotes" :key="index">
                <div class="row fit justify-start items-center q-gutter-xs q-col-gutter no-wrap">
                  <h1 v-for="lote in loteGrupo" :key="lote._id" style="background-color: white; margin-left:20px">{{
                    lote.nombre }}</h1>
                  <!-- <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/mountains.jpg" />
                  <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/parallax1.jpg" />
                  <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/material.png" />
                  <q-img class="rounded-borders col-3 full-height" src="https://cdn.quasar.dev/img/donuts.png" /> -->
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div>

          <table>
            <th>
            <td>N°</td>
            <td>Producto</td>
            <td>Unidad Medida</td>
            <td>Precio neto</td>
            <td>Cantidad</td>
            <td>Subtotal</td>
            <td>Opciones</td>
            </th>
            <tr v-for="producto in opcionesSelect.productos" :key="producto._id">
              <td v-for="(atributo, i) in Object.values(producto)" :key="i">{{ atributo }}</td>
              <td> <q-btn>editar</q-btn></td>
            </tr>
          </table>
        </article>
      </section>
    </q-form>

    <q-dialog v-model="modal">
      <q-card class="modal" style="width: 450px;">
          <q-toolbar style="        background-color: #39A900;color: white">
              <q-toolbar-title>Agregar producto</q-toolbar-title>
              <q-btn class="botonv1" flat dense icon="close" v-close-popup />
          </q-toolbar>

          <q-card-section class="q-gutter-md">
              <q-form @submit="validarCampos" class="q-gutter-md">
                  <q-select filled v-model:model-value="data.area" label="Area" lazy-rules :options="optionsArea"
                      :rules="[val => val !== null && val !== '' || 'Seleccione un area']" />

                  <div style=" display: flex; width: 96%; justify-content: flex-end;">
                      <q-btn :loading="loadingModal" padding="10px" type="submit"
                          :color="estado == 'editar' ? 'warning' : 'primary'" :label="estado" />
                  </div>

              </q-form>
          </q-card-section>
      </q-card>
  </q-dialog>
  </main>
</template>

<style scoped></style>
