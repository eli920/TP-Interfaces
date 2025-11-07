export class GeneradorImagenes {
  static async generarImagen(ancho, alto, tipo) {
    return new Promise((resolve, reject) => {
      const lienzo = document.createElement('canvas');
      lienzo.width = ancho;
      lienzo.height = alto;
      const contexto = lienzo.getContext('2d');

      function dibujarImagen(imagen) {
        contexto.drawImage(imagen, 0, 0, ancho, alto);
        resolve(lienzo);
      }

      switch (tipo) {
        case 'batman':
          const imagenBatman = new Image();
          imagenBatman.src = 'imagenes/juego/blocka/batman.png';
          imagenBatman.onload = function () {
            dibujarImagen(this);
          };
          imagenBatman.onerror = function () {
            console.error('Error al cargar la imagen');
            contexto.fillStyle = '#cccccc';
            contexto.fillRect(0, 0, ancho, alto);
            resolve(lienzo);
          };
          break;

        case 'superman':
          const imagenSuperman = new Image();
          imagenSuperman.src = 'imagenes/juego/blocka/superman.jpg';
          imagenSuperman.onload = function () {
            dibujarImagen(this);
          };
          imagenSuperman.onerror = () => {
            console.error('Error al cargar la imagen');
            contexto.fillStyle = '#cccccc';
            contexto.fillRect(0, 0, ancho, alto);
            resolve(lienzo);
          };
          break;

        case 'batman-superman':
          const imagenBatmanSuperman = new Image();
          imagenBatmanSuperman.src =
            'imagenes/juego/blocka/batman-superman.jpg';
          imagenBatmanSuperman.onload = function () {
            dibujarImagen(this);
          };
          imagenBatmanSuperman.onerror = () => {
            console.error('Error al cargar la imagen');
            contexto.fillStyle = '#cccccc';
            contexto.fillRect(0, 0, ancho, alto);
            resolve(lienzo);
          };
          break;

        case 'radial':
          const degradadoRadial = contexto.createRadialGradient(
            ancho / 2,
            alto / 2,
            0,
            ancho / 2,
            alto / 2,
            ancho / 2
          );
          degradadoRadial.addColorStop(0, '#F2C335');
          degradadoRadial.addColorStop(0.5, '#b92020ff');
          degradadoRadial.addColorStop(1, '#263385ff');
          contexto.fillStyle = degradadoRadial;
          contexto.fillRect(0, 0, ancho, alto);
          resolve(lienzo);
          break;

        case 'waves':
          contexto.fillStyle = '#F2C335';
          contexto.fillRect(0, 0, ancho, alto);
          contexto.strokeStyle = '#1B1F2B';
          contexto.lineWidth = 5;
          for (let i = 0; i < 10; i++) {
            contexto.beginPath();
            for (let x = 0; x <= ancho; x += 10) {
              const y = alto / 2 + Math.sin((x + i * 30) * 0.02) * 50;
              if (x === 0) contexto.moveTo(x, y);
              else contexto.lineTo(x, y);
            }
            contexto.stroke();
          }
          resolve(lienzo);
          break;

        case 'stars':
          contexto.fillStyle = '#191970';
          contexto.fillRect(0, 0, ancho, alto);
          contexto.fillStyle = '#FFD700';
          for (let i = 0; i < 50; i++) {
            const x = Math.random() * ancho;
            const y = Math.random() * alto;
            const tamaño = 2 + Math.random() * 4;
            contexto.beginPath();
            contexto.arc(x, y, tamaño, 0, Math.PI * 2);
            contexto.fill();
          }
          resolve(lienzo);
          break;
      }

      contexto.fillStyle = 'rgba(255, 255, 255, 0.8)';
      contexto.font = 'bold 40px Arial';
      contexto.textAlign = 'center';
      contexto.textBaseline = 'middle';
      contexto.fillText(`GameHub- Blocka- ${tipo}`, ancho / 2, alto / 2);

      return lienzo;
    });
  }
}
