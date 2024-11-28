const checkbox = document.getElementById("addCuenta");
const itemsSocio = document.getElementById("itemsSocio");
const inputSocio = document.getElementById("txtSocio");
const itemsCuenta = document.getElementById("itemsCuenta");
const inputCuenta = document.getElementById("txtCuenta");
const itemServicio = document.getElementById("itemsServicio");

const messageError = document.getElementById("messageError");
const messagePdf = document.getElementById("message-pdf");

$(document).ready(function() {
  obtenerSocios();
});

function obtenerSocios() {
  console.log("Cargando socios...");
  $.ajax({
    type: "POST",
    url: "./php/phpgets.php",
    data: {
      action: "ObtenerSocios",
    },
    success: function (data) {  
      itemsSocio.innerHTML = data;
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud AJAX:", error);
    },
  });
}

function obtenerServicios() {
  console.log("Cargando Servicios...");
  $.ajax({
    type: "POST",
    url: "./php/phpgets.php",
    data: {
      action: "ObtenerServicios",
    },
    success: function(data) {
      itemServicio.innerHTML = data;
    },
    error: function(xhr, status, error) {
      console.error("Error en la solicitud AJAX:", error);
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
  const inputContainers = document.querySelectorAll(".inputContainer");
  
  inputSocio.addEventListener("change", () => {
    if (isSocioValido()) {
      inputCuenta.value = "";
      const socioId = inputSocio.value.trim();
      obtenerCuentasSocio(socioId);
      messageError.style.display = "none";
      messageError.classList.remove("error-visible");
    } else {
      messageError.style.display = "flex";
    messageError.textContent = "Socio no válido";
    messageError.classList.add("error-visible");
    }
  })

  checkbox.addEventListener("change", () => {
    const isChecked = checkbox.checked;
    if(isChecked) {
      obtenerServicios();
    }
    inputContainers.forEach((container) => {
      container.style.display = isChecked ? "flex" : "none";
    });
  });

  if (!checkbox.checked) {
    inputContainers.forEach((container) => {
      container.style.display = "none";
    });
  }
});

function isSocioValido() {  
  const options = Array.from(itemsSocio.options);
  return options.some(option => option.value === inputSocio.value.trim());
}

function obtenerCuentasSocio(socioId) {
  console.log("Obteniendo cuentas del socio con ID:", socioId);
  $.ajax({
    type: "POST",
    url: "./php/phpgets.php",
    data: {
      action: "ObtenerCuentasSocio",
      Id_Socio: socioId,
    },
    success: function (data) {
      itemsCuenta.innerHTML = data;
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud AJAX:", error);
    },
  });
}

document.getElementById("uploadBtn").addEventListener("click", function () {
  const folderInput = document.getElementById("folderName");
  const fileInput = document.getElementById("pdfFile");
  const folderName = folderInput.value.trim();
  const files = fileInput.files;

  if (!folderName) {
    alert("Por favor, ingresa un nombre para la carpeta.");
    return;
  }
  if (files.length === 0) {
    alert("Por favor, selecciona al menos un archivo PDF.");
    return;
  }

  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    if (files[i].type !== "application/pdf") {
      alert("Solo se permiten archivos PDF.");
      return;
    }
    formData.append("pdf[]", files[i]);
  }
  formData.append("folder", folderName);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "./php/upload.php", true);
  xhr.send(formData);

  xhr.onload = function () {
    if (xhr.status === 200) {
      messagePdf.textContent = "Archivo subido correctamente.";
    } else {
      messagePdf.textContent = "Error al subir el archivo.";
      messagePdf.style.color = "red";
    }
  };
  xhr.onerror = function () {
    alert("Hubo un error al enviar el archivo.");
  };
});