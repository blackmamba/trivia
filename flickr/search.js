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
                this.ui.loadAll.addEventListener('click', this.loadAll);
                this.ui.scrollToBottom.addEventListener('click', this.scrollToBottom);
                this.ui.clear.addEventListener('click', this.clearResults);
                this.ui.close.addEventListener('click', this.closeLightBox.bind(this));
                //delegation
                this.ui.results.addEventListener('click', this.goToImage);

            },

            performSearch: function(query, pageNumber) {
                var xhr = new XMLHttpRequest(),
                    newSearchURL = SEARCH_ENDPOINT.replace('PLACEHOLDER', query).replace('PAGENUMBER', pageNumber),
                    that = this;


                var loadingElement = document.getElementsByClassName('loading')[0];

                loadingElement.className = loadingElement.className.replace('hide', '');

                xhr.open('GET', newSearchURL, true);
                xhr.onreadystatechange = function() {

                    if (xhr.readyState !== 4 || xhr.status !== 200) {
                        return;
                    }

                    var results = JSON.parse(xhr.responseText);

                    // console.log(results);
                    var length = (results && results.photos && results.photos.photo && results.photos.photo.length) || 0;
                    var fragment = document.createDocumentFragment();
                    var images = [];
                    for (var n = 0; n < length; n++) {
                        // var templateHolder = document.createElement('div');
                        var photoSizeUrl = results.photos.photo[n].url_l || results.photos.photo[n].url_c || results.photos.photo[n].url_z;
                        // var template = '<div class="result" data-photoid="' + results.photos.photo[n].id + '"><div><img src=""></div><div class="metadata"><div class="title">' +
                        //     results.photos.photo[n].title + '</div><div class="attribution">' + results.photos.photo[n].ownername + '</div></div></div>';
                        fragment.appendChild(that.templateItem(results.photos.photo[n]));

                        // document.getElementById('results').appendChild(templateHolder);

                        // templateHolder.addEventListener('click', that.goToImage);

                        photoCache.push(results.photos.photo[n]);
                        // images.push({
                        //     id: results.photos.photo[n].id,
                        //     url: photoSizeUrl
                        // });
                        // that.preloadImage(results.photos.photo[n].id, photoSizeUrl);
                    }

                    that.ui.results.appendChild(fragment);
                    that.preloadImage(photoCache);


                    var loadingElement = document.getElementsByClassName('loading')[0];

                    loadingElement.className += ' hide';

                    totalImages = parseInt(results.photos.total, 10);

                    document.getElementsByClassName('loaded-percent')[0].innerHTML = parseInt((photoCache.length / totalImages) * 100, 10) + '%';

                };

                xhr.send(null);
            },

            loadMore: function() {
                currentPage++;

                var loadingElement = document.getElementsByClassName('loading')[0];

                loadingElement.className = loadingElement.className.replace('hide', '');

                this.performSearch(document.getElementById('query').value, currentPage);
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
                    photoId = clickedElement.dataset.photoid;

                    if (clickedElement.className.indexOf('result') === -1) {
                        clickedElement = clickedElement.parentElement;
                        photoId = clickedElement.dataset.photoid;

                        if (clickedElement.className.indexOf('result') === -1) {
                            clickedElement = clickedElement.parentElement;
                            photoId = clickedElement.dataset.photoid;

                            if (clickedElement.className.indexOf('result') === -1) {
                                clickedElement = clickedElement.parentElement;
                                photoId = clickedElement.dataset.photoid;
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

            preloadImage: function(images) {


                images.forEach(function(imgMap) {
                    var image = new Image(),
                    url = imgMap.url_l || imgMap.url_c || imgMap.url_z;

                    image.onload = (function(event) {
                        if (event.type === 'load') {
                            document.querySelectorAll('[data-photoid="' + imgMap.id + '"]')[0].querySelectorAll('img')[0].setAttribute('src', url);
                        }
                    });

                    image.src = url;
                    preloadedImages.push(image);

                });

            },
            closeLightBox: function() {
                this.ui.close.parentElement.className = 'hide';
            },
            do_a_search: function() {
                this.performSearch(document.getElementById('query').value, 1);
            },
            searchOnEnter: function(event) {
                if (event.keyCode === 13) {
                    this.do_a_search();
                }
            },

            destroy: function() {
                //remove events
            }

        };

    Flickr.Search = Search;
    return Search;
}(window));

