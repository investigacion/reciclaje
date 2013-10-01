# Reciclaje #

Recycling "special" for La Nación. Also a development workflow experiment.

If you're interested in the data behind this project, see the [reciclaje-data](https://github.com/investigacion/reciclaje-data) project.

## Building ##

Required: [`make`](http://www.gnu.org/software/make/), [`Node.js`](http://nodejs.org/) and [`GDAL`](http://www.gdal.org/).

Run `make` to build public resources. If you want the resources to be built automatically every time you save a file while working, run [`wr`](https://npmjs.org/package/wr). This utility will run the script in the provided `.wr` file every time the source tree changes. All you have to do then is refresh your browser.

## Publishing ##

Run `make publish` to publish directly to GitHub pages. The `publish` task will build minified Javascript and CSS before publishing.

## Might be useful ##

- [Costa Rica shaded relief](https://gist.github.com/mjhoy/5301594#file-index-html)
- [Let's Make a Map](http://bost.ocks.org/mike/map/)
- [Maps Tutorial](http://www.schneidy.com/Tutorials/MapsTutorial.html)
- [Choropleth](http://bl.ocks.org/mbostock/4060606)
- [Grouped Bar Chart](http://bl.ocks.org/mbostock/3887051)

## Credits and license ##

Developed by [Matthew Caruana Galizia](https://twitter.com/mcaruanagalizia) at [La Nación](http://www.nacion.com/).

Code licensed under an MIT-style license.
