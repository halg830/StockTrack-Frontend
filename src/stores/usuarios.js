import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const modelo = "persona";

export const useStoreUsuarios = defineStore(
  modelo,
  () => {
    const token = ref("");
    const usuario = ref("");
    const email = ref("");
    const id = ref("");

    const router = useRouter();
    function salir() {
      notificar("negative", "Por favor vuela a iniciar sesión");
      router.push("/");
    }

    function insertarToken() {
      axios.defaults.headers.common["x-token"] = token.value;
    }

    const $q = useQuasar();
    function notificar(tipo, msg) {
      $q.notify({
        type: tipo,
        message: msg,
        position: "top",
      });
    }

    const getAll = async () => {
      try {
        insertarToken();
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
          error.response.data.error === "Token no válido" ||
          error.response.data.error.name === "TokenExpiredError"
        ) {
          salir();
          return null;
        }
        return error.response.data;
      }
    };

    const codigoRecuperar = async (correo) => {
      try {
        const response = await axios.get(
          `${modelo}/codigo-recuperar/${correo}`
        );
        console.log(response);
          email.value = correo
        return response;
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

    const confirmarCodigo = async (codigo) => {
      try {
        const response = await axios.get(
          `${modelo}/confirmar-codigo/${codigo}`
        );
        console.log(response);

        return response;
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

    const login = async (data) => {
      try {
        const response = await axios.post(`${modelo}/login`, data);
        console.log("Hola soy login", response);

        token.value = response.data.token;
        usuario.value = response.data.usuario;
        id.value = response.data.usuario._id;
        
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

    const editar = async (id, data) => {
      try {
        insertarToken();
        const response = await axios.put(`${modelo}/editar/${id}`, data);
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
          error.response.data.error === "Token no válido" ||
          error.response.data.error.name === "TokenExpiredError"
        ) {
          notificar("negative", "Por favor vuelva a iniciar sesión");
          router.push("/");
          return null;
        }
        return error.response.data;
      }
    };

    const agregar = async (data) => {
      try {
        insertarToken();
        const response = await axios.post(`${modelo}/registro`, data);
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
          error.response.data.error === "Token no válido" ||
          error.response.data.error.name === "TokenExpiredError"
        ) {
          notificar("negative", "Por favor vuelva a iniciar sesión");
          router.push("/");
          return null;
        }
        return error.response.data;
      }
    };

    const cambiarPassword = async (data) => {
      try {
        insertarToken();
        const response = await axios.put(`${modelo}/cambioPassword/${id.value}`, data);
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
          error.response.data.error === "Token no válido" ||
          error.response.data.error.name === "TokenExpiredError"
        ) {
          notificar("negative", "Por favor vuelva a iniciar sesión");
          router.push("/");
          return null;
        }
        return error.response.data;
      }
    };

    const nuevaPassword = async (data) => {
      try {
        const response = await axios.put(`${modelo}/nueva-password`, data);
        console.log(response);

        return response;
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
          notificar("negative", "Por favor vuelva a iniciar sesión");
          router.push("/");
          return null;
        }
        return error.response.data;
      }
    };

    const activar = async (id) => {
      try {
        insertarToken();
        const response = await axios.put(`${modelo}/activar/${id}`);
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
        if (error.message === "Network Error") {
          notificar("Sin conexión, por favor intente recargar");
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

    const inactivar = async (id) => {
      try {
        insertarToken();
        const response = await axios.put(`${modelo}/inactivar/${id}`);
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
        if (error.message === "Network Error") {
          notificar("Sin conexión, por favor intente recargar");
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
    
    const subirFotoPerfil = async (id, file) => {
      try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'fotosperfil');
          const response = await axios.post(`https://api.cloudinary.com/v1_1/djnx92ifa/image/upload`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
          const fotoPerfil = response.data.secure_url;
  
          // Actualizar la foto de perfil del usuario
          usuario.value.fotoPerfil = fotoPerfil;
  
          // Guardar la foto de perfil en el servidor
          await editar(id, { fotoPerfil });
  
          // Notificar al usuario
          $q.notify({
              color: 'positive',
              message: 'Foto de perfil actualizada correctamente',
              position: 'top'
          });
  
          return fotoPerfil;
      } catch (error) {
          console.error('Error al subir la foto de perfil:', error);
          $q.notify({
              color: 'negative',
              message: 'Error al subir la foto de perfil',
              position: 'top'
          });
          return null;
      }
  };
    return {
      getAll,
      codigoRecuperar,
      confirmarCodigo,
      login,
      token,
      id,
      email,
      usuario,
      cambiarPassword,
      nuevaPassword,
      agregar,
      editar,
      activar,
      inactivar,
      subirFotoPerfil,
    };
  },
  {
    persist: true,
  }
);
