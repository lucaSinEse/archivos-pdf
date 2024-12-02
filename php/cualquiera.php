<?php
// Conexión a la base de datos, si es necesario
include("conexion.php");

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $response = [];

    //? Recibimos los datos enviados por el formulario
    $checkbox = isset($_POST['checkbox']) ? $_POST['checkbox'] === 'true' : false;
    $socio = isset($_POST['socio']) ? trim($_POST['socio']) : null;
    $descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : null;
    $tipoTramite = isset($_POST['tipoTramite']) ? trim($_POST['tipoTramite']) : null;
    $servicio = isset($_POST['servicio']) ? trim($_POST['servicio']) : null;
    $cuenta = isset($_POST['cuenta']) ? trim($_POST['cuenta']) : null;
    $manzana = isset($_POST['manzana']) ? trim($_POST['manzana']) : null;
    $lote = isset($_POST['lote']) ? trim($_POST['lote']) : null;
    $folder = isset($_POST['folder']) ? trim($_POST['folder']) : null;

    echo $checkbox;

    //? Validación de campos obligatorios
    if (!$checkbox) {
        //? Si checkbox es false, validamos los campos mínimos
        if (empty($socio) || empty($descripcion) || empty($tipoTramite) || empty($servicio) ) {
            $response['error'] = "Faltan campos obligatorios: socio, descripcion,  tipo de trámite y servicio.";
            echo json_encode($response);
            exit;
        }
    } else {
        //? Si checkbox es true, validamos todos los campos
        if (empty($socio) || empty($descripcion) || empty($tipoTramite) || empty($servicio) || empty($cuenta) || empty($manzana) || empty($lote)) {
            $response['error'] = "Faltan campos obligatorios: socio, tipo de trámite, servicio, cuenta, manzana y lote.";
            echo json_encode($response);
            exit;
        }
    }

    //? Validación y procesamiento de archivos subidos
    var_dump($_FILES);
    if (!isset($_FILES['pdf']) || count($_FILES['pdf']['name']) == 0) {
      try {
        $response['error'] = "No se subieron archivos.";
        echo json_encode($response);
        exit;
      } catch (\Throwable $th) {
        echo "Catch";
      }  
    } else {
      echo "NO paso";
    }

    //? Validamos y guardamos cada archivo PDF
    // $conexion = conectar();
    // if(!$checkbox) {
    //   $sql = "SELECT * FROM `Archivos_Tramites` WHERE `ID_Socio` = '$socio' AND `ID_Servicio` = '$servicio' AND `ID_TipoTramite` = '$tipoTramite'";
    //   $result = mysqli_query($conexion, $sql);

    //   //? Si NO hay registros creamos el primero
    //   if(mysqli_num_rows($result) === 0) {
    //     $insertSql = "INSERT INTO `Archivos_Tramites` (`ID_Socio`, `ID_TipoTramite`, `ID_Servicio`,`ID_Usuario`, `Descripcion`)
    //                   VALUES ('$socio', '$tipoTramite', '$servicio', '1', '$descripcion')";
        
    //     if(mysqli_query($conexion, $insertSql)){
    //      //? Recuperamos el ID del trámite recién insertado
    //       $sql = "SELECT * FROM `Archivos_Tramites` ORDER BY `ID_Tramite` DESC LIMIT 1";
    //       $result = mysqli_query($conexion, $sql);

    //       if($result && mysqli_num_rows($result) > 0) {
    //         //? Cargamos el pdf. Obtenemos la info de Archivos_Tramites
            
    //         $row = mysqli_fetch_assoc($result);
    //         $idTramite = $row['ID_Tramite'];
    //         $idSocio = $row['ID_Socio'];
    //         $idTipoTramite = $row['ID_TipoTramite'];

    //         //? Obtenemos la descripcion de Archivos_TipoTramites
            
    //         $sqlTipoTramite = "SELECT `Descripcion` FROM `Archivos_TipoTramites` WHERE `ID_TipoTramite` = '$idTipoTramite'";
    //         $resultTipoTramite = mysqli_query($conexion, $sqlTipoTramite);

    //         //? Si obtenemos la descripcion de Archivos_TipoTramites hacemos el insert a Archivos_Pdf
    //         if($resultTipoTramite && mysqli_num_rows($resultTipoTramite) > 0) {

    //           $rowTipoTramite = mysqli_fetch_assoc($resultTipoTramite);
    //           $descripcionTipoTramite = $rowTipoTramite['Descripcion'];

    //           $pathArchivoBase = "Archivos/" . $idSocio;
    //           if (!is_dir($pathArchivoBase) && !mkdir($pathArchivoBase, 0777, true)) {
    //             $response['error'] = "Error al crear el directorio de almacenamiento.";
    //             echo json_encode($response);
    //             exit;
    //           }
              
    //           foreach ($_FILES['pdf']['name'] as $key => $originalNombreArchivo) {
    //             $nombreArchivo = $descripcionTipoTramite . "_" . uniqid() . "_$key.pdf";
    //             $pathArchivo = $pathArchivoBase . "/" . $nombreArchivo;
    //             $fecha = date("Y-m-d");
    //             $hora = date("H:i:s");

    //             if (move_uploaded_file($_FILES['pdf']['tmp_name'][$key], $pathArchivo)) {
    //               $sql = "INSERT INTO `Archivos_Pdf` (`ID_Tramite`, `ID_Usuario`, `Nombre`, `Path`, `Fecha`, `Hora`)
    //                   VALUES ('$idTramite', '1', '$nombreArchivo', '$pathArchivo', '$fecha', '$hora')";

    //               if (!mysqli_query($conexion, $sql)) {
    //                 $response['errors'][] = "Error al registrar el archivo $originalNombreArchivo en la base de datos.";
    //               }
    //             } else {
    //               $response['errors'][] = "Error al mover el archivo $originalNombreArchivo al directorio destino.";
    //             }
    //           }
    //           if (empty($response['errors'])) {
    //             $response['success'] = "Todos los archivos se cargaron y registraron correctamente.";
    //           }
    //         } else {
    //           $response['error'] = "No se pudo obtener la descripción del tipo de trámite.";
    //         }
    //       }

    //     } else {
    //       $response['error'] = "Error al insertar el trámite.";
    //     }
    //   } else {
    //     //? Logica pra cuando el tramite existe.
    //     $response['info'] = "El trámite ya existe.";
    //   }


    // } else {
    //   //? Logica para cuando el checkbox es true.
    // }
    // desconectar($conexion); 
} else {
    // Respuesta para métodos que no sean POST
    http_response_code(405); // Método no permitido
    echo json_encode(['error' => 'Método no permitido.']);
}