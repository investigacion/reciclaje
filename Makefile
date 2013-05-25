# Examples:
# http://bost.ocks.org/mike/map/
# Costa Rica shaded relief: http://bl.ocks.org/mjhoy/5301594

GDAL_CRI_URL=http://gadm.org/data/shp/CRI_adm.zip
GDAL_CRI_ZIP=build/CRI_adm.zip
GDAL_CRI_SHP=build/CRI_adm/CRI_adm2.shp

CRI_JSON=build/costarica.json
CRI_TOPO_JSON=build/costarica-topo.json

MENTIRA_JS_PUB=public/js/mentira.js

# Run `make ENV=live` to build production assets.
# Otherwise dev is assumed.
ifndef $ENV
	ENV=dev
endif

public: ${MENTIRA_JS_PUB}

node_modules: package.json
	npm install

${GDAL_CRI_ZIP}:
	curl "${GDAL_CRI_URL}" --output ${GDAL_CRI_ZIP} --time-cond ${GDAL_CRI_ZIP} --progress-bar --location

${GDAL_CRI_SHP}: ${GDAL_CRI_ZIP}
	unzip ${GDAL_CRI_ZIP} CRI_adm2.* -d build/CRI_adm
	touch ${GDAL_CRI_SHP}

${CRI_JSON}: ${GDAL_CRI_SHP}
	rm -f ${CRI_JSON}
	ogr2ogr -f GeoJSON ${CRI_JSON} ${GDAL_CRI_SHP}

${CRI_TOPO_JSON}: node_modules ${CRI_JSON}
	@# Uses external properties file to munge in the official canton codes.
	@# https://github.com/mbostock/topojson/wiki/Command-Line-Reference#external-properties
	./node_modules/topojson/bin/topojson \
		-e build/costarica-codes.tsv \
		--id-property=+ID_2 \
		-p code=+code \
		-p name=NAME_2 \
		-p province=NAME_1 \
		-q 1e4 \
		-o ${CRI_TOPO_JSON} \
		${CRI_JSON}

${MENTIRA_JS_PUB}: ${CRI_TOPO_JSON} lib/js/*.js lib/js/controllers/*.js lib/js/vendor/*.js
	./node_modules/browserify/bin/cmd.js lib/js/mentira.js --outfile ${MENTIRA_JS_PUB}.tmp --require ./lib/js/mentira.js
	if [[ ${ENV} == "live" ]]; then \
		./node_modules/uglify-js/bin/uglifyjs ${MENTIRA_JS_PUB}.tmp --compress --output ${MENTIRA_JS_PUB}.tmp; \
	fi;
	cat lib/js/vendor/*.js ${MENTIRA_JS_PUB}.tmp > ${MENTIRA_JS_PUB}
	rm ${MENTIRA_JS_PUB}.tmp

clean:
	rm -rf build/CRI_adm ${CRI_JSON} ${CRI_TOPO_JSON} ${MENTIRA_JS_PUB}

clean-vendor:
	rm -rf node_modules

.PHONY: public clean clean-vendor
