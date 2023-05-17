
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