// =========================
// CONFIGURACIÓN
// =========================

const API_URL = "https://panel-admin-production-a0ea.up.railway.app";


// =========================
// ESTADO
// =========================

let productos = [];

let categorias = [];

let productoEditandoId = null;


// =========================
// ELEMENTOS
// =========================

const btnNuevoProducto =
    document.getElementById("btnNuevoProducto");

const btnCancelarProducto =
    document.getElementById("btnCancelarProducto");

const formularioProducto =
    document.getElementById("formularioProducto");

const productoForm =
    document.getElementById("productoForm");

const selectCategoria =
    document.getElementById("categoria");

const inputImagenUrl =
    document.getElementById("imagenUrl");

const vistaPreviaImagen =
    document.getElementById("vistaPreviaImagen");

const listaProductos =
    document.getElementById("lista-productos");

const mensaje =
    document.getElementById("mensaje");


// =========================
// TOKEN
// =========================

function obtenerToken() {
    return sessionStorage.getItem("token");
}


// =========================
// UTILIDADES
// =========================

// Evita que texto escrito por el usuario se interprete como HTML
function escaparHTML(texto) {

    const div = document.createElement("div");

    div.textContent = texto ?? "";

    return div.innerHTML;
}

function urlImagenValida(url) {
    return /^https?:\/\//i.test(url);
}

// El producto solo guarda el id, así que el nombre se busca en la lista
function obtenerNombreCategoria(id) {

    const categoria = categorias.find(
        categoria => categoria.id === id
    );

    return categoria ? categoria.nombre : "Sin categoría";
}


// =========================
// CARGAR CATEGORÍAS
// =========================

async function cargarCategorias() {

    try {

        const respuesta = await fetch(
            `${API_URL}/api/Categorias`
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron cargar las categorías."
            );
        }

        categorias = await respuesta.json();

        llenarSelectCategorias();

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "No se pudieron cargar las categorías.";
    }
}


function llenarSelectCategorias() {

    selectCategoria.innerHTML = "";

    const opcionInicial = document.createElement("option");

    opcionInicial.value = "";
    opcionInicial.textContent = "Selecciona una categoría";

    selectCategoria.appendChild(opcionInicial);

    const ordenadas = [...categorias].sort(
        (a, b) => a.orden - b.orden
    );

    ordenadas.forEach(categoria => {

        const opcion = document.createElement("option");

        opcion.value = categoria.id;
        opcion.textContent = categoria.nombre;

        selectCategoria.appendChild(opcion);
    });
}


// =========================
// CARGAR PRODUCTOS
// =========================

async function cargarProductos() {

    mensaje.textContent = "Cargando productos...";

    try {

        const respuesta = await fetch(
            `${API_URL}/api/Productos`
        );

        if (!respuesta.ok) {
            throw new Error(
                "No se pudieron obtener los productos."
            );
        }

        productos = await respuesta.json();

        mostrarProductos();

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "No se pudieron cargar los productos.";
    }
}


// =========================
// MOSTRAR PRODUCTOS
// =========================

function mostrarProductos() {

    listaProductos.innerHTML = "";

    if (productos.length === 0) {

        mensaje.textContent =
            "No hay productos registrados.";

        return;
    }

    mensaje.textContent = "";

    productos.forEach(producto => {

        const tarjeta = document.createElement("article");

        tarjeta.classList.add("producto-card");

        const imagen = producto.imagenUrl
            ? `
                <img
                    class="producto-imagen"
                    src="${escaparHTML(producto.imagenUrl)}"
                    alt="${escaparHTML(producto.nombre)}"
                    onerror="this.remove()">
            `
            : "";

        tarjeta.innerHTML = `

            ${imagen}

            <h3>${escaparHTML(producto.nombre)}</h3>

            <p class="producto-precio">
                $${producto.precio}
            </p>

            <p>${escaparHTML(producto.descripcion)}</p>

            <p>
                Categoría:
                ${escaparHTML(obtenerNombreCategoria(producto.categoriaId))}
            </p>

            <p>
                ${producto.disponible ? "Disponible" : "No disponible"}
            </p>

            <div class="producto-acciones">

                <button
                    class="btn-editar"
                    onclick="editarProducto(${producto.id})">
                    ✏️ Editar
                </button>

                <button
                    class="btn-eliminar"
                    onclick="eliminarProducto(${producto.id})">
                    🗑️ Eliminar
                </button>

            </div>

        `;

        listaProductos.appendChild(tarjeta);
    });
}


// =========================
// FORMULARIO
// =========================

function actualizarVistaPrevia() {

    const url = inputImagenUrl.value.trim();

    if (!urlImagenValida(url)) {
        vistaPreviaImagen.hidden = true;
        return;
    }

    vistaPreviaImagen.src = url;
}

inputImagenUrl.addEventListener(
    "input",
    actualizarVistaPrevia
);

vistaPreviaImagen.addEventListener("load", () => {
    vistaPreviaImagen.hidden = false;
});

vistaPreviaImagen.addEventListener("error", () => {
    vistaPreviaImagen.hidden = true;
});


function cerrarFormulario() {

    productoForm.reset();

    vistaPreviaImagen.hidden = true;

    formularioProducto.hidden = true;

    productoEditandoId = null;
}


// =========================
// NUEVO PRODUCTO
// =========================

btnNuevoProducto.addEventListener("click", () => {

    if (categorias.length === 0) {

        mensaje.textContent =
            "Primero crea al menos una categoría.";

        return;
    }

    productoEditandoId = null;

    productoForm.reset();

    vistaPreviaImagen.hidden = true;

    document.getElementById("tituloFormulario").textContent =
        "Nuevo producto";

    formularioProducto.hidden = false;

    mensaje.textContent = "";
});


btnCancelarProducto.addEventListener("click", () => {

    cerrarFormulario();

    mensaje.textContent = "";
});


// =========================
// EDITAR PRODUCTO
// =========================

function editarProducto(id) {

    const producto = productos.find(
        producto => producto.id === id
    );

    if (!producto) {

        mensaje.textContent =
            "No se encontró el producto.";

        return;
    }

    productoEditandoId = producto.id;

    document.getElementById("tituloFormulario").textContent =
        "Editar producto";

    document.getElementById("nombre").value =
        producto.nombre;

    document.getElementById("precio").value =
        producto.precio;

    document.getElementById("descripcion").value =
        producto.descripcion ?? "";

    // Si la categoría del producto ya no existe,
    // el select queda en la opción inicial
    selectCategoria.value =
        producto.categoriaId ?? "";

    inputImagenUrl.value =
        producto.imagenUrl ?? "";

    actualizarVistaPrevia();

    document.getElementById("disponible").checked =
        producto.disponible;

    formularioProducto.hidden = false;

    if (producto.categoriaId && selectCategoria.value === "") {

        mensaje.textContent =
            "La categoría de este producto ya no existe. " +
            "Elige una categoría válida.";

    } else {

        mensaje.textContent = "";
    }

    formularioProducto.scrollIntoView({ behavior: "smooth" });
}

// =========================
// GUARDAR PRODUCTO
// =========================

productoForm.addEventListener("submit", guardarProducto);


async function guardarProducto(evento) {

    evento.preventDefault();

    const categoriaId = Number(selectCategoria.value);

    const categoriaExiste = categorias.some(
        c => c.id === categoriaId
    );

    if (!categoriaExiste) {

        mensaje.textContent =
            "Selecciona una categoría de la lista.";

        return;
    }

    const imagenUrl = inputImagenUrl.value.trim();

    if (imagenUrl && !urlImagenValida(imagenUrl)) {

        mensaje.textContent =
            "La URL de la imagen debe empezar con http:// o https://";

        return;
    }

    const token = obtenerToken();

    if (!token) {

        mensaje.textContent =
            "No estás autenticado.";

        return;
    }

    const producto = {
        nombre: document.getElementById("nombre").value.trim(),
        precio: Number(document.getElementById("precio").value),
        descripcion: document.getElementById("descripcion").value.trim(),
        categoriaId: categoriaId,
        imagenUrl: imagenUrl,
        disponible: document.getElementById("disponible").checked
    };

    const editando = productoEditandoId !== null;

    const url = editando
        ? `${API_URL}/api/Productos/${productoEditandoId}`
        : `${API_URL}/api/Productos`;

    const metodo = editando ? "PUT" : "POST";

    mensaje.textContent = "Guardando producto...";
console.log("URL:", url);
console.log("MÉTODO:", metodo);
console.log("PRODUCTO:", producto);
    try {

        const respuesta = await fetch(url, {
            method: metodo,

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify(producto)
        });
console.log("STATUS:", respuesta.status);
console.log("RESPUESTA:", await respuesta.text());
        if (!respuesta.ok) {

            if (respuesta.status === 401 ||
                respuesta.status === 403) {

                mensaje.textContent =
                    "No tienes autorización para guardar productos.";

                return;
            }

            const texto = await respuesta.text();

            let datos;

            try {
                datos = JSON.parse(texto);
            } catch {
                datos = texto;
            }

            mensaje.textContent =
                datos.mensaje ||
                (typeof datos === "string" && datos) ||
                (editando
                    ? "No se pudo actualizar el producto."
                    : "No se pudo crear el producto.");

            return;
        }

        cerrarFormulario();

        await cargarProductos();

        mensaje.textContent =
            "Producto guardado correctamente.";

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "No se pudo conectar con el servidor.";
    }
}


// =========================
// ELIMINAR PRODUCTO
// =========================

async function eliminarProducto(id) {

    const producto = productos.find(
        producto => producto.id === id
    );

    if (!producto) {
        return;
    }

    const confirmar = confirm(
        `¿Seguro que quieres eliminar el producto "${producto.nombre}"?`
    );

    if (!confirmar) {
        return;
    }

    const token = obtenerToken();

    if (!token) {

        mensaje.textContent =
            "No estás autenticado.";

        return;
    }

    mensaje.textContent = "Eliminando producto...";

    try {

        const respuesta = await fetch(
            `${API_URL}/api/Productos/${id}`,
            {
                method: "DELETE",

                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!respuesta.ok) {

            if (respuesta.status === 401 ||
                respuesta.status === 403) {

                mensaje.textContent =
                    "No tienes autorización para eliminar productos.";

                return;
            }

            throw new Error(
                "No se pudo eliminar el producto."
            );
        }

        await cargarProductos();

        mensaje.textContent =
            "Producto eliminado correctamente.";

    } catch (error) {

        console.error(error);

        mensaje.textContent =
            "Ocurrió un error al eliminar el producto.";
    }
}


// =========================
// INICIALIZACIÓN
// =========================

async function iniciar() {

    // Primero las categorías, para que el select esté listo
    await cargarCategorias();

    await cargarProductos();
}

iniciar();
