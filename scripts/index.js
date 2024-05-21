import { leer_async, escribir_async, borrar_async, objectToJson } from "./local-storage-async.js";
import { Crypto } from "../model/crypto.js";
import { StringHelper } from "../helpers/StringHelper.js";
import {mostrarSpinner, esconderSpinner } from "./spinner.js"

document.addEventListener("DOMContentLoaded", onInit);

const STORAGE_KEY = "cryptos";
const items = []

async function onInit() {
    eventListeners();
    await cargarItems();
    actualizarTabla();
}


function eventListeners() {
    document.getElementById("botonBorrarTodo").addEventListener("click", borrarTodo);
    document.addEventListener("click", (e) => (manejarClick(e)));
    const formulario = document.getElementById("formCryptos");
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault(); 
        if (formEsValido(formulario)) {
            let cryptoId = formulario.querySelector("#id").value;
            const fecha = formulario.querySelector("#fechaCreacion").value;
    
    
            const selectConsenso = document.getElementById("tipoConsenso");
            const selectAlgoritmo = document.getElementById("algoritmo");
    
            const operacion = obtenerOperacion(e.submitter, cryptoId);
    
            const model = new Crypto(
                StringHelper.stringHasValue(cryptoId) ? cryptoId : await obtenerId(),
                formulario.querySelector("#nombre").value,
                formulario.querySelector("#simbolo").value,
                StringHelper.stringHasValue(cryptoId) ? fecha : obtenerFecha(),
                formulario.querySelector("#precioActual").value,
                selectConsenso.options[selectConsenso.selectedIndex].text,
                formulario.querySelector("#cantidadCirculacion").value,
                selectAlgoritmo.options[selectAlgoritmo.selectedIndex].text,
                formulario.querySelector("#sitio").value
            );
    
            switch(operacion) {
                case "editar": 
                    const indice = obtenerIndicePorId(items, cryptoId);
                    items[indice] = model;
                    break;
                case "eliminar":
                    if (confirm("Seguro que quiere eliminar?"))
                        quitarElementoPorId(items, cryptoId);
                    break;
                case "crear":
                default:
                    items.push(model);
                    break;
            }
            limpiarFormulario();
            actualizarTabla();
            guardarCryptos();
        }
    })
}

function obtenerFecha() {
    const options = { timeZone: 'America/Argentina/Buenos_Aires', timeZoneName: 'short' };
    return new Date(options);
}

async function cargarItems() {
    const json = await leer(STORAGE_KEY);
    const objetos = JSON.parse(json) || [];

    objetos.forEach(obj => {
        const model = new Crypto(
            obj.id, 
            obj.nombre, 
            obj.simbolo, 
            obj.fechaCreacion, 
            obj.precioActual, 
            obj.consenso, 
            obj.cantidadCirculacion, 
            obj.algoritmo, 
            obj.sitio
        )
        items.push(model);
    });
}


function manejarClick(evento) {
    if (evento.target.matches("td")) { 
        let id = evento.target.parentNode.dataset.id; 
        let crypto = obtenerElementoPorId(items, id);
        cargarFormulario(
            crypto.id,
            crypto.fechaCreacion,
            crypto.nombre,
            crypto.simbolo,
            crypto.precioActual,
            crypto.consenso,
            crypto.cantidadCirculacion,
            crypto.algoritmo,
            crypto.sitio
        )
    }
}

function cargarFormulario(...datos) {
    const selectConsenso = document.getElementById("tipoConsenso");
    const selectAlgoritmo = document.getElementById("algoritmo");
    const formulario = document.getElementById("formCryptos");
    formulario.querySelector("#id").value = datos[0];
    formulario.querySelector("#nombre").value = datos[2];
    formulario.querySelector("#simbolo").value = datos[3];
    formulario.querySelector("#fechaCreacion").value = datos[1];
    formulario.querySelector("#precioActual").value = datos[4];
    selectConsenso.selectedIndex = indiceOpcionPorTexto(selectConsenso, datos[5]) >= 0  ? indiceOpcionPorTexto(selectConsenso, datos[5]) : 0;
    selectAlgoritmo.selectedIndex = indiceOpcionPorTexto(selectAlgoritmo, datos[7]) >= 0 ? indiceOpcionPorTexto(selectAlgoritmo, datos[7]) : 0;
    formulario.querySelector("#cantidadCirculacion").value = datos[6];
    formulario.querySelector("#sitio").value = datos[8];
}

function indiceOpcionPorTexto(select, texto) {
    const options = select.options;
    for (let i = 0; i < options.length; i++) {
        if (options[i].text === texto) {
            return i 
        }
    }
    return -1; 
}

function formEsValido(formulario) {
    let precioActual = formulario.querySelector("#precioActual").value;
    let cantidadCirculacion = formulario.querySelector("#cantidadCirculacion").value;
    let valido = StringHelper.stringHasValue(formulario.querySelector("#nombre").value) &&
    StringHelper.stringHasValue(formulario.querySelector("#simbolo").value) &&
    precioActual != "" && parseInt(precioActual) > 0 &&
    cantidadCirculacion > 0 &&
    StringHelper.stringHasValue(formulario.querySelector("#sitio").value);
    if (!valido) {
        alert("Los valores ingresados no son validos. Los números deben ser positivos y los textos no vacíos")
    }
    return valido;
}
async function guardarCryptos() {
    await escribir(STORAGE_KEY, objectToJson(items));
}

function limpiarFormulario() {
    const selectConsenso = document.getElementById("tipoConsenso");
    const selectAlgoritmo = document.getElementById("algoritmo");

    const formulario = document.getElementById("formCryptos");
    formulario.querySelector("#id").value = "";
    formulario.querySelector("#nombre").value = "";
    formulario.querySelector("#simbolo").value = "";
    formulario.querySelector("#fechaCreacion").value = null;
    formulario.querySelector("#precioActual").value = "";
    selectConsenso.selectedIndex = 0;
    selectAlgoritmo.selectedIndex = 0;
    formulario.querySelector("#cantidadCirculacion").value = "";
    formulario.querySelector("#sitio").value = "";
}

function obtenerOperacion(submitter, id) {
    if (submitter.className.includes("eliminar")) {
        return "eliminar"
    }
    else if (StringHelper.stringHasValue(id)) {
        return "editar"
    }
    else {
        return "crear";
    }
}



function quitarElementoPorId(lista, id) {
    const index = obtenerIndicePorId(lista, id)
    lista.splice(index, 1);
}

function obtenerIndicePorId(lista, id) {
    return lista.findIndex(obj => obj.id.toString() === id);
}

function obtenerElementoPorId(lista, id) {
    let indice = obtenerIndicePorId(lista, id);
    return lista[indice];
}

async function obtenerId() {
    const lectura = await leer("id");
    let ultimoId = lectura != null ? lectura : 0;
    ultimoId++;
    await escribir("id", ultimoId);
    return ultimoId;
}

async function borrarTodo() {
    if (confirm("Seguro que quiere eliminar todos los registros de la tabla?")) {
        await borrar(STORAGE_KEY);
        items.length = 0;
        actualizarTabla();
    }
}

function actualizarTabla() {
    const tabla = document.getElementById("table-items");
    let tbody = tabla.getElementsByTagName('tbody')[0];
  
    tbody.innerHTML = '';    
    const celdas = ["id","nombre","simbolo","fechaCreacion","precioActual","consenso","cantidadCirculacion","algoritmo", "sitio"];

    items.forEach((item) => {
        let nuevaFila = document.createElement("tr");

        celdas.forEach((celda) => {
            if (celda == "id") {
                nuevaFila.setAttribute("data-id", item[celda])
            }
            else {
                let nuevaCelda = document.createElement("td");
                nuevaCelda.textContent = item[celda];
                nuevaFila.appendChild(nuevaCelda);
            }
        });
        tbody.appendChild(nuevaFila);
    });
  }

async function leer(clave) {
    mostrarSpinner();
    const value = await leer_async(clave);
    esconderSpinner();
    return value;
}

async function escribir(clave, valor) {
    mostrarSpinner();
    await escribir_async(clave, valor);
    esconderSpinner();
}

async function borrar(clave) {
    mostrarSpinner();
    await borrar_async(clave);
    esconderSpinner();
}