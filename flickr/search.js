//namespacing
(function(window) {
    window.Flickr = window.Flickr || {};

    var API_KEY = '949e98778755d1982f537d56236bbb42',
        SEARCH_ENDPOINT = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&page=PAGENUMBER&per_page=250&api_key=' + API_KEY +
        '&text=PLACEHOLDER&extras=&format=json&nojsoncallback=1&extras=description,license,date_upload,date_taken,owner_name,icon_server,original_format,last_update,geo,tags,machine_tags,o_dims,views,media,path_alias,url_t,url_s,url_q,url_m,url_n,url_z,url_c,url_l',

        currentPage = 1,
        photoCache = [],
        totalImages = 0,
        preloadedImages = [],
        totalPages = 1,

        Search = {
            init: function() {
                //any
                this.ui = {};
                this.ui.query = document.getElementById('query');
                this.ui.query.focus();
                this.ui.query.setSelectionRange(0, 100);
                this.ui.search = document.getElementById('search');
                this.ui.loadMore = document.getElementById('load-more');
                this.ui.loadAll = document.getElementById('load-all');
                this.ui.scrollToBottom = document.getElementById('scroll-to-bottom');
                this.ui.clear = document.getElementById('clear');
                this.ui.results = document.getElementById('results');
                this.ui.close = document.getElementById('close');
                this.attachEvents();
                window.onunload = this.destroy;
            },

            templateItem: function(item) {
                var templateStr = '<div class="result" data-photoid="' + item.id + '"> \
                            <div><img src=""></div> \
                            <div class="metadata"> \
                                <div class="title">' + item.title + '</div> \
                                <div class="attribution">' + item.ownername + '</div> \
                            </div> \
                        </div>';
                var div = document.createElement('div');
                div.innerHTML = templateStr;
                return div.firstChild;

            },

            attachEvents: function() {
                this.ui.query.addEventListener('keydown', this.searchOnEnter.bind(this));
                this.ui.search.addEventListener('click', this.do_a_search.bind(this));
                this.ui.loadMore.addEventListener('click', this.loadMore.bind(this));
                this.ui.loadAll.addEventListener('click', this.loadAll.bind(this));
                this.ui.scrollToBottom.addEventListener('click', this.scrollToBottom);
                this.ui.clear.addEventListener('click', this.clearResults);
                this.ui.close.addEventListener('click', this.closeLightBox.bind(this));
                //delegation
                this.ui.results.addEventListener('click', this.goToImage);

            },

            performSearch: function(query, pageNumber) {
                //base case
                if (pageNumber > totalPages) {
                    return;
                }
                return new Promise(function(resolve, reject) {
                    var xhr = new XMLHttpRequest(),
                        newSearchURL = SEARCH_ENDPOINT.replace('PLACEHOLDER', query).replace('PAGENUMBER', pageNumber);
                    // that = this;


                    var loadingElement = document.getElementsByClassName('loading')[0];

                    loadingElement.className = loadingElement.className.replace('hide', '');

                    xhr.open('GET', newSearchURL, true);
                    xhr.onreadystatechange = function() {

                        if (xhr.readyState !== 4 || xhr.status !== 200) {
                            return;
                        }


                        var results = JSON.parse(xhr.responseText);
                        resolve(results);

                    };

                    xhr.send(null);

                });



            },
            loadAll: function() {
                this.performSearch(document.getElementById('query').value, currentPage).then(this.handleResponse.bind(this)).then(function() {
                    if (currentPage <= totalPages) {
                        currentPage++;
                        var loadingElement = document.getElementsByClassName('loading')[0];
                        loadingElement.className = loadingElement.className.replace('hide', '');
                        this.loadAll();
                    } else {
                        //hide the 'loading..' over here
                    }
                }.bind(this));

            },

            loadMore: function() {
                currentPage++;

                var loadingElement = document.getElementsByClassName('loading')[0];

                loadingElement.className = loadingElement.className.replace('hide', '');

                this.performSearch(document.getElementById('query').value, currentPage).then(this.handleResponse.bind(this));
            },

            handleResponse: function(results) {
                return new Promise(function(resolve, reject) {
                    if (!results) return;
                    totalPages = results.photos && results.photos.pages;
                    // console.log(results);
                    var length = (results && results.photos && results.photos.photo && results.photos.photo.length) || 0;
                    // var fragment = document.createDocumentFragment();
                    for (var n = 0; n < length; n++) {
                        // var templateHolder = document.createElement('div');
                        var photoSizeUrl = results.photos.photo[n] && (results.photos.photo[n].url_l || results.photos.photo[n].url_c || results.photos.photo[n].url_z);
                        // var template = '<div class="result" data-photoid="' + results.photos.photo[n].id + '"><div><img src=""></div><div class="metadata"><div class="title">' +
                        //     results.photos.photo[n].title + '</div><div class="attribution">' + results.photos.photo[n].ownername + '</div></div></div>';


                        // document.getElementById('results').appendChild(templateHolder);

                        if (photoSizeUrl) {
                            // fragment.appendChild(this.templateItem(results.photos.photo[n]));
                            photoCache.push(results.photos.photo[n]);
                        }

                        // this.preloadImage(results.photos.photo[n].id, photoSizeUrl);
                    }

                    // this.ui.results.appendChild(fragment);


                    var loadingElement = document.getElementsByClassName('loading')[0];

                    loadingElement.className += ' hide';

                    totalImages = parseInt(results.photos.total, 10);

                    document.getElementsByClassName('loaded-percent')[0].innerHTML = parseInt((photoCache.length / totalImages) * 100, 10) + '%';
                    this.throttleImageLoad(photoCache, 6, this.preloadImage).then(function() {
                        resolve();
                    });
                }.bind(this));


            },
            scrollToBottom: function() {
                window.scrollTo(0, document.body.scrollHeight);
            },

            clearResults: function() {
                document.getElementById('results').innerHTML = '';
            },

            goToImage: function(event) {
                // event.preventDefault();

                var photoPageUrl = '',
                    photoId = event.target.dataset.photoid,
                    clickedElement = event.target;

                // Look for the parent with the data-photoid attribute
                if (clickedElement.className.indexOf('result') === -1) {
                    clickedElement = clickedElement.parentElement;
                    // photoId = clickedElement.dataset.photoid;

                    if (clickedElement.className.indexOf('result') === -1) {
                        clickedElement = clickedElement.parentElement;
                        // photoId = clickedElement.dataset.photoid;

                        if (clickedElement.className.indexOf('result') === -1) {
                            clickedElement = clickedElement.parentElement;
                            // photoId = clickedElement.dataset.photoid;

                            if (clickedElement.className.indexOf('result') === -1) {
                                clickedElement = clickedElement.parentElement;
                                // photoId = clickedElement.dataset.photoid;
                            }
                        }
                    }
                }
                // clickedElement.className = clickedElement.className + ' zoom';
                // for (var n = 0; n < photoCache.length; n++) {
                //     if (photoId === photoCache[n].id) {
                //         photoPageUrl = 'https://www.flickr.com/photos/' + photoCache[n].owner + '/' + photoCache[n].id;
                //     }
                // }

                // This would be better as a lightbox
                // window.location = photoPageUrl;
                var lightbox = document.getElementById('lightbox');
                lightbox.getElementsByTagName('img')[0].src = clickedElement.getElementsByTagName('img')[0].src;
                lightbox.getElementsByClassName('title')[0].innerHTML = clickedElement.getElementsByClassName('title')[0].textContent;
                lightbox.getElementsByClassName('attribution')[0].innerHTML = clickedElement.getElementsByClassName('attribution')[0].textContent;
                lightbox.className = '';

            },
            throttleImageLoad: function(images, maxConcurrency, cb) {
                return new Promise(function(resolve, reject) {
                    var totalImages = images.length;
                    var currentlyLoaded = 0;
                    this.throttler(images, maxConcurrency, cb, currentlyLoaded, totalImages, resolve);
                }.bind(this));
            },
            throttler: function(images, maxConcurrency, cb, currentlyLoaded, totalImages, done) {
                if (!images || images.length === 0) {

                    //base case
                    return;
                }
                this.max = maxConcurrency || 8;
                this.count = 0;
                this.cb = cb;
                this.images = images;


                var promises = [];
                this.renderImages(this.images.slice(0, this.max));
                while (this.count < maxConcurrency) {
                    promises.push(cb.call(this, images[this.count]));

                    this.count += 1;
                }
                Promise.all(promises).then(function() {
                    currentlyLoaded += this.max;
                    if (currentlyLoaded >= totalImages) {
                        done();
                        return;
                    } else {
                        this.throttler.call(this, this.images.slice(maxConcurrency), this.max, this.cb, currentlyLoaded, totalImages, done);
                    }

                }.bind(this));





                // .catch (function(err) {
                //     // catch any error that happened so far
                //     // display error
                //     console.log('error occured while loading');
                // });

            },
            renderImages: function(images) {
                var that = this,
                    fragment = document.createDocumentFragment();
                images.forEach(function(imageMap) {
                    fragment.appendChild(that.templateItem(imageMap));
                });

                this.ui.results.appendChild(fragment);

            },

            preloadImage: function(imgMap) {
                return promise = new Promise(function(resolve, reject) {
                    var image = new Image(),
                        url = '';
                    url = imgMap && (imgMap.url_l || imgMap.url_c || imgMap.url_z);
                    if (!url) {
                        resolve();
                        return;
                    }
                    image.onload = function(event) {
                        if (event.type === 'load') {
                            document.querySelectorAll('[data-photoid="' + imgMap.id + '"]')[0].querySelectorAll('img')[0].setAttribute('src', url);
                            resolve();
                        }

                    };

                    image.onerror = function(e) {
                        // reject();
                    };


                    image.src = url;
                    preloadedImages.push(image);

                });

            },
            closeLightBox: function() {
                this.ui.close.parentElement.className = 'hide';
            },
            do_a_search: function() {
                this.performSearch(document.getElementById('query').value, 1).then(this.handleResponse.bind(this));
            },
            searchOnEnter: function(event) {
                if (event.keyCode === 13) {
                    this.do_a_search();
                }
            },

            destroy: function() {
                //detach events
            }

        };

    Flickr.Search = Search;
    return Search;
}(window));
