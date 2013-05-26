GADM_CRI_URL=http://gadm.org/data/shp/CRI_adm.zip
GADM_CRI_ZIP=build/CRI_adm.zip
GADM_CRI_SHP=build/CRI_adm/CRI_adm2.shp

CRI_JSON=build/costarica.json
CRI_TOPO_JSON=build/costarica-topo.json

CRI_GARBAGE_JSON=build/costarica-garbage.json

MENTIRA_JS_PUB=public/js/mentira.js

# Run `make ENV=live` to build production assets.
# Otherwise dev is assumed.
ifndef $ENV
	ENV=dev
endif

public: ${MENTIRA_JS_PUB}

node_modules: package.json
	npm install

${GADM_CRI_ZIP}:
	curl "${GADM_CRI_URL}" --output ${GADM_CRI_ZIP} --time-cond ${GADM_CRI_ZIP} --progress-bar --location

${GADM_CRI_SHP}: ${GADM_CRI_ZIP}
	unzip ${GADM_CRI_ZIP} CRI_adm2.* -d build/CRI_adm
	touch ${GADM_CRI_SHP}

${CRI_JSON}: ${GADM_CRI_SHP}
	rm -f ${CRI_JSON}
	ogr2ogr -f GeoJSON ${CRI_JSON} ${GADM_CRI_SHP}

${CRI_TOPO_JSON}: node_modules ${CRI_JSON}
	@# Uses external properties file to munge in the official canton codes.
	@# https://github.com/mbostock/topojson/wiki/Command-Line-Reference#external-properties
	./node_modules/topojson/bin/topojson \
		-e lib/data/costarica-codes.csv \
		--id-property=+ID_2 \
		-p code=+code \
		-p name=NAME_2 \
		-p province=NAME_1 \
		-q 1e4 \
		-o ${CRI_TOPO_JSON} \
		${CRI_JSON}

${CRI_GARBAGE_JSON}: lib/data/costarica-garbage.csv lib/scripts/garbage2json.js
	node lib/scripts/garbage2json.js > ${CRI_GARBAGE_JSON}

${MENTIRA_JS_PUB}: ${CRI_TOPO_JSON} ${CRI_GARBAGE_JSON} lib/js/*.js lib/js/controllers/*.js lib/js/vendor/*.js
	./node_modules/browserify/bin/cmd.js lib/js/mentira.js --outfile ${MENTIRA_JS_PUB}.tmp --require ./lib/js/mentira.js
	if [[ ${ENV} == "live" ]]; then \
		./node_modules/uglify-js/bin/uglifyjs ${MENTIRA_JS_PUB}.tmp --compress --output ${MENTIRA_JS_PUB}.tmp; \
	fi;
	cat lib/js/vendor/*.js ${MENTIRA_JS_PUB}.tmp > ${MENTIRA_JS_PUB}
	rm ${MENTIRA_JS_PUB}.tmp

clean:
	rm -rf build/CRI_adm ${CRI_JSON} ${CRI_TOPO_JSON} ${CRI_GARBAGE_JSON} ${MENTIRA_JS_PUB}

clean-vendor:
	rm -rf node_modules

.PHONY: public clean clean-vendor
