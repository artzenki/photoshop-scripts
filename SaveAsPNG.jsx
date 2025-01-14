// Save opened documents as PNG
(function() {
  // Check if there are open documents
  if (documents.length > 0) {
      // Turn off dialogs
      app.displayDialogs = DialogModes.NO;
      
      // Loop through all open documents
      for (var i = 0; i < documents.length; i++) {
          // Get current document
          var currentDoc = documents[i];
          app.activeDocument = currentDoc;
          
          // Get the current file path and name
          var currentPath = currentDoc.path;
          var currentName = currentDoc.name.replace(/\.[^\.]+$/, '');
          
          // Create PNG save options
          var pngSaveOptions = new PNGSaveOptions();
          pngSaveOptions.compression = 0; // 0-9, 0 = none, 9 = maximum
          pngSaveOptions.interlaced = false;
          
          // Create new file path with PNG extension
          var saveFile = new File(currentPath + "/" + currentName + ".png");
          
          // Save the document
          currentDoc.saveAs(saveFile, pngSaveOptions, true);
      }
      
      // Turn dialogs back on
      app.displayDialogs = DialogModes.ALL;
      
      alert("All documents have been saved as PNG files!");
  } else {
      alert("No documents are open!");
  }
})();