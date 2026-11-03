document.addEventListener("DOMContentLoaded", () => {
    const menuContainer = document.getElementById("menu-container");
    const menuForm = document.getElementById("menu-form");
    const inputNombre = document.getElementById("nombre-opcion");
    const inputEnlace = document.getElementById("enlace-opcion");

    // Estructura de datos en memoria (simulando la carga inicial del JSON)
    let menuData = [];

    // Función para renderizar el menú dinámicamente en el DOM
    function renderMenu(items) {
        menuContainer.innerHTML = ""; // Limpiar menú actual
        const ul = document.createElement("ul");

        items.forEach(item => {
            const li = document.createElement("li");

            // Validar si tiene submenús
            if (item.submenus && item.submenus.length > 0) {
                li.classList.add("has-submenu");
                li.innerHTML = `<a href="${item.enlace}"><i class="fa-solid ${item.icono || 'fa-circle'}"></i> ${item.nombre} <i class="fa-solid fa-angle-down"></i></a>`;
                
                const subUl = document.createElement("ul");
                subUl.classList.add("submenu");

                item.submenus.forEach(sub => {
                    const subLi = document.createElement("li");
                    subLi.innerHTML = `<a href="${sub.enlace}">${sub.nombre}</a>`;
                    subUl.appendChild(subLi);
                });

                li.appendChild(subUl);
            } else {
                li.innerHTML = `<a href="${item.enlace}"><i class="fa-solid ${item.icono || 'fa-circle'}"></i> ${item.nombre}</a>`;
            }

            ul.appendChild(li);
        });

        menuContainer.appendChild(ul);
    }

    // Cargar datos desde el archivo menu.json usando Fetch API
    function cargarMenu() {
        fetch("menu.json")
            .then(response => {
                if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
                return response.json();
            })
            .then(data => {
                menuData = data.menu;
                renderMenu(menuData);
            })
            .catch(error => {
                console.warn("Carga por fetch falló (común al abrir local sin servidor), usando datos por defecto:", error);
                // Datos de respaldo por si se abre localmente sin servidor web
                menuData = [
                    { id: "1", nombre: "Inicio", enlace: "#inicio", icono: "fa-house" },
                    { id: "2", nombre: "Productos", enlace: "#", icono: "fa-wallet", submenus: [{nombre: "Cuentas", enlace: "#cuentas"}] },
                    { id: "3", nombre: "Contacto", enlace: "#contacto", icono: "fa-headset" }
                ];
                renderMenu(menuData);
            });
    }

    // Evento para agregar opciones dinámicamente sin recargar la página (Requerimiento Funcional)
    menuForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nuevoNombre = inputNombre.value.trim();
        const nuevoEnlace = inputEnlace.value.trim();

        if (nuevoNombre === "" || nuevoEnlace === "") return;

        // Crear nueva opción con ID único basado en timestamp
        const nuevaOpcion = {
            id: Date.now().toString(),
            nombre: nuevoNombre,
            enlace: nuevoEnlace,
            icono: "fa-star"
        };

        // Agregar al arreglo de datos
        menuData.push(nuevaOpcion);

        // Volver a renderizar el menú dinámicamente en tiempo real
        renderMenu(menuData);

        // Limpiar formulario
        inputNombre.value = "";
        inputEnlace.value = "";
    });

    // Inicializar carga del menú
    cargarMenu();
});