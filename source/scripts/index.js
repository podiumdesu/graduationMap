require('./lib/html2canvas/html2canvas.min.js');
$(document).mouseup(function (e) {
    var _area = $("#xlsx-standard");
    if (!_area.is(e.target) && _area.has(e.target).length === 0) {

        $("#xlsx-standard").fadeOut();
        $("#map-part").removeAttr("style", "filter:blur(10px)");
    }
});

$("#closeStandard").click(function () {
    $("#xlsx-standard").fadeOut();
    $("#map-part").removeAttr("style", "filter:blur(10px)");

})

$("#showStandard").click(function () {
    $("#xlsx-standard").fadeIn(1000);
    $("#map-part").attr("style", "filter:blur(10px)");

});

$("#addString").click(function () {
    var locationFrom = {
        "上海": [975, 528],
        "湖北": [824, 535],
        "北京": [882, 351],
        "天津": [882, 351],
        "新疆": [429, 300],
        "内蒙古": [784, 326],
        "黑龙江": [1041, 230],
        "吉林": [1041, 230],
        "辽宁": [995, 310],
        "河北": [882, 351],
        "陕西": [765, 460],
        "甘肃": [689, 437],
        "青海": [587, 422],
        "西藏": [418, 498],
        "山东": [914, 430],
        "四川": [654, 549],
        "山西": [834, 470],
        "江苏": [962, 487],
        "浙江": [962, 550],
        "福建": [962, 616],
        "广东": [852, 704],
        "广西": [768, 683],
        "云南": [617, 661],
        "海南": [794, 783],
        "台湾": [997, 676],
        "湖南": [815, 608],
        "安徽": [901, 512],
        "重庆": [741, 555],
        "贵州": [727, 618],
        "江西": [882, 616],
    };
    //var nowNode = $("#")
    var icons = $(".student-data-style");
    var svgNode = $("#svg-data");
    //console.log(icons);
    var svgDocument = svgNode[0].contentDocument;
    var paths = svgDocument.getElementById('path');
    //console.log(paths);
    while (paths) {
        var parent = paths.parentNode;
        parent.removeChild(paths);
        paths = svgDocument.getElementById('path');
    }
    //console.log(icons[0]);
    for (var i = 0; i < icons.length; ++i) {
        var location = $(icons[i]).attr('location');
        if (!(location in locationFrom))
            continue;
        var width = locationFrom[location][0];
        var height = locationFrom[location][1];
        var pl = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
        var pl2 = $(document.createElementNS('http://www.w3.org/2000/svg', 'path'));
        var left = $(icons[i]).css("left"), top = $(icons[i]).css("top");
        var X = parseInt(left.substr(0, left.length - 2)) / 0.7625,
            Y = (parseInt(top.substr(0, top.length - 2)) + $(icons[i]).height() / 2) / 0.7625;
        //console.log($(icons[i]).css("left"));
        //console.log(X, Y);
        if (X > width) {
            pl.attr('stroke', 'black');
            pl.attr('d', 'M' + width + ' ' + height + ',' + (X - 40) + ' ' + Y + ' Z');
            pl.attr('fill', 'none');
            pl.attr('id', 'path');
            pl.attr('stroke-width', '1');
            pl2.attr('stroke', 'black');
            pl2.attr('d', 'M' + (X - 40) + ' ' + Y + ',' + X + ' ' + Y + ' Z');
            pl2.attr('fill', 'none');
            pl2.attr('id', 'path');
            pl2.attr('stroke-width', '1');
        }
        else {
            pl.attr('stroke', 'black');
            pl.attr('d', 'M' + width + ' ' + height + ',' + (X + $(icons[i]).width() / 0.7625 + 40) + ' ' + Y + ' Z');
            pl.attr('fill', 'none');
            pl.attr('id', 'path');
            pl.attr('stroke-width', '1');
            pl2.attr('stroke', 'black');
            pl2.attr('d', 'M' + (X + $(icons[i]).width() / 0.7625 + 40) + ' ' + Y + ',' + X + ' ' + Y + ' Z');
            pl2.attr('fill', 'none');
            pl2.attr('id', 'path');
            pl2.attr('stroke-width', '1');
        }

        svgDocument.rootElement.appendChild(pl.get(0));
        svgDocument.rootElement.appendChild(pl2.get(0));
    }

});

$(function () {
    $("#downloadPic").click(function () {
        /*var svgImage = $('#svg-data')[0].contentDocument.childNodes[0];
        var str = (new XMLSerializer()).serializeToString(svgImage);
        str = str.replace(/xmlns=\"http:\/\/www\.w3\.org\/1999\/svg\"/, '');
        var $canvas = $('<canvas/>');
        $canvas.width($('#svg-data').width());
        $canvas.height($('#svg-data').height());
        $canvas[0].getcontext("2d").fillStyle = '#fff';
        $canvas[0].getcontext("2d").fillRect(0,0);
        $canvas.appendTo("#map-part");
        canvg($canvas.get(0), str); // convert SVG to canvas
        $('#svg-data').hide();
        $canvas.onload = function () {
            html2canvas($("#map-part"), {
                onrendered: function (canvas) {
                    var a = document.createElement('a');
                    a.href = canvas.toDataURL();
                    a.download = 'test2.png';
                    a.click();
                    $canvas.remove();
                }
            })
        };*/
        var svgObj = $("#svg-data");
        var svgString = new XMLSerializer().serializeToString(svgObj[0].contentDocument.childNodes[0]);
        var DOMURL = self.URL || self.webkitURL || self;
        var canvas2 = document.createElement("canvas");
        canvas2.setAttribute("class", "previewPic");
        canvas2.height = $(svgObj).height();
        canvas2.width = $(svgObj).width();
        var svg = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
        var url = DOMURL.createObjectURL(svg);
        var ctx = canvas2.getContext("2d");

        var img = new Image();

        img.onload = function () {
            ctx.drawImage(img, 0, 0);

            html2canvas($("#map-part"), {
                onrendered: function (canvas) {
                    //document.body.appendChild(canvas);
                    $(svgObj).show();
                    $(canvas2).remove();
                    var a = document.createElement('a');
                    a.href = canvas.toDataURL();
                    a.download = '毕业流向图.png';
                    a.click();
                    // Convert and download as image
                    //Canvas2Image.saveAsPNG(canvas);
                    //$("#img-out").append(canvas);
                    // Clean up
                    //document.getElementById('img-out').removeChild(canvas);
                },
                //height:canvas2.height,
                //width:canvas2.width,
            });

        }


        img.src = url;

        $(canvas2).insertAfter(svgObj);
        console.log(svgObj);
        $(svgObj).hide();
        //document.body.appendChild(canvas2);*/
    });
});