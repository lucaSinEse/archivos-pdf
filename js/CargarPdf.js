//? Elementos del html
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

const fileInput = document.getElementById("pdfFile");
const messagePdf = document.getElementById("message-pdf");

//?Cuando se termine de renderizar el html obtiene los socios, tipos de tramitrs activos y servicios, ademas de cambiarle
//? los estilos a los componentes de cuenta, manzana y lote.
$(document).ready(() => {
  obtenerSocios();
  obtenerTipoTramiteActivo();
  obtenerServicios();

  const inputContainers = document.querySelectorAll(".inputContainer");
  checkbox.addEventListener("change", () => {
    const isChecked = checkbox.checked;
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

//? Valida que el valor del input de socios exista en las opciones
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

//? Valida que el valor del input de cuenta exista en las opciones
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

//? Valida que el valor del input de servicios exista en las opciones
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

//? Valida que el valor del input de servicios exista en las opciones
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

//? Funcion para validar que el valor del input exista en las opciones
function isInputValido(inputElement, datalistElement) {
  const options = Array.from(datalistElement.options);
  return options.some((option) => option.value === inputElement.value.trim());
}

//? Valida que no existan caracteres raros en los inputs (y textarea) tipados por el usuario
function validarCaracteres(inputElement) {
  //? asegura que solo se permiten letras, números, letras con acento y espacios en el valor del input.
  const regex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚüÜñÑ]*$/;

  if (!regex.test(inputElement.value)) {
    return false;
  } else {
    return true;
  }
}

//? Funcion para obtener socios
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

//? Funcion para obtener tipos de tramites activos
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

//? Funcion para obtener servicios
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

//? Funcion para obtener las cuentas de un socio.
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

//? Evento para mostrar el nombre del pdf
fileInput.addEventListener("change", () => {
  const files = fileInput.files;

  if (files.length === 0) {
    messagePdf.textContent = "No se seleccionó ningún archivo.";
  } else if (files.length === 1) {
    messagePdf.textContent = `Archivo seleccionado: ${files[0].name}`;
  } else {
    messagePdf.textContent = `Se seleccionaron múltiples archivos (${files.length}).`;
  }
});

//? Funcion para subir los pdf.
document.getElementById("uploadBtn").addEventListener("click", function () {
  //? Validaciones de caracteres
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

  //? Validaciones de caracteres nulos
  if(!checkbox.checked){
    if(inputSocio.value == "" || txtDescripcion.value =="" || inputTipoTramite.value == "" || inputServicio.value == ""){
      messageError.style.display = "flex";
      messageError.textContent = "Faltan campos";
      messageError.classList.add("error-visible");
      return;
    }
  } else{
    if(inputSocio.value == "" || txtDescripcion.value =="" || inputTipoTramite.value == "" || inputServicio.value == "" || inputCuenta.value == "" || txtmanzana.value == "" || txtlote.value == "") {
      messageError.style.display = "flex";
      messageError.textContent = "Faltan campos";
      messageError.classList.add("error-visible");
      return;
    }
  }

  //? Aca seguiria todo lo relacionado con la subida del pdf.
  const files = fileInput.files;
  let path = ``;
  if(!checkbox.checked) {
     path = `${inputSocio.value}`;
  } else {
     path = `${inputSocio.value}/${inputCuenta.value}`;
  }

  if (files.length === 0) {
    messageError.style.display = "flex";
    messageError.textContent = "Por favor, selecciona al menos un archivo PDF.";
    messageError.classList.add("error-visible");
    return;
  }

  //? Se crea el formData
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    if (files[i].type !== "application/pdf") {
      messageError.style.display = "flex";
      messageError.textContent = "Solo se permiten archivos PDF.";
      messageError.classList.add("error-visible");
      return;
    }
    formData.append("pdf[]", files[i]);
  }

  formData.append("folder", path);
  formData.append("checkbox", checkbox.checked);
  formData.append("socio", inputSocio.value);
  formData.append("descripcion", txtDescripcion.value);
  formData.append("tipoTramite", inputTipoTramite.value);
  formData.append("servicio", inputServicio.value);
  formData.append("cuenta", inputCuenta.value);
  formData.append("manzana", txtmanzana.value);
  formData.append("lote", txtlote.value);

  // console.log("Datos en FormData:");
  // for (const [key, value] of formData.entries()) {
  //     console.log(`${key}: ${value}`);
  // }
  
  //? Mandamos el req con el formData
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "./php/subirPdf.php", true);
  xhr.onload = () => {
    if(xhr.status === 200) {
      messageError.style.display = "flex";
      messageError.textContent = "Archivo subido correctamente";
      messageError.classList.add("error-visible");

      inputSocio.value = "";
      txtDescripcion.value = "";
      inputTipoTramite.value = "";
      inputServicio.value = "";
      checkbox.checked = false;
      inputCuenta.value = "";
      txtmanzana.value = "";
      txtlote.value = "";
      fileInput.value = "";
      messagePdf.textContent = "";

      const inputContainers = document.querySelectorAll(".inputContainer");
        inputContainers.forEach((container) => {
        container.style.display = "none";
      });

    } else {
      messageError.style.display = "flex";
      messageError.textContent = "Error al subir el archivo.";
      messageError.classList.add("error-visible");
      console.log(xhr.status);
      console.log(xhr);
      return;
    }
  }
  xhr.error = () => {
    alert("Hubo un error al enviar el archivo.");
    messageError.style.display = "flex";
    messageError.textContent = "Hubo un error al enviar el archivo.";
    messageError.classList.add("error-visible");
  }
  xhr.send(formData);
});