<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['folder']) && isset($_FILES['pdf']) && !empty($_FILES['pdf']['name'][0])) {
        $folderName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $_POST['folder']);
        $uploadDir = 'uploads/' . $folderName . '/';

        // Crear la carpeta si no existe
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        $uploadMessages = [];
        $errors = [];

        foreach ($_FILES['pdf']['name'] as $key => $name) {
            if ($_FILES['pdf']['error'][$key] === UPLOAD_ERR_OK) {
                $fileName = basename($name);
                $targetFilePath = $uploadDir . $fileName;

                // Mover el archivo cargado a la carpeta de destino
                if (move_uploaded_file($_FILES['pdf']['tmp_name'][$key], $targetFilePath)) {
                    $uploadMessages[] = 'Archivo subido correctamente: ' . htmlspecialchars($fileName);
                } else {
                    $errors[] = 'Error al guardar el archivo: ' . htmlspecialchars($fileName);
                }
            } else {
                $errors[] = 'Error en el archivo: ' . htmlspecialchars($name);
            }
        }

        if (!empty($uploadMessages)) {
            echo implode('<br>', $uploadMessages);
        }
        if (!empty($errors)) {
            http_response_code(500);
            echo implode('<br>', $errors);
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