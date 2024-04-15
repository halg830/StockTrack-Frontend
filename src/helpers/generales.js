import { useQuasar } from "quasar";

const helpersGenerales = {
  primeraMayus: (cadena) => cadena.charAt(0).toUpperCase() + cadena.slice(1),
  // formatearMoneda: (numero) => {
  //   const numeroRedondeado = Math.round(numero);
  //   const partes = new Intl.NumberFormat("es-CO", {
  //     minimumFractionDigits: 0,
  //     maximumFractionDigits: 0,
  //   }).formatToParts(numeroRedondeado);

  //   return partes
  //     .map((part) => {
  //       if (part.type === "fraction") {
  //         return "";
  //       } else {
  //         return part.value;
  //       }
  //     })
  //     .join("");
  // },
  formatearMoneda: (val) => {
    const precioNumber = parseFloat(val);

    if (!isNaN(precioNumber)) {
      return precioNumber.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
      });
    } else {
      return val;
    }
  },
  
};

export default helpersGenerales;
