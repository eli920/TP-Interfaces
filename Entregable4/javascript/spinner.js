const texto = document.querySelector('#texto-spinner');
let porcentaje = 0;
const duracion = 5000; // 5 segundos
const intervalo = 50; // cada 50ms
const pasos = duracion / intervalo;
const incremento = 100 / pasos;

const tiempo = setInterval(() => {
    porcentaje += incremento;
    if (porcentaje >= 100) {
        porcentaje = 100;
        clearInterval(tiempo);
        // ocultar loader y mostrar contenido
        document.querySelector('#cargar-pagina').style.display = 'none';
        document.querySelector('.contenido-home').style.display = 'block';
    }
    texto.textContent = `Cargando ${Math.floor(porcentaje)}%`;
}, intervalo);
