<?php

  require_once('./conection.php');

  if (isset($_POST['action']))
  {
    switch ($_POST['action'])
    {
      case 'ObtenerTipoTramites':
        ObtenerTipoTramites();
        break;
      
      default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
    }
  }

  function ObtenerTipoTramites() {
    ob_clean();
    $conexion = conectar();
    $sql = "SELECT * FROM `Archivos_TipoTramites`";

    $result = mysqli_query($conexion, $sql);

    if (!$result) 
    {
      echo json_encode([
          "success" => false,
          "error" => "Error al consultar la base de datos",
          "details" => mysqli_error($conexion),
      ]);
  } else {
    $tramites = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $tramites[] = $row;
        }

        echo json_encode([
            "success" => true,
            "data" => $tramites,
        ]);
  }
  desconectar($conexion); 
  }
?>