const checkbox = document.getElementById("addCuenta");

const inputSocio = document.getElementById("txtSocio");
const itemsSocio = document.getElementById("itemsSocio");

const textareaDescripcion = document.getElementById("txtDescripcion");
const manzanaInput = document.getElementById("txtmanzana");
const loteInput = document.getElementById("txtlote");

const inputCuenta = document.getElementById("txtCuenta");
const itemsCuenta = document.getElementById("itemsCuenta");

const inputServicio = document.getElementById("txtServicio");
const itemServicio = document.getElementById("itemsServicio");

const inputTipoTramite = document.getElementById("txtTipoTramite");
const itemTipoTramite = document.getElementById("itemsTipoTramite");

const messageError = document.getElementById("messageError");
const messagePdf = document.getElementById("message-pdf");

$(document).ready(() => {
  obtenerSocios();
  obtenerTipoTramiteActivo();

  const inputContainers = document.querySelectorAll(".inputContainer");
  checkbox.addEventListener("change", () => {
    const isChecked = checkbox.checked;
    if (isChecked) {
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
    },
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
  const validDescripcion = validarCaracteres(textareaDescripcion);
  const validManzana = validarCaracteres(manzanaInput);
  const validLote = validarCaracteres(loteInput, "Lote");

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
  
});