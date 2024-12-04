<?php
  require_once('./conection.php');

  $conexion = conectar();

  $sql = "SELECT * FROM `Archivos_TipoTramites` WHERE `Estado` = 1"; 

  $result = mysqli_query($conexion, $sql);
  $cadena = "";

  while ($row = mysqli_fetch_array($result)) {
      $cadena .= "<option value='" . $row['Descripcion'] . "'>" . $row['ID_TipoTramites'] . "</option>";
  }
  echo $cadena;

  
  desconectar($conexion);


?>