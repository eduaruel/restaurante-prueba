const btnGuardarCliente = document.querySelector('#guardar-cliente')

// Guardamos la información 
let cliente = {
    mesa: '',
    hora: '',   
    pedido: []
}

const categorias = {
    1: 'Pizzas',
    2: 'Postres',
    3: 'Jugos',
    4: 'Comida',
    5: 'Cafe'
}

btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    const camposVacios = [mesa, hora].some(campo => campo == '');

    if (camposVacios) {
        //Si los campos estan vacios

        /*------REVISAR-------*/

        //Mostrar mensaje de error en la ventana modal
        const existeAlerta = document.querySelector('.invalid-feedback');
        if (!existeAlerta) {
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Los campos son obligatorios'
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove()
            }, 3000);
        }
    } else {
        //En caso de que todos los campos esten llenos
        cliente = { ...cliente, mesa, hora }

        //Ocultar ventana modal despus de realizar el registro
        var modalFormulario = document.querySelector('#formulario')
        var modal = bootstrap.Modal.getInstance(modalFormulario);
        modal.hide();

        mostrarSeccion();
        obtenerMenu();
    }
}

function mostrarSeccion() {
    const secciones = document.querySelectorAll('.d-none');
    secciones.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerMenu() {
    const url = 'http://localhost:3000/menu';

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => mostrarMenu(resultado))
        .catch(error => console.log(error))
}

function mostrarMenu(menu) {

    console.log('ingrese a mostrar');
    console.log(menu);
    const contenido = document.querySelector('#menu .contenido');

    menu.forEach(menu => {
        const fila = document.createElement('div')
        fila.classList.add('row', 'border-top');

        const nombre = document.createElement('div')
        nombre.classList.add('col-md-4', 'py-3')
        nombre.textContent = menu.nombre;

        const precio = document.createElement('div')
        precio.classList.add('col-md-3', 'py-3')
        precio.textContent = `$${menu.precio}`;

        const categoria = document.createElement('div')
        categoria.classList.add('col-md-3', 'py-3')
        categoria.textContent = categorias[menu.categoria];

        const inputCantidad = document.createElement('input')
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto - ${menu.id}`;
        inputCantidad.classList.add('form-control');
        inputCantidad.onchange = function () {
            const cantidad = parseInt(inputCantidad.value);
            agregarOrden({ ...menu, cantidad });
        }

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2', 'py-3');
        agregar.appendChild(inputCantidad);

        fila.appendChild(nombre);
        fila.appendChild(precio);
        fila.appendChild(categoria);
        fila.appendChild(agregar);

        contenido.appendChild(fila);


    });
}

function agregarOrden(producto) {
    let { pedido } = cliente;

    if (producto.cantidad > 0) {
        //Estoy validando que el producto exista
        if (pedido.some(item => item.id === producto.id)) {
            const pedidoActualizado = pedido.map(item => {
                if (item.id === producto.id) {
                    item.cantidad = producto.cantidad;
                }
                return item;
            });
            cliente.pedido = [...pedidoActualizado];
        } else {
            //Caso de que no exista el item
            //Lo agregamos como nuevo
            cliente.pedido = [...pedido, producto];
        }
    } else {
        //cantidad sea igual a 0
        const resultado = pedido.filter(item => item.id !== producto.id);
        cliente.pedido = resultado;
    }

    limpiarHTML();

    if (cliente.pedido.length) {
        actualizarResumen();
    } else {
        // Pedido vacio
        mensajePedidoVacio();
    }
}

function limpiarHTML() {
    const contenido = document.querySelector('#resumen .contenido');
    while (contenido.firstChild) {
        contenido.removeChild(contenido.firstChild);
    }
}

function actualizarResumen() {
    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'shadow');

    //Mostrar la mesa

    const mesa = document.createElement('p');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaCliente = document.createElement('span');
    mesaCliente.textContent = cliente.mesa;
    mesaCliente.classList.add('fw-normal');
    mesa.appendChild(mesaCliente);

    //Mostrar la hora

    const hora = document.createElement('p');
    hora.textContent = 'Hora: ';
    hora.classList.add('fw-bold');

    const horaCliente = document.createElement('span');
    horaCliente.textContent = cliente.hora;
    horaCliente.classList.add('fw-normal');
    hora.appendChild(horaCliente);

    //Mostrar los items del menu consumidos
    const heading = document.createElement('h3');
    heading.textContent = 'Pedidos';
    heading.classList.add('my-4');

    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    //producto pedido
    const { pedido } = cliente;
    pedido.forEach(item => {
        const { nombre, cantidad, precio, id } = item;
        const lista = document.createElement('li');
        lista.classList.add('list-group-item');

        const nombreP = document.createElement('li');
        nombreP.classList.add('text-center', 'my-4');
        nombreP.textContent = nombre;

        const cantidadP = document.createElement('p');
        cantidadP.classList.add('fw-bold');
        cantidadP.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('span');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

        const precioP = document.createElement('p');
        precioP.classList.add('fw-bold');
        precioP.textContent = 'Precio: ';

        const precioValor = document.createElement('span');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `$${precio}`;

        const subtotalP = document.createElement('p');
        subtotalP.classList.add('fw-bold');
        subtotalP.textContent = 'Subtotal: ';

        const subtotalValor = document.createElement('span');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal(item);

        //boton de eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eliminar pedido';

        btnEliminar.onclick = function () {
            eliminarProducto(id);
        }

        //Agregar label a sus contenedores
        cantidadP.appendChild(cantidadValor);
        precioP.appendChild(precioValor);
        subtotalP.appendChild(subtotalValor);

        lista.appendChild(nombreP);
        lista.appendChild(cantidadP);
        lista.appendChild(precioP);
        lista.appendChild(subtotalP);
        lista.appendChild(btnEliminar);

        grupo.appendChild(lista);
    })

    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(heading);
    resumen.appendChild(grupo);

    //Agregamos el contenido 
    contenido.appendChild(resumen);

    //mostrar la calculadora de propinas 
    formularioPropinas();

}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');

    const heading = document.createElement('h3');
    heading.classList.add('my-4');
    heading.textContent = 'Propina';

    //propina 10%
    const checkBox10 = document.createElement('input');
    checkBox10.type = 'radio';
    checkBox10.name = 'Propina';
    checkBox10.value = '10';
    checkBox10.classList.add('form-check-input');
    checkBox10.onclick = calcularPropina;

    const checkLabel10 = document.createElement('label');
    checkLabel10.textContent = '10%';
    checkLabel10.classList.add('form-check-label');

    const checkDiv10 = document.createElement('div');
    checkDiv10.classList.add('form-check');

    checkDiv10.appendChild(checkBox10);
    checkDiv10.appendChild(checkLabel10);

    //propina 25%
    const checkBox25 = document.createElement('input');
    checkBox25.type = 'radio';
    checkBox25.name = 'Propina';
    checkBox25.value = '25';
    checkBox25.classList.add('form-check-input');
    checkBox25.onclick = calcularPropina;

    const checkLabel25 = document.createElement('label');
    checkLabel25.textContent = '25%';
    checkLabel25.classList.add('form-check-label');

    const checkDiv25 = document.createElement('div');
    checkDiv25.classList.add('form-check');

    checkDiv25.appendChild(checkBox25);
    checkDiv25.appendChild(checkLabel25);

    formulario.appendChild(checkDiv10);
    formulario.appendChild(checkDiv25);
    contenido.appendChild(formulario);

}

function calcularSubtotal(item) {
    const { cantidad, precio } = item;
    return `$ ${cantidad * precio}`;

}

function calcularPropina() {
    const radioSeleccionado = document.querySelector('[name = "Propina"]:checked').value;
    console.log(radioSeleccionado);
    //('[name = "Propina"]:checked')

    const { pedido } = cliente;
    //console.log(pedido);

    let subtotal = 0;
    pedido.forEach(item => {
        subtotal += item.cantidad * item.precio;
    });

    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar');

    //propina
    const propina = ((subtotal * parseInt(radioSeleccionado)) / 100);
    const total = propina + subtotal;

    //subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-3', 'fw-bold', 'mt-5');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalP = document.createElement('span');
    subtotalP.classList.add('fs-normal');
    subtotalP.textContent = `${subtotal}`;
    subtotalParrafo.appendChild(subtotalP);

    //AQUI QUEDAMOS//

    const propinaParrafo = document.createElement('span');
    propinaParrafo.classList.add('fw-normal');
    propinaParrafo.textContent = 'Propina: ';


    const propinaP = document.createElement('span');
    propinaP.classList.add('fw-normal');
    propinaP.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaP);

    //total
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-3', 'fw-bold');
    totalParrafo.textContent = 'Total a Pagar: ';

    const totalp = document.createElement('p');
    totalp.classList.add('fs-normal');
    totalp.textContent = `$${total}`;

    totalParrafo.appendChild(totalp);

    const totalPagarDiv = document.querySelector('.total-pagar');
    if (totalPagarDiv) {
        totalPagarDiv.remove();
    }
    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(divTotales);

}

function eliminarProducto(id) {
    const { pedido } = cliente;
    cliente.pedido = pedido.filter(item => item.id !== id);

    limpiarHTML();

    if (cliente.pedido.length) {
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    //Ahora como eliminamos el producto debemos actualizar la cantidad a cero

    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
}

function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido');
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Agregar productos al pedido';

    contenido.appendChild(texto);
}
