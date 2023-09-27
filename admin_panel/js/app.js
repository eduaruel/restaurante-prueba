import { obtenerProductos } from "./api";

const listado = document.querySelector('#listado-Productos');
listado.addEventListener('click', confirmarEliminar);

document.addEventListener('DOMContentLoaded', mostrarProductos);

async function mostrarProductos() {
    const productos = await obtenerProductos();

    productos.forEach(producto => {
        const { nombre, precio, categoria, id } = productos;
        const fila = document.createElement('tr');

        fila.innerHTML = `
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            <p class= "text-sm leading-5 font-medium text-gray-700 text-ig font-bold">${nombre}</p>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            <p class= "text-sm leading-5 font-medium text-gray-700">${precio}</p>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            <p class= "text-sm leading-5 font-medium text-gray-700">${categoria}</p>
        </td>

        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            <a href = "editar-producto.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
            <a href = "#" data-producto="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
        </td>
    `
    });

    listado.appendChild(fila); ``
}