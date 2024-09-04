import { format } from "date-fns";
import { es } from "date-fns/locale";
import Cookies from "js-cookie";

export default class Helper {
  private ckey: string =
    "ax7a1b3be1f64d5cf9e9d3b9177274f084e4c95a2a6e7a1b3be1f64d5c2c4d6f6cbde72061ce7a53";

  getToken(): string | null | undefined {
    const cTokenLS = localStorage.getItem("token");
    return cTokenLS;
  }
  formatDate(cFecha: string): string {
    const fecha: Date = new Date(cFecha);
    fecha.setHours(fecha.getHours() + 5);
    const formattedDateTime = format(
      fecha,
      "dd 'de' MMMM 'de' yyyy, HH:mm:ss",
      { locale: es }
    );

    return formattedDateTime;
  }

  obtenerFechaActual(): string {
    const fecha = new Date();
    const dia = fecha.getDate();
    const mes = fecha.getMonth();
    const año = fecha.getFullYear();
    const horas = fecha.getHours().toString().padStart(2, "0");
    const minutos = fecha.getMinutes().toString().padStart(2, "0");

    return `${año}-${mes}-${dia} ${horas}:${minutos}`;
  }
  validarTokenFecha(): boolean {
    let estado: boolean = false;
    let fechaActual: Date = new Date();
    fechaActual.setMinutes(fechaActual.getMinutes() + 1);

    if (localStorage.getItem("dateNow") !== null) {
      estado =
        new Date(localStorage.getItem("dateNow") ?? Date.now()) > fechaActual;
    }
    return estado;
  }
}
