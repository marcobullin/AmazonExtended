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
             * This method renders the tabmenu
             */
            renderReviewsAndRatings = function () {},

            addTabMenu = function () {},

            /**
             * This method renders the customer ratings (stars)
             */
            renderStarsOverview = function () {};

        if (-1 !== currentUrl.indexOf('/dp/')) {
            key = 'dp';
        } else if (-1 !== currentUrl.indexOf('/product/')) {
            key = 'product';
        } else {
            return;
        }

        chrome.extension.sendRequest({action: "getCountryCode"}, $.proxy(this.init, this));

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

        this.init = function (usersettings) {
            config = usersettings;

            var keyTokens      = currentUrl.split('/' + key + '/'),
                rest           = keyTokens[1],
                asin           = rest.split('/')[0],
                currentReviews = $('#customerReviews'),
                currentStars   = $('.tiny .crAvgStars');

            // no reviews or ratings -> exit
            if (currentReviews.length === 0 || currentStars.length === 0) {
                return;
            }

            addTabMenu(currentReviews);
        };
    };
}());