        const API_URL = "https://panel-admin-production-a0ea.up.railway.app";
        const loginForm = document.getElementById("loginForm");
        const mensaje = document.getElementById("mensaje");

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const nombreUsuario =
                document.getElementById("nombreUsuario").value;

            const password =
                document.getElementById("password").value;

            mensaje.textContent = "Iniciando sesión...";

            try {
                const respuesta = await fetch(`${API_URL}/api/auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        nombreUsuario,
                        password
                    })
                });

let datos;

try {
    datos = await respuesta.json();
} catch {
    datos = await respuesta.text();
}

if (!respuesta.ok) {
    mensaje.textContent =
        datos.mensaje || datos || "Usuario o contraseña incorrectos.";

    return;
}

                sessionStorage.setItem("token", datos.token);

                mensaje.textContent = "Login correcto.";

                window.location.href = "/index.html";
            }
            catch (error) {
                console.error(error);
                mensaje.textContent =
                    "No se pudo conectar con el servidor.";
            }
        });
  
