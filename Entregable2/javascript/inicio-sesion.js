"use strict";
const formLogin = document.querySelector("#form-login");

// Funciones para manejar errores
function mostrarError(input, mensaje) {
  const formItem = input.closest(".form-item");
  const errorSection = formItem.querySelector(".error");
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

// Validar email
function validarEmail() {
  const emailLogin = document.querySelector("#email-login");
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!patron.test(emailLogin.value.trim())) {
    mostrarError(emailLogin, "*Ingresa un correo electrónico válido");
    return false;
  } else {
    limpiarError(emailLogin);
    return true;
  }
}

// Validar credenciales con lo guardado en localStorage
function validarCredenciales() {
  const emailLogin = document.querySelector("#email-login");
  const contraseniaLogin = document.querySelector("#contrasenia-login");

  const emailGuardado = localStorage.getItem("email");
  const passGuardada = localStorage.getItem("password");

  if (emailLogin.value.trim() !== emailGuardado) {
      mostrarError(emailLogin, "*Correo inválido");
      return false;

  } else if (contraseniaLogin.value !== passGuardada){
      mostrarError(contraseniaLogin, "*Contraseña incorrecta");
      return false;
    
  } else {
      limpiarError(contraseniaLogin);
      return true;
  }
}

// Validar captcha
function validarCaptcha() {
  const captchaResponse = grecaptcha.getResponse();
  const captchaDiv = document.querySelector(".form-item.captcha");
  const errorSection = captchaDiv.querySelector(".error");

  if (captchaResponse.length === 0) {
    errorSection.textContent = "*Por favor, verifica que no eres un robot.";
    return false;
  } else {
    errorSection.textContent = "";
    return true;
  }
}

// Envío final
formLogin.addEventListener("submit", function (e) {
  e.preventDefault();

  const validoEmail = validarEmail();
  const validoCredenciales = validarCredenciales();
  const captchaValido = validarCaptcha();

  if (validoEmail && validoCredenciales && captchaValido) {
    formLogin.reset();
    grecaptcha.reset();

    // Redirección a home
    window.location.href = "/index.html";
  } else {
    console.log("Error en login");
  }
});

// Mostrar/ocultar contraseña
const toggleIcono = document.querySelectorAll(".toggle-password");
toggleIcono.forEach(icono => {
  icono.addEventListener("click", () => {
    const inputId = icono.getAttribute("data-target");
    const input = document.getElementById(inputId);

    if (input.type === "password") {
      input.type = "text";
      icono.src = "imagenes/registro/ojo_abierto.png";
    } else {
      input.type = "password";
      icono.src = "imagenes/registro/ojo_cerrado.png";
    }
  });
});

