BASEDIR = .
DEVDIR = $(BASEDIR)/presets/development
PRODDIR = $(BASEDIR)/presets/production
CFGDIR = $(BASEDIR)/application/config
FRONTENDDIR = $(BASEDIR)/frontend

COPY = cp -v

build:
	@ echo 'Building frontend application ...'
	@ cd frontend; npm run build
	@ echo 'Done'

.PHONY : build

development:
	@ echo 'Setting up development environment ...'
	@ $(COPY) $(DEVDIR)/config.php $(CFGDIR)/config.php
	@ $(COPY) $(DEVDIR)/database.php $(CFGDIR)/database.php
	@ $(COPY) $(DEVDIR)/constants.php $(CFGDIR)/constants.php
	@ $(COPY) $(DEVDIR)/index.php $(BASEDIR)/index.php
	@ $(COPY) $(DEVDIR)/webpack.config.js $(FRONTENDDIR)/webpack.config.js
	@ echo 'Done'

.PHONY : development

production:
	@ echo 'Setting up production environment ...'
	@ $(COPY) $(PRODDIR)/config.php $(CFGDIR)/config.php
	@ $(COPY) $(PRODDIR)/database.php $(CFGDIR)/database.php
	@ $(COPY) $(PRODDIR)/constants.php $(CFGDIR)/constants.php
	@ $(COPY) $(PRODDIR)/index.php $(BASEDIR)/index.php
	@ $(COPY) $(PRODDIR)/webpack.config.js $(FRONTENDDIR)/webpack.config.js
	@ echo 'Done'

.PHONY : production

archive: production build
	@ echo 'Preparing archive for distribution ...'
	@ tar -czf aksen.tar.gz application public system index.php
	@ echo 'Done.'

.PHONY : archive

