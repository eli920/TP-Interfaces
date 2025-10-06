"use strict"
const form = document.querySelector("#form-registro");


// Funciones para manejar errores

function mostrarError(input, mensaje) {
  const formItem = input.closest(".form-item"); // busca el contenedor principal
  const errorSection = formItem.querySelector(".error"); // busca el error dentro de ese form-item
  if (errorSection) {
    errorSection.textContent = mensaje;
  }
}

function limpiarError(input) {
  const formItem = input.closest(".form-item");
  const errorSection = formItem.querySelector(".error");
  if (errorSection) {
    errorSection.textContent = "";
  }
}

// Validaciones individuales

// Nombre obligatorio
function validarNombre() {
  const nombre = document.querySelector("#nombre");
  if (nombre.value.trim() === "") {
    mostrarError(nombre, "*El nombre es obligatorio");
    return false;
  } else {
    limpiarError(nombre);
    return true;
  }
}

// Apellido obligatorio
function validarApellido() {
  const apellido = document.querySelector("#apellido");
  if (apellido.value.trim() === "") {
    mostrarError(apellido, "*El apellido es obligatorio");
    return false;
  } else {
    limpiarError(apellido);
    return true;
  }
}

// Edad debe ser número y mayor a 0
function validarEdad() {
  const edad = document.querySelector("#edad");
  if (edad.value.trim() === "" || Number(edad.value) <= 0) {
    mostrarError(edad, "*Ingresa una edad válida");
    return false;
  } else {
    limpiarError(edad);
    return true;
  }
}

// Email con formato correcto
function validarEmail() {
  const email = document.querySelector("#email");
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!patron.test(email.value.trim())) {
    mostrarError(email, "*Ingresa un correo electrónico válido");
    return false;
  } else {
    limpiarError(email);
    return true;
  }
}

// Contraseña: mínimo 8 caracteres, 1 mayúscula y 1 número
function validarContrasenia() {
  const contrasenia = document.querySelector("#contrasenia");
  const patron = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!patron.test(contrasenia.value)) {
    mostrarError(
      contrasenia,
      "*La contraseña debe tener mínimo 8 caracteres, 1 mayúscula y 1 número"
    );
    return false;
  } else {
    limpiarError(contrasenia);
    return true;
  }
}

// Repetición de contraseña debe coincidir
function validarContrasenia2() {
  const contrasenia = document.querySelector("#contrasenia");
  const contrasenia2 = document.querySelector("#contrasenia2");

  if (contrasenia2.value !== contrasenia.value || contrasenia2.value === "") {
    mostrarError(contrasenia2, "*Las contraseñas no coinciden");
    return false;
  } else {
    limpiarError(contrasenia2);
    return true;
  }
}

//Validar captcha
function validarCaptcha() {
  
  const captchaDiv = document.querySelector(".form-item.captcha");
  const errorSection = captchaDiv.querySelector(".error");

  //Si grecaptcha no existe (GH Pages), se usa el modo simulación
  if (typeof grecaptcha === "undefined" || !grecaptcha.getResponse) {
    console.warn("Modo simulación: captcha validado automáticamente en GH Pages.");
    errorSection.textContent = ""; 
    return true; 
  }

  //Si grecaptcha existe, se usa el token normal
  const captchaResponse = grecaptcha.getResponse();
  if (captchaResponse.length === 0) {
    errorSection.textContent = "*Por favor, verifica que no eres un robot.";
    return false;
  } else {
    errorSection.textContent = "";
    return true;
  }
}


// Validaciones para validar en tiempo real

// Campos básicos
document.querySelector("#nombre").addEventListener("input", validarNombre);
document.querySelector("#nombre").addEventListener("blur", validarNombre);

document.querySelector("#apellido").addEventListener("input", validarApellido);
document.querySelector("#apellido").addEventListener("blur", validarApellido);

document.querySelector("#edad").addEventListener("input", validarEdad);
document.querySelector("#edad").addEventListener("blur", validarEdad);

document.querySelector("#email").addEventListener("input", validarEmail);
document.querySelector("#email").addEventListener("blur", validarEmail);

// Contraseña y repetición
document.querySelector("#contrasenia").addEventListener("input", validarContrasenia);
document.querySelector("#contrasenia").addEventListener("blur", validarContrasenia);

document.querySelector("#contrasenia2").addEventListener("input", validarContrasenia2);
document.querySelector("#contrasenia2").addEventListener("blur", validarContrasenia2);



//Popover
const popoverContainer = document.querySelector(".popover");
const popoverContent = document.querySelector("#popover");
const popoverCloseBtn = popoverContent.querySelector("button");

// Funciones para mostrar y ocultar
function showPopover() {
  popoverContainer.style.display = "flex";
}

function hidePopover() {
  popoverContainer.style.display = "none";
  // Redirige a la página de iniciar sesión
  window.location.href = "inicio-sesion.html";
}


// Envío final del formulario

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Evita envío automático

  const validoNombre = validarNombre();
  const validoApellido = validarApellido();
  const validoEdad = validarEdad();
  const validoEmail = validarEmail();
  const validoPass = validarContrasenia();
  const validoPass2 = validarContrasenia2();
  const captchaValido = validarCaptcha();

  if (
    validoNombre &&
    validoApellido &&
    validoEdad &&
    validoEmail &&
    validoPass &&
    validoPass2 &&
    captchaValido
  ) {
      // Guardamos los datos en localStorage para luego validar los de inicio de sesión
    localStorage.setItem("email", document.querySelector("#email").value.trim());
    localStorage.setItem("password", document.querySelector("#contrasenia").value);

     // Retrasamos la aparición del popover para que se vea el efecto de la animación del botón
    setTimeout(() => {
      showPopover();
    }, 1550); //1550 ms

    form.reset(); //Limpia el formulario despues de enviar
    grecaptcha.reset(); // Limpia el captcha después de enviar
  } else {
    console.log("Errores en el formulario");
  }
});

// Cerrar popover
popoverCloseBtn.addEventListener("click", hidePopover);



// Contraseña

// Mostrar/Ocultar contraseña
const toggleIcono = document.querySelectorAll(".toggle-password");

toggleIcono.forEach(icono => {
  icono.addEventListener("click", () => {
    const inputId = icono.getAttribute("data-target");
    const input = document.getElementById(inputId);

    if (input.type === "password") {
      // Mostrar contraseña
      input.type = "text";
      icono.src = "imagenes/registro/ojo_abierto.png"; // imagen de ojo abierto
      icono.alt = "Ocultar contraseña";
    } else {
      // Ocultar contraseña
      input.type = "password";
      icono.src = "imagenes/registro/ojo_cerrado.png"; // imagen de ojo cerrado
      icono.alt = "Mostrar contraseña";
    }
  });
});