import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import Cookies from "js-cookie";
import { useQuasar } from "quasar";

const modelo = "persona";

export const useStoreUsuarios = defineStore(modelo, () => {
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

  const token = ref("");
  const rol = ref("");

  const login = async (data) => {
    try {
      const response = await axios.post(`${modelo}/login`, data);
      console.log(response);

      token.value = response.token;
      rol.value = response.data.usuario.rol;

      localStorage.setItem("x-token", response.token);
      return response;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar("negative", "Sin conexión, por favor intente recargar");
        return null;
      }
      return error.response.data;
    }
  };

  const cambiarPassword = async (data) => {
    try {
      const id = Cookies.get("id");

      const response = await axios.put(`${modelo}/cambioPassword/${id}`, data);
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

  return { login, token, rol, cambiarPassword };
});
