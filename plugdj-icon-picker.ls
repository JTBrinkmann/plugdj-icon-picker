# get URL to plug's CSS file
cssURL = $ \link
  .filter (,el) -> /app\.\w*?\.css/.test(el.href)
  .0 .href

# load CSS file's contents
$.get(cssURL)
  .then (cssData) !-> # done loading
    # get all icon positions from the CSS
    regx = /(\.icon-[\w-]+)\s*\{\s*background-position:\s*(?:0|-(\d+)px)\s+(?:0|-(\d+)px);?\s*\}/g
    iconPositions = {}
    while m = regx.exec(cssData)
      iconPositions[m.3||0] ||= {0: ''}
      iconPositions[m.3||0][m.2||0] = m.1

    # generate sorted lists of the X- and Y-positions
    ys = Object.keys(iconPositions).sort (a,b) -> a - b
    xs = {}
    for y, row of iconPositions
      xs[y] = Object.keys(row).sort (a,b) -> a - b

    # icon a popup window
    icons = window.open('about:blank', 'plugdj icons', 'width=315,height=665,location=no,menubar=no,titlebar=no,status=no,toolbar=no,resizable=yes')

    # wait for the popup to open/load
    <-! setTimeout _, 200ms

    # display icons in popup and format the className text
    icons .document.body.style = "color: \#fff; background: \#222 url(#{/https:\/\/[^"]+\/icons\.\w+\.png/.exec(cssData)[0]}) no-repeat; display: flex; align-items: flex-end; margin:0; height: 100%; font-family: sans-serif; cursor: pointer"

    # when moving the mouse, check which icon is hovered
    icons .document.body.onmousemove = (e) !->
      # find closest icon Y position
      for y, yi in ys when y >= e.pageY
        break

      # see below
      for offset from 1 to 2
        # get list of X-positions of icons in this row
        bestY = ys[yi - offset]
        row = xs[bestY]
        # find closest icon X position
        for x, xi in row when x >= e.pageX
          break

        # get icon at that position
        bestX = row[xi - 1]
        icon = iconPositions[bestY][bestX]
        break if icon
      # if no icon was found, go one icon row up and try again
      # this is because there are rows with larger icons,
      # which also have two rows of smaller icons

      # display className (and position) of found icon
      this.textContent = "#{icon}\t(#{bestX} x #{bestY})"

    # show hint
    icons .document.body.textContent = "triple click an icon and press ctrl+c"

  .fail !-> # CSS file failed to load
    alert "failed to load CSS file: #{cssURL || 'no file found; are you even on plug.dj?'}"