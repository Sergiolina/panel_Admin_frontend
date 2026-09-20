// =========================
// CONFIGURACIÓN
// =========================

const API_URL = "https://panel-admin-production-a0ea.up.railway.app";


// =========================
// CATEGORÍAS
// =========================

let categorias = [];


// =========================
// TOKEN
// =========================

function obtenerToken() {
    return sessionStorage.getItem("token");
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

        mostrarCategorias();

    } catch (error) {

        console.error(error);

        alert("No se pudieron cargar las categorías.");
    }
}


// =========================
// MOSTRAR CATEGORÍAS
// =========================

function mostrarCategorias() {

    const lista = document.getElementById(
        "lista-categorias"
    );

    lista.innerHTML = "";

    categorias.forEach(categoria => {

        const tarjeta = document.createElement("div");

        tarjeta.classList.add("categoria");

        tarjeta.innerHTML = `

            <div class="categoria-info">

                <h3>${categoria.nombre}</h3>

                <p>${categoria.descripcion}</p>

                <small>
                    Orden: ${categoria.orden}
                </small>

            </div>

            <div class="categoria-acciones">

                <button
                    class="btn-editar"
                    onclick="editarCategoria(${categoria.id})">
                    ✏️ Editar
                </button>

                <button
                    class="btn-eliminar"
                    onclick="eliminarCategoria(${categoria.id})">
                    🗑️ Eliminar
                </button>

            </div>

        `;

        lista.appendChild(tarjeta);

    });
}


// =========================
// NUEVA CATEGORÍA
// =========================

const btnNuevaCategoria =
    document.getElementById("btnNuevaCategoria");

btnNuevaCategoria.addEventListener(
    "click",
    crearCategoria
);


async function crearCategoria() {

    const nombre = prompt(
        "Nombre de la categoría:"
    );

    if (!nombre) {
        return;
    }

    const descripcion =
        prompt(
            "Descripción de la categoría:"
        ) || "";

    const ordenTexto =
        prompt(
            "Orden de la categoría:",
            "1"
        );

    const orden = Number(ordenTexto);

    if (Number.isNaN(orden)) {

        alert(
            "El orden debe ser un número."
        );

        return;
    }

    const token = obtenerToken();

    if (!token) {

        alert(
            "No estás autenticado."
        );

        return;
    }

    try {

        const respuesta = await fetch(
            `${API_URL}/api/Categorias`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    nombre: nombre,
                    descripcion: descripcion,
                    orden: orden
                })
            }
        );

        if (!respuesta.ok) {

            if (respuesta.status === 401 ||
                respuesta.status === 403) {

                alert(
                    "No tienes autorización para crear categorías."
                );

                return;
            }

            throw new Error(
                "No se pudo crear la categoría."
            );
        }

        await cargarCategorias();

        alert(
            "Categoría creada correctamente."
        );

    } catch (error) {

        console.error(error);

        alert(
            "Ocurrió un error al crear la categoría."
        );
    }
}


// =========================
// EDITAR CATEGORÍA
// =========================

async function editarCategoria(id) {

    const categoria = categorias.find(
        categoria => categoria.id === id
    );

    if (!categoria) {
        return;
    }

    const nombre = prompt(
        "Nombre de la categoría:",
        categoria.nombre
    );

    if (!nombre) {
        return;
    }

    const descripcion = prompt(
        "Descripción de la categoría:",
        categoria.descripcion
    );

    if (descripcion === null) {
        return;
    }

    const ordenTexto = prompt(
        "Orden de la categoría:",
        categoria.orden
    );

    if (ordenTexto === null) {
        return;
    }

    const orden = Number(ordenTexto);

    if (Number.isNaN(orden)) {

        alert(
            "El orden debe ser un número."
        );

        return;
    }

    const token = obtenerToken();

    if (!token) {

        alert(
            "No estás autenticado."
        );

        return;
    }

    try {

        const respuesta = await fetch(
            `${API_URL}/api/Categorias/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    nombre: nombre,
                    descripcion: descripcion,
                    orden: orden
                })
            }
        );

        if (!respuesta.ok) {

            if (respuesta.status === 401 ||
                respuesta.status === 403) {

                alert(
                    "No tienes autorización para editar categorías."
                );

                return;
            }

            throw new Error(
                "No se pudo actualizar la categoría."
            );
        }

        await cargarCategorias();

        alert(
            "Categoría actualizada correctamente."
        );

    } catch (error) {

        console.error(error);

        alert(
            "Ocurrió un error al actualizar la categoría."
        );
    }
}


// =========================
// ELIMINAR CATEGORÍA
// =========================

async function eliminarCategoria(id) {

    const categoria = categorias.find(
        categoria => categoria.id === id
    );

    if (!categoria) {
        return;
    }

    const confirmar = confirm(
        `¿Seguro que quieres eliminar la categoría "${categoria.nombre}"?`
    );

    if (!confirmar) {
        return;
    }

    const token = obtenerToken();

    if (!token) {

        alert(
            "No estás autenticado."
        );

        return;
    }

    try {

        const respuesta = await fetch(
            `${API_URL}/api/Categorias/${id}`,
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

                alert(
                    "No tienes autorización para eliminar categorías."
                );

                return;
            }

            throw new Error(
                "No se pudo eliminar la categoría."
            );
        }

        await cargarCategorias();

        alert(
            "Categoría eliminada correctamente."
        );

    } catch (error) {

        console.error(error);

        alert(
            "Ocurrió un error al eliminar la categoría."
        );
    }
}


// =========================
// INICIALIZACIÓN
// =========================

cargarCategorias();