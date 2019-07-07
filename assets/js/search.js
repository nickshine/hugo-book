var idx;
var results = [];
var $searchResults;
var $searchInput;


function init() {
  console.log('init');
  var request = new XMLHttpRequest();
  var query = '';

  $searchInput = document.getElementById('book-search');
  $searchResults = document.getElementById('book-search-results');

  request.overrideMimeType("application/json");
  request.open("GET", "/index.json");
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      var pages = JSON.parse(request.responseText);

      idx = lunr(function() {
        this.ref('ref');
        this.field('title', {
          boost: 15
        });
        this.field('excerpt');
        this.field('body');

        pages.forEach(function(page) {
          this.add(page);
          results[page.ref] = {
            'title': page.title,
            'excerpt': page.excerpt
          };
        }, this)
      });
    } else {
      console.error('Error loading search index');
    }
  };

  request.onerror = function() {
    console.error('Error loading search index');
  }

  request.send();

  registerSearchHandler();
}

function registerSearchHandler() {
  $searchInput.oninput = function(event) {
    var query = event.target.value.trim();
    console.log(query);
    var results = search(query);
    renderSearch(query, results);
  }
}

function renderSearch(query, results) {
  $searchResults.style.display = query ? 'block' : 'none';
  console.log(results);
  if (results.length) {
    var res = '';
    for (var i = 0; i < results.length; i++) {
      console.log(i);
      res += '<div class="search-result-item">' + results[i].ref + '</div>';
    }

    $searchResults.innerHTML = res;
  } else {
    $searchResults.innerHTML = '';
  }
}


function search(query) {
  return query ? idx.search(query): [];
}

// window.onload = init();
init();

/**
 * Trigger a search in lunr and transform the result
 *
 * @param  {String} query
 * @return {Array}  results
 */
 /*
function search(query) {
  // Find the item in our index corresponding to the lunr one to have more info
  return lunrIndex.search(query).map(function(result) {
    return pagesIndex.filter(function(page) {
      return page.uri === result.ref;
    })[0];
  });
}
*/
/*
renderItem: function (item, search){
    // escape special characters
    search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var re = new RegExp("(" + search.split(' ').join('|') + ")", "gi");
    return '<div class="autocomplete-suggestion" data-val="' + item + '">' + item.replace(re, "<b>$1</b>") + '</div>';
            },
*/

