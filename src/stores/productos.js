import axios from "axios";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import helpersGenerales from "../helpers/generales.js";

const $q = useQuasar()
function n(){
  $q.notify({
    type: 'negative',
    message: 'msg',
    position: "top",
  });
}
const modelo = "producto";
const router = useRouter();

export const useStoreProductos = defineStore(modelo, () => {
  const getAll = async () => {
    try {
      const response = await axios.get(`${modelo}/all`);
      console.log(response);

      return response.data;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        // helpersGenerales.notificar(
        //   "negative",
        //   "Sin conexión, por favor intente recargar"
        // );
        return null;
      }
      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido"
      ) {
        n()
        // helpersGenerales.notificar(
        //   "negative",
        //   "Por favor vuelva a iniciar sesión"
        // );
        router.push("/");
        return null;
      }
      return error.response.data;
    }
  };

  const agregar = async (data) => {
    try {
      const response = await axios.post(`${modelo}/agregar`, data);
      console.log(response);

      return response.data;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        helpersGenerales.notificar(
          "negative",
          "Sin conexión, por favor intente recargar"
        );
        return null;
      }
      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido"
      ) {
        helpersGenerales.notificar(
          "negative",
          "Por favor vuelva a iniciar sesión"
        );
        router.push("/");
        return null;
      }
      return error.response.data;
    }
  };

  return { getAll, agregar };
});
