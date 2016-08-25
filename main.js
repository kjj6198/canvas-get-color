
function makeRGB(name) {
  return ['rgb(', name, ')'].join('');
}

function createCanvas(width, height, id) {
  var canvas    = document.createElement('canvas');
  canvas.id     = id;
  canvas.width  = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  return canvas;
}

function mapPalette(palette) {
  return palette.map(function(c) { return makeRGB(c.name)} );
} 

function getContext() {
  return document.getElementById('blurCanvas').getContext('2d');
}

function getImageData(canvasContext, image, loaded) {
  var ctx = canvasContext;
  
  image.onload = function() {
    ctx.drawImage(image, 0, 0, image.width, image.height);
    var data = ctx.getImageData(0, 0, image.width, image.height).data;
    loaded && loaded.call(null, data);
  }
  
  return ;
}

function getImagePalette(canvas) {
	var ctx = null;

	if(canvas instanceof HTMLCanvasElement) {
		ctx = canvas.getContext('2d');
	} else { throw TypeError; }
	
	var albumImage = document.getElementById('albumCover');
  var colors = {
    dominant: { name: '', count: 0},
    palette:  Array.apply(null, new Array(10)).map(Boolean).map(function(a){ return { name: '0,0,0', count: 0 }; })
  };

	getImageData(ctx, albumImage, function(data) {
      var imageDataLength = albumImage.width * albumImage.height || data.length;
      var colorCounts     = {};
      var rgbString       = '';
      var rgb             = [];
      var exclude         = ['rgb(0,0,0)'];
      var i = 0;
      while( i < imageDataLength) {
        rgb[0] = data[i]; // R
        rgb[1] = data[i+1]; // G
        rgb[2] = data[i+2]; // B
        rgbString = rgb.join(',');
        
        i += 20;
        
        if (rgb.indexOf(undefined) !== -1) {
          i += 20;
          continue;
        }
        
        if(rgbString in colorCounts) {
          colorCounts[rgbString] += 1;
        } else {
          colorCounts[rgbString] = 1;
        }
        
        if(exclude.indexOf(makeRGB(rgbString)) === -1) {
          var colorCount = colorCounts[rgbString];
          
          if(colorCount >= colors.dominant.count) {
            colors.dominant.name  = makeRGB(rgbString);
            colors.dominant.count = colorCount;
          } else {
            colors.palette.some(function(c) {
              // skip max colorCount
              if(colorCount >= c.count) {
                c.name = rgbString;
                c.count = colorCount;
                
                return true;
              }
            });

            mapPalette(colors.palette);
          }
        }        
      }
      
      gradient = ctx.createLinearGradient(0,0, canvas.width, canvas.height);
      console.log(colors);
      gradient.addColorStop(0, colors.dominant.name);

      ctx.fillStyle = gradient;
      ctx.strokeStyle = gradient;

      ctx.fillRect(0, 0, canvas.width, canvas.height);
  });
  
}

function main() {
  var canvas  = createCanvas(window.screen.width, window.screen.height, 'blurCanvas');
  getImagePalette(canvas);
}

if(document.addEventListener) {
  document.addEventListener('DOMContentLoaded', main, false);
} else if(document.attachEvent) {

}
