const delay = 2.5; // segundos
export function leer_async(clave) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                let data = JSON.parse(localStorage.getItem(clave));
                resolve(data);
            }
            catch {
                reject("No se pudo leer");
            }
        }, delay * 1000);
    })
}

export function escribir_async(clave, valor) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                localStorage.setItem(clave, JSON.stringify(valor));
                resolve();
            }
            catch {
                reject("No se pudo escribir");
            }
        }, delay * 1000);
    })
}

export function borrar_async(clave, valor) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                localStorage.removeItem(clave);
                resolve();
            }
            catch {
                reject("No se pudo borrar");
            }
        }, delay * 1000);
    })
}

export function objectToJson(obj) {
    return JSON.stringify(obj);
}


