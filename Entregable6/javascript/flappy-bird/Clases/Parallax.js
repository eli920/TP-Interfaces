export class Parallax {
  constructor() {
    this.scroll = 0;
    this.inicializado = false;
    this.layers = [];
    this.andando = false;
  }

  inicializar() {
    this.andando = true;
    this.scroll = 0;

    this.limpiarAnterior();

    //Obtener todas las capas del DOM
    const layerElementos = document.querySelectorAll('.parallax-bg img');
    this.layers = Array.from(layerElementos).map((el, index) => ({
      el: el,
      speed: (index + 1) * 0.4, //Velocidad que aumenta por capa
      clone: null,
      width: 0,
    }));

    // Resetear posición y duplicar imágenes para loop infinito
    this.layers.forEach((layer) => {
      if (layer.el) {
        layer.el.style.transform = 'translateX(0px)';
        
        // Duplicar la imagen para crear efecto infinito
        const clone = layer.el.cloneNode(true);
        clone.classList.add('layer-clone');
        layer.el.parentElement.appendChild(clone);

        layer.clone = clone;
        layer.width = layer.el.offsetWidth;
      }
    });
    
    this.inicializado = true;
  }

  actualizar() {
    if (!this.andando || !this.inicializado) return;
    
    this.scroll++;
    
    this.layers.forEach((layer) => {
      if (layer.el && layer.clone) {
        const offset = -(this.scroll * layer.speed) % layer.width;
        
        // Mover ambas imágenes (original y clon)
        layer.el.style.transform = `translateX(${offset}px)`;
        layer.clone.style.transform = `translateX(${offset + layer.width}px)`;
      }
    });
  }

  detener() {
    this.andando = false;
    this.limpiarAnterior();
  }

  limpiarAnterior() {
    document
      .querySelectorAll('.layer-clone')
      .forEach((clone) => clone.remove());
    this.layers = [];
    this.inicializado = false;
  }
}