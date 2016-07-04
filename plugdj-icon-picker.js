// get URL to plug's CSS file
var cssURL;
cssURL = $('link').filter(function(arg$, el){
  return /app\.\w*?\.css/.test(el.href);
})[0].href;

// load CSS file's contents
$.get(cssURL).then(function(cssData){ // done loading
  // get all icon positions from the CSS
  var regx, iconPositions, m, key$, ys, xs, y, row, icons;
  regx = /(\.icon-[\w-]+)\s*\{\s*background-position:\s*(?:0|-(\d+)px)\s+(?:0|-(\d+)px);?\s*\}/g;
  iconPositions = {};
  while (m = regx.exec(cssData)) {
    iconPositions[key$ = m[3] || 0] || (iconPositions[key$] = {
      0: ''
    });
    iconPositions[m[3] || 0][m[2] || 0] = m[1];
  }

  // generate sorted lists of the X- and Y-positions
  ys = Object.keys(iconPositions).sort(function(a, b){
    return a - b;
  });
  xs = {};
  for (y in iconPositions) {
    row = iconPositions[y];
    xs[y] = Object.keys(row).sort(fn$);
  }

  // icon a popup window
  icons = window.open('about:blank', 'plugdj icons', 'width=315,height=665,location=no,menubar=no,titlebar=no,status=no,toolbar=no,resizable=yes');

  // wait for the popup to open/load
  setTimeout(function(){

    // display icons in popup and format the className text
    icons.document.body.style = "color: #fff; background: #222 url(" + /https:\/\/[^"]+\/icons\.\w+\.png/.exec(cssData)[0] + ") no-repeat; display: flex; align-items: flex-end; margin:0; height: 100%; font-family: sans-serif; cursor: pointer";

    // when moving the mouse, check which icon is hovered
    icons.document.body.onmousemove = function(e){
      // find closest icon Y position
      var i$, ref$, len$, yi, y, offset, bestY, row, j$, xi, x, bestX, icon;
      for (i$ = 0, len$ = (ref$ = ys).length; i$ < len$; ++i$) {
        yi = i$;
        y = ref$[i$];
        if (y >= e.pageY) {
          break;
        }
      }

      // see below
      for (i$ = 1; i$ <= 2; ++i$) {
        offset = i$;

        // get list of X-positions of icons in this row
        bestY = ys[yi - offset];
        row = xs[bestY];

        // find closest icon X position
        for (j$ = 0, len$ = row.length; j$ < len$; ++j$) {
          xi = j$;
          x = row[j$];
          if (x >= e.pageX) {
            break;
          }
        }

        // get icon at that position
        bestX = row[xi - 1];
        icon = iconPositions[bestY][bestX];
        if (icon) {
          break;
        }
      }
      // if no icon was found, go one icon row up and try again
      // this is because there are rows with larger icons,
      // which also have two rows of smaller icons

      // display className (and position) of found icon
      this.textContent = icon + "\t(" + bestX + " x " + bestY + ")";
    };

    // show hint
    icons.document.body.textContent = "triple click an icon and press ctrl+c";
  }, 200);

  function fn$(a, b){
    return a - b;
  }

}).fail(function(){ // CSS file failed to load
  alert("failed to load CSS file: " + (cssURL || 'no file found; are you even on plug.dj?'));
});