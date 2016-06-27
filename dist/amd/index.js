define(['exports', './base-config'], function (exports, _baseConfig) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.configure = configure;
    function configure(aurelia, configCallback) {
        aurelia.globalResources('./aurelia-tagit');

        var baseConfig = aurelia.container.get(_baseConfig.BaseConfig);
        if (configCallback !== undefined && typeof configCallback === 'function') {
            configCallback(baseConfig.current);
        }
    }
});