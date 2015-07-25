(function (window) {
    'use strict';

    var FW = window.FW = {};

    FW.mixins = {};
    FW.mixins.EventManager = {

        init: function () {
            this._events = {};
            this._subscriber = {};
        },

        subscribe: function (event, obj) {
            this._subscriber[event] || (this._subscriber[event] = {});
            this._subscriber[event][obj.cId] = obj;
        },
        unsubscribe: function (event, obj) {
            if (this._subscriber[event]) {
                if (obj && this._subscriber[event][obj.cId]) {
                    delete this._subscriber[event][obj.cId];
                } else {
                    delete this._subscriber[event];
               }
            }
        },
        isSubscribed: function (event, obj) {
            if (obj && this._subscriber[event]) {
                return !!this._subscriber[event][obj.cId];
            } else {
                return !!this._subscriber[event];
            }
        },
        getSubscribers: function () {
            var result = [];
            _.each(this._subscriber, function (subscriberList) {
                result = result.concat(_.values(subscriberList));
            }, this);
            return result;
        },
        unsubscribeAll: function () {
            var subscribers = this.getSubscribers();
            _.each(subscribers, function (subscriber) {
                subscriber.stopListening(this);
            }, this);
        },

        trigger: function (event) {
            var args = Array.prototype.slice.call(arguments);
            args.shift();

            if (this._subscriber[event]) {
                _.each(this._subscriber[event], function (object) {
                    object._trigger(event, args);
                }, this);
            }
        },

        _trigger: function (event, args) {
            if (this._events[event]) {
                _.each(this._events[event], function (info) {
                    info.fn.apply(this, args);
                }, this);
            }
        },

        listenTo: function (obj, event, fn) {
            this._events[event] || (this._events[event] = []);
            this._events[event].push({
                obj: obj,
                fn: fn
            });
            obj.subscribe(event, this);
        },
        stopListening: function (obj, event, fn) {

            _.each(this._events, function (items, currentEvent) {
                var removeItems = [];

                _.each(items, function (item, index) {

                    if (!obj && !event && !fn) {
                        item.obj.unsubscribe(event, this);
                    } else if ((obj && !event && !fn) && (item.obj === obj)) {
                        item.obj.unsubscribe(event, this); removeItems.push(index);
                    } else if ((obj && event && !fn) && (event === currentEvent) && (item.obj === obj)) {
                        item.obj.unsubscribe(event, this); removeItems.push(index);
                    } else if ((obj && event && fn) && (event === currentEvent) && (item.fn === fn) && (item.obj === obj)) {
                        item.obj.unsubscribe(event, this); removeItems.push(index);
                    }

                }, this);

                while(removeItems.length > 0) {
                    delete this._events[currentEvent][removeItems.pop()];
                }
            }, this);

            if (!obj && !event && !fn) {
                this._events = {};
            }
        },
        isListening: function (event) {
            return !!this._events[event];
        }
    };

    FW.Object = function() {
        var mixinOptions;

        this.cId = _.uniqueId('I');

        mixinOptions = this.setup.apply(this, arguments);
        this.initMixins(mixinOptions);
        this.init.apply(this, arguments);
    };
    FW.Object.prototype = _.extend(FW.Object.prototype, {
        _initList: [],

        init: function (options) {
        },
        setup: function (options) {
            return options;
        },
        initMixins: function () {
            _.each(this._initList, function (fn) {
                fn.apply(this, arguments);
            }, this);
        },

        toString: function () {
            return '(I) ' + this.constructor.NAME + ' [' + this.cId + ']';
        }
    });

    _.extend(FW.Object, {
        NAME: 'Object',

        extend: function (nam, protoProps) {

            var Ctor,
                child,
                parent = this;

            child = function() {
                parent.apply(this, arguments);
            };
            _.extend(child, parent, { NAME: nam, parent: parent.prototype });

            Ctor = function () {};
            Ctor.prototype = parent.prototype;

            child.prototype = new Ctor();
            child.prototype._initList = Array.prototype.slice.call(child.prototype._initList);
            _.extend(child.prototype, protoProps, { constructor: child });

            return child;
        },

        mixin: function (obj) {
            var mixinInit = obj.init,
                newObj = _.extend({}, obj);

            delete newObj.init;

            _.extend(this.prototype, newObj);

            if (mixinInit) {
                this.prototype._initList.push(mixinInit);
            }
        },

        toString: function () {
            return '(C) ' + this.NAME;
        }
    });
    FW.Object.mixin(FW.mixins.EventManager);

    FW.AbstractModel = FW.Object.extend('AbstractModel', {

        init: function (attributes, options) {
            var self = this,
                mixinOptions;

            mixinOptions = FW.AbstractModel.parent.init.call(this, options);

            Object.defineProperty(this, "length", {
                get: function() {
                    return self._attributes.length;
                }
            });
            Object.defineProperty(this, "isEmpty", {
                get: function() {
                    return (self.length === 0);
                }
            });

            this.clear();
            if (attributes) {
                this._set(attributes, { silent:true });
            }

            return mixinOptions;
        },


        has: function (attribute) {
            return (this._attributes[attribute] !== undefined);
        },

        remove: function (attribute, options) {
            var obj = {};
            obj[attribute] = undefined;
            this._set(obj, options);
        },

        clear: function () {
            this._attributes = {};
        },

        all: function () {
            return this._attributes;
        },

        validate: function (values) {
            return true;
        },

        _get: function (attribute) {
            return this._attributes[attribute];
        },

        _set: function (values, options) {

            if (!options || (options.validate === false)) {
                if (!this.validate(values)) {
                    return;
                }
            }

            _.each(values, function (value, attribute) {
                var previousValue = this._attributes[attribute];

                if (value === undefined) {
                    delete this._attributes[attribute];
                } else {
                    this._attributes[attribute] = value;
                }

                if (!(options && options.silent)) {
                    this.trigger('change:' + attribute, value, previousValue, options);
                }
            }, this);

            if (!(options && options.silent)) {
                this.trigger('change', values, options);
            }
        }
    });

    FW.Model = FW.AbstractModel.extend('Model', {
        get: function (attribute) {
            return this._attributes[attribute];
        },

        set: function (attribute, value, options) {
            if (_.isObject(attribute)) {
                this._set(attribute, value);
            } else {
                var obj = {};
                obj[attribute] = value;
                this._set(obj, options);
            }
        },

        toJson: function () {
            return _.clone(this._attributes);
        }
    });

    FW.ComponentList = FW.AbstractModel.extend('ComponentList', {

        getContext: function (name) {
            return this._attributes[name];
        },

        getComponent: function (name) {
            return this.getContext(name).component;
        },

        remove: function (name, options) {
            this.trigger('remove', name);
            FW.ComponentList.parent.remove.call(this, name, options);
        },

        _add: function (name, data, options) {
            var obj = {};
            obj[name] = data;
            this._set(obj, options);
            this.trigger('add', name);
        },

        append: function (name, component, domSelector, options) {
            this._add(name, {
                component: component,
                domSelector: domSelector,
                positioning: 'append'
            }, options);
        },

        prepend: function (name, component, domSelector, options) {
            this._add(name, {
                component: component,
                domSelector: domSelector,
                positioning: 'prepend'
            }, options);
        }
    });


    FW.List = FW.Object.extend('List', {

        init: function (models, options) {
            var self = this,
                mixinOptions;

            mixinOptions = FW.List.parent.init.call(this, options);

            Object.defineProperty(this, "length", {
                get: function() {
                    return self._data.length;
                }
            });
            Object.defineProperty(this, "isEmpty", {
                get: function() {
                    return (self.length === 0);
                }
            });

            this.clear();
            if (models) {
                this.add(models, { silent:true });
            }

            return mixinOptions;
        },

        indexOf: function (callback) {
            var len = this._data.length;
            for(var i = 0; i < len; i++) {
                if (callback(this._data[i])) return i;
            }
            return -1;
        },
        find: function (field, value) {
            return this.indexOf(function (entry) { return (entry.get(field) == value); });
        },

        get: function (index) {
            return this._data[index];
        },

        add: function (obj, options) {
            var self = this;

            if (!_.isArray(obj)) {
                obj = [obj];
            }

            _.each(obj, function (el) {
                (function (el) {
                    self.listenTo(el, 'change', function (values, options) {
                        self.trigger('update', el, values, options);
                    });
                    self._data.push(el);
                }(el));
            }, this);

            if (!(options && options.silent)) {
                _.each(obj, function (el) {
                    this.trigger('add', el, options);
                }, this);
                this.trigger('change', null, obj, options);
            }
        },

        remove: function (index, options) {
            var obj = this._data[index],
                removedItems = this._data.splice(index, 1);

            _.each(removedItems, function (removedItem) {
                this.stopListening(removedItem);
            }, this);

            if (!(options && options.silent)) {
                this.trigger('remove', index, obj, options);
                this.trigger('change', index, obj, options);
            }
        },

        clear: function (options) {
            var all = this.all;
            this._data = [];
            if (!(options && options.silent)) {
                this.trigger('clear', all, options);
                this.trigger('change', null, all, options);
            }
        },

        all: function () {
            return Array.prototype.slice.call(this._data);
        },

        toJson: function () {
            return _.map(this.all(), function (entry) { return entry.toJson(); });
        }
    });

    FW.Component = FW.Object.extend('Component', {

        init: function (options) {

            var mixinOptions;

            mixinOptions = FW.Component.parent.init.call(this, options);

            this._$el = $('<div></div>');
            this._template = options.template || 'No template available!';
            this._components = new FW.ComponentList();
            this._delegates = [];

            this.listenTo(this._components, 'add', function (name) {
                this.components().getComponent(name).load();
                this.render();
            });
            this.listenTo(this._components, 'remove', function (name) {
                this.components().getComponent(name).unload();
            });
            this.listenTo(this, 'unload', function () {
                this.removeDelegates();
                this.stopListening();
                this.unsubscribeAll();
                this.removeFromDom(0);
            });

            return mixinOptions;
        },

        _activateDelegate: function (delegate) {
            if (!delegate.selector) {
                this._$el.on(delegate.event + '.delegateEvents' + this.cId, delegate.callback);
            } else {
                this._$el.on(delegate.event + '.delegateEvents' + this.cId, delegate.selector, delegate.callback);
            }
        },
        addDelegate: function (event, selector, callback) {
            var delegate;
            this._delegates.push(delegate = {
                event: event,
                selector: selector,
                callback: _.bind(callback, this)
            });
            this._activateDelegate(delegate);
        },
        activateDelegates: function () {
            _.each(this._delegates, function (delegate) {
                this._activateDelegate(delegate);
            }, this);
        },
        removeDelegates: function () {
            this._$el.off('.delegateEvents' + this.cId);
        },

        fieldsToJson: function () {
            var elements = this._$el.find('.sw-form'),
                result = {};
            _.each(elements, function (el) {
                var $el = $(el);
                result[$el.attr("name")] = $el.val();
            }, this);
            return result;
        },
        jsonToFields: function (values) {
            var elements = this._$el.find('.sw-form');
            _.each(elements, function (el) {
                var $el = $(el);
                $el.val(values[$el.attr("name")]);
            }, this);
        },

        show: function () {
            this._$el.css('display', '');
        },
        hide: function () {
            this._$el.css('display', 'none');
        },

        find: function () {
            return this._$el.find.apply(this._$el, arguments);
        },

        getTemplate: function () {
            return this._template;
        },
        getElement: function () {
            return this._$el;
        },

        components: function () {
            return this._components;
        },

        load: function () {
            this.trigger('load');
        },
        unload: function () {
            this.trigger('unload');
        },

        removeFromDom: function (level) {
            var $el = this.getElement();
            this.trigger('removeFromDom', level);
            $el.remove();
        },
        addToDom: function ($selector, context, level) {
            $selector[context.positioning](this.getElement());
            this.trigger('addToDom', $selector, context, level);
        },

        modifyViewData: function (data) {
            return data;
        },

        _removeComponentsFromDom: function (level) {
            var components = this.components().all();

            this.trigger('removeComponentsFromDom', level);

            _.each(components, function (componentContext) {
                componentContext.component.removeFromDom(level + 1);
            }, this);
        },

        _addComponentsToDom: function (componentSelectors, level) {
            var components = this.components().all();

            this.trigger('addComponentsToDom', level);

            _.each(components, function (componentContext, componentName) {
                componentContext.component.addToDom(componentSelectors[componentName], componentContext, level + 1);
            }, this);
        },

        _findComponentsDomSelectors: function (level) {
            var components = this.components().all(),
                $el = this.getElement(),
                foundSelectors = {};

            _.each(components, function (componentContext, componentName) {
                var selector = componentContext.domSelector,
                    $selector = $el.find(selector);

                foundSelectors[componentName] = $selector.first();
            }, this);

            return foundSelectors;
        },

        _renderComponents: function (level) {
            var components = this.components().all();

            this.trigger('renderComponents', level);

            _.each(components, function (componentContext) {
                componentContext.component.render(level + 1);
            }, this);
        },


        render: function (level) {
            var template = this.getTemplate(),
                componentSelectors,
                data,
                html;

            level || (level = 0);

            this.trigger('render', level);

            this.removeDelegates();
            this._removeComponentsFromDom(level);

            data = this.modifyViewData({});

            if (_.isString(template)) {
                html = template;
            } else {
                html = template(data);
            }

            this.getElement().html(html);

            componentSelectors = this._findComponentsDomSelectors(level);
            this._renderComponents(level);
            this._addComponentsToDom(componentSelectors, level);

            this.activateDelegates();

            this.trigger('postRender', level);
        }
    });

}(window));