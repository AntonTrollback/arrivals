"use strict";

(function(window, document) {

  var App = {};

  // OK LET'S DO THIS
  document.addEventListener('DOMContentLoaded', function(){

    document.getElementById("tictail_search_box").setAttribute("placeholder", "");

    var navigation = document.querySelector(".nav");
    var productList = document.querySelector(".product-list");
    var products = document.querySelectorAll(".product");

    App.PrepairMarkup.init(products);

    if (productList !== null) {
      var triggers = document.querySelectorAll(".filter a");
      var peekLinks = document.querySelector('.peek-links');

      Array.prototype.forEach.call(products, function(product) {
        App.Drag.init(product);
      });

      App.Layout.init({
        container: productList,
        itemSelector: ".product",
        columnWidth: 220,
        gutter: 20,
        items: products
      });

      if (triggers !== null) {
        App.Filter.init(triggers);
      }

      if (peekLinks !== null) {
        App.PeekLinks.init(peekLinks, products);
      }
    }

    App.Nav.init(navigation);
  });




  App.Layout = {
    init: function(settings) {
      this.settings = settings;
      this.setupIsotope();
      this.displayItems();
    },

    setupIsotope: function() {
      // Setup Isotope without items, hence the ".temp" selector
      this.isotope = new Isotope(this.settings.container, {
        itemSelector: ".temp",
        sortBy: "random",
        masonry: {
          columnWidth: this.settings.columnWidth,
          gutter: this.settings.gutter,
          isFitWidth: true
        }
      });
    },

    displayItems: function() {
      var that = this;
      var imgLoad = imagesLoaded(this.settings.container);

      // Correct Isotope selector
      this.isotope.options.itemSelector = this.settings.itemSelector;

      // When a image has loaded..
      imgLoad.on('progress', function(instance, image) {
        var item = image.img.parentNode;
        // Un-hide it
        item.classList.remove("is-hidden");
        // Append it to layout
        that.isotope.appended(item);
      });
    }
  };



  App.Drag = {
    init: function(item) {
      this.item = item;
      this.zIndex = 10;
      this.hasMoved = false;
      this.draggabilly = new Draggabilly(this.item);
      this.binds();
    },

    binds: function() {
      var that = this;

      // Disable clicks on item, for now
      this.item.addEventListener("click", function(e) {
        e.preventDefault();
      });

      this.draggabilly.on("dragStart", function(instance) {
        that.setZIndex(instance.element);
      });

      this.draggabilly.on("dragMove", function(instance) {
        that.detectIfMoved(instance);
      });

      this.draggabilly.on("dragEnd", function(instance) {
        that.dragResult(instance);
        that.hasMoved = false;
      });
    },

    detectIfMoved: function(instance) {
      var startPos = instance.startPosition;
      var pos = instance.position;

      if (pos.x !== startPos.x || pos.y !== startPos.y) {
        this.hasMoved = true;
      }
    },

    setZIndex: function(item) {
      this.zIndex = this.zIndex + 1;
      item.style.zIndex = this.zIndex;
    },

    dragResult: function(instance) {
      if (this.hasMoved) {
        // Let's not mess up users ordering by turning off relayout on resize
        App.Layout.isotope.unbindResize();
      } else {
        // Visit link if item did not move
        window.location = instance.element.getAttribute("href");
      }
    }
  };



  App.PrepairMarkup = {
    init: function(items) {
      this.items = items;
      this.max = 10;
      this.data = this.getData();
      this.setSingleItemData();

      if (this.items !== null) {
        this.setItemData();
        this.setLatest();
      }
    },

    getData: function() {
      // Remove last lol item in array
      delete DATA_DESC.last;
      var data = DATA_DESC;

      for(var i in data) {
        data[i].artist = this.getShortcode(data[i].desc, 'artist')
          .replace(/(<([^>]+)>)/ig,"");
        data[i].dimentions = this.getShortcode(data[i].desc, 'dimentions')
          .replace(/(<([^>]+)>)/ig,"");
        data[i].editions = this.getShortcode(data[i].desc, 'editions')
          .replace(/(<([^>]+)>)/ig,"");
        data[i].technique = this.getShortcode(data[i].desc, 'technique');
        data[i].bio = this.getShortcode(data[i].desc, 'bio');
      }
      return data;
    },

    setItemData: function() {
      var that = this;

      Array.prototype.forEach.call(this.items, function(item) {
        var id = item.getAttribute('data-id');
        var artistElm = item.querySelector('.js-artist');
        artistElm.innerHTML = that.data[id].artist;
      });
    },

    setSingleItemData: function() {
      var that = this;

      var elmsToFill = ['artist', 'dimentions', 'editions', 'technique', 'bio'];

      for(var i in elmsToFill) {
        var elms = document.querySelectorAll('.js-' + elmsToFill[i]);

        if (elms !== null) {
          Array.prototype.forEach.call(elms, function(elm) {
            var text = that.data[Object.keys(that.data)[0]][elmsToFill[i]];
            elm.innerHTML = text;
          });
        }
      }
    },

    setLatest: function() {
      var latest = Array.prototype.slice.call(this.items);
      latest = latest.splice(0, this.max);

      Array.prototype.forEach.call(latest, function(item) {
        item.classList.add("is-latest");
      });
    },

    setRandom: function() {
      // If less items than max, add is-random to every item
      if (this.items.length <= this.max) {
        Array.prototype.forEach.call(this.items, function(item) {
          item.classList.add("is-random");
        });
        return false;
      }

      // Remove previous classes
      Array.prototype.forEach.call(this.items, function(item) {
        item.classList.remove("is-random");
      });

      var arr = Array.prototype.slice.call(this.items);
      var shuffled = this.shuffle(arr).splice(0, this.max);

      // Add new
      Array.prototype.forEach.call(shuffled, function(item) {
        item.classList.add("is-random");
      });
    },

    getShortcode: function(string, code) {
      string = string.replace(/(<([^>]+)>)/ig,"");
      if (string.indexOf('['+code+']') == -1 || string.indexOf('[/'+code+']') == -1) {
        return "";
      }
      var content = string.split('['+code+']')[1].split('[/'+code+']')[0];
      return content
    },

    shuffle: function(array) {
      var counter = array.length, temp, index;

      // While there are elements in the array
      while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
      }

      return array;
    }
  };



  App.Filter = {
    init: function(triggers) {
      this.triggers = triggers;
      this.binds();
    },

    binds: function() {
      var that = this;

      Array.prototype.forEach.call(this.triggers, function(trigger) {
        trigger.addEventListener("click", function(e) {
          e.preventDefault();
          var filter = trigger.getAttribute("data-filter");
          var sorting = trigger.getAttribute("data-sorting");

          that.setTriggerActiveState(this);

          if (filter === ".is-random") {
            window.App.PrepairMarkup.setRandom();
          }

          that.filter(filter, sorting);
        });
      });
    },

    setTriggerActiveState: function(clicked) {
      Array.prototype.forEach.call(this.triggers, function(trigger) {
        trigger.parentNode.classList.remove("is-active");
      });

      clicked.parentNode.classList.add("is-active");
    },

    filter: function(filter, sorting) {
      sorting = sorting ? sorting : "random";
      window.App.Layout.isotope.arrange({
        filter: filter,
        sortBy: sorting
      });
    },
  };



  App.Layout = {
    init: function(settings) {
      this.settings = settings;
      this.setupIsotope();
      this.displayItems();
    },

    setupIsotope: function() {
      // Setup Isotope without items, hence the ".temp" selector
      this.isotope = new Isotope(this.settings.container, {
        itemSelector: ".temp",
        sortBy: "random",
        masonry: {
          columnWidth: this.settings.columnWidth,
          gutter: this.settings.gutter,
          isFitWidth: true
        }
      });
    },

    displayItems: function() {
      var that = this;
      var imgLoad = imagesLoaded(this.settings.container);

      // Correct Isotope selector
      this.isotope.options.itemSelector = this.settings.itemSelector;

      // When a image has loaded..
      imgLoad.on('progress', function(instance, image) {
        var item = image.img.parentNode;
        // Un-hide it
        item.classList.remove("is-hidden");
        // Append it to layout
        that.isotope.appended(item);
      });
    }
  };



  App.PeekLinks = {
    init: function(container, items) {
      this.container = container;
      this.items = items;
      this.peekLinks = this.container.querySelectorAll('a');
      this.setImages();
    },

    setImages: function() {
      var that = this;

      Array.prototype.forEach.call(this.peekLinks, function(link) {

        // Text in link
        var text = link
          .textContent
          .replace(/^\s+|\s+$/g, '')
          .toLowerCase();

        Array.prototype.forEach.call(that.items, function(item) {
          // Return if link already has an img
          if (link.querySelector("img") !== null) {
            return false;
          }

          // Text in item
          var itemText = item.querySelector('.js-artist')
            .textContent
            .replace(/^\s+|\s+$/g, '')
            .toLowerCase();

          // If they mach, clone the image and append it to the link
          if (text === itemText) {
            var img = item.querySelector("img");
            link.appendChild(img.cloneNode(true));
          }
        });
      });
    }
  };



  App.Nav = {
    init: function(container) {
      this.items = container.querySelectorAll('li');
      this.links = container.querySelectorAll('a');
      this.binds();

      var path = window.location.pathname;
      var hash = window.location.hash.replace("#", "").replace("/", "");

      if ((path === '' || path === '/') && hash !== '') {
        var activeItem = container.querySelector('a[href*='+ hash +']');
        this.setActiveState(activeItem);
        this.goTo(hash);
      }
    },

    binds: function() {
      var that = this;

      Array.prototype.forEach.call(this.links, function(link) {
        link.addEventListener("click", function() {
          that.setActiveState(this);

          var hash = this.getAttribute('href').replace("#", "").replace("/", "");
          that.goTo(hash);
        });
      });
    },

    setActiveState: function(elm) {
      Array.prototype.forEach.call(this.items, function(item) {
        item.classList.remove('is-active');
      });

      elm.parentNode.classList.add('is-active');
    },

    goTo: function(target) {

      if (target === "filter") {
        this.scrollToSelector('body', 0);
      } else if (target === "filter-all") {
        this.scrollToSelector('body', 0);

        var trigger = document.querySelector('a[data-filter="*"]');

        if (trigger !== null) {
          var e = document.createEvent('HTMLEvents');
          e.initEvent('click', true, false);
          trigger.dispatchEvent(e);
        }
      } else if (target === "artists") {
        this.scrollToSelector('body', 0);
      }
    },

    scrollToSelector: function(selector, padding) {
      EPPZScrollTo.scrollVerticalToElement(selector, padding);
    }
  };

  // Allow access
  window.App = App;

})(window, document);
