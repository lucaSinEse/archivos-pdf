<?php

require_once('./conection.php');

if (isset($_POST['action'])) 
{
    switch ($_POST['action']) 
    {
        case 'EditarTipotramite':
            $descripcion = $_POST['descripcion'];
            $estado = $_POST['estado'];
            $idtipotramite = $_POST['idtipotramite'];
            
            EditarTipoTramite($descripcion,$estado,$idtipotramite);
            break;

        case 'ejemplo':
            //getcuentas();

            break;
   
        default:
            # code...
            break;
    }

}
function EditarTipoTramite($descripcion,$estado,$idtipotramite)
{
    ob_clean();
    $conexion = conectar();
    $sql2 = "SELECT * FROM `Archivos_TipoTramites` WHERE `Descripcion` = '{$descripcion}' and `Archivos_TipoTramites`.`ID_TipoTramites` <> ".$idtipotramite.";";
    $res = mysqli_query($conexion, $sql2);
    if ($fila = mysqli_fetch_row($res)) {
        echo "esta";
    } else {
        $SQL = "UPDATE `Archivos_TipoTramites` SET `Descripcion` = '".$descripcion."', `Estado` = ".$estado." WHERE `Archivos_TipoTramites`.`ID_TipoTramites` = ".$idtipotramite.";";
        /* s */
        if (mysqli_query($conexion, $SQL)) {
            echo "modificado";
        } else {
            echo "no modificado";
        }
    }

    desconectar($conexion);
   
}

?>