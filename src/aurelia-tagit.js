import {customElement, bindable} from 'aurelia-framework';
@customElement('aurelia-tagit')
export class TagIt {
    @bindable options;

    constructor() {
      
    }
    attached() {
        this.create();
    }

    create() {
        
    }
}