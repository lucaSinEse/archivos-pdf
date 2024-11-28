$(document).ready(function() {
  obtenerSocios();
});

document.addEventListener("DOMContentLoaded", () => {
  const checkbox = document.getElementById("addCuenta");
  
  const inputContainers = document.querySelectorAll(".inputContainer");

  checkbox.addEventListener("change", () => {
    const isChecked = checkbox.checked;

    inputContainers.forEach((container) => {
      if (isChecked) {
        container.style.display = "flex";
      } else {
        container.style.display = "none";
      }
    });
  });

  if (!checkbox.checked) {
    inputContainers.forEach((container) => {
      container.style.display = "none";
    });
  }
});

function obtenerSocios() {
  console.log("socios");
  $.ajax({
    type: "POST",
    url: "./php/phpgets.php",
    data: {
      action: "ObtenerSocios",
    },
    success: function (data) {
      console.log(data);
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
    const messageDiv = document.getElementById("message");
    if (xhr.status === 200) {
      messageDiv.textContent = "Archivo subido correctamente.";
    } else {
      messageDiv.textContent = "Error al subir el archivo.";
      messageDiv.style.color = "red";
    }
  };
  xhr.onerror = function () {
    alert("Hubo un error al enviar el archivo.");
  };
});
