import { useQuasar } from "quasar";

const $q = useQuasar();

const helpersGenerales = {
  primeraMayus: (cadena) => cadena.charAt(0).toUpperCase() + cadena.slice(1),
  notificar: (tipo, msg) => {
    $q.notify({
      type: tipo,
      message: msg,
      position: "top",
    });
  },
};

export default helpersGenerales;
