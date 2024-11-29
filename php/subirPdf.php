<?php
// Conexión a la base de datos, si es necesario
// include("conexion.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = [];

    // Recibimos los datos enviados por el formulario
    $checkbox = isset($_POST['checkbox']) ? $_POST['checkbox'] === 'true' : false;
    $socio = isset($_POST['socio']) ? trim($_POST['socio']) : null;
    $descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : null;
    $tipoTramite = isset($_POST['tipoTramite']) ? trim($_POST['tipoTramite']) : null;
    $servicio = isset($_POST['servicio']) ? trim($_POST['servicio']) : null;
    $cuenta = isset($_POST['cuenta']) ? trim($_POST['cuenta']) : null;
    $manzana = isset($_POST['manzana']) ? trim($_POST['manzana']) : null;
    $lote = isset($_POST['lote']) ? trim($_POST['lote']) : null;
    $folder = isset($_POST['folder']) ? trim($_POST['folder']) : null;

    // Validación de campos obligatorios
    if (!$checkbox) {
        // Si checkbox es false, validamos los campos mínimos
        if (empty($socio) || empty($descripcion) || empty($tipoTramite) || empty($servicio) ) {
            $response['error'] = "Faltan campos obligatorios: socio, descripcion,  tipo de trámite y servicio.";
            echo json_encode($response);
            exit;
        }
    } else {
        // Si checkbox es true, validamos todos los campos
        if (empty($socio) || empty($descripcion) || empty($tipoTramite) || empty($servicio) || empty($cuenta) || empty($manzana) || empty($lote)) {
            $response['error'] = "Faltan campos obligatorios: socio, tipo de trámite, servicio, cuenta, manzana y lote.";
            echo json_encode($response);
            exit;
        }
    }

    // Validación y procesamiento de archivos subidos
    if (!isset($_FILES['pdf']) || count($_FILES['pdf']['name']) === 0) {
        $response['error'] = "No se subieron archivos.";
        echo json_encode($response);
        exit;
    }

    //! Validamos y guardamos cada archivo PDF
    if(!$checkbox) {
      $conexion = conectar();
      $sql = "SELECT * FROM `Archivos_Tramites` WHERE `ID_Socio` = $socio, `ID_TipoTramite` = $tipoTramite, `ID_Servicio` = $servicio";

      $result = mysqli_query($conexion, $sql);

      if(mysqli_num_rows($result) === 0) {
        $insertSql = "INSERT INTO `Archivos_Tramites` (`ID_Socio`, `ID_TipoTramite`, `ID_Servicio`, `Descripcion`)
                      VALUES ('$socio', '$tipoTramite', '$servicio', '$descripcion')";
        
        if(mysqli_query($conexion, $insertSql)){
          $response['success'] = "Trámite agregado exitosamente.";
        } else {
          $response['error'] = "Error al insertar el trámite.";
        }
      } else {
        $response['info'] = "El trámite ya existe.";
      }


      desconectar($conexion); 
    }
    // $uploadDir = __DIR__ . "/archivos/";
    // if (!is_dir($uploadDir)) {
    //     mkdir($uploadDir, 0777, true); // Creamos la carpeta si no existe
    // }

    // foreach ($_FILES['pdf']['name'] as $key => $fileName) {
    //     $tmpName = $_FILES['pdf']['tmp_name'][$key];
    //     $fileType = $_FILES['pdf']['type'][$key];
    //     $error = $_FILES['pdf']['error'][$key];

    //     if ($error !== UPLOAD_ERR_OK) {
    //         $response['error'] = "Error al subir el archivo: " . $fileName;
    //         echo json_encode($response);
    //         exit;
    //     }

    //     // Validamos que sea un archivo PDF
    //     if ($fileType !== 'application/pdf') {
    //         $response['error'] = "Solo se permiten archivos PDF. Archivo rechazado: " . $fileName;
    //         echo json_encode($response);
    //         exit;
    //     }

    //     // Movemos el archivo al directorio de destino
    //     $destPath = $uploadDir . "/" . basename($fileName);
    //     if (!move_uploaded_file($tmpName, $destPath)) {
    //         $response['error'] = "No se pudo guardar el archivo: " . $fileName;
    //         echo json_encode($response);
    //         exit;
    //     }
    // }

    // // Respuesta en caso de éxito
    // $response['success'] = "Archivos subidos correctamente.";
    // echo json_encode($response);
} else {
    // Respuesta para métodos que no sean POST
    http_response_code(405); // Método no permitido
    echo json_encode(['error' => 'Método no permitido.']);
}