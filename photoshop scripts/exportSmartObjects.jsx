// Export Smart Objects to PSB files
(function() {
    if (!documents.length) {
        alert("No documents are open!");
        return;
    }

    // Get active document
    var doc = app.activeDocument;
    var processedCount = 0;
    
    // Create folder for exported smart objects if it doesn't exist
    var exportFolder = new Folder(doc.path + "/exported_smart_objects");
    if (!exportFolder.exists) {
        exportFolder.create();
    }
    
    // Process layers in a set (recursive function)
    function processLayerSet(layerSet) {
        for (var i = 0; i < layerSet.layers.length; i++) {
            var layer = layerSet.layers[i];
            
            // Process groups recursively
            if (layer.typename === "LayerSet") {
                processLayerSet(layer);
            }
            // Process smart objects
            else if (layer.kind === LayerKind.SMARTOBJECT) {
                // Make layer active
                doc.activeLayer = layer;
                
                // Get layer name (clean up invalid characters)
                var layerName = layer.name.replace(/[^a-zA-Z0-9]/g, "_");
                
                $.writeln("Processing: " + layer.name);
                
                try {
                    // Edit smart object contents
                    executeAction(stringIDToTypeID("placedLayerEditContents"), undefined, DialogModes.NO);
                    
                    // Save smart object content
                    var smartDoc = app.activeDocument;
                    
                    // Create file path with index to prevent overwrites
                    var basePath = exportFolder + "/" + layerName;
                    var filePath = new File(basePath + ".psb");
                    var fileIndex = 1;
                    
                    // Add number if filename already exists
                    while (filePath.exists) {
                        filePath = new File(basePath + "_" + fileIndex + ".psb");
                        fileIndex++;
                    }
                    
                    // Save as PSB
                    var saveOptions = new PhotoshopSaveOptions();
                    saveOptions.embedColorProfile = true;
                    saveOptions.maximizeCompatibility = true;
                    
                    smartDoc.saveAs(filePath, saveOptions, true);
                    smartDoc.close(SaveOptions.DONOTSAVECHANGES);
                    
                    processedCount++;
                    
                } catch(e) {
                    $.writeln("Error with layer: " + layer.name + "\nError: " + e);
                }
            }
        }
    }
    
    // Start processing from the root
    processLayerSet(doc);
    
    alert("Export complete!\nExported " + processedCount + " Smart Objects\nLocation: " + exportFolder);
})();