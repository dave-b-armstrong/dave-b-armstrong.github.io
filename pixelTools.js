function getColor(r,g,b) {

  	for (var i=0; i<colors.length;i++) {
       	if (r == colors[i][2] && g == colors[i][3] &&	b == colors[i][4]) {
            if (pegs == 29) {
                if (colors[i][9] == 0) {
       		       return colors[i]; 
                }               
            } else {
                if (colors[i][9] == 1) {
                    return colors[i];
                }
            }
       	}
    }
}

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r * 255, g * 255, b * 255];
}

function processBeads(data, colors) {
    var diff;
    var rgbDiff;
    var hslDiff;

    for( var index = 0; index < data.length; index+=4 ) {

        if ( data[index+3] === 0 ) {
            //transparent pixel
            data[index]   = 255;
            data[index+1] = 255;
            data[index+2] = 255;
            data[index+3] = 0;
        } else {
            var r = data[index];
            var g = data[index+1];
            var b = data[index+2];

            var hsl = rgbToHsl(r,g,b);
            var hu = hsl[0];
            var s = hsl[1];
            var l = hsl[2];

            var curColor;
            var curDiff =-1;
            for (var i=0; i<colors.length;i++) {
                if (colors[i][5] > -1) {
                  r2 = colors[i][2];
                  g2 = colors[i][3];
                  b2 = colors[i][4];
                  var hsl2 = rgbToHsl(r2,g2,b2);
                  var h2 = hsl2[0];
                  var s2 = hsl2[1];
                  var l2 = hsl2[2];

                  hslDiff = Math.pow((hu-h2),2) + Math.pow((s-s2),2) + Math.pow((l-l2),2);
                  rgbDiff = Math.pow((r-r2),2) + Math.pow((g-g2),2) + Math.pow((b-b2),2);
                  diff = hslDiff + rgbDiff;

                  if (curDiff == -1 || diff < curDiff) {
                      data[index]   = r2;
                      data[index+1] = g2;
                      data[index+2] = b2;
                      curColor = colors[i];
                      curDiff = diff;
                  }
                }
            }
            curColor[5] +=1;
        }
    }
}
