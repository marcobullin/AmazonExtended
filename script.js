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
      count = 0,
      data = {
        uk : {
          name: 'United Kingdom',
          url: 'http://www.amazon.co.uk/' + key + '/' + asin
        },

        us : {
          name: 'United States',
          url: 'http://www.amazon.com/' + key + '/' + asin
        },

        fr : {
          name: 'France',
          url: 'http://www.amazon.fr/' + key + '/' + asin
        },

        es : {
          name: 'Spain',
          url: 'http://www.amazon.es/' + key + '/' + asin
        },

        jp : {
          name: 'Japan',
          url: 'http://www.amazon.co.jp/' + key + '/' + asin
        },

        cn : {
          name: 'China',
          url: 'http://www.amazon.cn/' + key + '/' + asin
        },

        it : {
          name: 'Italy',
          url: 'http://www.amazon.it/' + key + '/' + asin
        },

        de : {
          name: 'Germany',
          url: 'http://www.amazon.de/' + key + '/' + asin
        }
      },
      id;

    if (currentReviews.length === 0 || currentStars.length === 0) {
      return;
    }

    var appendReviewsAndRatings = function (content) {
      var reviews   = $(this).find('#customerReviews'),
        stars       = $(this).find('.tiny .crAvgStars'),
        reviewsHtml = (reviews.length > 0) ? reviews.html() : '',
        starsHtml   = (stars.length > 0) ? stars.html() : '';

      // this country has not a review for this product
      if (!reviews || !reviewsHtml || !stars || !starsHtml) {
        _hideFaildCountryTab(this.id.substr(0, 2));

        // clean up
        $(this).remove();
        return;
      }

      currentReviews.after('<div class="' + this.id.substr(0, 2) + '_review reviews" style="display: none">' + reviewsHtml + '</div>');
      
      if (starsHtml) {
        currentStars.after('<p><span class="crAvgStars">' + starsHtml + '</span> (' + data[this.id.substr(0, 2)].name + ')</p>');
      }
      // clean up
      $(this).remove();
    };

    tabmenue.push('<ul id="tabmenue">');
    
    for (id in selectedCountries) {
      if (selectedCountries.hasOwnProperty(id)) {
        // user wont see this country except it is his own
        if (selectedCountries[id] === false && currentUrl.indexOf('.' + id + '/') === -1) {
          continue;
        }

        // current amazon page 
        if (currentUrl.indexOf('.' + id + '/') !== -1) {
          tabmenue.push('<li><a id="' + id + '" class="current" href="javascript:;">' + data[id].name + '</a></li>');
          currentReviews.addClass(id + '_review');
          continue;
        }

        var helperId = id + '_' + count;
        tabmenue.push('<li><a id="' + id + '" href="javascript:;">' + data[id].name + '</a></li>');
        
        // ADD A HELPER CONTAINER TO PUT THE CONTENT OF LOADED AMAZON-PAGES
        $('body').append('<div style="display: none" id="' + helperId + '"></div>');

        // IF FOREIGN AMAZON-PAGE IS LOADED THAN GET THE "REVIEWS"
        $('#' + helperId).load(data[id].url, appendReviewsAndRatings);
        
        count++;
      }
    }

    tabmenue.push('</ul>');
    tabmenue.push('<div class="shadow"></div>');
    
    currentReviews.before(tabmenue.join(''));

    // TABMENU CLICK LISTENER
    $('#tabmenue').live('click', function (event) {
      var a = $(event.target).closest('a'),
        id = a[0].id;

      $('a.current').removeClass('current');
      a.addClass('current');

      $('#customerReviews, .reviews').css('display', 'none');
      $('div.' + id + '_review').css('display', 'block');
    });
  };

  chrome.extension.sendRequest({action: "getCountryCode"}, _init);
}()); 