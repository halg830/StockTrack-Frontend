<script setup>
import { ref, watch } from "vue";
import { useQuasar } from "quasar";
import { useStoreUsuarios } from "../stores/usuarios.js";
import helpersGenerales from "../helpers/generales.js";

// Alertas notify
const $q = useQuasar();
function notificar(tipo, msg) {
  $q.notify({
    type: tipo,
    message: msg,
    position: "top",
  });
}

//Input contraseña visible
const clicks = ref({ password: true, newPassword: true });

//Data tabla
const columns = ref([
  {
    name: "nombre",
    label: "Nombre",
    align: "center",
    field: "nombre",
  },
  {
    name: "apellido",
    label: "Apellidos",
    align: "center",
    field: "apellido",
  },
  {
    name: "identificacion",
    label: "Identificación",
    align: "center",
    field: "identificacion",
  },
  {
    name: "correo",
    label: "Correo",
    align: "center",
    field: "correo",
  },
  {
    name: "telefono",
    label: "Teléfono",
    align: "center",
    field: "telefono",
  },
  {
    name: "rol",
    label: "Rol",
    align: "center",
    field: "rol",
  },
  {
    name: "estado",
    label: "Estado",
    align: "center",
    field: "estado",
  },
  {
    name: "opciones",
    label: "Opciones",
    align: "center",
    field: "opciones",
  },
]);
const rows = ref([]);

const data = ref({});
const confirmPassword = ref("");
const estado = ref("agregar");
const modal = ref(false);
const opcionesSelect = {
  rol: ["Admin", "Instructor", "Bodega"],
};

// Get datos tabla
const useUsuario = useStoreUsuarios();
const loadTable = ref(false);
async function getInfo() {
  try {
    loadTable.value = true;

    const response = await useUsuario.getAll();
    console.log(response);

    if (!response) return;
    if (response.error) {
      notificar("negative", response.error);
      return;
    }

    rows.value = response.reverse();
  } catch (error) {
    console.log(error);
  } finally {
    loadTable.value = false;
  }
}
getInfo();

// Opciones tabla
const opciones = {
  agregar: () => {
    data.value = {};
    confirmPassword.value = "";
    estado.value = "agregar";
    modal.value = true;
  },
  editar: (info) => {
    data.value = { ...info };
    estado.value = "editar";
    modal.value = true;
  },
};

//Registrar
const loadBtnModal = ref(false);
const enviarInfo = {
  agregar: async () => {
    try {
      loadBtnModal.value = true;

      const response = await useUsuario.agregar(data.value);
      console.log(response);

      if (!response) return;
      if (response.error) {
        notificar("negative", response.error);
        return;
      }

      rows.value.unshift(response);
      modal.value = false;
      notificar("positive", "Guardado exitosamente");
    } catch (error) {
      console.log(error);
    } finally {
      loadBtnModal.value = false;
    }
  },
  editar: async () => {
    loadBtnModal.value = true;
    try {
      console.log(data.value);
      const response = await useUsuario.editar(data.value._id, data.value);
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar("negative", response.error);
        return;
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
      modal.value = false;
      notificar("positive", "Editado exitosamente");
    } catch (error) {
      console.log(error);
    } finally {
      loadBtnModal.value = false;
    }
  },
};

//Validaciones
const vali = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validarCampos() {
  console.log(data.value);
  const arrData = Object.entries(data.value);
  console.log(arrData);
  for (const d of arrData) {
    console.log(d);
    if (d[1] === null) {
      notificar("negative", "Por favor complete todos los campos");
      return;
    }
    if (typeof d[1] === "string") {
      if (d[1].trim() === "" && (d[0]==='password' && estado.value==='agregar')) {
        notificar("negative", "Por favor complete todos los campos");
        return;
      }
    }
  }

  if (confirmPassword.value.trim() === "" && estado.value==='agregar') {
    notificar("negative", "Por favor complete todos los campos");
    return;
  }

  enviarInfo[estado.value]();
}

function limitarLongitud(input, maxLength) {
  if (data.value[input] > maxLength) {
    data.value[input] = data.value[input].slice(0, maxLength);
  }
}

//Activar y desactivar
const loadIn_activar = ref(false);
const in_activar = {
  activar: async (id) => {
    loadIn_activar.value = true;
    try {
      const response = await useUsuario.activar(id);
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar("negative", response.error);
        return;
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
    } catch (error) {
      console.log(error);
    } finally {
      loadIn_activar.value = false;
    }
  },
  inactivar: async (id) => {
    loadIn_activar.value = true;
    try {
      const response = await useUsuario.inactivar(id);
      console.log(response);
      if (!response) return;
      if (response.error) {
        notificar("negative", response.error);
        return;
      }
      rows.value.splice(buscarIndexLocal(response._id), 1, response);
    } catch (error) {
      console.log(error);
    } finally {
      loadIn_activar.value = false;
    }
  },
};

function buscarIndexLocal(id) {
  return rows.value.findIndex((r) => r._id === id);
}
</script>

<template>
  <main>
    <section>
      <q-dialog v-model="modal">
        <q-card class="modal">
          <q-toolbar>
            <q-toolbar-title
              >{{
                helpersGenerales.primeraMayus(estado)
              }}
              usuario</q-toolbar-title
            >
            <q-btn class="botonv1" flat dense icon="close" v-close-popup />
          </q-toolbar>

          <q-card-section class="q-gutter-md">
            <q-form @submit="validarCampos" class="q-gutter-md">
              <div class="q-pa-md" style="max-width: 500px">
                <q-input
                  filled
                  v-model="data.nombre"
                  label="Nombre"
                  bottom-slots
                  :rules="[(val) => !!val.trim() || 'Ingrese un nombre']"
                >
                </q-input>
              </div>

              <div class="q-pa-md" style="max-width: 500px">
                <q-input
                  filled
                  v-model="data.apellido"
                  label="Apellidos"
                  bottom-slots
                  :rules="[(val) => !!val.trim() || 'Ingrese un apellido']"
                >
                </q-input>
              </div>

              <div class="q-pa-md" style="max-width: 500px">
                <q-input
                  filled
                  v-model="data.identificacion"
                  label="Identificación"
                  bottom-slots
                  type="number"
                  input-class="input"
                  :rules="[
                    (val) => !!val.trim() || 'Ingrese una identificación',
                  ]"
                  :oninput="limitarLongitud('identificacion', 10)"
                >
                </q-input>
              </div>

              <div class="q-pa-md" style="max-width: 500px">
                <q-input
                  filled
                  v-model="data.correo"
                  label="Correo"
                  bottom-slots
                  :rules="[
                    (val) => !!val.trim() || 'Ingrese un correo',
                    (val) =>
                      regexCorreo.test(val) ||
                      'Por favor ingrese un correo válido',
                  ]"
                >
                </q-input>
              </div>

              <div class="q-pa-md" style="max-width: 500px">
                <q-input
                  filled
                  v-model="data.telefono"
                  type="Number"
                  label="Telefono"
                  bottom-slots
                  :rules="[(val) => !!val.trim() || 'Ingrese un teléfono']"
                  :oninput="limitarLongitud('telefono', 10)"
                >
                </q-input>
              </div>
              <div class="q-pa-md" style="max-width: 500px">
                <q-select
                  filled
                  v-model:model-value="data.rol"
                  input-debounce="0"
                  label="Rol"
                  :options="opcionesSelect.rol"
                  behavior="menu"
                  :rules="[(val) => !!val || 'Seleccione un rol']"
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
              <div
                class="q-pa-md"
                style="max-width: 500px"
                v-if="estado === 'agregar'"
              >
                <q-input
                  filled
                  v-model="data.password"
                  :type="clicks.password ? 'password' : 'text'"
                  label="Contraseña"
                  bottom-slots
                  :rules="[
                    (val) => !!val.trim() || 'Ingrese una contraseña',
                    (val) =>
                      vali.test(val) ||
                      'La contraseña debe contener una minúscula, una mayúscula, un número, un carácter especial y 8 carácteres.',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="clicks.password ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="clicks.password = !clicks.password"
                    />
                  </template>
                </q-input>
              </div>
              <div
                class="q-pa-md"
                style="max-width: 500px"
                v-if="estado === 'agregar'"
              >
                <q-input
                  filled
                  v-model="confirmPassword"
                  :type="clicks.newPassword ? 'password' : 'text'"
                  label="Confirme su contraseña"
                  bottom-slots
                  :rules="[
                    (val) => !!val.trim() || 'Confirme la contraseña',
                    (val) =>
                      val === data.password || 'Las contraseñas no coinciden',
                    (val) =>
                      vali.test(val) ||
                      'La contraseña debe contener una minúscula, una mayúscula, un número, un carácter especial y 8 carácteres.',
                  ]"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="
                        clicks.newPassword ? 'visibility_off' : 'visibility'
                      "
                      class="cursor-pointer"
                      @click="clicks.newPassword = !clicks.newPassword"
                    />
                  </template>
                </q-input>
              </div>

              <q-btn
                :loading="loadBtnModal"
                padding="10px"
                type="submit"
                :color="estado == 'editar' ? 'warning' : 'secondary'"
                :label="estado"
              >
              </q-btn>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <q-table
        :rows="rows"
        :columns="columns"
        row-key="name"
        :loading="loadTable"
        loading-label="Cargando..."
        :filter="filter"
        rows-per-page-label="Visualización de filas"
        page="2"
        :rows-per-page-options="[10, 20, 40, 0]"
        no-results-label="No hay resultados para la búsqueda."
        wrap-cells="false"
        label="Usuarios"
        no-data-label="No hay programa registrados."
        class="my-sticky-header-column-table"
      >
        <template v-slot:top-left style="margin: 100px; background-color: aqua">
          <h4 id="titleTable">Usuarios</h4>
          <q-btn @click="opciones.agregar" color="primary">
            <q-icon name="add" color="white" center />
          </q-btn>
        </template>
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            color="primary"
            v-model="filter"
            class="buscar"
            placeholder="Buscar cualquier campo"
            id="boxBuscar"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props" class="botones">
            <q-btn
              class="botonv1"
              text-size="1px"
              padding="10px"
              :loading="props.row.estado === 'load'"
              :label="
                props.row.estado
                  ? 'Activo'
                  : !props.row.estado
                  ? 'Inactivo'
                  : '‎  ‎   ‎   ‎   ‎ '
              "
              :color="props.row.estado ? 'positive' : 'accent'"
              loading-indicator-size="small"
              @click="
                props.row.estado
                  ? in_activar.inactivar(props.row._id)
                  : in_activar.activar(props.row._id);
                props.row.estado = 'load';
              "
            />
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props" class="botones">
            <q-btn
              color="warning"
              icon="edit"
              class="botonv1"
              @click="opciones.editar(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </section>
  </main>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=Kanit:wght@500&display=swap");

.name {
  font-size: 15px;
  font-family: "Inter", sans-serif;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  display: flex;
}

.box {
  display: flex;
  width: 100%;
  border-bottom: solid black 1px;
}

.img-perfil {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.card {
  margin-left: 200px;
  margin-top: 200px;
  width: 500px;
  height: 500px;
  border-radius: 30px;
  background: #e0e0e0;
}

.form {
  width: 500px;
  margin-top: -100px;
}

.container {
  display: flex;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;
}

.left-panel {
  background-color: #39a900;
  display: flex;
}

.right-panel {
  margin: 0 auto;
}

.ingresa {
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 250px;
  background-color: #39a900;
  border: none;
}

.nombre {
  align-items: center;
  justify-content: center;
  display: flex;
}

.boton {
  justify-content: center;
  display: flex;
}

.boton2 {
  justify-content: center;
  display: flex;
}

.ingresar {
  width: 250px;
  background-color: white;
  border: none;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.input {
  width: 500px;
}

.registro {
  justify-content: center;
  align-items: center;
  display: flex;
}

/* estilos de check activo inactivo */
.toggler {
  align-items: center;
  /* width: 72px; */
  /* margin: 15px 271px; */
  display: flex;
  justify-content: flex-end;
  width: 38%;
}

.toggler input {
  display: none;
}

.toggler label {
  display: block;
  position: relative;
  width: 72px;
  height: 36px;
  border: 1px solid #d6d6d6;
  border-radius: 36px;
  background: #e4e8e8;
  cursor: pointer;
}

.toggler label::after {
  display: block;
  border-radius: 100%;
  background-color: #d7062a;
  content: "";
  animation-name: toggler-size;
  animation-duration: 0.15s;
  animation-timing-function: ease-out;
  animation-direction: forwards;
  animation-iteration-count: 1;
  animation-play-state: running;
}

.toggler label::after,
.toggler label .toggler-on,
.toggler label .toggler-off {
  position: absolute;
  top: 50%;
  left: 25%;
  width: 26px;
  height: 26px;
  transform: translateY(-50%) translateX(-50%);
  transition: left 0.15s ease-in-out, background-color 0.2s ease-out,
    width 0.15s ease-in-out, height 0.15s ease-in-out, opacity 0.15s ease-in-out;
}

.toggler input:checked + label::after,
.toggler input:checked + label .toggler-on,
.toggler input:checked + label .toggler-off {
  left: 75%;
}

.toggler input:checked + label::after {
  background-color: #50ac5d;
  animation-name: toggler-size2;
}

.toggler .toggler-on,
.toggler .toggler-off {
  opacity: 1;
  z-index: 2;
}

.toggler input:checked + label .toggler-off,
.toggler input:not(:checked) + label .toggler-on {
  width: 0;
  height: 0;
  opacity: 0;
}

.toggler .path {
  fill: none;
  stroke: #fefefe;
  stroke-width: 7px;
  stroke-linecap: round;
  stroke-miterlimit: 10;
}

@keyframes toggler-size {
  0%,
  100% {
    width: 26px;
    height: 26px;
  }

  50% {
    width: 20px;
    height: 20px;
  }
}

@keyframes toggler-size2 {
  0%,
  100% {
    width: 26px;
    height: 26px;
  }

  50% {
    width: 20px;
    height: 20px;
  }
}
</style>
