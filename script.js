(function () {
  "use strict";

  var currentUrl = window.location.href,
    key;

  if (-1 !== currentUrl.indexOf('/dp/')) {
    key = 'dp';
  } else if (-1 !== currentUrl.indexOf('/product/')) {
    key = 'product';
  } else {
    return;
  }

  var _hideFaildCountryTab = function (id) {
    $('a#' + id).remove();  
  };

  var _init = function (response) {
    var tokens = currentUrl.split('/' + key + '/'),
      rest = tokens[1],
      asin = rest.split('/')[0],
      selectedCountries = response.countryCode,
      currentReviews = $('#customerReviews'),
      currentStars = $('.tiny .crAvgStars'),
      tabmenue = [],
      data = {
        uk : {
          name: 'United Kingdom',
          url: 'http://www.amazon.co.uk/dp/' + asin
        },

        com : {
          name: 'United States',
          url: 'http://www.amazon.com/dp/' + asin
        },

        fr : {
          name: 'France',
          url: 'http://www.amazon.fr/dp/' + asin
        },

        es : {
          name: 'Spain',
          url: 'http://www.amazon.es/dp/' + asin
        },

        jp : {
          name: 'Japan',
          url: 'http://www.amazon.co.jp/dp/' + asin
        },

        cn : {
          name: 'China',
          url: 'http://www.amazon.cn/dp/' + asin
        },

        it : {
          name: 'Italy',
          url: 'http://www.amazon.it/dp/' + asin
        },

        de : {
          name: 'Germany',
          url: 'http://www.amazon.de/dp/' + asin
        }
      },
      id;

    if (currentReviews.length === 0 || currentStars.length === 0) {
      return;
    }

    var appendReviewsAndRatings = function (content, id) {
      var reviews   = $(content).find('#customerReviews'),
        stars       = $(content).find('.tiny .crAvgStars'),
        reviewsHtml = (reviews.length > 0) ? reviews.html() : '',
        starsHtml   = (stars.length > 0) ? stars.html() : '';

      // this country has not a review for this product
      if (!reviewsHtml || !starsHtml) {
        return;
      }

      $('#tabmenue').append('<li><a id="' + id + '" href="javascript:;">' + data[id].name + '</a></li>');

      currentReviews.after('<div class="' + id + '_review reviews" style="display: none">' + reviewsHtml + '</div>');
      
      if (starsHtml) {
        currentStars.after('<p><span class="crAvgStars">' + starsHtml + '</span> (' + data[id].name + ')</p>');
      }
    };

    tabmenue.push('<ul id="tabmenue">');
    tabmenue.push('</ul>');
    tabmenue.push('<div class="shadow"></div>');
    currentReviews.before(tabmenue.join(''));
    
    for (id in selectedCountries) {
      if (selectedCountries.hasOwnProperty(id)) {
        // user wont see this country except it is his own
        if (selectedCountries[id] === false && currentUrl.indexOf('.' + id + '/') === -1) {
          continue;
        }

        // current amazon page 
        if (currentUrl.indexOf('.' + id + '/') !== -1) {
          $('#tabmenue').append('<li><a id="' + id + '" class="current" href="javascript:;">' + data[id].name + '</a></li>');
          currentReviews.addClass(id + '_review');
          continue;
        }

        // IF FOREIGN AMAZON-PAGE IS LOADED THAN GET THE "REVIEWS"
        (function (id) {
          $.get(data[id].url, function (content, status) {
            if (status === 'error') {
              return;
            }
            appendReviewsAndRatings(content, id)
          });
        }(id));
      }
    }

    // TABMENU CLICK LISTENER
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

  chrome.extension.sendRequest({action: "getCountryCode"}, _init);
}()); 