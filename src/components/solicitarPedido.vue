<script setup>
import { ref } from "vue";
import Cookies from "js-cookie";
import { useStoreFichas } from "../stores/ficha.js";

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

function onSubmit() {}
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
                <q-select
                  class="input3"
                  outlined
                  v-model:model-value="data.idInstructorEncargado"
                  label="Nombre"
                  type="text"
                  disable
                  lazy-rules
                ></q-select>
              </div>
              <div>
                <span>Ficha: </span>
                <q-select
                  outlined
                  v-model="data.ficha"
                  use-input
                  input-debounce="0"
                  label="Numero"
                  behavior="menu"
                  :options="opcionesSelect.fichas"
                  :rules="[(val) => val != null || 'Seleccione una ficha']"
                  :loading="selectLoad.ficha"
                  :disable="selectLoad.ficha"
                >
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
            <div>
              <span>Presupuesto disponible: </span>
            </div>
          </div>
        </article>
        <article>
          <span>Escoger productos:</span>
          <nav>
            <!-- <div></div> -->
          </nav>
        </article>
      </section>
    </q-form>
  </main>
</template>

<style scoped></style>
