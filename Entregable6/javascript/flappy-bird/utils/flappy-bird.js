'use strict';

import { Juego } from '../Clases/Juego.js';

let juego = null;

const PARALLAX_LAYERS = [
  { id: 'layer-1'},
  { id: 'layer-2'},
  { id: 'layer-3'},
  { id: 'layer-4'},
  { id: 'layer-5'},
  { id: 'layer-6'},
  { id: 'layer-7'},
  { id: 'layer-8'},
  { id: 'layer-9'},
  { id: 'layer-10'},
  { id: 'layer-11'},
  { id: 'layer-12'},
]

//Cargar capas del parallax dinámicamente
function cargarParallax() {
  const container = document.querySelector('.parallax-bg');
  container.innerHTML = '';

  PARALLAX_LAYERS.forEach((layer) => {
    const div = document.createElement('div');
    div.classList.add('parallax-layer');
    div.id = layer.id;
    container.appendChild(div);
  })
}

document.getElementById('btn-start').addEventListener('click', iniciarJuego);
document.getElementById('resetBtn').addEventListener('click', reiniciarJuego);
document.getElementById('menuBtn').addEventListener('click', volverAlMenu);

/*Al hacer click en "Jugar ahora en la portada se cambia la pantalla a la del menú del juego"*/ 
document.getElementById('btn-jugar-ahora').addEventListener('click', () => {
  document.getElementById('portada-juego').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';

  /*Se remueve la clase active de todas las pantallas que se controlan con screen*/
  document.querySelectorAll('.screen')
    .forEach((pantalla) => pantalla.classList.remove('active'));
  
  /*Se le agrega active solo a la de menú que es la que se debe mostrar*/
  document.getElementById('menu-screen').classList.add('active');
});

function iniciarJuego() {
  console.log("hola");
  if (juego) {
    juego.detener();
  }

  cargarParallax();

  juego = new Juego();
  juego.iniciarJuego();
}

function reiniciarJuego() {
  if (juego) {
    juego.reiniciar();
  }
}

function volverAlMenu() {
  if (juego) {
    juego.volverAlMenu();
  }
}