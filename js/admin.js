const cerrarSesion = document.getElementById("cerrarSesion");

cerrarSesion.addEventListener("click", () => {
    sessionStorage.removeItem("token");

    window.location.href = "index.html";
});
