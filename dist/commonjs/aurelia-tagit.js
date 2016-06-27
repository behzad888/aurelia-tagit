'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TagIt = undefined;

var _dec, _dec2, _dec3, _class;

var _aureliaFramework = require('aurelia-framework');

var _aureliaTemplating = require('aurelia-templating');

require('./aurelia_tagit.css!');

var _baseConfig = require('./base-config');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TagIt = exports.TagIt = (_dec = (0, _aureliaTemplating.customElement)('aurelia-tagit'), _dec2 = (0, _aureliaFramework.noView)(), _dec3 = (0, _aureliaFramework.inject)(_baseConfig.BaseConfig, Element), _dec(_class = _dec2(_class = _dec3(_class = function () {
    function TagIt(baseConfig, el) {
        _classCallCheck(this, TagIt);

        this.element = el;
        this.options = baseConfig.current;
        this.keys = baseConfig.KeyCodes;
    }

    TagIt.prototype.attached = function attached() {
        this.create();
    };

    TagIt.prototype.create = function create() {
        var that = this;
        this.element = $(this.element);
        if (this.element.is('input')) {
            this.tagList = $('<ul></ul>').insertAfter(this.element);
            this.options.singleField = true;
            this.options.singleFieldNode = this.element;
            this.element.addClass('tagit-hidden-field');
        } else {
            this.tagList = this.element.find('ul, ol').andSelf().last();
        }
        this.tagInput = $('<input type="text" />').addClass('ui-widget-content');

        if (this.options.readOnly) this.tagInput.attr('disabled', 'disabled');

        if (this.options.tabIndex) {
            this.tagInput.attr('tabindex', this.options.tabIndex);
        }

        if (this.options.placeholderText) {
            this.tagInput.attr('placeholder', this.options.placeholderText);
        }
        if (!this.options.autocomplete.source) {
            this.options.autocomplete.source = function (search, showChoices) {
                var filter = search.term.toLowerCase();
                var choices = $.grep(this.options.availableTags, function (element) {
                    return element.toLowerCase().indexOf(filter) === 0;
                });
                if (!this.options.allowDuplicates) {
                    choices = this._subtractArray(choices, this.assignedTags());
                }
                showChoices(choices);
            };
        }

        if (this.options.showAutocompleteOnFocus) {
            this.tagInput.focus(function (event, ui) {});

            if (typeof this.options.autocomplete.minLength === 'undefined') {
                this.options.autocomplete.minLength = 0;
            }
        }

        if ($.isFunction(this.options.autocomplete.source)) {
            this.options.autocomplete.source = $.proxy(this.options.autocomplete.source, this);
        }

        if ($.isFunction(this.options.tagSource)) {
            this.options.tagSource = $.proxy(this.options.tagSource, this);
        }

        this.tagList.addClass('tagit').addClass('ui-widget ui-widget-content ui-corner-all').append($('<li class="tagit-new"></li>').append(this.tagInput)).click(function (e) {
            var target = $(e.target);
            if (target.hasClass('tagit-label')) {
                var tag = target.closest('.tagit-choice');
                if (!tag.hasClass('removed')) {
                    that._trigger('onTagClicked', e, { tag: tag, tagLabel: that.tagLabel(tag) });
                }
            } else {
                that.tagInput.focus();
            }
        });

        var addedExistingFromSingleFieldNode = false;
        if (this.options.singleField) {
            if (this.options.singleFieldNode) {
                var node = $(this.options.singleFieldNode);
                var tags = node.val().split(this.options.singleFieldDelimiter);
                node.val('');
                $.each(tags, function (index, tag) {
                    that.createTag(tag, null, true);
                    addedExistingFromSingleFieldNode = true;
                });
            } else {
                this.options.singleFieldNode = $('<input type="hidden" style="display:none;" value="" name="' + this.options.fieldName + '" />');
                this.tagList.after(this.options.singleFieldNode);
            }
        }

        if (!addedExistingFromSingleFieldNode) {
            this.tagList.children('li').each(function () {
                if (!$(this).hasClass('tagit-new')) {
                    that.createTag($(this).text(), $(this).attr('class'), true);
                    $(this).remove();
                }
            });
        }

        this.tagInput.keydown(function (event) {
            if (event.which == that.keys.BACKSPACE && that.tagInput.val() === '') {
                var tag = that._lastTag();
                if (!that.options.removeConfirmation || tag.hasClass('remove')) {
                    that.removeTag(tag);
                } else if (that.options.removeConfirmation) {
                    tag.addClass('remove ui-state-highlight');
                }
            } else if (that.options.removeConfirmation) {
                that._lastTag().removeClass('remove ui-state-highlight');
            }

            if (event.which === that.keys.COMMA && event.shiftKey === false || event.which === that.keys.ENTER || event.which == that.keys.TAB && that.tagInput.val() !== '' || event.which == that.keys.SPACE && that.options.allowSpaces !== true && ($.trim(that.tagInput.val()).replace(/^s*/, '').charAt(0) != '"' || $.trim(that.tagInput.val()).charAt(0) == '"' && $.trim(that.tagInput.val()).charAt($.trim(that.tagInput.val()).length - 1) == '"' && $.trim(that.tagInput.val()).length - 1 !== 0)) {
                if (!(event.which === that.keys.ENTER && that.tagInput.val() === '')) {
                    event.preventDefault();
                }

                if (!(that.options.autocomplete.autoFocus && that.tagInput.data('autocomplete-open'))) {
                    that.createTag(that._cleanedInput());
                }
            }
        }).blur(function (e) {});

        if (this.options.availableTags || this.options.tagSource || this.options.autocomplete.source) {
            var autocompleteOptions = {
                select: function select(event, ui) {
                    that.createTag(ui.item.value);

                    return false;
                }
            };
            $.extend(autocompleteOptions, this.options.autocomplete);

            autocompleteOptions.source = this.options.tagSource || autocompleteOptions.source;
        }
    };

    TagIt.prototype.destroy = function destroy() {
        $.Widget.prototype.destroy.call(this);

        this.element.unbind('.tagit');
        this.tagList.unbind('.tagit');

        this.tagInput.removeData('autocomplete-open');

        this.tagList.removeClass(['tagit', 'ui-widget', 'ui-widget-content', 'ui-corner-all', 'tagit-hidden-field'].join(' '));

        if (this.element.is('input')) {
            this.element.removeClass('tagit-hidden-field');
            this.tagList.remove();
        } else {
            this.element.children('li').each(function () {
                if ($(this).hasClass('tagit-new')) {
                    $(this).remove();
                } else {
                    $(this).removeClass(['tagit-choice', 'ui-widget-content', 'ui-state-default', 'ui-state-highlight', 'ui-corner-all', 'remove', 'tagit-choice-editable', 'tagit-choice-read-only'].join(' '));

                    $(this).text($(this).children('.tagit-label').text());
                }
            });

            if (this.singleFieldNode) {
                this.singleFieldNode.remove();
            }
        }

        return this;
    };

    TagIt.prototype._cleanedInput = function _cleanedInput() {
        return $.trim(this.tagInput.val().replace(/^"(.*)"$/, '$1'));
    };

    TagIt.prototype._showAutocomplete = function _showAutocomplete() {
        this.tagInput.autocomplete('search', '');
    };

    TagIt.prototype.tagLabel = function tagLabel(tag) {
        if (this.options.singleField) {
            return $(tag).find('.tagit-label:first').text();
        } else {
            return $(tag).find('input:first').val();
        }
    };

    TagIt.prototype._subtractArray = function _subtractArray(a1, a2) {
        var result = [];
        for (var i = 0; i < a1.length; i++) {
            if ($.inArray(a1[i], a2) == -1) {
                result.push(a1[i]);
            }
        }
        return result;
    };

    TagIt.prototype._lastTag = function _lastTag() {
        return this.tagList.find('.tagit-choice:last:not(.removed)');
    };

    TagIt.prototype._tags = function _tags() {
        return this.tagList.find('.tagit-choice:not(.removed)');
    };

    TagIt.prototype.assignedTags = function assignedTags() {
        var that = this;
        var tags = [];
        if (this.options.singleField) {
            tags = $(this.options.singleFieldNode).val().split(this.options.singleFieldDelimiter);
            if (tags[0] === '') {
                tags = [];
            }
        } else {
            this._tags().each(function () {
                tags.push(that.tagLabel(this));
            });
        }
        return tags;
    };

    TagIt.prototype._updateSingleTagsField = function _updateSingleTagsField(tags) {
        $(this.options.singleFieldNode).val(tags.join(this.options.singleFieldDelimiter)).trigger('change');
    };

    TagIt.prototype._isNew = function _isNew(name) {
        return !this._findTagByLabel(name);
    };

    TagIt.prototype._findTagByLabel = function _findTagByLabel(name) {
        var that = this;
        var tag = null;
        this._tags().each(function (i) {
            if (that._formatStr(name) == that._formatStr(that.tagLabel(this))) {
                tag = $(this);
                return false;
            }
        });
        return tag;
    };

    TagIt.prototype._effectExists = function _effectExists(name) {
        return Boolean($.effects && ($.effects[name] || $.effects.effect && $.effects.effect[name]));
    };

    TagIt.prototype._formatStr = function _formatStr(str) {
        if (this.options.caseSensitive) {
            return str;
        }
        return $.trim(str.toLowerCase());
    };

    TagIt.prototype.createTag = function createTag(value, additionalClass, duringInitialization) {
        var that = this;

        value = $.trim(value);

        if (this.options.preprocessTag) {
            value = this.options.preprocessTag(value);
        }

        if (value === '') {
            return false;
        }

        if (!this.options.allowDuplicates && !this._isNew(value)) {
            var existingTag = this._findTagByLabel(value);
            if (this._trigger('onTagExists', null, {
                existingTag: existingTag,
                duringInitialization: duringInitialization
            }) !== false) {
                if (this._effectExists('highlight')) {
                    existingTag.effect('highlight');
                }
            }
            return false;
        }

        if (this.options.tagLimit && this._tags().length >= this.options.tagLimit) {
            this._trigger('onTagLimitExceeded', null, { duringInitialization: duringInitialization });
            return false;
        }

        var label = $(this.options.onTagClicked ? '<a class="tagit-label"></a>' : '<span class="tagit-label"></span>').text(value);

        var tag = $('<li></li>').addClass('tagit-choice ui-widget-content ui-state-default ui-corner-all').addClass(additionalClass).append(label);

        if (this.options.readOnly) {
            tag.addClass('tagit-choice-read-only');
        } else {
            tag.addClass('tagit-choice-editable');

            var removeTagIcon = $('<span></span>').addClass('ui-icon ui-icon-close');
            var removeTag = $('<a><span class="text-icon">\xd7</span></a>').addClass('tagit-close').append(removeTagIcon).click(function (e) {
                that.removeTag(tag);
            });
            tag.append(removeTag);
        }

        if (!this.options.singleField) {
            var escapedValue = label.html();
            tag.append('<input type="hidden" value="' + escapedValue + '" name="' + this.options.fieldName + '" class="tagit-hidden-field" />');
        }

        if (this._trigger('beforeTagAdded', null, {
            tag: tag,
            tagLabel: this.tagLabel(tag),
            duringInitialization: duringInitialization
        }) === false) {
            return;
        }

        if (this.options.singleField) {
            var tags = this.assignedTags();
            tags.push(value);
            this._updateSingleTagsField(tags);
        }

        this._trigger('onTagAdded', null, tag);

        this.tagInput.val('');

        this.tagInput.parent().before(tag);

        this._trigger('afterTagAdded', null, {
            tag: tag,
            tagLabel: this.tagLabel(tag),
            duringInitialization: duringInitialization
        });

        if (this.options.showAutocompleteOnFocus && !duringInitialization) {}
    };

    TagIt.prototype.removeTag = function removeTag(tag, animate) {
        animate = typeof animate === 'undefined' ? this.options.animate : animate;

        tag = $(tag);

        this._trigger('onTagRemoved', null, tag);

        if (this._trigger('beforeTagRemoved', null, { tag: tag, tagLabel: this.tagLabel(tag) }) === false) {
            return;
        }

        if (this.options.singleField) {
            var tags = this.assignedTags();
            var removedTagLabel = this.tagLabel(tag);
            tags = $.grep(tags, function (el) {
                return el != removedTagLabel;
            });
            this._updateSingleTagsField(tags);
        }

        if (animate) {
            tag.addClass('removed');
            var hide_args = this._effectExists('blind') ? ['blind', { direction: 'horizontal' }, 'fast'] : ['fast'];

            var thisTag = this;
            hide_args.push(function () {
                tag.remove();
                thisTag._trigger('afterTagRemoved', null, { tag: tag, tagLabel: thisTag.tagLabel(tag) });
            });

            tag.fadeOut('fast').hide.apply(tag, hide_args).dequeue();
        } else {
            tag.remove();
            this._trigger('afterTagRemoved', null, { tag: tag, tagLabel: this.tagLabel(tag) });
        }
    };

    TagIt.prototype.removeTagByLabel = function removeTagByLabel(tagLabel, animate) {
        var toRemove = this._findTagByLabel(tagLabel);
        if (!toRemove) {
            throw "No such tag exists with the name '" + tagLabel + "'";
        }
        this.removeTag(toRemove, animate);
    };

    TagIt.prototype.removeAll = function removeAll() {
        var that = this;
        this._tags().each(function (index, tag) {
            that.removeTag(tag, false);
        });
    };

    TagIt.prototype._trigger = function _trigger(type, event, data) {
        var prop, orig;
        var callback = this.options[type];

        data = data || {};
        event = $.Event(event);
        event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type).toLowerCase();

        event.target = this.element[0];

        orig = event.originalEvent;
        if (orig) {
            for (prop in orig) {
                if (!(prop in event)) {
                    event[prop] = orig[prop];
                }
            }
        }

        this.element.trigger(event, data);
        return !($.isFunction(callback) && callback.apply(this.element[0], [event].concat(data)) === false || event.isDefaultPrevented());
    };

    return TagIt;
}()) || _class) || _class) || _class);