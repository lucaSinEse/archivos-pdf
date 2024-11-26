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
