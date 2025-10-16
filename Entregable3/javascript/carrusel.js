export {};

export class Juego {
  constructor(foto, titulo, categoria, favorito) {
    this.foto = foto;
    this.titulo = titulo;
    this.categoria = categoria;
    this.favorito = favorito;
  }
}

export function misJuegosCarrusel() {
  const misJuegos = [
    new Juego("imagenes/juego/rompecabeza.png", "Rompecabeza", "Puzzle", true),
    new Juego("imagenes/juego/tetris.png", "Tetris", "Puzzle", false),
    new Juego("imagenes/juego/domino.png", "Domino", "Puzzle", false),
  ];

  const cintaMisJuegos = document.querySelector("#cinta-mis-juegos");
  const btnAtrasMisJuegos = document.querySelector("#btn-atras-mis-juegos");
  const btnSiguienteMisJuegos = document.querySelector("#btn-siguiente-mis-juegos");

  let indiceActual = 0;
  let cantJuegos = misJuegos.length;
  let cantCards = 1;

  function actualizarPosicionCard() {
    cintaMisJuegos.innerHTML = "";
    
    misJuegos.forEach((juego) => {
      const card = document.createElement("div");
      card.classList.add("card-juego");
      
      // Estructura similar a juegos relacionados
      card.innerHTML = `
        <div class="image-juego">
          <img src="${juego.foto}" alt="${juego.titulo}">
        </div>
        <div class="container-info">
          <h3 class="juego-titulo">${juego.titulo}</h3>
          <p class="juego-categoria">${juego.categoria}</p>
        </div>
      `;
      
      cintaMisJuegos.appendChild(card);
    });

    // Calcular altura de card + margen
    const cardHeight = cintaMisJuegos.querySelector(".card-juego").offsetHeight + 20;
    cintaMisJuegos.style.transform = `translateY(-${indiceActual * cardHeight}px)`;

    // Actualizar estado de botones
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

  actualizarPosicionCard();
}

misJuegosCarrusel();


// Función para cargar juegos relacionados desde la API
export async function cargarJuegosRelacionados() {
  try {
      // Llamada a la API v2
      const response = await fetch('https://vj.interfaces.jima.com.ar/api/v2');
      const juegos = await response.json();
      
      // Tomar 3 juegos random
      const juegosRandom = juegos.sort(() => Math.random() - 0.5).slice(0, 3);
      
      // Seleccionar el contenedor de cards
      const container = document.querySelector('.juegos-relacionados .container-cards');
      
      // Limpiar contenido actual
      container.innerHTML = '';
      
      // Crear cards dinámicamente
      juegosRandom.forEach(juego => {
          const article = document.createElement('article');
          article.className = 'card-juegos';
          article.innerHTML = `
              <div class="image-2" role="img" aria-label="Imagen del juego ${juego.name}">
                  <img class="img" src="${juego.background_image_low_res}" alt="${juego.name}" />
              </div>
              <div class="container-11">
                  <div class="div-wrapper"><h3 class="text-wrapper-4">${juego.name}</h3></div>
                  <div class="div-wrapper"><p class="text-wrapper-5">${juego.genres[0]?.name||'sin genero'}</p></div>
              </div>
          `;
          container.appendChild(article);
      });
      
  } catch (error) {
      console.error('Error al cargar juegos relacionados:', error);
  }
}

// Ejecutar al cargar la página
window.addEventListener('load', cargarJuegosRelacionados);
