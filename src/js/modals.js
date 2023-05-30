
//* Modal cambio de contraseña
var modalPass = document.getElementById("modalPass");

var btnPass = document.getElementById("btnPass");

var btnCerrar = document.getElementsByClassName("close")[0];

btnPass.onclick = function() {
  modalPass.style.display = "block";
}

btnCerrar.onclick = function() {
  modalPass.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modalPass) {
    modalPass.style.display = "none";
  }
}

//* Modal Agregar Usuario
var modalAgregarUsuario = document.getElementById("modalAgregarUsuario");

var btnAgregarUsuario = document.getElementById("btnAgregarUsuario");

var btnCerrar = document.getElementsByClassName("close")[1];

btnAgregarUsuario.onclick = function() {
  modalAgregarUsuario.style.display = "block";
}

btnCerrar.onclick = function() {
  modalAgregarUsuario.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modalAgregarUsuario) {
    modalAgregarUsuario.style.display = "none";
  }
}
