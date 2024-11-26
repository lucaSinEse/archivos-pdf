
<?php

require_once('./conection.php');

if (isset($_POST['action'])) 
{
    switch ($_POST['action']) 
    {
        case 'GuardarTipoTramite':
            $descripcion = $_POST['Descripcion'];
            $estado = $_POST['estado'];
            
            GuardarTipoTramite($descripcion,$estado);
            break;

        case 'Obtenercuentas':
            //getcuentas();

            break;
   
        default:
            # code...
            break;
    }

}
function GuardarTipoTramite($descripcion,$estado)
{
    $conexion = conectar();
    $sql2 = "SELECT * FROM `Archivos_TipoTramites` WHERE `Descripcion` = '{$descripcion}'";
    $res = mysqli_query($conexion, $sql2);
    if ($fila = mysqli_fetch_row($res)) {
        echo "esta";
    } else {
        $SQL = "INSERT INTO `Archivos_TipoTramites` (`Descripcion`, `estado`) VALUES ('{$descripcion}', {$estado})";
        
        if (mysqli_query($conexion, $SQL)) {
            echo "guardado";
        } else {
            echo "no guardado";
        }
    }

    desconectar($conexion);
   
}

?>