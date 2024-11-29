const checkbox = document.getElementById("addCuenta");

const inputSocio = document.getElementById("txtSocio");
const itemsSocio = document.getElementById("itemsSocio");

const textareaDescripcion = document.getElementById("txtDescripcion");
const manzanaInput = document.getElementById("txtmanzana");
const loteInput = document.getElementById("txtlote");

const inputCuenta = document.getElementById("txtCuenta");
const itemsCuenta = document.getElementById("itemsCuenta");

const itemServicio = document.getElementById("itemsServicio");
const inputServicio = document.getElementById("txtServicio");
const itemTipoTramites = document.getElementById("itemsTipoTramite");
const inputTipoTramites = document.getElementById("txtTipoTramite");
const txtDescripcion = document.getElementById("txtDescripcion");
const txtmanzana = document.getElementById("txtmanzana");
const txtlote = document.getElementById("txtlote");


const inputTipoTramite = document.getElementById("txtTipoTramite");
const itemTipoTramite = document.getElementById("itemsTipoTramite");

const messageError = document.getElementById("messageError");
const messagePdf = document.getElementById("message-pdf");

$(document).ready(() => {
  obtenerSocios();
  ObtenerTipoTramitesLista();
});

//* Valida que el valor del input de socios exista en las opciones
inputSocio.addEventListener("change", () => {
  if (isInputValido(inputSocio, itemsSocio)) {
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
});

//* Valida que el valor del input de cuenta exista en las opciones
inputCuenta.addEventListener("change", () => {
  if (isInputValido(inputCuenta, itemsCuenta)) {
    messageError.style.display = "none";
    messageError.classList.remove("error-visible");
  } else {
    messageError.style.display = "flex";
    messageError.textContent = "Cuenta no válida";
    messageError.classList.add("error-visible");
  }
});

//* Valida que el valor del input de servicios exista en las opciones
inputServicio.addEventListener("change", () => {
  if (isInputValido(inputServicio, itemServicio)) {
    messageError.style.display = "none";
    messageError.classList.remove("error-visible");
  } else {
    messageError.style.display = "flex";
    messageError.textContent = "Servicio no Válido";
    messageError.classList.add("error-visible");
  }
});

//* Valida que el valor del input de servicios exista en las opciones
inputTipoTramite.addEventListener("change", () => {
  if (isInputValido(inputTipoTramite, itemTipoTramite)) {
    messageError.style.display = "none";
    messageError.classList.remove("error-visible");
  } else {
    messageError.style.display = "flex";
    messageError.textContent = "Tipo de Tramite no Válido";
    messageError.classList.add("error-visible");
  }
});

//* Funcion para validar que el valor del input exista en las opciones
function isInputValido(inputElement, datalistElement) {
  const options = Array.from(datalistElement.options);
  return options.some((option) => option.value === inputElement.value.trim());
}

//* Valida que no existan caracteres raros en los inputs (y textarea) tipados por el usuario
function validarCaracteres(inputElement) {
  //? asegura que solo se permiten letras, números, letras con acento y espacios en el valor del input.
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚüÜñÑ]*$/;

  if (!regex.test(inputElement.value)) {
    return false;
  } else {
    return true;
  }
}

function obtenerSocios() {
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

function obtenerTipoTramiteActivo() {
  $.ajax({
    type: "POST",
    url: "./php/phpgets.php",
    data: {
      action: "ObtenerTipoTramitesActivos",
    },
    success: function (data) {
      itemTipoTramite.innerHTML = data;
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud AJAX:", error);
    },
  });
}

function obtenerServicios() {
  $.ajax({
    type: "POST",
    url: "./php/phpgets.php",
    data: {
      action: "ObtenerServicios",
    },
    success: function (data) {
      itemServicio.innerHTML = data;
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud AJAX:", error);
    }
  });
}

function ObtenerTipoTramitesLista() {
  console.log("Cargando TipoTramites...");
  $.ajax({
    type: "POST",
    url: "./php/phpgets.php",
    data: {
      action: "ObtenerTipoTramitesLista",
    },
    success: function(data) {
      itemTipoTramites.innerHTML = data;
      console.log(data);
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
}

function obtenerCuentasSocio(socioId) {
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
<<<<<<< Updated upstream
  const validDescripcion = validarCaracteres(textareaDescripcion);
  const validManzana = validarCaracteres(manzanaInput);
  const validLote = validarCaracteres(loteInput, "Lote");
=======
  console.log(checkbox.checked);
  console.log(inputSocio.value);
  console.log(inputCuenta.value);
  console.log(inputServicio.value);
  console.log(inputTipoTramites.value);
  console.log(txtDescripcion.value);
  console.log(txtmanzana.value);
  console.log(txtlote.value);

  if(checkbox.checked){
    console.log("activo");
    if(inputSocio.value != "" || inputCuenta.value != "" || inputServicio.value != ""){
      console.log("faltan campos");
    }
  }else{
    console.log("no activo");

  }
});


/* document.getElementById("uploadBtn").addEventListener("click", function () {
  const folderInput = document.getElementById("folderName");
  const fileInput = document.getElementById("pdfFile");
  const folderName = folderInput.value.trim();
  const files = fileInput.files;
>>>>>>> Stashed changes

  if (validDescripcion && validManzana && validLote) {
    messageError.style.display = "none";
    messageError.classList.remove("error-visible");
  } else {
    messageError.style.display = "flex";
    messageError.textContent =
      "Solo se permiten letras, números, tildes y espacios en los campos";
    messageError.classList.add("error-visible");
    return;
  }
  //? Aca seguiria todo lo relacionado con la subida del pdf.
  // const folderInput = document.getElementById("folderName");
  // const fileInput = document.getElementById("pdfFile");
  // const folderName = folderInput.value.trim();
  // const files = fileInput.files;

  // if (!folderName) {
  //   alert("Por favor, ingresa un nombre para la carpeta.");
  //   return;
  // }
  // if (files.length === 0) {
  //   alert("Por favor, selecciona al menos un archivo PDF.");
  //   return;
  // }

  // const formData = new FormData();

  // for (let i = 0; i < files.length; i++) {
  //   if (files[i].type !== "application/pdf") {
  //     alert("Solo se permiten archivos PDF.");
  //     return;
  //   }
  //   formData.append("pdf[]", files[i]);
  // }
  // formData.append("folder", folderName);

<<<<<<< Updated upstream
  // const xhr = new XMLHttpRequest();
  // xhr.open("POST", "./php/upload.php", true);
  // xhr.send(formData);

  // xhr.onload = function () {
  //   if (xhr.status === 200) {
  //     messagePdf.textContent = "Archivo subido correctamente.";
  //   } else {
  //     messagePdf.textContent = "Error al subir el archivo.";
  //     messagePdf.style.color = "red";
  //   }
  // };
  // xhr.onerror = function () {
  //   alert("Hubo un error al enviar el archivo.");
  // };
});
=======
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
}); */
>>>>>>> Stashed changes
