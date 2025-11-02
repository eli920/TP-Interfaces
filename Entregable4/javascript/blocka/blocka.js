'use strict';

import * as Carrusel from '../carrusel.js'; // ← Sube un nivel con ../
import { Juego } from './clases/Juego.js';
import { mostrarTransicionPortada } from './utils/transiciones.js';

let juego = null;

function inicializar() {
  console.log('Inicializando Blocka...');
  mostrarTransicionPortada();
  juego = new Juego();

  console.log('Iniciando carrusel con juegos:', misJuegos);
  Carrusel.misJuegosCarrusel(misJuegos);
  Carrusel.cargarJuegosRelacionados();
}

const misJuegos = [
  new Carrusel.Juego('imagenes/juego/pokemon.jpg', 'Pokemon', 'Puzzle', true),
  new Carrusel.Juego(
    'imagenes/juego/guardian.jpg',
    'Guardian',
    'Puzzle',
    false
  ),
  new Carrusel.Juego('imagenes/juego/sokoban.jpg', 'Sokoban', 'Puzzle', false),
];

document.addEventListener('DOMContentLoaded', inicializar);
