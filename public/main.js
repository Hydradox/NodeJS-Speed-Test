var socket = io.connect();
var fileForm = document.getElementById('upload-text'),
    files = document.getElementById('files');

var uploadTag = document.getElementById('uploading-files');

socket.on('uploadProgress', function(id, fileName, percentage, bytes) {
    var element = document.getElementById(id);

    if(element == null) { // Doesn't exist
        uploadTag.innerHTML += '<li id="' + id + '"><progress min="0" max="100" value="' + percentage + '"></progress> ('
            + Math.round((bytes / 1000000) * 100) / 100 + ' MB/s - ' + Math.round((bytes / 125000) * 100) / 100 + ' Mb/s' + ') ' + fileName + '</li>';

    } else { // Already exists
        element.innerHTML = '<progress min="0" max="100" value="' + percentage + '"></progress>' + percentage + '% || ('
        + Math.round((bytes / 1000000) * 100) / 100 + ' MB/s - ' + Math.round((bytes / 125000) * 100) / 100 + ' Mb/s' + ' Mb/s' + ') ' + fileName;
    }
});




fileForm.addEventListener('submit', (e) => {
    e.preventDefault(); //This will prevent the default click action

    for(var i = 0; i < files.files.length; i++) {
        var formData = new FormData();

        formData.append('fileName', files.files[i]);

        fetch(e.target.getAttribute('action'), {
            method: e.target.getAttribute('method'),
            body: formData
        })
        .then((res) => {
            if(res.ok)
                console.log('GOOD: ', res);
            else
                console.log('ERR1: ', res);
        })
        .catch((err) => {
            console.log('ERR2: ', err);
        });
    }
});


/**
 * TODO:
 * Probar a dividir los ficheros
 * en distintos FETCH para para
 * trackear el progreso de cada
 * uno individualmente.
 */