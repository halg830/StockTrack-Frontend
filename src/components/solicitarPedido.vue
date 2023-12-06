<script setup>
const selectLoad = ref({
  ficha: false
})


function fechaActual() {
  const fecha = new Date
  const formatoFecha = `${fecha.getFullYear()}/${(fecha.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${fecha.getDate().toString().padStart(2, '0')}`;

  return formatoFecha
}

const data = ref({ fechaCreacion: fechaActual() })

const opcionesFiltro = ref({
  
})

function filterFn(val, update) {
  if (val === '') {
    update(() => {
      opcionesFiltro.value.conductores = options.value.conductores
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    opcionesFiltro.value.conductores = options.value.conductores.filter(v => v.label.toLowerCase().indexOf(needle) > -1) || []
  })
}

</script>
<template>
 <!--  <main>
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <section>
        <article>
          <span>Fecha: {{ data.fechaCreacion }}</span>
          <div>
            <span>Instructor: </span>
            <q-input class="input3" outlined v-model="data.instructor" label="Nombre" type="text" disable
              lazy-rules></q-input>
          </div>
          <div>
            <span>Ficha: </span>
            <q-select outlined v-model:="data.ficha" use-input input-debounce="0" label="Numero"
              :options="opcionesFiltro.ficha" @filter="filterFn" behavior="menu"
              :rules="[val => val != null || 'Seleccione una ficha']" :loading="selectLoad.ficha"
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
        </article>
        <article></article>
      </section>
    </q-form>
  </main> -->
</template>

<style scoped></style>