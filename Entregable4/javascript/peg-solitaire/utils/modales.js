export function mostrarModalGuardar(juegoGlobal) {
  const modal = document.getElementById('modal-guardar-partida');
  if (modal) {
    modal.style.display = 'flex';

    if (juegoGlobal) {
      juegoGlobal.juegoActivo = false;
      clearInterval(juegoGlobal.timerInterval);
    }
  }
}

export function ocultarModalGuardar() {
  const modal = document.getElementById('modal-guardar-partida');
  if (modal) {
    modal.style.display = 'none';
  }
}

export function mostrarModalContinuar(juegoGlobal) {
  const modal = document.getElementById('modal-continuar-partida');
  const infoDiv = document.getElementById('info-partida-guardada');

  if (modal && juegoGlobal) {
    const guardado = localStorage.getItem('peg-solitaire-guardado');
    if (guardado) {
      try {
        const estado = JSON.parse(guardado);
        const fecha = new Date(estado.fechaGuardado);
        const min = Math.floor(estado.tiempoRestante / 60);
        const seg = estado.tiempoRestante % 60;

        if (infoDiv) {
          infoDiv.innerHTML = `
            <p><strong>Fichas restantes:</strong> ${estado.piezas.length}</p>
            <p><strong>Movimientos:</strong> ${estado.movimientos}</p>
            <p><strong>Tiempo restante:</strong> ${min}:${seg
            .toString()
            .padStart(2, '0')}</p>
            <p><strong>Guardada:</strong> ${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}</p>
          `;
        }
      } catch (error) {
        console.error(error);
      }
    }

    modal.style.display = 'flex';
  }
}

export function ocultarModalContinuar() {
  const modal = document.getElementById('modal-continuar-partida');
  if (modal) {
    modal.style.display = 'none';
  }
}

export function volverAlMenu(configuracionJuego) {
  const gameScreen = document.getElementById('game-screen');
  const menuScreen = document.getElementById('menu-screen');

  gameScreen.classList.remove('active');
  menuScreen.classList.add('active');

  document.getElementById('selector-fondo').value =
    configuracionJuego.fondoActual;
  document.getElementById('selector-fichas').value =
    configuracionJuego.estiloFichas;
}
