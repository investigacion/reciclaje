GADM_CRI_URL := http://gadm.org/data/shp/CRI_adm.zip
GADM_CRI_ZIP := build/CRI_adm.zip
GADM_CRI_SHP := build/CRI_adm/CRI_adm2.shp

CRI_JSON := build/costarica.json
CRI_TOPO_JSON := build/costarica-topo.json

CRI_GARBAGE_JSON := ../reciclaje-data/data/json/reciclaje.json
CRI_INDICES_JSON := ../desarrollo-humano-data/data/json/desarrollo-humano.json

pages: \
	gh-pages/img \
	gh-pages/index.html \
	gh-pages/js/reciclaje.js \
	gh-pages/css/reciclaje.css

node_modules: package.json
	npm install
	touch $@

build:
	if [ ! -d build ]; then \
		mkdir build; \
	fi;

${GADM_CRI_ZIP}: build
	curl http://gadm.org/data/shp/CRI_adm.zip \
		--output $@ \
		--time-cond $@ \
		--progress-bar \
		--location
	touch $@

${GADM_CRI_SHP}: ${GADM_CRI_ZIP}
	unzip -u $< CRI_adm2.* -d build/CRI_adm
	touch $@

${CRI_JSON}: ${GADM_CRI_SHP}
	rm -f $@
	ogr2ogr -f GeoJSON $@ $<

${CRI_TOPO_JSON}: node_modules ${CRI_JSON}
	@# Uses external properties file to munge in the official canton codes.
	@# https://github.com/mbostock/topojson/wiki/Command-Line-Reference#external-properties
	./node_modules/topojson/bin/topojson \
		-e ../divisiones-territoriales-data/data/csv/adm2-gadm.csv \
		--id-property=+ID_2 \
		-p code=+Código \
		-q 1e4 \
		-o $@ \
		${CRI_JSON}

gh-pages/js/reciclaje.js: gh-pages ${CRI_TOPO_JSON} ${CRI_GARBAGE_JSON} ${CRI_INDICES_JSON} lib/js/*.js lib/js/controllers/*.js lib/js/vendor/*.js
	if [ ! -d $(@D) ]; then \
		mkdir $(@D); \
	fi;
	./node_modules/browserify/bin/cmd.js \
		lib/js/reciclaje.js \
		--outfile $@.tmp \
		--require ./lib/js/reciclaje.js
	./node_modules/uglify-js/bin/uglifyjs \
		$@.tmp \
		--compress \
		--output $@.tmp
	cat \
		lib/js/vendor/d3.v3.min.js \
		lib/js/vendor/topojson.v1.min.js \
		lib/js/vendor/classList.min.js \
		$@.tmp > $@
	rm $@.tmp

gh-pages/css/reciclaje.css: gh-pages lib/less/*.less lib/less/modules/*.less
	if [ ! -d $(@D) ]; then \
		mkdir $(@D); \
	fi;
	./node_modules/recess/bin/recess \
		--compress lib/less/reciclaje.less > $@

gh-pages/img: lib/img gh-pages
	cp -r $< $@

gh-pages/index.html: lib/html/index.html gh-pages
	cp $< $@

gh-pages:
	if [ ! -d $@ ]; then \
		if git ls-remote --heads https://github.com/investigacion/reciclaje.git | grep --quiet gh-pages; then \
			git clone git@github.com:investigacion/reciclaje.git -b gh-pages $@; \
		else \
			mkdir $@; \
			cd $@; \
			git clone git@github.com:investigacion/reciclaje.git .; \
			git checkout --orphan gh-pages; \
			git rm -rf .; \
			echo ".DS_Store" > .gitignore; \
			git add .gitignore; \
			git ci -m "Initial commit"; \
			git push --set-upstream origin gh-pages; \
		fi; \
	else \
		cd $@ && git pull; \
		touch $@; \
	fi;

publish: pages
	cd gh-pages && git add . --all && \
	git ci \
		-m "Automated commit from make" && \
	git push

clean:
	if [ -d gh-pages ]; then \
		cd gh-pages && git reset --hard && git clean -df
	fi;

clean-vendor:
	rm -rf node_modules

.PHONY: publish clean clean-vendor
