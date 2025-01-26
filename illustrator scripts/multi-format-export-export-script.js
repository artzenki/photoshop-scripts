#target illustrator

function exportDocuments() {
    var doc = app.activeDocument;
    var originalFilePath = doc.fullName;
    var folderPath = originalFilePath.parent;
    var baseFileName = doc.name.replace(/\.[^\.]+$/, '');

    // Export formats with specific export methods
    var exportFormats = [
        { 
            ext: 'pdf', 
            method: function(file) { 
                var pdfOptions = new PDFSaveOptions(); 
                doc.saveAs(file, pdfOptions); 
            }
        },
        { 
            ext: 'ai', 
            method: function(file) { 
                var aiOptions = new IllustratorSaveOptions(); 
                doc.saveAs(file, aiOptions); 
            }
        },
        { 
            ext: 'eps', 
            method: function(file) { 
                var epsOptions = new EPSSaveOptions(); 
                doc.saveAs(file, epsOptions); 
            }
        },
        { 
            ext: 'tif', 
            method: function(file) { 
                var tiffOptions = new ExportOptionsTIFF();
                tiffOptions.artboardRange = '1-' + doc.artboards.length;
                tiffOptions.saveMultipleArtboards = true;
                doc.exportFile(file, ExportType.TIFF, tiffOptions); 
            }
        }
    ];

    for (var i = 0; i < exportFormats.length; i++) {
        var format = exportFormats[i];
        var newFileName = baseFileName + '-' + format.ext.toUpperCase() + '.' + format.ext;
        var saveFile = File(folderPath + '/' + newFileName);

        format.method(saveFile);
    }

    alert("All files exported successfully!");
}

exportDocuments();