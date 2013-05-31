# Mentira verde + reciclaje #

## Building ##

Required: [`make`](http://www.gnu.org/software/make/), [`Node.js`](http://nodejs.org/) and [`GDAL`](http://www.gdal.org/).

Run `make` to build public resources. If you want the resources to be built automatically every time you save a file while working, run [`wr`](https://npmjs.org/package/wr). This utility will run the script in the provided `.wr` file every time the source tree changes. All you have to do then is refresh your browser.

## Publishing ##

Run `make publish` to publish directly to `media.nacion.com`. The `publish` task will build minified JavaScript and CSS before publishing. To build the pre-publish assets without actually publishing to the host run `make ENV=live`.

## Might be useful ##

- [Costa Rica shaded relief](https://gist.github.com/mjhoy/5301594#file-index-html)
- [Let's Make a Map](http://bost.ocks.org/mike/map/)
- [Maps Tutorial](http://www.schneidy.com/Tutorials/MapsTutorial.html)
- [Choropleth](http://bl.ocks.org/mbostock/4060606)
- [Grouped Bar Chart](http://bl.ocks.org/mbostock/3887051)
