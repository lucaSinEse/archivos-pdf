<?php
  require_once('./conection.php');
  ini_set('display_errors', 1);
  ini_set('display_startup_errors', 1);
  error_reporting(E_ALL);

  if($_SERVER['REQUEST_METHOD'] == 'POST') {
    
    //? Validaciones
    $checkbox = isset($_POST['checkbox']) ? $_POST['checkbox'] === 'true' : false;
    $socio = isset($_POST['socio']) ? trim($_POST['socio']) : null;
    $descripcion = isset($_POST['descripcion']) ? trim($_POST['descripcion']) : null;
    $tipoTramite = isset($_POST['tipoTramite']) ? trim($_POST['tipoTramite']) : null;
    $servicio = isset($_POST['servicio']) ? trim($_POST['servicio']) : null;
    $cuenta = isset($_POST['cuenta']) ? trim($_POST['cuenta']) : null;
    $manzana = isset($_POST['manzana']) ? trim($_POST['manzana']) : null;
    $lote = isset($_POST['lote']) ? trim($_POST['lote']) : null;
    $folder = isset($_POST['folder']) ? trim($_POST['folder']) : null;

    if(!isset($_FILES['pdf']) || !isset($_FILES['pdf']['name'])) {
      $response['error'] = "Faltan los pdfs.";
      http_response_code(400);
      echo json_encode($response);
      exit;
    }

    if(!$checkbox) {
      if(empty($socio) || empty($descripcion) || empty($tipoTramite) || empty($servicio)) {
        $response['error'] = "Faltan campos obligatorios: socio, descripcion, tipo de tramite y servicio.";
        http_response_code(400);
        echo json_encode($response);
        exit;
      } else {
        //? logica cuando pasa las validaciones con checkbox false;
        $conexion = conectar();
        $sql = "SELECT * FROM `Archivos_Tramites` WHERE `ID_Socio` = '$socio' AND `ID_Servicio` = '$servicio' AND `ID_TipoTramite` = '$tipoTramite'";
        $result = mysqli_query($conexion, $sql);
        desconectar($conexion);

        if (mysqli_num_rows($result) === 0){
          //? Si NO hay registros creamos el primero;
          echo "no hay registros en Archivos_Tramites \n";
          $fecha = date("Y-m-d");
          $hora = date("H:i:s");
          $conexion = conectar();
          $sql = "INSERT INTO `Archivos_Tramites` 
                  (`ID_Socio`, `ID_TipoTramite`, `ID_Servicio`,`ID_Usuario`, `Descripcion`, `Fecha`, `Hora`) 
                  VALUES ('$socio', '$tipoTramite', '$servicio', '1', '$descripcion', '$fecha', '$hora')";

          $result = mysqli_query($conexion, $sql);
          desconectar($conexion);
          if(mysqli_num_rows($result) > 0) {
            echo "se insertaron los datos en Archivos_Tramites";
          } else {
            $response['error'] = "No se insertaron los datos en Archivos_Tramites";
            http_response_code(500);
            echo json_encode($response);
            exit;
          }

        } else {
          //? Si hay registros seguimos creando mas;
          echo "hay registros en Archivos_Tramites \n";
          while($row = mysqli_fetch_array($result)) {
            echo json_encode($row) . "\n";
          }
        }
      }
    } else {
      //? Logica de cuando el checkbox es True;
      if (empty($socio) || empty($descripcion) || empty($tipoTramite) || empty($servicio) || empty($cuenta) || empty($manzana) || empty($lote)) {
        $response['error'] = "Faltan campos obligatorios: socio, tipo de trámite, servicio, cuenta, manzana y lote.";
        http_response_code(400);
        echo json_encode($response);
      } else {
        //? logica cuando pasa las validaciones con checkbox true;
      }
    }
  } 
?>