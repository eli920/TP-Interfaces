import { Juego } from "./Juego.js";
let tamanioPantalla = window.innerWidth;

//Funcionalidad menú deplegable hamburguesa
document.addEventListener("DOMContentLoaded", () => {
  const btnHamburguesa = document.querySelector(".btn-hamburguesa");
  const btnCerrarHamburguesa = document.querySelector(
    ".btn-cerrar-hamburguesa"
  );
  const menuHamburguesa = document.querySelector(".menu-hamburguesa");
  const overlay = document.querySelector('.overlay');

  btnHamburguesa.addEventListener("click", () => {
    menuHamburguesa.classList.add("activo");
    overlay.classList.add('activo');
  });

  btnCerrarHamburguesa.addEventListener("click", () => {
    menuHamburguesa.classList.remove("activo");
    overlay.classList.remove('activo');
  });

  overlay.addEventListener('click', () => {
    menuHamburguesa.classList.remove('activo');
    overlay.classList.remove('activo');
  })
});

//Funcionalidad menú busqueda texto
document.addEventListener("DOMContentLoaded", () => {
  const btnBuscar = document.querySelector(".btn-buscar");
  const btnCerrarCampo = document.querySelector(".btn-cerrar-campo");
  const desplegableBusqueda = document.querySelector(".desplegable-busqueda");

  btnBuscar.addEventListener("click", () => {
    desplegableBusqueda.classList.add("abierto");
    btnBuscar.classList.add("cliqueado");
  });

  btnCerrarCampo.addEventListener("click", () => {
    desplegableBusqueda.classList.remove("abierto");
    btnBuscar.classList.remove("cliqueado");
  });
});

//Funcionalidad menú usuario
document.addEventListener("DOMContentLoaded", () => {
  const btnUsuario = document.querySelector(".btn-usuario");
  const btnCerrarOpciones = document.querySelector(".btn-cerrar-opciones");
  const desplegableUsuario = document.querySelector(".desplegable-usuario");
  const overlay = document.querySelector('.overlay');

  btnUsuario.addEventListener("click", () => {
    desplegableUsuario.classList.add("desplegado");
    overlay.classList.add('activo');
  });

  btnCerrarOpciones.addEventListener("click", () => {
    desplegableUsuario.classList.remove("desplegado");
    overlay.classList.remove('activo');
  });

  overlay.addEventListener('click', () => {
    desplegableUsuario.classList.remove('desplegado');
    overlay.classList.remove('activo');
  })
});

function bannerCarrusel() {
  //Arreglo banner dinamico
  const juegosBanner = [
    new Juego("imagenes/home/banner/juego1.png", "Peg Solitaire"),
    new Juego("imagenes/home/banner/juego2.png", "Shape of Dreams"),
    new Juego("imagenes/home/banner/juego3.png", "Hollow Knight Silksong"),
  ];

  const bannerContenedor = document.querySelector(".banner-contenedor");
  const bannerPuntos = document.querySelector(".banner-puntos");

  let indiceActual = 0;

  juegosBanner.forEach((juego) => {
    const card = document.createElement("div");
    card.classList.add("card-banner");

    card.innerHTML = `
    <img src="${juego.foto}" alt="${juego.titulo}">
    <h2 class="titulo-juego">${juego.titulo}</h2>
    <button class="btn btn-xs btn-jugar">Jugar ahora</button>
    
  `;

    bannerContenedor.appendChild(card);
  });

  const cards = document.querySelectorAll(".card-banner");

  function actualizarClases() {
    cards.forEach((card, indice) => {
      card.classList.remove("active", "atras", "siguiente");

      if (indice === indiceActual) {
        card.classList.add("active");
      } else if (
        indice ===
        (indiceActual - 1 + juegosBanner.length) % juegosBanner.length
      ) {
        card.classList.add("atras");
      } else if (
        indice ===
        (indiceActual + 1 + juegosBanner.length) % juegosBanner.length
      ) {
        card.classList.add("siguiente");
      }
    });

    mostrarPuntos();
  }

  function mostrarPuntos() {
    bannerPuntos.innerHTML = "";
    juegosBanner.forEach((juego, indice) => {
      const punto = document.createElement("span");

      if (indice === indiceActual) punto.classList.add("activo");
      bannerPuntos.appendChild(punto);
    });
  }

  document
    .querySelector("#btn-siguiente-banner")
    .addEventListener("click", () => {
      indiceActual =
        (indiceActual + 1 + juegosBanner.length) % juegosBanner.length;
      actualizarClases();
    });

  document.querySelector("#btn-atras-banner").addEventListener("click", () => {
    indiceActual =
      (indiceActual - 1 + juegosBanner.length) % juegosBanner.length;
    actualizarClases();
  });

  actualizarClases();
}

bannerCarrusel();

function misJuegosCarrusel() {
  //Arreglo carrusel mis juegos
  const misJuegos = [
    new Juego(
      "imagenes/home/carrusel-mis-juegos/blocka-juego.jpg",
      "Blocka",
      "Puzzle"
    ),
    new Juego(
      "imagenes/home/carrusel-mis-juegos/flappy-bird.jpg",
      "Flappy Batman",
      "Acción"
    ),
    new Juego(
      "imagenes/home/carrusel-mis-juegos/juego3.png",
      "Minecraft",
      "Aventura"
    ),
    new Juego(
      "imagenes/home/carrusel-mis-juegos/juego4.png",
      "Baldur's Gate",
      "Estrategia"
    ),
    new Juego(
      "imagenes/home/carrusel-mis-juegos/juego5.png",
      "GTA V",
      "Acción"
    ),
    new Juego(
      "imagenes/home/carrusel-mis-juegos/juego6.png",
      "Peak",
      "Aventura"
    ),
    new Juego(
      "imagenes/home/carrusel-mis-juegos/juego7.png",
      "Ready or Not",
      "Estrategia"
    ),
    new Juego(
      "imagenes/home/carrusel-mis-juegos/juego8.png",
      "Blue Prince",
      "Puzzle"
    ),
  ];

  const cintaMisJuegos = document.querySelector("#cinta-mis-juegos");
  const btnAtrasMisJuegos = document.querySelector("#btn-atras-mis-juegos");
  const btnSiguienteMisJuegos = document.querySelector(
    "#btn-siguiente-mis-juegos"
  ); 

  let indiceActual = 0;
  let cantJuegos = misJuegos.length;

  //si el tamaño de la pantalla es mobile se muestran 2 cards; si es desktop, se muestran 4
  let cantCards = tamanioPantalla < 768 ? 2 : 4;

  function actualizarPosicionCard() {
    cintaMisJuegos.innerHTML = "";

    misJuegos.forEach((juego, indice) => {
      const card = document.createElement("div");
      card.classList.add("card-juego");

      card.innerHTML = `
      <img src="${juego.foto}" alt="${juego.titulo}">
      <h3 class="juego-titulo">${juego.titulo}</h3>
      <p class="juego-categoria">${juego.categoria}</p>
      <button class="btn btn-jugar-ahora btn-xs">Jugar Ahora</button>
    `;

      cintaMisJuegos.appendChild(card);
    });

    //anchoTarjeta calcula el porcentaje que ocupa la card en el container. Si la pantalla es mobile seria: 100 / 2 (cards) = 50%. Si la pantalla es desktop: 100 / 4 (cards) = 25%. Este valor sirve para saber cuanto hay que desplazar para cambiar a la siguiente
    const anchoTarjeta = 100 / cantCards;
    cintaMisJuegos.style.transform = `translateX(-${
      indiceActual * anchoTarjeta
    }%)`;

    btnAtrasMisJuegos.disabled = indiceActual <= 0;
    btnSiguienteMisJuegos.disabled = indiceActual >= cantJuegos - cantCards;
  }

  btnAtrasMisJuegos.addEventListener("click", () => {
    if (indiceActual > 0) {
      indiceActual--;
      actualizarPosicionCard();
    }
  });

  btnSiguienteMisJuegos.addEventListener("click", () => {
    if (indiceActual < cantJuegos - cantCards) {
      indiceActual++;
      actualizarPosicionCard();
    }
  });

  window.addEventListener("resize", () => {
    cantCards = window.innerWidth < 768 ? 2 : 4;
    actualizarPosicionCard();
  });

  actualizarPosicionCard();
}

misJuegosCarrusel();

function sugerenciasCarrusel() {
  //Arreglo carrusel juegos sugerencias
  const sugerenciasJuegos = [
    new Juego(
      "imagenes/home/carrusel-sugerencias/juego1.png",
      "Peg Solitaire",
      "Puzzle",
      false
    ),
    new Juego(
      "imagenes/home/carrusel-sugerencias/juego2.png",
      "Hollow Knight Silksong",
      "Aventura",
      false
    ),
    new Juego(
      "imagenes/home/carrusel-sugerencias/juego3.png",
      "Borderlands 4",
      "Acción",
      false
    ),
    new Juego(
      "imagenes/home/carrusel-sugerencias/juego4.png",
      "Warframe",
      "Estrategia",
      true
    ),
    new Juego(
      "imagenes/home/carrusel-sugerencias/juego5.png",
      "Sengoku Dynasty",
      "Estrategia",
      false
    ),
    new Juego(
      "imagenes/home/carrusel-sugerencias/juego6.png",
      "Shape of Dreams",
      "Acción",
      false
    ),
    new Juego(
      "imagenes/home/carrusel-sugerencias/juego7.png",
      "Henry Halfhead",
      "Puzzle",
      false
    ),
    new Juego(
      "imagenes/home/carrusel-sugerencias/juego8.png",
      "Dead Reset",
      "Terror",
      false
    ),
  ];

  const cintaSugerencias = document.querySelector("#cinta-sugerencias");
  const btnAtrasSugerencias = document.querySelector("#btn-atras-sugerencias");
  const btnSiguienteSugerencias = document.querySelector(
    "#btn-siguiente-sugerencias"
  );

  let indiceActual = 0;
  let cantJuegos = sugerenciasJuegos.length;

  let cantCards = tamanioPantalla < 768 ? 2 : 4;

  function actualizarPosicionCard() {
    cintaSugerencias.innerHTML = "";

    sugerenciasJuegos.forEach((juego, indice) => {
      const card = document.createElement("div");
      card.classList.add("card-juego");

      card.innerHTML = `
      <img src="${juego.foto}" alt="${juego.titulo}">
      <h3 class="juego-titulo">${juego.titulo}</h3>
      <p class="juego-categoria">${juego.categoria}</p>
      ${juego.gratis ? '<span class="gratis">Gratis</span>' : ""}
      <button class="btn btn-jugar-ahora btn-xs">Jugar Ahora</button>
    `;

      cintaSugerencias.appendChild(card);
    });

    //anchoTarjeta calcula el porcentaje que ocupa la card en el container. Si la pantalla es mobile seria: 100 / 2 (cards) = 50%. Si la pantalla es desktop: 100 / 4 (cards) = 25%. Este valor sirve para saber cuanto hay que desplazar para cambiar a la siguiente
    const anchoTarjeta = 100 / cantCards;
    cintaSugerencias.style.transform = `translateX(-${
      indiceActual * anchoTarjeta
    }%)`;

    btnAtrasSugerencias.disabled = indiceActual <= 0;
    btnSiguienteSugerencias.disabled = indiceActual >= cantJuegos - cantCards;
  }

  btnAtrasSugerencias.addEventListener("click", () => {
    if (indiceActual > 0) {
      indiceActual--;
      actualizarPosicionCard();
    }
  });

  btnSiguienteSugerencias.addEventListener("click", () => {
    if (indiceActual < cantJuegos - cantCards) {
      indiceActual++;
      actualizarPosicionCard();
    }
  });

  window.addEventListener("resize", () => {
    cantCards = window.innerWidth < 768 ? 2 : 4;
    actualizarPosicionCard();
  });

  actualizarPosicionCard();
}

sugerenciasCarrusel();

// Redirección del botón "Jugar ahora" para Peg Solitaire
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("btn-jugar") ||
    e.target.classList.contains("btn-jugar-ahora")
  ) {
    const titulo = e.target.parentElement.querySelector(".titulo-juego, .juego-titulo")?.textContent?.trim();

    if (titulo === "Peg Solitaire") {
      window.location.href = "peg-solitaire.html"; 
    }
  }
});

// Redirección del botón "Jugar ahora" para Blocka
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("btn-jugar-ahora")
  ) {
    const titulo = e.target.parentElement.querySelector(".juego-titulo")?.textContent?.trim();

    if (titulo === "Blocka") {
      window.location.href = "blocka.html"; 
    }
  }
});

