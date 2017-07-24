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

        var svgObj = $("#svg-data");

        var canvas2 = document.createElement("canvas");
        canvas2.setAttribute("class","previewPic");
        canvas2.height = $(svgObj).height();
        canvas2.width = $(svgObj).width();

        var ctx = canvas2.getContext("2d");

        var img = new Image();


        img.onload = function() {
            ctx.drawImage(img, 0, 0);

        html2canvas($("#map-part"), {
            onrendered: function(canvas) {

                document.body.appendChild(canvas);
                $(svgObj).show();
                $(canvas2).remove();

                // Convert and download as image
                // Canvas2Image.saveAsPNG(canvas);
                // $("#img-out").append(canvas);
                // Clean up
                //document.body.removeChild(canvas);
            },
            //height:canvas2.height,
            //width:canvas2.width,
        });

        }
        

        img.src = document.getElementById("svg-data").data;

        $(canvas2).insertAfter(svgObj);
        console.log(svgObj);
        $(svgObj).hide();
        //document.body.appendChild(canvas2);
    });
});