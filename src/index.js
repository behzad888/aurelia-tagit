export function configure(aurelia, configCallback) {
    aurelia.globalResources('./aurelia-tagit');
    
    let baseConfig = aurelia.container.get(BaseConfig);
    if (configCallback !== undefined && typeof (configCallback) === 'function') {
        configCallback(baseConfig);
    }
}