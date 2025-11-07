export class Pieza {
  constructor(fila, columna, tipo, imagen) {
    this.fila = fila;
    this.columna = columna;
    this.tipo = tipo;
    this.imagen = imagen;
    this.radio = 15;
    this.tamanioImagen = 30;
    this.seleccionada = false;
  }

  isPointInside(x, y, posX, posY) {
    const _x = posX - x;
    const _y = posY - y;
    return Math.sqrt(_x * _x + _y * _y) < this.radio;
  }

  dibujar(ctx, x, y) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(x, y, this.radio, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (this.seleccionada) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#FFD700';
    }

    ctx.drawImage(
      this.imagen,
      x - this.radio,
      y - this.radio,
      this.radio * 2,
      this.radio * 2
    );

    ctx.restore();

    if (this.seleccionada) {
      ctx.save();
      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y, this.radio + 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}
