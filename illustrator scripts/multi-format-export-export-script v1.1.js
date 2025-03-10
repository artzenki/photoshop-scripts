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
            method: function(file, useExport, perArtboard) { 
                if (useExport) {
                    var pdfOptions = new PDFSaveOptions();
                    if (perArtboard) {
                        pdfOptions.artboardRange = "all";
                        var options = new ExportOptionsPDF();
                        options.generateThumbnails = true;
                        doc.exportFile(file, ExportType.PDF, options);
                    } else {
                        doc.exportFile(file, ExportType.PDF, pdfOptions);
                    }
                } else {
                    var pdfOptions = new PDFSaveOptions();
                    doc.saveAs(file, pdfOptions); 
                }
            }
        },
        { 
            name: "Illustrator", 
            ext: 'ai', 
            method: function(file, useExport, perArtboard) { 
                // AI files can only be saved, not exported
                var aiOptions = new IllustratorSaveOptions(); 
                doc.saveAs(file, aiOptions); 
            }
        },
        { 
            name: "EPS", 
            ext: 'eps', 
            method: function(file, useExport, perArtboard) { 
                if (useExport && perArtboard) {
                    var options = new ExportOptionsEPS();
                    options.saveMultipleArtboards = true;
                    options.artboardRange = "all";
                    doc.exportFile(file, ExportType.EPS, options);
                } else {
                    var epsOptions = new EPSSaveOptions(); 
                    doc.saveAs(file, epsOptions); 
                }
            }
        },
        { 
            name: "TIFF", 
            ext: 'tif', 
            method: function(file, useExport, perArtboard) { 
                var tiffOptions = new ExportOptionsTIFF();
                // Fix for TIFF export error - properly set artboard settings
                if (perArtboard) {
                    tiffOptions.saveMultipleArtboards = true;
                    tiffOptions.artboardRange = "all"; // This is the correct syntax for TIFF
                } else {
                    // Export only the active artboard when not using per-artboard option
                    tiffOptions.saveMultipleArtboards = false;
                }
                doc.exportFile(file, ExportType.TIFF, tiffOptions); 
            }
        },
        { 
            name: "JPEG", 
            ext: 'jpg', 
            method: function(file, useExport, perArtboard) { 
                var jpgOptions = new ExportOptionsJPEG();
                jpgOptions.artBoardClipping = true;
                jpgOptions.qualitySetting = 80;
                if (perArtboard) {
                    jpgOptions.saveMultipleArtboards = true;
                    jpgOptions.artboardRange = "all";
                }
                doc.exportFile(file, ExportType.JPEG, jpgOptions); 
            }
        },
        { 
            name: "PNG", 
            ext: 'png', 
            method: function(file, useExport, perArtboard) { 
                var pngOptions = new ExportOptionsPNG24();
                pngOptions.artBoardClipping = true;
                pngOptions.transparency = true;
                if (perArtboard) {
                    pngOptions.saveMultipleArtboards = true;
                    pngOptions.artboardRange = "all";
                }
                doc.exportFile(file, ExportType.PNG24, pngOptions); 
            }
        },
        { 
            name: "SVG", 
            ext: 'svg', 
            method: function(file, useExport, perArtboard) { 
                var svgOptions = new ExportOptionsSVG();
                svgOptions.embedAllFonts = true;
                svgOptions.cssProperties = SVGCSSPropertyLocation.STYLEATTRIBUTES;
                if (perArtboard) {
                    svgOptions.saveMultipleArtboards = true;
                    svgOptions.artboardRange = "all";
                }
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
    
    // Add global options
    dialog.add("statictext", undefined, "Options:");
    var useExportCheckbox = dialog.add("checkbox", undefined, "Use Export instead of Save (when possible)");
    var perArtboardCheckbox = dialog.add("checkbox", undefined, "Export individual artboards (when possible)");
    var separateFoldersCheckbox = dialog.add("checkbox", undefined, "Save each format in its own folder");
    
    // Add button panel
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
    
    // Get options
    var useExport = useExportCheckbox.value;
    var perArtboard = perArtboardCheckbox.value;
    var useSeparateFolders = separateFoldersCheckbox.value;
    
    // Create folders if needed
    if (useSeparateFolders) {
        for (var i = 0; i < selectedFormats.length; i++) {
            var format = selectedFormats[i];
            var formatFolder = new Folder(folderPath + '/' + baseFileName + '-' + format.ext.toUpperCase());
            if (!formatFolder.exists) {
                formatFolder.create();
            }
        }
    }
    
    // Export selected formats
    var successCount = 0;
    var errorMessages = [];
    
    for (var i = 0; i < selectedFormats.length; i++) {
        try {
            var format = selectedFormats[i];
            var newFileName = baseFileName + '.' + format.ext;
            var targetFolder = folderPath;
            
            // If using separate folders, update the target folder
            if (useSeparateFolders) {
                targetFolder = folderPath + '/' + baseFileName + '-' + format.ext.toUpperCase();
            }
            
            var saveFile = File(targetFolder + '/' + newFileName);
            
            // Call the method with option flags
            format.method(saveFile, useExport, perArtboard);
            successCount++;
        } catch (e) {
            var errorMsg = "Error exporting " + format.name + ": " + e;
            errorMessages.push(errorMsg);
            alert(errorMsg);
        }
    }
    
    if (successCount > 0) {
        alert(successCount + " file(s) exported successfully!");
    }
    
    // Show all errors at the end if there were any
    if (errorMessages.length > 0) {
        alert("Some formats failed to export. Check the console for details.");
    }
}

exportDocuments();