
BROWSERIFY=./node_modules/.bin/browserify
BABEL=./node_modules/.bin/babel

SRC_DIR=./src
LIB_DIR=./lib
DEMO_DIR=./demo

all: lib demo 

lib: $(LIB_DIR)/react-goban.js
demo: $(DEMO_DIR)/demo-bundle.js

$(LIB_DIR)/react-goban.js: $(SRC_DIR)/react-goban.jsx
	mkdir -p $(LIB_DIR)
	$(BABEL) $< -o $@

$(DEMO_DIR)/demo-bundle.js: $(DEMO_DIR)/demo.jsx $(SRC_DIR)/react-goban.jsx
	$(BROWSERIFY) -t babelify $< -o $@

clean:
	rm $(DEMO_DIR)/demo-bundle.js
	rm $(LIB_DIR)/react-goban.js

.PHONY: clean 

