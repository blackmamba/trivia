(function() {
    'use strict';
    var data = [{
        id: 0,
        name: 'component1',
        detail: 'Component 1',
        price: 100,
        quantity: 10

    }, {
        id: 1,
        name: 'component2',
        detail: 'Component 2',
        price: 120,
        quantity: 10
    }, {
        id: 2,
        name: 'component3',
        detail: 'Component 3',
        price: 125,
        quantity: 10

    }];

    function createRootView() {
        try {


            var rootView = new RootComponent({});

            rootView.load();
            rootView.render();
            $('.product-list').append(rootView._$el);
            return rootView;
        } catch (e) {
            throw e;
        }
    }



    var Collection = FW.Object.extend('Collection', {
        init: function(models, options) {
            Collection.parent.init.call(this, options);
            this.models = [];
            if (models.length > 0) {
                this.models = models;
            }
        },
        add: function(element) {
            if (typeof element === 'object') {
                this.models.push(element);
                this.trigger('collection:add', element);
            }
        },

        remove: function(ele) {
            if (typeof ele === 'object')
                _.each(this.models, function(element, index, list) {
                    if (element.id === +ele.id) {
                        //element exists
                        this.models.splice(index, 1);
                        this.trigger('collection:remove', element);
                    }

                }, this);


        }

    });


    var RootComponent = FW.Component.extend('RootComponent', {
            init: function(options) {
                // options.el = $('<li></li>');
                this.collection = new Collection(data);

                options.template = '<ul class="hookLevel1"></ul>';
                RootComponent.parent.init.call(this, options);
                this.listenTo(this, 'load', this._onLoad);
                // this.listenTo(this, 'render', this.attachEvents);
                $('.addItem').on('click', this.addItem.bind(this));
                $('.product-list').on('click', 'li', this.showDetailView.bind(this));

                this.listenTo(this.collection, 'collection:add', this.updateUI);
                $('.product-list').on('click', 'span.delete', this.removeItem.bind(this));
                // this.listenTo(collection, 'remove', this.updateUI)
            },
            removeItem: function(e) {
                e.stopPropagation();
                var tar = e.target;
                tar = $(tar).parents('li');
                var id = +tar.find('span[name="id"]').text();
                if (id) {
                    this.collection.remove({'id': +id});
                }
                tar.remove();
            },

            showDetailView: function(e) {
                var tar = e.target;
                var item = $(tar);
                var data = {
                    id: item.find('span[name="id"]').text(),
                    name: item.find('span[name="name"]').text(),
                    detail: item.find('span[name="detail"]').text(),
                    price: +item.find('span[name="price"]').text(),
                    quantity: +item.find('span[name="quantity"]').text()
                };

                var tpl = _.template($('#editView').html());
                $('.dynamic').html(tpl(data)).show();
                $('.const').hide();
            },

            _onLoad: function() {
                var that = this;
                _.each(this.collection.models, function(element, index, list) {
                    that.components().append('component' + index, new Component({
                        id: element.id,
                        name: element.name,
                        detail: element.detail,
                        price: element.price,
                        quantity: element.quantity
                    }), '.hookLevel1');
                });

                console.log("onload called");

            },

            updateUI: function(element) {
                this.components().append('component' + this.collection.models.length, new Component({
                    id: element.id,
                    name: element.name,
                    detail: element.detail,
                    price: element.price,
                    quantity: element.quantity
                }), '.hookLevel1');

            },

            addItem: function() {
                this.showForm();
            },

            showForm: function() {
                $('.dynamic').html($('#addItem').html()).show();
                $('.dynamic button.save').on('click', this.save.bind(this));

                $('.const').hide();

                // $('.dynamic ')
            },

            save: function() {
                var item = $('.dynamic .item');
                this.collection.add({
                    id: this.collection.models.length,
                    name: item.find('input[name="name"]').val(),
                    detail: item.find('input[name="detail"]').val(),
                    price: +item.find('input[name="price"]').val(),
                    quantity: +item.find('input[name="quantity"]').val()
                });
                $('.dynamic button.save').off('click', this.save.bind(this));

                $('.const').show();
                $('.dynamic').html('').hide();

            },

            delete: function(e) {

                this.collection.remove({
                    name: item.find('input[name="name"]').val(),
                });
                $('.dynamic button.save').off('click', this.save.bind(this));

                $('.const').show();
                $('.dynamic').html('').hide();

            }
        }),

        Component = FW.Component.extend('Component', {
            init: function(options) {
                options.el = $('<li></li>');
                options.template = '<div class="component">' + '<label>id: </label><span name="id">' + options.id + '</span><br/><label>name: </label><span name="name">' + options.name + '</span><br/><label>detail: </label><span name="detail">' + options.detail + '</span><br/><label>price: </label><span name="price">' + options.price + '</span><br/><label>quantity: </label><span name="quantity">' + options.quantity + '</span><span class="glyphicon glyphicon-trash delete" aria-hidden="true"></span></div>';
                Component.parent.init.call(this, options);
                this.text = options.text;
                
                // this.listenTo(this, 'load', this._onLoad);
            },





        });

    createRootView();
}());
