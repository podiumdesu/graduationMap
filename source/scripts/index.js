require('./lib/html2canvas/html2canvas.min.js');
$(document).mouseup(function(e) {
    var _area = $("#xlsx-standard");
    if (!_area.is(e.target) && _area.has(e.target).length === 0) {

        $("#xlsx-standard").fadeOut();
        $("#map-part").removeAttr("style","filter:blur(10px)");
    }
});

$("#closeStandard").click(function() {
    $("#xlsx-standard").fadeOut();
    $("#map-part").removeAttr("style","filter:blur(10px)");

})

$("#showStandard").click(function() {
    $("#xlsx-standard").fadeIn(1000);
    $("#map-part").attr("style","filter:blur(10px)");

});

$(function() {
    $("#downloadPic").click(function() {
        html2canvas($("#map-part"), {
            onrendered: function(canvas) {
                document.body.appendChild(canvas);

                // Convert and download as image
                Canvas2Image.saveAsPNG(canvas);
                $("#img-out").append(canvas);
                // Clean up
                //document.body.removeChild(canvas);
            }
        });
    });
});