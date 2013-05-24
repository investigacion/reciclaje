# Examples:
# http://bost.ocks.org/mike/map/
# Costa Rica shaded relief: http://bl.ocks.org/mjhoy/5301594

GDAL_CRI_URL=http://gadm.org/data/shp/CRI_adm.zip
GDAL_CRI_ZIP=build/CRI_adm.zip
GDAL_CRI_SHP=build/CRI_adm0.shp

CRI_JSON=build/costarica.json
CRI_TOPO_JSON=public/js/data/costarica-topo.json

build: ${CRI_TOPO_JSON}

node_modules: package.json
	npm install

${GDAL_CRI_ZIP}:
	curl "${GDAL_CRI_URL}" --output ${GDAL_CRI_ZIP} --progress-bar --location

${GDAL_CRI_SHP}: ${GDAL_CRI_ZIP}
	unzip ${GDAL_CRI_ZIP} *.sh[px] -d build/
	touch ${GDAL_CRI_SHP}

${CRI_JSON}: ${GDAL_CRI_SHP}
	ogr2ogr -overwrite -f GeoJSON ${CRI_JSON} ${GDAL_CRI_SHP}

${CRI_TOPO_JSON}: node_modules ${CRI_JSON}
	./node_modules/topojson/bin/topojson -p name=NAME -p name -q 1e4 -o ${CRI_TOPO_JSON} ${CRI_JSON}

clean:
	rm -rf build/*.json build/*.shp build/*.shx ${CRI_TOPO_JSON}

.PHONY: clean
