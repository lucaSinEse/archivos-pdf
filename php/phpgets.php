<?php

  require_once('./conection.php');

  if (isset($_POST['action']))
  {
    switch ($_POST['action'])
    {
      case 'ObtenerTipoTramites':
        ObtenerTipoTramites();
        break;

      case 'ObtenerTipoTramitesActivos':
        ObtenerTipoTramitesActivos();
        break;

      case 'ObtenerSocios':
        ObtenerSocios();
        break;
      
      case 'ObtenerCuentasSocio':
        $Id_Socio = $_POST['Id_Socio'];
        ObtenerCuentasSocio($Id_Socio);
        break;
      
      case 'ObtenerServicios':
        ObtenerServicios();
        break;

      case 'ObtenerTramites':
        $inputValue = $_POST['inputValue'];
        ObtenerTramites($inputValue);
        break;

      case 'ObtenerPdfDeTramites':
        $idtramite = $_POST['idtramite'];

        ObtenerPdfDeTramites($idtramite);
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
    $cadena="";
    while ($row = mysqli_fetch_array($result)) {
      $estado ="";
      if($row['Estado'] =='1'){
        $estado ="Activo";
      }else{
        $estado ="Inactivo";
      }
      $cadena = $cadena. "<tr>
            <td>".$row['Descripcion']."</td>
            <td>". $estado."</td>
            <td>
              <button 
              class=\"editar\"
              onclick=\"abrirDialogEditar('formularioEditar', '".$row['ID_TipoTramites']."','".$row['Estado']."', '".$row['Descripcion']."')\">Editar</button>
            </td>
          </tr>";
    }
    echo $cadena;
        
  desconectar($conexion); 
  }

  function ObtenerTipoTramitesActivos() {
    $conexion = conectar();

    $sql = "SELECT * FROM `Archivos_TipoTramites` WHERE `Estado` = 1"; 

    $result = mysqli_query($conexion, $sql);
    $cadena = "";

    while ($row = mysqli_fetch_array($result)) {
        $cadena .= "<option value='" . $row['ID_TipoTramites'] . "'>" . $row['Descripcion'] . "</option>";
    }
    echo $cadena;
    desconectar($conexion);
  }

  function ObtenerSocios() {
    
    $conexion = conectar();
    $sql = "SELECT * FROM `socios`";

    $result = mysqli_query($conexion, $sql);
    $cadena = "";
    while ($row = mysqli_fetch_array($result)) {
      $cadena = $cadena . "<option value='".$row['Id_Socio']."'>".$row['Nombre']."</option>";
    }
    echo $cadena;
    desconectar($conexion); 
  }

  function ObtenerCuentasSocio($Id_Socio) {
    $conexion = conectar();
    $sql = "SELECT * FROM `cuentas` WHERE `Id_Socio` = $Id_Socio";
    $result = mysqli_query($conexion, $sql);
    $cadena = "";

    while($row = mysqli_fetch_array($result) ) {
      $cadena = $cadena . "<option value='".$row['Id_Cuenta']."'>".$row['Id_Cuenta']."</option>";
    }
    echo $cadena;
    desconectar($conexion); 
  }

  function ObtenerServicios() {
    $conexion = conectar();
    $sql = "SELECT * FROM `servicios`";
    $result = mysqli_query($conexion, $sql);
    $cadena = "";

    while($row = mysqli_fetch_array($result) ) {
      $cadena = $cadena . "<option value='".$row['Id_Servicio']."'>".$row['Nombre']."</option>";
    }
    echo $cadena;
    desconectar($conexion); 
  }

  function ObtenerTramites($inputValue) {
    $conexion = conectar();
    $sql = "SELECT a.ID_Tramite, t.Descripcion DesTipoTramite, s.Nombre Servicio, a.Descripcion, a.ID_Socio, socio.Nombre, a.ID_Cuenta, a.NumeroManzana, a.NumeroLote
            FROM `Archivos_Tramites` AS `a`
            INNER JOIN `Archivos_TipoTramites` AS `t` ON a.ID_TipoTramite = t.ID_TipoTramites
            INNER JOIN `servicios` AS `s` ON a.ID_Servicio = s.Id_Servicio
            INNER JOIN `socios` AS `socio` ON a.ID_Socio = socio.Id_Socio
            WHERE `ID_Tramite` LIKE '%$inputValue%'
            OR t.Descripcion LIKE '%$inputValue%'
            OR s.Nombre LIKE '%$inputValue%'
            OR a.ID_Socio LIKE '%$inputValue%'
            OR socio.Nombre LIKE '%$inputValue%'
            OR `ID_Cuenta` LIKE '%$inputValue%'";
    
    $result = mysqli_query($conexion, $sql);

    if ($result) {
      $cadena = "";
      while ($row = mysqli_fetch_array($result)) {
          $cadena = $cadena . "<tr class='tipos'>
                                <td>". $row['ID_Tramite'] ."</td>
                                <td>". $row['DesTipoTramite'] ."</td>
                                <td>". $row['Servicio'] ."</td>
                                <td>". $row['Descripcion'] ."</td>
                                <td>
                                  ". $row['ID_Socio'] ."<br>
                                  ". $row['Nombre'] ."<br>
                                </td>
                                <td>
                                Cuenta: ". $row['ID_Cuenta'] ."<br>
                                Manzana: ". $row['NumeroManzana'] ."<br>
                                  Lote: ". $row['NumeroLote'] ."<br>
                                </td>
                                <td><a href='#' onclick='verPdf(". $row['ID_Tramite'] .")'>Ver PDF</a></td>
                              </tr>";
      }
      echo $cadena;
    } else {
        echo json_encode(["error" => "Error en la consulta: " . mysqli_error($conexion)]);
    }
    desconectar($conexion);
  }



  function ObtenerPdfDeTramites($idtramite) {
    $conexion = conectar();
    $sql = "SELECT * FROM `Archivos_Pdfs` WHERE `ID_Tramite` = $idtramite";
    $result = mysqli_query($conexion, $sql);
    $cadena = "";

    while($row = mysqli_fetch_array($result) ) {
      $cadena = $cadena . $row['Path']."///";
    }
    echo $cadena;
    desconectar($conexion); 
  }
?>