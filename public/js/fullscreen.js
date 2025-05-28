const fullscreenButton = document.getElementById('fullscreen-btn');

    fullscreenButton.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
          .then(() => {
            fullscreenButton.textContent = 'Salir';
          })
          .catch((err) => {
            console.error(`Error al intentar entrar en modo pantalla completa: ${err.message}`);
          });
      } else {
        document.exitFullscreen()
          .then(() => {
            fullscreenButton.textContent = 'Ampliar';
          })
          .catch((err) => {
            console.error(`Error al intentar salir del modo pantalla completa: ${err.message}`);
          });
      }
    });