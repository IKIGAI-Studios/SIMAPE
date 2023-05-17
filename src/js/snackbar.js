
    const mensajeError = document.getElementById("snackbar");
  
    mensajeError.className = ('show');

    setTimeout(function(){ mensajeError.className = mensajeError.className.replace("show", ""); }, 3069);
  