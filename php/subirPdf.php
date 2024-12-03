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
          if($result) {
            echo "se insertaron los datos en Archivos_Tramites \n";

            $conexion = conectar();
            $sql = "SELECT * FROM `Archivos_Tramites` ORDER BY `ID_Tramite` DESC LIMIT 1";
            $result = mysqli_query($conexion, $sql);
            desconectar($conexion);

            if($result && mysqli_num_rows($result) > 0) {
              echo "se obtuvieron los datos de Archivos_Tramites ";
              $row = mysqli_fetch_assoc($result);
              $idTramite = $row['ID_Tramite'];
              $idSocio = $row['ID_Socio'];
              $idTipoTramite = $row['ID_TipoTramite'];

              echo "Tramite: ".$idTramite. " socio: ".$idSocio. " tipoTramite". $idTipoTramite." ";

              $conexion = conectar();
              $sqlTipoTramite = "SELECT `Descripcion` FROM `Archivos_TipoTramites` WHERE `ID_TipoTramites` = '$idTipoTramite'";
              $resultTipoTramite = mysqli_query($conexion, $sqlTipoTramite);
              desconectar($conexion);
              if($resultTipoTramite && mysqli_num_rows($resultTipoTramite) > 0){
                echo "se obtuvieron los datos de Archivos_TipoTramites ";

                $rowTipoTramite = mysqli_fetch_assoc($resultTipoTramite);
                $descripcionTipoTramite = $rowTipoTramite['Descripcion'];
                echo $descripcionTipoTramite." ";

                $idSocio = intval($idSocio);
                $pathArchivoBase = "./../Archivos/" . $idSocio;
                echo "Ruta base: $pathArchivoBase "; 
                
                if (!is_dir($pathArchivoBase)) {
                  if (!mkdir($pathArchivoBase, 0777, true)) {
                      $errorMensaje = error_get_last();
                      $response['error'] = "Error al crear el directorio de almacenamiento: $pathArchivoBase. Detalles: " . $errorMensaje['message'];
                      echo json_encode($response);
                      exit;
                  }
                }
                echo "Por entrar al foreach ";

                $archivosExistentes = array_diff(scandir($pathArchivoBase), ['.', '..']);
                $contador = count($archivosExistentes); 
                foreach ($_FILES['pdf']['name'] as $key => $originalNombreArchivo) {
                  $contador++;
                  $nombreArchivo = $descripcionTipoTramite . "_" . $contador . ".pdf";
                  $pathArchivo = $pathArchivoBase . "/" . $nombreArchivo;
                  
                  if (move_uploaded_file($_FILES['pdf']['tmp_name'][$key], $pathArchivo)) {
                    echo "Por mover lospdf a la carpeta. ". $pathArchivo. " ";
                    $fecha = date("Y-m-d");
                    $hora = date("H:i:s");
                    $conexion = conectar();
                    $sql = "INSERT INTO `Archivos_Pdfs` 
                            (`ID_Tramite`, `ID_Usuario`, `Nombre`, `Path`, `Fecha`, `Hora`)
                            VALUES ('$idTramite', '1', '$nombreArchivo', '$pathArchivo', '$fecha', '$hora')";
                    $result = mysqli_query($conexion, $sql);
                    desconectar($conexion);

                    if($result) {
                      echo "Se registro el pdf en la base de datos. ";
                    } else {
                      $response['error'] = "Error al crear el registro de Archivos_Pdf.";
                      echo json_encode($response);
                      exit;
                    }
                  } else {
                    $response['error'] = "Error al mover el archivo: " . $originalNombreArchivo . " ";
                    http_response_code(500);
                    echo json_encode($response);
                    exit;
                  }
                }
              } else {
                $response['error'] = "No se obtuvieron los datos de Archivos_TipoTramites";
                http_response_code(500);
                echo json_encode($response);
                exit;
              }
            } else {
              $response['error'] = "No se obtuvieron los datos de Archivos_Tramites";
              http_response_code(500);
              echo json_encode($response);
              exit;
            }
          } else {
            $response['error'] = "No se insertaron los datos en Archivos_Tramites";
            http_response_code(500);
            echo json_encode($response);
            exit;
          }

        } else {
          //? Si hay registros seguimos creando mas;
          echo "hay registros en Archivos_Tramites \n";
          $row = mysqli_fetch_assoc($result);
          $idTramite = $row['ID_Tramite'];
          $idSocio = $row['ID_Socio'];
          $idTipoTramite = $row['ID_TipoTramite'];

          echo "Tramite: ".$idTramite. " socio: ".$idSocio. " tipoTramite". $idTipoTramite." ";

          $conexion = conectar();
          $sqlTipoTramite = "SELECT `Descripcion` FROM `Archivos_TipoTramites` WHERE `ID_TipoTramites` = '$idTipoTramite'";
          $resultTipoTramite = mysqli_query($conexion, $sqlTipoTramite);
          desconectar($conexion);
          echo "Se obtuvo la descripcion del tramite ";
          if($resultTipoTramite && mysqli_num_rows($resultTipoTramite) > 0) {
            echo "se obtuvieron los datos de Archivos_TipoTramites ";

            $rowTipoTramite = mysqli_fetch_assoc($resultTipoTramite);
            $descripcionTipoTramite = $rowTipoTramite['Descripcion'];
            echo $descripcionTipoTramite." ";

            $idSocio = intval($idSocio);
            $pathArchivoBase = "./../Archivos/" . $idSocio;
            echo "Ruta base: $pathArchivoBase ";

            echo "Por entrar al foreach ";

            $archivosExistentes = array_diff(scandir($pathArchivoBase), ['.', '..']);
            $contador = count($archivosExistentes); 
            foreach ($_FILES['pdf']['name'] as $key => $originalNombreArchivo) {
              $contador++;
              $nombreArchivo = $descripcionTipoTramite . "_" . $contador . ".pdf";
              $pathArchivo = $pathArchivoBase . "/" . $nombreArchivo;
              
              if(move_uploaded_file($_FILES['pdf']['tmp_name'][$key], $pathArchivo)) {
                echo "Archivo guardado en: " . $pathArchivo . " ";
                $conexion = conectar();
                $fecha = date("Y-m-d");
                $hora = date("H:i:s");

                $sql = "INSERT INTO `Archivos_Pdfs` 
                        (`ID_Tramite`, `ID_Usuario`, `Nombre`, `Path`, `Fecha`, `Hora`)
                        VALUES ('$idTramite', '1', '$nombreArchivo', '$pathArchivo', '$fecha', '$hora')";
                $result = mysqli_query($conexion, $sql);
                desconectar($conexion);

                if($result) {
                  echo "Se registro el PDF en la base de datos";
                } else {
                  $response['error'] = "Error al crear el registro de Archivos_Pdfs.";
                  echo json_encode($response);
                  exit;
                }
              }else {
                $response['error'] = "Error al mover el archivo: " . $originalNombreArchivo . " ";
                http_response_code(500);
                echo json_encode($response);
                exit;
              }
            }
          } else {
            $response['error'] = "No se obtuvieron los datos de Archivos_TipoTramites";
            http_response_code(500);
            echo json_encode($response);
            exit;
          }
        }
      }
    } else {
      //? Logica de cuando el checkbox es True;
      if (empty($socio) || empty($descripcion) || empty($tipoTramite) || empty($servicio) || empty($cuenta) || empty($manzana) || empty($lote)) {
        $response['error'] = "Faltan campos obligatorios: socio, tipo de trámite, servicio, cuenta, manzana y lote.";
        http_response_code(400);
        echo json_encode($response);
        exit;
      } else {
        //? logica cuando pasa las validaciones con checkbox true;
        $conexion = conectar();
        $sql = "SELECT * FROM `Archivos_Tramites` WHERE `ID_Socio` = '$socio' AND `ID_Servicio` = '$servicio' AND `ID_TipoTramite` = '$tipoTramite' AND `ID_Cuenta` = '$cuenta'";
        $result = mysqli_query($conexion, $sql);
        desconectar($conexion);

        if (mysqli_num_rows($result) === 0) {
          //? Si no hay registros creamos el primero
          echo "no hay registros en Archivos_Tramites \n";
          $fecha = date("Y-m-d");
          $hora = date("H:i:s");
          $conexion = conectar();
          $sql = "INSERT INTO `Archivos_Tramites` 
                  (`ID_Socio`, `ID_Cuenta`, `ID_TipoTramite`, `ID_Servicio`,`ID_Usuario`, `NumeroManzana`, `NumeroLote`, `Descripcion`, `Fecha`, `Hora`) 
                  VALUES ('$socio', '$cuenta', '$tipoTramite', '$servicio', '1', '$manzana', '$lote','$descripcion', '$fecha', '$hora')";
          $result = mysqli_query($conexion, $sql);
          desconectar($conexion);
          
          if($result) {
            echo "se insertaron los datos en Archivos_Tramites ";

            $conexion = conectar();
            $sql = "SELECT * FROM `Archivos_Tramites` ORDER BY `ID_Tramite` DESC LIMIT 1";
            $result = mysqli_query($conexion, $sql);
            desconectar($conexion);
            if($result && mysqli_num_rows($result) > 0){
              echo "se obtuvieron los datos de Archivos_Tramites ";
              $row = mysqli_fetch_assoc($result);
              $idTramite = $row['ID_Tramite'];
              $idSocio = $row['ID_Socio'];
              $idCuenta = $row['ID_Cuenta'];
              $idTipoTramite = $row['ID_TipoTramite'];

              echo "Tramite: ".$idTramite. " socio: ".$idSocio. "cuenta: ".$idCuenta." tipoTramite". $idTipoTramite." ";

              $conexion = conectar();
              $sqlTipoTramite = "SELECT `Descripcion` FROM `Archivos_TipoTramites` WHERE `ID_TipoTramites` = '$idTipoTramite'";
              $resultTipoTramite = mysqli_query($conexion, $sqlTipoTramite);
              desconectar($conexion);

              if($resultTipoTramite && mysqli_num_rows($resultTipoTramite) > 0) {
                echo "se obtuvo la descripcion de  Archivos_TipoTramites: ";
                $rowTipoTramite = mysqli_fetch_assoc($resultTipoTramite);
                $descripcionTipoTramite = $rowTipoTramite['Descripcion'];
                echo $descripcionTipoTramite." ";

                $idSocio = intval($idSocio);
                $idCuenta = intval($idCuenta);
                
                $pathArchivoBase = "./../Archivos/" . $idSocio."/".$idCuenta;
                echo "Ruta base: $pathArchivoBase ";

                if (!is_dir($pathArchivoBase)) {
                  if (!mkdir($pathArchivoBase, 0777, true)) {
                      $errorMensaje = error_get_last();
                      $response['error'] = "Error al crear el directorio de almacenamiento: $pathArchivoBase. Detalles: " . $errorMensaje['message'];
                      echo json_encode($response);
                      exit;
                  }
                }
                echo "Por entrar al foreach ";

                $archivosExistentes = array_diff(scandir($pathArchivoBase), ['.', '..']);
                $contador = count($archivosExistentes);
                foreach($_FILES['pdf']['name'] as $key => $originalNombreArchivo) {
                  $contador++;
                  $nombreArchivo = $descripcionTipoTramite . "_" . $contador . ".pdf";
                  $pathArchivo = $pathArchivoBase . "/" . $nombreArchivo;

                  if(move_uploaded_file($_FILES['pdf']['tmp_name'][$key], $pathArchivo)){
                    echo "Por mover lospdf a la carpeta. ". $pathArchivo. " ";
                    $fecha = date("Y-m-d");
                    $hora = date("H:i:s");
                    $conexion = conectar();
                    $sql = "INSERT INTO `Archivos_Pdfs` 
                            (`ID_Tramite`, `ID_Usuario`, `Nombre`, `Path`, `Fecha`, `Hora`)
                            VALUES ('$idTramite', '1', '$nombreArchivo', '$pathArchivo', '$fecha', '$hora')";
                    $result = mysqli_query($conexion, $sql);
                    desconectar($conexion);

                    if($result) {
                      echo "Se registro el pdf en la base de datos. ";
                    } else {
                      $response['error'] = "Error al crear el registro de Archivos_Pdf.";
                      echo json_encode($response);
                      exit;
                    }
                  } else {
                    $response['error'] = "Error al mover el archivo: " . $originalNombreArchivo . " ";
                    http_response_code(500);
                    echo json_encode($response);
                    exit;
                  }
                }
              } else {
                $response['error'] = "No se obtuvieron los datos de Archivos_TipoTramites";
                http_response_code(500);
                echo json_encode($response);
                exit;
              }

            } else {
              $response['error'] = "No se obtuvieron los datos de Archivos_Tramites";
              http_response_code(500);
              echo json_encode($response);
              exit;
            }
          } else {
            $response['error'] = "No se insertaron los datos en Archivos_Tramites";
            http_response_code(500);
            echo json_encode($response);
            exit;
          }
        } else {
          //? Si ya hay registros seguimos creando
          echo "hay registros en Archivos_Tramites \n";
          $row = mysqli_fetch_assoc($result);
          $idTramite = $row['ID_Tramite'];
          $idSocio = $row['ID_Socio'];
          $idTipoTramite = $row['ID_TipoTramite'];
          $idCuenta = $row['ID_Cuenta'];

          echo "Tramite: ".$idTramite. " socio: ".$idSocio. "cuenta: ".$idCuenta." tipoTramite". $idTipoTramite." ";

          $conexion = conectar();
          $sqlTipoTramite = "SELECT `Descripcion` FROM `Archivos_TipoTramites` WHERE `ID_TipoTramites` = '$idTipoTramite'";
          $resultTipoTramite = mysqli_query($conexion, $sqlTipoTramite);
          desconectar($conexion);
          if($resultTipoTramite && mysqli_num_rows($resultTipoTramite) > 0){
            echo "Se obtuvo la descripcion del tramite ";

            $rowTipoTramite = mysqli_fetch_assoc($resultTipoTramite);
            $descripcionTipoTramite = $rowTipoTramite['Descripcion'];
            echo $descripcionTipoTramite." ";

            $idSocio = intval($idSocio);
            $idCuenta = intval($idCuenta);
            
            $pathArchivoBase = "./../Archivos/" . $idSocio."/".$idCuenta;
            echo "Ruta base: $pathArchivoBase ";

            echo "Por entrar al foreach ";

            $archivosExistentes = array_diff(scandir($pathArchivoBase), ['.', '..']);
            $contador = count($archivosExistentes);
            foreach($_FILES['pdf']['name'] as $key => $originalNombreArchivo) {
              $contador++;
              $nombreArchivo = $descripcionTipoTramite . "_" . $contador . ".pdf";
              $pathArchivo = $pathArchivoBase . "/" . $nombreArchivo;

              if(move_uploaded_file($_FILES['pdf']['tmp_name'][$key], $pathArchivo)){
                echo "Archivo guardado en: " . $pathArchivo . " ";
                $conexion = conectar();
                $fecha = date("Y-m-d");
                $hora = date("H:i:s");

                $sql = "INSERT INTO `Archivos_Pdfs` 
                        (`ID_Tramite`, `ID_Usuario`, `Nombre`, `Path`, `Fecha`, `Hora`)
                        VALUES ('$idTramite', '1', '$nombreArchivo', '$pathArchivo', '$fecha', '$hora')";
                $result = mysqli_query($conexion, $sql);
                desconectar($conexion);

                if($result) {
                  echo "Se registro el PDF en la base de datos";
                } else {
                  $response['error'] = "Error al crear el registro de Archivos_Pdfs.";
                  echo json_encode($response);
                  exit;
                }
              } else {
                $response['error'] = "Error al mover el archivo: " . $originalNombreArchivo . " ";
                http_response_code(500);
                echo json_encode($response);
                exit;
              }
            }

          } else {
            $response['error'] = "No se obtuvieron los datos de Archivos_TipoTramites";
            http_response_code(500);
            echo json_encode($response);
            exit;
          }
        }
      }
    }
  } 
?>