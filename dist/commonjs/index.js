'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.configure = configure;

var _baseConfig = require('./base-config');

function configure(aurelia, configCallback) {
    aurelia.globalResources('./aurelia-tagit');

    var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
    if (configCallback !== undefined && typeof configCallback === 'function') {
        configCallback(baseConfig.current);
    }
}