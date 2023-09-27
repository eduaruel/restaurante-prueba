import { nuevoProducto } from "./api.js";

//Selectores 
const formulario = document.querySelector('#formulario');
formulario.addEventListener('submit', validarProducto);

async function validarProducto() {
    e.preventDefault();

    const nombre = document.querySelector('#nombre').value;
    const precio = document.querySelector('#precio').value;
    const categoria = document.querySelector('#categoria').value;

    const producto = {
        nombre,
        precio,
        categoria
    }
    if (validar(producto)) {
        //Todos los campos son obligatorios
        mostrarAlerta('Todos los campos son obligarotios');
        return;
    }

    await nuevoProducto(producto);
    window.location.href = 'index.html';
}

function validar(producto) {
    return !Object.values(producto).every(index => index !== '')
}

function mostrarAlerta() {
    const alerta = document.querySelector('bg-red-100');
    if (alerta) {
        const alerta = document.createElement('p');
        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center');
        alerta.innerHTML = `
        <strong class = "font-bold">Error</strong>
        <span class="block sm:inline">${mensaje}</span>
        `;
        formulario.appendChild(alerta);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}
