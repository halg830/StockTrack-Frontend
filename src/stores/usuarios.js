import { defineStore } from "pinia";
import axios from "axios";
import helpersGenerales from '../helpers/generales.js'

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
        helpersGenerales.notificar("Sin conexión, por favor intente recargar");
        return null;
      }
      return error.response.data;
    }
  };

  return {login}
});
