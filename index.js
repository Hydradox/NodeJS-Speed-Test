import fs from 'fs';
import path from 'path';
import express from 'express';
import formidable from 'formidable';

import { Server } from 'socket.io';
import { createAdapter } from "@socket.io/cluster-adapter";
import { setupWorker } from "@socket.io/sticky";

const app = express();
const uploadedFiles = path.join(process.cwd(), '/uploaded_files');

var server = app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000 ...');
});

const io = new Server(server);
io.adapter(createAdapter());
setupWorker(io);

console.log(process.platform)

app.use(express.static(path.join(process.cwd(), '/public')));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/public/index.html');
});

app.post('/api/upload', (req, res) => {
  const form = formidable({
    uploadDir: uploadedFiles,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024 * 1024   // 50 GiB
  });

  var fileName,
    fileID = generateID(10);

  var lastProgress = new Date();
  var lastBytes = 0;

  var firstByte = new Date();
  var totalBytes;


  form.on('fileBegin', (formName, file) => {
    fileName = file.originalFilename;
  });


  form.parse(req, (err, fields, files) => {
    if (err) {
      return err;
    }
  });

  form.on('file', function (field, file) {
    //rename the incoming file to the file's name
    fs.rename(file.filepath, form.uploadDir + "/" + file.newFilename, () => {
      console.log('Done renaming ', file.newFilename);
    });
  });

  form.on('error', function (err) {
    console.log("an error has occured with form upload::", err);
  });

  form.on('aborted', function (err) {
    console.log("user aborted upload");
  });

  form.on('end', function () {
    io.emit('uploadProgress', fileID, fileName, 100, totalBytes / (new Date() - firstByte) * 1000);
    console.log('-> upload done');
  });


  form.on('progress', (bReceived, bExpected) => {
    var newProgress = new Date();
    var newBytes = bReceived;

    if(newProgress - lastProgress >= 50) {
      io.emit('uploadProgress', fileID, fileName, Math.round(bReceived / bExpected * 10000) / 100, (newBytes - lastBytes) * 1000 / (newProgress - lastProgress));

      totalBytes = bExpected;
      lastBytes = newBytes;
      lastProgress = new Date();
    }
  });
});


io.on('connection', (socket) => {
  console.log('Connected client!');

  // Disconnect listener
  socket.on('disconnect', function () {
    console.log('Client disconnected.');
  });
});



function generateID(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
