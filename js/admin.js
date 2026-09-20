const cerrarSesion = document.getElementById("cerrarSesion");

cerrarSesion.addEventListener("click", () => {
    sessionStorage.removeItem("token");

    window.location.href = "/admin/login.html";
});
