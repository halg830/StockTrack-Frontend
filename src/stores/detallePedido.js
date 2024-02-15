import axios from "axios";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { ref } from "vue";
import Cookies from "js-cookie";

const modelo = "detallePedido";

export const useStoreDetallePedido = defineStore(modelo, () => {
  function obtenerToken() {
    console.log(Cookies.get("x-token"));
    return Cookies.get("x-token");
  }

  axios.defaults.headers.common["x-token"] = obtenerToken();

  const $q = useQuasar();
  function notificar(tipo, msg) {
    $q.notify({
      type: tipo,
      message: msg,
      position: "top",
    });
  }

  const router = useRouter();
  function salir() {
    notificar("negative", "Por favor vuelva a iniciar sesión");
    router.push("/");
  }
  const detallesPedidos = ref([]);

  const getAll = async () => {
    try {
      const response = await axios.get(`${modelo}/all`);
      console.log(response);
      pedidos.value = response.data;
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("negative", "Sin conexión, por favor intente recargar");
        return null;
      }
      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido" ||
        error.response.data.error.name === "TokenExpiredError"
      ) {
        salir();
        return null;
      }
      return error.response.data;
    }
  };

  const getPorPedido =async(idPedido)=>{
    try {
      const response = await axios.get(`${modelo}/getPorPedido/${idPedido}`)
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("negative", "Sin conexión, por favor intente recargar");
        return null;
      }
      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido" ||
        error.response.data.error.name === "TokenExpiredError"
      ) {
        salir();
        return null;
      }
      return error.response.data;
    }
  }

  return { getAll, getPorPedido, detallesPedidos}
})



