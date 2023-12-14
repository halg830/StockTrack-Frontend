import { defineStore } from "pinia";
import axios from "axios";

const modelo = "persona";

export const useStoreUsuarios = defineStore(modelo, () => {
  const login = async (data) => {
    try {
      const response = await axios.post(`${modelo}/login`, data);
      console.log(response);

      return response;
    } catch (error) {
      console.log(error);
      if (error.message === "Network Error") {
        notificar('negative',"Sin conexión, por favor intente recargar");
        return null;
      }
      return error.response.data;
    }
  };

  return {login}
});
