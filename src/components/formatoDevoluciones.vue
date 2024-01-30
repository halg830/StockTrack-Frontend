<script setup>
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue';
import { useStoreFichas } from '../stores/ficha.js';
import { useStoreProductos } from '../Stores/productos.js'

const useProductos = useStoreProductos()
const producto = ref();
const cantidad = ref();
const tipoDevolucion = ref();
const dataProductos = ref([]);
const opcionesTipo = ref([
  "Por uso", "Mal estado"
]);



const getFilteredProducts = () => {
  const productsOptions = dataProductos.value.map((c) => {
    return {
      label: c.estado === 0 ? `${c.nombre} - No disponible` : c.nombre,
      value: c,
      disable: c.estado === 0,
    };
  });
  return productsOptions;
};

const filtrarProductos = (val, update) => {
  if (val === '') {
    update(() => {
      dataProductos.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    dataProductos.value = dataProductos.value.filter(c => c.nombre.toLowerCase().includes(needle));
  });
  return;
};

const getFilteredTypes = () => opcionesTipo.value;

const filtrarTipos = (val, update) => {
  if (val === '') {
    update(() => {
      opcionesTipo.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    opcionesTipo.value = opcionesTipo.value.filter(c => c.toLowerCase().includes(needle));
  });
  return;
};


async function getInfo() {
  try {
    const response = await useProductos.getAll()
    console.log(response);
    if (!response) return;
    if (response.error) {
      notificar('negative', response.error)
      return
    }
    dataProductos.value = response
  } catch (error) {
    console.log(error);
  }
}
getInfo()

</script>

<template>
  <main>
    <section>
      <article>
        <p class="text-h3">Solicitud de Devolución</p>
      </article>
    </section>
    <section>

      <article>
        <p>Nombre</p>
        <q-select filled v-model="producto" clearable use-input hide-selected fill-input input-debounce="0"
          label="Seleccione el producto" :options="getFilteredProducts(dataProductos)" style="width: 400px"
          @filter="filtrarProductos">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No se encontraron resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </article>

      <article>
        <p>Cantidad</p>
        <q-input rounded outlined v-model="cantidad" lazy-rules type="number" color="dark" style="width: 400px"
          :rules="[val => val && val.length > 0 || 'Por favor ingrese una cantidad',  val => val && val === 0 || 'Por favor ingrese una cantidad mayor a 0' ]" />
      </article>

      <article>
        <p>Tipo de Devolución</p>
        <q-select filled v-model="tipoDevolucion" clearable use-input hide-selected fill-input input-debounce="0"
          label="Seleccione el producto" :options="getFilteredTypes(opcionesTipo)" style="width: 400px"
          @filter="filtrarTipos">
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No se encontraron resultados
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </article>

    </section>
  </main>
</template>

<style scoped>

</style>