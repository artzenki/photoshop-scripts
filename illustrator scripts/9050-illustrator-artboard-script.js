#target illustrator

function createCustomArtboards() {
    var width = 90;  // Width in mm
    var height = 50; // Height in mm
    var bleed = 3;   // Bleed in mm

    var pointWidth = width * 2.834645;
    var pointHeight = height * 2.834645;
    var pointBleed = bleed * 2.834645;

    var doc = app.documents.add(
        DocumentColorSpace.CMYK, 
        pointWidth, 
        pointHeight, 
        2,  
        DocumentArtboardLayout.GridByRow,
        10  
    );

    for (var i = 0; i < doc.artboards.length; i++) {
        doc.artboards[i].artboardRect = [
            0, 
            pointHeight, 
            pointWidth, 
            0
        ];
    }

    alert("Artboards created successfully!");
}

createCustomArtboards();