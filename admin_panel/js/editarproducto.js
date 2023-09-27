import { mostrarAlerta } from './nuevoproducto.js';
import { obtenerProducto, editarProducto } from './api.js';

const nombreInput = document.querySelector('#nombre');
const precioInput = document.querySelector('#precio');
const categoriaInput = document.querySelector('#categoria');
const idInput = document.querySelector('#id');

document.addEventListener('DOMContentLoaded', async () => {
    //verificar si el cliente existe
    const parametrosURL = new URLSearchParams(window.location.search);
    const idProducto = parseInt(parametrosURL.get('id'));

    const producto = await obtenerProducto(idProducto)
    mostrarProducto(producto);

    //ahora vamos a registrar en el formulario

    const formulario = document.querySelector('#formulario');
    formulario.addEventListener('submit', validarProducto);
})

function mostrarProducto() {
    const { nombre, precio, categoria, id } = producto;

    nombreInput.value = nombre;
    precioInput.value = precio;
    categoriaInput.value = categoria;
    idInput.value = id;
}

async function validarProducto(e) {
    e.preventDefault();
    const producto = {
        nombre: nombreInput.value,
        precio: precioInput.value,
        categoria: categoriaInput.value,
        id: parseInt(idInput.value)
    }
    if (validar(producto)) {
        mostrarAlerta('Todos los campos son obligatorios');
        return;
    }

    await editarProducto(producto);
    window.location.href = 'index.html';

}

function validar(e) {
    return !Object.values(producto).every(i => i !== '');
}