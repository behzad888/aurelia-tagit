'use strict';

System.register([], function (_export, _context) {
            "use strict";

            var _createClass, BaseConfig;

            function _classCallCheck(instance, Constructor) {
                        if (!(instance instanceof Constructor)) {
                                    throw new TypeError("Cannot call a class as a function");
                        }
            }

            return {
                        setters: [],
                        execute: function () {
                                    _createClass = function () {
                                                function defineProperties(target, props) {
                                                            for (var i = 0; i < props.length; i++) {
                                                                        var descriptor = props[i];
                                                                        descriptor.enumerable = descriptor.enumerable || false;
                                                                        descriptor.configurable = true;
                                                                        if ("value" in descriptor) descriptor.writable = true;
                                                                        Object.defineProperty(target, descriptor.key, descriptor);
                                                            }
                                                }

                                                return function (Constructor, protoProps, staticProps) {
                                                            if (protoProps) defineProperties(Constructor.prototype, protoProps);
                                                            if (staticProps) defineProperties(Constructor, staticProps);
                                                            return Constructor;
                                                };
                                    }();

                                    _export('BaseConfig', BaseConfig = function () {
                                                _createClass(BaseConfig, [{
                                                            key: 'current',
                                                            get: function get() {
                                                                        return this.options;
                                                            }
                                                }]);

                                                function BaseConfig() {
                                                            _classCallCheck(this, BaseConfig);

                                                            this.options = {
                                                                        allowDuplicates: false,
                                                                        caseSensitive: true,
                                                                        fieldName: 'tags',
                                                                        placeholderText: null,
                                                                        readOnly: false,
                                                                        removeConfirmation: false,
                                                                        tagLimit: null,
                                                                        availableTags: [],

                                                                        autocomplete: {},

                                                                        showAutocompleteOnFocus: false,

                                                                        allowSpaces: false,

                                                                        singleField: false,

                                                                        singleFieldDelimiter: ',',

                                                                        singleFieldNode: null,

                                                                        animate: true,

                                                                        tabIndex: null,

                                                                        beforeTagAdded: null,
                                                                        afterTagAdded: null,

                                                                        beforeTagRemoved: null,
                                                                        afterTagRemoved: null,

                                                                        onTagClicked: null,
                                                                        onTagLimitExceeded: null,

                                                                        onTagAdded: null,
                                                                        onTagRemoved: null,

                                                                        tagSource: null
                                                            };

                                                            this.KeyCodes = {
                                                                        BACKSPACE: 8,
                                                                        TAB: 9,
                                                                        ENTER: 13,
                                                                        SHIFT: 16,
                                                                        CTRL: 17,
                                                                        ALT: 18,
                                                                        PauseBreak: 19,
                                                                        CapsLock: 20,
                                                                        ESC: 27,
                                                                        PageUp: 33,
                                                                        PageDown: 34,
                                                                        END: 35,
                                                                        HOME: 36,
                                                                        ArrowLeft: 37,
                                                                        ArrowUp: 38,
                                                                        ArrowRight: 39,
                                                                        ArrowDown: 40,
                                                                        INSERT: 45,
                                                                        DELETE: 46,
                                                                        Digit0: 48,
                                                                        Digit1: 49,
                                                                        Digit2: 50,
                                                                        Digit3: 51,
                                                                        Digit4: 52,
                                                                        Digit5: 53,
                                                                        Digit6: 54,
                                                                        Digit7: 55,
                                                                        Digit8: 56,
                                                                        Digit9: 57,
                                                                        A: 65,
                                                                        B: 66,
                                                                        C: 67,
                                                                        D: 68,
                                                                        E: 69,
                                                                        F: 70,
                                                                        G: 71,
                                                                        H: 72,
                                                                        I: 73,
                                                                        J: 74,
                                                                        K: 75,
                                                                        L: 76,
                                                                        M: 77,
                                                                        N: 78,
                                                                        O: 79,
                                                                        P: 80,
                                                                        Q: 81,
                                                                        R: 82,
                                                                        S: 83,
                                                                        T: 84,
                                                                        U: 85,
                                                                        V: 86,
                                                                        W: 87,
                                                                        X: 88,
                                                                        Y: 89,
                                                                        Z: 90,
                                                                        WindowLeft: 91,
                                                                        WindowRight: 92,
                                                                        SelectKey: 93,
                                                                        Numpad0: 96,
                                                                        Numpad1: 97,
                                                                        Numpad2: 98,
                                                                        Numpad3: 99,
                                                                        Numpad4: 100,
                                                                        Numpad5: 101,
                                                                        Numpad6: 102,
                                                                        Numpad7: 103,
                                                                        Numpad8: 104,
                                                                        Numpad9: 105,
                                                                        Multiply: 106,
                                                                        Add: 107,
                                                                        Subtract: 109,
                                                                        DecimalPoint: 110,
                                                                        Divide: 111,
                                                                        F1: 112,
                                                                        F2: 113,
                                                                        F3: 114,
                                                                        F4: 115,
                                                                        F5: 116,
                                                                        F6: 117,
                                                                        F7: 118,
                                                                        F8: 119,
                                                                        F9: 120,
                                                                        F10: 121,
                                                                        F11: 122,
                                                                        F12: 123,
                                                                        NumLock: 144,
                                                                        ScrollLock: 145,
                                                                        SemiColon: 186,
                                                                        Equal: 187,
                                                                        COMMA: 188,
                                                                        Dash: 189,
                                                                        Period: 190,
                                                                        ForwardSlash: 191,
                                                                        GraveAccent: 192,
                                                                        BracketOpen: 219,
                                                                        BackSlash: 220,
                                                                        BracketClose: 221,
                                                                        SingleQuote: 222
                                                            };
                                                }

                                                return BaseConfig;
                                    }());

                                    _export('BaseConfig', BaseConfig);
                        }
            };
});