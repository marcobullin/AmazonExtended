(function () {
    "use strict";

    var AmazonExtended = function () {
        var data = {
                uk : {
                    name: 'United Kingdom',
                    url: 'http://www.amazon.co.uk'
                },

                com : {
                    name: 'United States',
                    url: 'http://www.amazon.com'
                },

                fr : {
                    name: 'France',
                    url: 'http://www.amazon.fr'
                },

                es : {
                    name: 'Spain',
                    url: 'http://www.amazon.es'
                },

                jp : {
                    name: 'Japan',
                    url: 'http://www.amazon.co.jp'
                },

                cn : {
                    name: 'China',
                    url: 'http://www.amazon.cn'
                },

                it : {
                    name: 'Italy',
                    url: 'http://www.amazon.it'
                },

                de : {
                    name: 'Germany',
                    url: 'http://www.amazon.de'
                }
            },

            /**
             * @var string currentUrl
             */
            currentUrl = window.location.href,

            /**
             * @var string key - "dp" || "product"
             */
            key,

            /**
             * @var string asin - amazon standard identification number
             */
            asin,

            /**
             * @var string config - users config settings
             */
            config,

            /**
             * This method renders the reviews and ratings content
             */
            renderReviewsAndRatings = function () {},

            /**
             * This method renders the tab menu
             */
            addTabMenu = function () {},

            /**
             * This method adds a tab item to the tab menu
             */
            addTabMenuItem = function () {},

            /**
             * This method renders the customer ratings (stars)
             */
            renderStarsOverview = function () {};

        // if we don't find what we are looking for -> exit
        if (-1 !== currentUrl.indexOf('/dp/')) {
            key = 'dp';
        } else if (-1 !== currentUrl.indexOf('/product/')) {
            key = 'product';
        } else {
            return;
        }

        /**
         * Adding the structure of the tab menu to amazon page.
         *
         * @param nodelist currentReviews
         * 
         * @return void
         */
        addTabMenu = function (currentReviews) {
            currentReviews.before('<ul id="tabmenue"></ul><div class="shadow"></div>');

            $('#tabmenue').live('click', function (event) {
                var a = $(event.target).closest('a'),
                    id;

                if (a.length === 0) {
                    return;
                }

                id = a[0].id;

                $('a.current').removeClass('current');
                a.addClass('current');

                $('#customerReviews, .reviews').css('display', 'none');
                $('div.' + id + '_review').css('display', 'block');
            });  
        };

        /**
         * Adding a tab menu item
         *
         * @param integer id - our country code (de, en, com, ...)
         * @param string name - name of the country
         * @param string _class - optinal a class to highlight current tab item
         *
         * @return void
         */
        addTabMenuItem = function (id, name, _class) {
            $('#tabmenue').append('<li><a id="' + id + '" class="' + _class + '" href="javascript:;">' + name + '</a></li>');
        };

        /**
         * Render reviews and ratings in the bottom of the amazon page
         *
         * @param nodelist currentReviews
         * @param string content - amazon page of the foreign country
         * @param integer id - our country code (de, en, com, ...)
         *
         * @return void
         */
        renderReviewsAndRatings = function (currentReviews, content, id) {
            var reviews   = $(content).find('#customerReviews'),
                reviewsHtml = (reviews.length > 0) ? reviews.html() : '';

            // this country has not a review for this product
            if (!reviewsHtml.trim()) {
                return;
            }

            addTabMenuItem(id, data[id].name, '');
          
            currentReviews.after('<div class="' + id + '_review reviews" style="display: none">' + reviewsHtml + '</div>');
        };

        /**
         * Render stars of foreign countries aside to the product photo
         *
         * @param nodelist currentStars
         * @param string content - amazon page of the foreign country
         * @param integer id - our country code (de, en, com, ...)
         *
         * @return void
         */
        renderStarsOverview = function (currentStars, content, id) {
            var stars = $(content).find('.tiny .crAvgStars'),
                starsHtml = (stars.length > 0) ? stars.html() : '';

            // this country has not a star preview
            if (!starsHtml.trim()) {
                return false;
            }

            currentStars.append('<p><span class="crAvgStars">' + starsHtml + '</span> (' + data[id].name + ')</p>');
        };

        /**
         * INIT
         */
        this.init = function (usersettings) {
            config = usersettings;

            var keyTokens      = currentUrl.split('/' + key + '/'),
                rest           = keyTokens[1],
                asin           = rest.split('/')[0],
                currentReviews = $('#customerReviews, [name="customerReviews"]'),
                currentStars   = $('.tiny'),
                id;

            // no reviews or ratings -> exit
            if (currentReviews.length === 0 || currentStars.length === 0) {
                return;
            }

            addTabMenu(currentReviews);

            for (id in config.countryCode) {
                if (config.countryCode.hasOwnProperty(id)) {
                    // user won't see this country except it is his own
                    if (config.countryCode[id] === false && currentUrl.indexOf('.' + id + '/') === -1) {
                        continue;
                    }

                    // add tab item for current amazon page 
                    if (currentUrl.indexOf('.' + id + '/') !== -1) {
                        addTabMenuItem(id, data[id].name, 'current');
                        currentReviews.addClass(id + '_review');
                        continue;
                    }

                    // IF FOREIGN AMAZON-PAGE IS LOADED THAN GET THE "REVIEWS"
                    (function (id) {
                        $.get(data[id].url + '/' + key + '/' + asin, function (content, status) {
                            if (status === 'error') {
                                return;
                            }

                            if (false === renderStarsOverview(currentStars, content, id)) {
                                return;
                            }

                            renderReviewsAndRatings(currentReviews, content, id);
                            
                        });
                    }(id));
                }
            }
        };

        // read user settings
        chrome.extension.sendMessage({action: "getCountryCode"}, $.proxy(this.init, this));
    };

    var amazonExtended = new AmazonExtended();
}());
