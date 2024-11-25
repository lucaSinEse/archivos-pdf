const fileInput = document.querySelector('#inppdf');
var srcPdf = new Array();

/*document.querySelector('#btn-enviar').addEventListener('click', (e) => {
    e.preventDefault();
     $.ajax({
        type: "POST",
        url: "./php/Guardarimg.php",
        // data: datos,
        data: {
            
            srcImg
        },
        success: function(data) {
            console.log(data);
            reclamoCreado.innerHTML = '<h2 style="color:white;">Se cargo correctamente</h2>';
            reclamoCreado.style.display = 'block';
        }
    }); 
    });
    */
    document.getElementById('uploadBtn').addEventListener('click', function() {
        const folderInput = document.getElementById('folderName');
        const fileInput = document.getElementById('pdfFile');
        const folderName = folderInput.value.trim();
        const file = fileInput.files[0];

        if (!folderName) {
            alert('Por favor, ingresa un nombre para la carpeta.');
            return;
        }

        if (!file) {
            alert('Por favor, selecciona un archivo PDF.');
            return;
        }

        if (file.type !== 'application/pdf') {
            alert('Solo se permiten archivos PDF.');
            return;
        }

        const formData = new FormData();
        formData.append('pdf', file);
        formData.append('folder', folderName);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', './php/upload.php', true);

        xhr.onload = function() {
            const messageDiv = document.getElementById('message');
            if (xhr.status === 200) {
                messageDiv.textContent = 'Archivo subido correctamente.';
                
                //guardar en base de datos 
            } else {
                messageDiv.textContent = 'Error al subir el archivo.';
                messageDiv.style.color = 'red';
            }
        };

        xhr.onerror = function() {
            alert('Hubo un error al enviar el archivo.');
        };

        xhr.send(formData);
    });
