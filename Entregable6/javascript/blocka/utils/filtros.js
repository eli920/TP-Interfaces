export function aplicarEscalaGrises(contexto, x, y, ancho, alto) {
  const datosImagen = contexto.getImageData(x, y, ancho, alto);
  const datos = datosImagen.data;

  for (let i = 0; i < datos.length; i += 4) {
    const luminosidad = Math.round(
      datos[i] * 0.299 + datos[i + 1] * 0.587 + datos[i + 2] * 0.114
    );
    datos[i] = datos[i + 1] = datos[i + 2] = luminosidad;
  }

  contexto.putImageData(datosImagen, x, y);
}

export function aplicarBrillo(contexto, x, y, ancho, alto) {
  const datosImagen = contexto.getImageData(x, y, ancho, alto);
  const datos = datosImagen.data;

  for (let i = 0; i < datos.length; i += 4) {
    datos[i] = Math.min(255, datos[i] * 1.3);
    datos[i + 1] = Math.min(255, datos[i + 1] * 1.3);
    datos[i + 2] = Math.min(255, datos[i + 2] * 1.3);
  }

  contexto.putImageData(datosImagen, x, y);
}

export function aplicarNegativo(contexto, x, y, ancho, alto) {
  const datosImagen = contexto.getImageData(x, y, ancho, alto);
  const datos = datosImagen.data;

  for (let i = 0; i < datos.length; i += 4) {
    datos[i] = 255 - datos[i];
    datos[i + 1] = 255 - datos[i + 1];
    datos[i + 2] = 255 - datos[i + 2];
  }

  contexto.putImageData(datosImagen, x, y);
}
