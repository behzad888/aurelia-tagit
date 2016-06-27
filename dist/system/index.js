'use strict';

System.register(['./base-config'], function (_export, _context) {
    "use strict";

    var BaseConfig;
    return {
        setters: [function (_baseConfig) {
            BaseConfig = _baseConfig.BaseConfig;
        }],
        execute: function () {
            function configure(aurelia, configCallback) {
                aurelia.globalResources('./aurelia-tagit');

                var baseConfig = aurelia.container.get(BaseConfig);
                if (configCallback !== undefined && typeof configCallback === 'function') {
                    configCallback(baseConfig.current);
                }
            }

            _export('configure', configure);
        }
    };
});