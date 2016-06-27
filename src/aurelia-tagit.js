import { inject, noView} from 'aurelia-framework';
import {bindable, customElement} from 'aurelia-templating';
import './aurelia_tagit.css!';
import {BaseConfig} from './base-config'
@customElement('aurelia-tagit')
@noView()
@inject(BaseConfig, Element)
export class TagIt {
    constructor(baseConfig, el) {
        this.element = el;
        this.options = baseConfig.current;
        this.keys = baseConfig.KeyCodes;
    }
    attached() {
        this.create();
    }

    create() {
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
                    // Only match autocomplete options that begin with the search term.
                    // (Case insensitive.)
                    return (element.toLowerCase().indexOf(filter) === 0);
                });
                if (!this.options.allowDuplicates) {
                    choices = this._subtractArray(choices, this.assignedTags());
                }
                showChoices(choices);
            };
        }

        if (this.options.showAutocompleteOnFocus) {
            this.tagInput.focus(function (event, ui) {
                // that._showAutocomplete();
            });

            if (typeof this.options.autocomplete.minLength === 'undefined') {
                this.options.autocomplete.minLength = 0;
            }
        }

        // Bind autocomplete.source callback functions to this context.
        if ($.isFunction(this.options.autocomplete.source)) {
            this.options.autocomplete.source = $.proxy(this.options.autocomplete.source, this);
        }

        // DEPRECATED.
        if ($.isFunction(this.options.tagSource)) {
            this.options.tagSource = $.proxy(this.options.tagSource, this);
        }

        this.tagList
            .addClass('tagit')
            .addClass('ui-widget ui-widget-content ui-corner-all')
            // Create the input field.
            .append($('<li class="tagit-new"></li>').append(this.tagInput))
            .click(function (e) {
                var target = $(e.target);
                if (target.hasClass('tagit-label')) {
                    var tag = target.closest('.tagit-choice');
                    if (!tag.hasClass('removed')) {
                        that._trigger('onTagClicked', e, { tag: tag, tagLabel: that.tagLabel(tag) });
                    }
                } else {
                    // Sets the focus() to the input field, if the user
                    // clicks anywhere inside the UL. This is needed
                    // because the input field needs to be of a small size.
                    that.tagInput.focus();
                }
            });

        // Single field support.
        var addedExistingFromSingleFieldNode = false;
        if (this.options.singleField) {
            if (this.options.singleFieldNode) {
                // Add existing tags from the input field.
                var node = $(this.options.singleFieldNode);
                var tags = node.val().split(this.options.singleFieldDelimiter);
                node.val('');
                $.each(tags, function (index, tag) {
                    that.createTag(tag, null, true);
                    addedExistingFromSingleFieldNode = true;
                });
            } else {
                // Create our single field input after our list.
                this.options.singleFieldNode = $('<input type="hidden" style="display:none;" value="" name="' + this.options.fieldName + '" />');
                this.tagList.after(this.options.singleFieldNode);
            }
        }

        // Add existing tags from the list, if any.
        if (!addedExistingFromSingleFieldNode) {
            this.tagList.children('li').each(function () {
                if (!$(this).hasClass('tagit-new')) {
                    that.createTag($(this).text(), $(this).attr('class'), true);
                    $(this).remove();
                }
            });
        }

        // Events.
        this.tagInput
            .keydown(function (event) {
                // Backspace is not detected within a keypress, so it must use keydown.
                if (event.which == that.keys.BACKSPACE && that.tagInput.val() === '') {
                    var tag = that._lastTag();
                    if (!that.options.removeConfirmation || tag.hasClass('remove')) {
                        // When backspace is pressed, the last tag is deleted.
                        that.removeTag(tag);
                    } else if (that.options.removeConfirmation) {
                        tag.addClass('remove ui-state-highlight');
                    }
                } else if (that.options.removeConfirmation) {
                    that._lastTag().removeClass('remove ui-state-highlight');
                }

                // Comma/Space/Enter are all valid delimiters for new tags,
                // except when there is an open quote or if setting allowSpaces = true.
                // Tab will also create a tag, unless the tag input is empty,
                // in which case it isn't caught.
                if (
                    (event.which === that.keys.COMMA && event.shiftKey === false) ||
                    event.which === that.keys.ENTER ||
                    (
                        event.which == that.keys.TAB &&
                        that.tagInput.val() !== ''
                    ) ||
                    (
                        event.which == that.keys.SPACE &&
                        that.options.allowSpaces !== true &&
                        (
                            $.trim(that.tagInput.val()).replace(/^s*/, '').charAt(0) != '"' ||
                            (
                                $.trim(that.tagInput.val()).charAt(0) == '"' &&
                                $.trim(that.tagInput.val()).charAt($.trim(that.tagInput.val()).length - 1) == '"' &&
                                $.trim(that.tagInput.val()).length - 1 !== 0
                            )
                        )
                    )
                ) {
                    // Enter submits the form if there's no text in the input.
                    if (!(event.which === that.keys.ENTER && that.tagInput.val() === '')) {
                        event.preventDefault();
                    }

                    // Autocomplete will create its own tag from a selection and close automatically.
                    if (!(that.options.autocomplete.autoFocus && that.tagInput.data('autocomplete-open'))) {
                        // that.tagInput.autocomplete('close');
                        that.createTag(that._cleanedInput());
                    }
                }
            }).blur(function (e) {
                // Create a tag when the element loses focus.
                // If autocomplete is enabled and suggestion was clicked, don't add it.
                // if (!that.tagInput.data('autocomplete-open')) {
                //     that.createTag(that._cleanedInput());
                // }
            });

        // Autocomplete.
        if (this.options.availableTags || this.options.tagSource || this.options.autocomplete.source) {
            var autocompleteOptions = {
                select: function (event, ui) {
                    that.createTag(ui.item.value);
                    // Preventing the tag input to be updated with the chosen value.
                    return false;
                }
            };
            $.extend(autocompleteOptions, this.options.autocomplete);

            // tagSource is deprecated, but takes precedence here since autocomplete.source is set by default,
            // while tagSource is left null by default.
            autocompleteOptions.source = this.options.tagSource || autocompleteOptions.source;

            // this.tagInput.autocomplete(autocompleteOptions).bind('autocompleteopen.tagit', function (event, ui) {
            //     that.tagInput.data('autocomplete-open', true);
            // }).bind('autocompleteclose.tagit', function (event, ui) {
            //     that.tagInput.data('autocomplete-open', false);
            // });

            // this.tagInput.autocomplete('widget').addClass('tagit-autocomplete');
        }
    }
    destroy() {
        $.Widget.prototype.destroy.call(this);

        this.element.unbind('.tagit');
        this.tagList.unbind('.tagit');

        this.tagInput.removeData('autocomplete-open');

        this.tagList.removeClass([
            'tagit',
            'ui-widget',
            'ui-widget-content',
            'ui-corner-all',
            'tagit-hidden-field'
        ].join(' '));

        if (this.element.is('input')) {
            this.element.removeClass('tagit-hidden-field');
            this.tagList.remove();
        } else {
            this.element.children('li').each(function () {
                if ($(this).hasClass('tagit-new')) {
                    $(this).remove();
                } else {
                    $(this).removeClass([
                        'tagit-choice',
                        'ui-widget-content',
                        'ui-state-default',
                        'ui-state-highlight',
                        'ui-corner-all',
                        'remove',
                        'tagit-choice-editable',
                        'tagit-choice-read-only'
                    ].join(' '));

                    $(this).text($(this).children('.tagit-label').text());
                }
            });

            if (this.singleFieldNode) {
                this.singleFieldNode.remove();
            }
        }

        return this;
    }
    _cleanedInput() {
        // Returns the contents of the tag input, cleaned and ready to be passed to createTag
        return $.trim(this.tagInput.val().replace(/^"(.*)"$/, '$1'));
    }
    _showAutocomplete() {
        this.tagInput.autocomplete('search', '');
    }
    tagLabel(tag) {
        // Returns the tag's string label.
        if (this.options.singleField) {
            return $(tag).find('.tagit-label:first').text();
        } else {
            return $(tag).find('input:first').val();
        }
    }
    _subtractArray(a1, a2) {
        var result = [];
        for (var i = 0; i < a1.length; i++) {
            if ($.inArray(a1[i], a2) == -1) {
                result.push(a1[i]);
            }
        }
        return result;
    }
    _lastTag() {
        return this.tagList.find('.tagit-choice:last:not(.removed)');
    }

    _tags() {
        return this.tagList.find('.tagit-choice:not(.removed)');
    }

    assignedTags() {
        // Returns an array of tag string values
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
    }

    _updateSingleTagsField(tags) {
        // Takes a list of tag string values, updates this.options.singleFieldNode.val to the tags delimited by this.options.singleFieldDelimiter
        $(this.options.singleFieldNode).val(tags.join(this.options.singleFieldDelimiter)).trigger('change');
    }
    _isNew(name) {
        return !this._findTagByLabel(name);
    }
    _findTagByLabel(name) {
        var that = this;
        var tag = null;
        this._tags().each(function (i) {
            if (that._formatStr(name) == that._formatStr(that.tagLabel(this))) {
                tag = $(this);
                return false;
            }
        });
        return tag;
    }
    _effectExists(name) {
        return Boolean($.effects && ($.effects[name] || ($.effects.effect && $.effects.effect[name])));
    }
    _formatStr(str) {
        if (this.options.caseSensitive) {
            return str;
        }
        return $.trim(str.toLowerCase());
    }
    createTag(value, additionalClass, duringInitialization) {
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

        // Create tag.
        var tag = $('<li></li>')
            .addClass('tagit-choice ui-widget-content ui-state-default ui-corner-all')
            .addClass(additionalClass)
            .append(label);

        if (this.options.readOnly) {
            tag.addClass('tagit-choice-read-only');
        } else {
            tag.addClass('tagit-choice-editable');
            // Button for removing the tag.
            var removeTagIcon = $('<span></span>')
                .addClass('ui-icon ui-icon-close');
            var removeTag = $('<a><span class="text-icon">\xd7</span></a>') // \xd7 is an X
                .addClass('tagit-close')
                .append(removeTagIcon)
                .click(function (e) {
                    // Removes a tag when the little 'x' is clicked.
                    that.removeTag(tag);
                });
            tag.append(removeTag);
        }

        // Unless options.singleField is set, each tag has a hidden input field inline.
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

        // DEPRECATED.
        this._trigger('onTagAdded', null, tag);

        this.tagInput.val('');

        // Insert tag.
        this.tagInput.parent().before(tag);

        this._trigger('afterTagAdded', null, {
            tag: tag,
            tagLabel: this.tagLabel(tag),
            duringInitialization: duringInitialization
        });

        if (this.options.showAutocompleteOnFocus && !duringInitialization) {
            // setTimeout(function () { that._showAutocomplete(); }, 0);
        }
    }
    removeTag(tag, animate) {
        animate = typeof animate === 'undefined' ? this.options.animate : animate;

        tag = $(tag);

        // DEPRECATED.
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
            tag.addClass('removed'); // Excludes this tag from _tags.
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

    }

    removeTagByLabel(tagLabel, animate) {
        var toRemove = this._findTagByLabel(tagLabel);
        if (!toRemove) {
            throw "No such tag exists with the name '" + tagLabel + "'";
        }
        this.removeTag(toRemove, animate);
    }
    removeAll() {
        // Removes all tags.
        var that = this;
        this._tags().each(function (index, tag) {
            that.removeTag(tag, false);
        });
    }
    _trigger( type, event, data ) {
		var prop, orig;
		var callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();

		// The original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// Copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[ 0 ], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
}