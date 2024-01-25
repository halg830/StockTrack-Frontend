import axios from "axios";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const modelo = "ficha";

export const useStoreFichas = defineStore(modelo, () => {
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
    notificar("negative", "Por favor vuela a iniciar sesión");
    router.push("/");
  }

  const getAll = async () => {
    try {
      const response = await axios.get(`${modelo}/all`);
      console.log(response);

      return response.data;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("negative", "Sin conexión, por favor intente recargar");
        return null;
      }
      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido"
      ) {
        salir();
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
        notificar("negative", "Sin conexión, por favor intente recargar");
        return null;
      }
      if (
        error.response.data.error === "No hay token en la peticion" ||
        error.response.data.error === "Token no válido"
      ) {
        notificar("negative", "Por favor vuelva a iniciar sesión");
        router.push("/");
        return null;
      }
      return error.response.data;
    }
  };

  const editar = async (id, data) => {
    try {
      const response = await axios.put(`${modelo}/editar/${id}`, data);
      console.log(response);
      return response.data
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar('negative',"Sin conexión, por favor intente recargar");
        return null;
      }

      if (error.response.data.error === "Token no valido") {
        salir();
        return null
      }
      return error.response.data;
    }
  };

  const activar = async (id) => {
    try {
      const response = await axios.put(`${modelo}/activar/${id}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("Sin conexión, por favor intente recargar");
        return null;
      }

      if (error.response.data.error === "Token no valido") {
        salir();
        return null;
      }
      return error.response.data;
    }
  };

  const inactivar = async (id) => {
    try {
      const response = await axios.put(`${modelo}/inactivar/${id}`);
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("Sin conexión, por favor intente recargar");
        return null;
      }

      if (error.response.data.error === "Token no valido") {
        salir();
        return null;
      }
      return error.response.data;
    }
  };

  return { getAll, agregar, editar, activar, inactivar };
});
