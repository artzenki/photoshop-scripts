function exportDocuments() {
    var doc = app.activeDocument;
    var originalFilePath = doc.fullName;
    var folderPath = originalFilePath.parent;
    var baseFileName = doc.name.replace(/\.[^\.]+$/, '');

    // Define all available export formats
    var exportFormats = [
        { 
            name: "PDF", 
            ext: 'pdf', 
            method: function(file) { 
                var pdfOptions = new PDFSaveOptions(); 
                doc.saveAs(file, pdfOptions); 
            }
        },
        { 
            name: "Illustrator", 
            ext: 'ai', 
            method: function(file) { 
                var aiOptions = new IllustratorSaveOptions(); 
                doc.saveAs(file, aiOptions); 
            }
        },
        { 
            name: "EPS", 
            ext: 'eps', 
            method: function(file) { 
                var epsOptions = new EPSSaveOptions(); 
                doc.saveAs(file, epsOptions); 
            }
        },
        { 
            name: "TIFF", 
            ext: 'tif', 
            method: function(file) { 
                var tiffOptions = new ExportOptionsTIFF();
                tiffOptions.artboardRange = '1-' + doc.artboards.length;
                tiffOptions.saveMultipleArtboards = true;
                doc.exportFile(file, ExportType.TIFF, tiffOptions); 
            }
        },
        { 
            name: "JPEG", 
            ext: 'jpg', 
            method: function(file) { 
                var jpgOptions = new ExportOptionsJPEG();
                jpgOptions.artBoardClipping = true;
                jpgOptions.qualitySetting = 80;
                doc.exportFile(file, ExportType.JPEG, jpgOptions); 
            }
        },
        { 
            name: "PNG", 
            ext: 'png', 
            method: function(file) { 
                var pngOptions = new ExportOptionsPNG24();
                pngOptions.artBoardClipping = true;
                pngOptions.transparency = true;
                doc.exportFile(file, ExportType.PNG24, pngOptions); 
            }
        },
        { 
            name: "SVG", 
            ext: 'svg', 
            method: function(file) { 
                var svgOptions = new ExportOptionsSVG();
                svgOptions.embedAllFonts = true;
                svgOptions.cssProperties = SVGCSSPropertyLocation.STYLEATTRIBUTES;
                doc.exportFile(file, ExportType.SVG, svgOptions); 
            }
        }
    ];

    // Create selection dialog
    var dialog = new Window("dialog", "Export Formats");
    dialog.orientation = "column";
    dialog.alignChildren = "left";
    
    // Add title
    dialog.add("statictext", undefined, "Select export formats:");
    
    // Add checkboxes for each format
    var checkboxes = [];
    for (var i = 0; i < exportFormats.length; i++) {
        checkboxes.push(dialog.add("checkbox", undefined, exportFormats[i].name));
    }
    
    // Add buttons
    var buttonGroup = dialog.add("group");
    buttonGroup.orientation = "row";
    buttonGroup.alignment = "center";
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    var okButton = buttonGroup.add("button", undefined, "OK", {name: "ok"});
    
    // Select all button
    var selectAllButton = dialog.add("button", undefined, "Select All");
    selectAllButton.onClick = function() {
        for (var i = 0; i < checkboxes.length; i++) {
            checkboxes[i].value = true;
        }
    };
    
    // Handle button clicks
    cancelButton.onClick = function() {
        dialog.close();
        return false;
    };
    
    // Show dialog
    dialog.show();
    
    // Check which formats were selected
    var selectedFormats = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].value) {
            selectedFormats.push(exportFormats[i]);
        }
    }
    
    // If no formats selected, exit
    if (selectedFormats.length === 0) {
        alert("No export formats selected. Operation cancelled.");
        return;
    }
    
    // Export selected formats
    var successCount = 0;
    for (var i = 0; i < selectedFormats.length; i++) {
        try {
            var format = selectedFormats[i];
            var newFileName = baseFileName + '-' + format.ext.toUpperCase() + '.' + format.ext;
            var saveFile = File(folderPath + '/' + newFileName);
            
            format.method(saveFile);
            successCount++;
        } catch (e) {
            alert("Error exporting " + format.name + ": " + e);
        }
    }
    
    if (successCount > 0) {
        alert(successCount + " file(s) exported successfully!");
    }
}

exportDocuments();