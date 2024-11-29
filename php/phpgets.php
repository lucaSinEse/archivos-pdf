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
  
      case 'ObtenerTipoTramitesLista':
        ObtenerTipoTramitesLista();
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
?>