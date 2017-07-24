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

$("#addString").click(function () {
    var locationFrom = {"上海":[975,528],"武汉":[824,535],"北京":[882,351]};
    //var nowNode = $("#")
    var icons=$(".student-data-style");
    var svgNode = $("#svg-data");

    var svgDocument = svgNode[0].contentDocument;
    var paths=svgDocument.getElementById('path');
    console.log(paths);
    while(paths) {
        var parent = paths.parentNode;
        parent.removeChild(paths);
        paths = svgDocument.getElementById('path');
    }
    for(var i=0;i<icons.length;++i) {
        var location = $(icons[i]).attr('location');
        var width = locationFrom[location][0];
        var height = locationFrom[location][1];
        var pl = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
        var X = icons[i].offsetLeft - 40, Y = icons[i].offsetTop;
        console.log(X, Y);
        pl.attr('stroke', 'red');
        pl.attr('d', 'M' + width + ' ' + height + ',' + X + ' ' + Y + ' Z');
        pl.attr('fill', 'none');
        pl.attr('id','path');
        pl.attr('stroke-width', '3');
        var pl2 = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
        pl2.attr('stroke', 'red');
        pl2.attr('d', 'M' + X + ' ' + Y + ',' + (X + 40) + ' ' + Y + ' Z');
        pl2.attr('fill', 'none');
        pl2.attr('id','path');
        pl2.attr('stroke-width', '3');

        svgDocument.rootElement.appendChild(pl.get(0));
        svgDocument.rootElement.appendChild(pl2.get(0));
    }

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