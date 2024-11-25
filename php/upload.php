<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['folder']) && isset($_FILES['pdf']) && $_FILES['pdf']['error'] === UPLOAD_ERR_OK) {
        $folderName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $_POST['folder']); // Sanear el nombre de la carpeta
        $uploadDir = 'uploads/' . $folderName . '/';
        $fileName = basename($_FILES['pdf']['name']);
        $targetFilePath = $uploadDir . $fileName;

        // Crear la carpeta si no existe
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Mover el archivo cargado a la carpeta de destino
        if (move_uploaded_file($_FILES['pdf']['tmp_name'], $targetFilePath)) {
            echo 'Archivo subido correctamente en la carpeta: ' . htmlspecialchars($folderName);
        } else {
            http_response_code(500);
            echo 'Error al guardar el archivo.';
        }
    } else {
        http_response_code(400);
        echo 'Datos incompletos o archivo no válido.';
    }
} else {
    http_response_code(405);
    echo 'Método no permitido.';
}
?>