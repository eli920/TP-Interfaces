'use strict';

import { Juego } from '../Clases/Juego.js';

// ============================================
// INICIALIZACIÓN DEL JUEGO
// ============================================

let juego = null;

function inicializar() {
  console.log('Inicializando Flappi Bird...');
  juego = new Juego();
  console.log('Flappi Bird inicializado correctamente');
}

document.addEventListener('DOMContentLoaded', inicializar);

// Exportar la instancia del juego por si se necesita acceder desde fuera
export { juego };