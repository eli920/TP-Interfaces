'use strict';

import { Juego } from '../Clases/Juego.js';

let juego = null;

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