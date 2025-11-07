export function mostrarTransicionPortada() {
  const btnJugarAhora = document.getElementById('btn-jugar-ahora');
  const portadaJuego = document.getElementById('portada-juego');
  const gameContainer = document.getElementById('game-container');

  if (btnJugarAhora) {
    btnJugarAhora.addEventListener('click', function () {
      portadaJuego.style.opacity = '0';
      portadaJuego.style.transform = 'scale(0.95)';
      portadaJuego.style.transition = 'all 0.5s ease';

      setTimeout(() => {
        portadaJuego.style.display = 'none';
        gameContainer.style.display = 'flex';

        gameContainer.style.opacity = '0';
        gameContainer.style.transform = 'scale(0.95)';

        setTimeout(() => {
          gameContainer.style.transition = 'all 0.5s ease';
          gameContainer.style.opacity = '1';
          gameContainer.style.transform = 'scale(1)';
        }, 50);
      }, 500);
    });
  }
}
