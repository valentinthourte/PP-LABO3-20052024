import { CryptoBase } from "./cryptoBase.js";

export class Crypto extends CryptoBase {
    constructor(id, nombre, simbolo, fechaCreacion, precioActual, consenso, cantidadCirculacion, algoritmo, sitio) {
        super(id, nombre, simbolo, fechaCreacion, precioActual);
        this.consenso = consenso;
        this.cantidadCirculacion = cantidadCirculacion;
        this.algoritmo = algoritmo;
        this.sitio = sitio;
    }
}