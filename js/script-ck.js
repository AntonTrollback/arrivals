"use strict";(function(e,t){var n={};t.addEventListener("DOMContentLoaded",function(){t.getElementById("tictail_search_box").setAttribute("placeholder","");var e=t.querySelector(".nav"),r=t.querySelector(".product-list"),i=t.querySelectorAll(".product");n.PrepairMarkup.init(i);if(r!==null){var s=t.querySelectorAll(".filter a"),o=t.querySelector(".peek-links");Array.prototype.forEach.call(i,function(e){n.Drag.init(e)});n.Layout.init({container:r,itemSelector:".product",columnWidth:220,gutter:20,items:i});s!==null&&n.Filter.init(s);o!==null&&n.PeekLinks.init(o,i)}n.Nav.init(e)});n.Layout={init:function(e){this.settings=e;this.setupIsotope();this.displayItems()},setupIsotope:function(){this.isotope=new Isotope(this.settings.container,{itemSelector:".temp",sortBy:"random",masonry:{columnWidth:this.settings.columnWidth,gutter:this.settings.gutter,isFitWidth:!0}})},displayItems:function(){var e=this,t=imagesLoaded(this.settings.container);this.isotope.options.itemSelector=this.settings.itemSelector;t.on("progress",function(t,n){var r=n.img.parentNode;r.classList.remove("is-hidden");e.isotope.appended(r)})}};n.Drag={init:function(e){this.item=e;this.zIndex=10;this.hasMoved=!1;this.draggabilly=new Draggabilly(this.item);this.binds()},binds:function(){var e=this;this.item.addEventListener("click",function(e){e.preventDefault()});this.draggabilly.on("dragStart",function(t){e.setZIndex(t.element)});this.draggabilly.on("dragMove",function(t){e.detectIfMoved(t)});this.draggabilly.on("dragEnd",function(t){e.dragResult(t);e.hasMoved=!1})},detectIfMoved:function(e){var t=e.startPosition,n=e.position;if(n.x!==t.x||n.y!==t.y)this.hasMoved=!0},setZIndex:function(e){this.zIndex=this.zIndex+1;e.style.zIndex=this.zIndex},dragResult:function(t){this.hasMoved?n.Layout.isotope.unbindResize():e.location=t.element.getAttribute("href")}};n.PrepairMarkup={init:function(e){this.items=e;this.max=10;this.data=this.getData();this.setSingleItemData();if(this.items!==null){this.setItemData();this.setLatest()}},getData:function(){delete DATA_DESC.last;var e=DATA_DESC;for(var t in e){e[t].artist=this.getShortcode(e[t].desc,"artist").replace(/(<([^>]+)>)/ig,"");e[t].dimentions=this.getShortcode(e[t].desc,"dimentions").replace(/(<([^>]+)>)/ig,"");e[t].editions=this.getShortcode(e[t].desc,"editions").replace(/(<([^>]+)>)/ig,"");e[t].technique=this.getShortcode(e[t].desc,"technique");e[t].bio=this.getShortcode(e[t].desc,"bio")}return e},setItemData:function(){var e=this;Array.prototype.forEach.call(this.items,function(t){var n=t.getAttribute("data-id"),r=t.querySelector(".js-artist");r.innerHTML=e.data[n].artist})},setSingleItemData:function(){var e=this,n=["artist","dimentions","editions","technique","bio"];for(var r in n){var i=t.querySelectorAll(".js-"+n[r]);i!==null&&Array.prototype.forEach.call(i,function(t){var i=e.data[Object.keys(e.data)[0]][n[r]];t.innerHTML=i})}},setLatest:function(){var e=Array.prototype.slice.call(this.items);e=e.splice(0,this.max);Array.prototype.forEach.call(e,function(e){e.classList.add("is-latest")})},setRandom:function(){if(this.items.length<=this.max){Array.prototype.forEach.call(this.items,function(e){e.classList.add("is-random")});return!1}Array.prototype.forEach.call(this.items,function(e){e.classList.remove("is-random")});var e=Array.prototype.slice.call(this.items),t=this.shuffle(e).splice(0,this.max);Array.prototype.forEach.call(t,function(e){e.classList.add("is-random")})},getShortcode:function(e,t){e=e.replace(/(<([^>]+)>)/ig,"");if(e.indexOf("["+t+"]")==-1||e.indexOf("[/"+t+"]")==-1)return"";var n=e.split("["+t+"]")[1].split("[/"+t+"]")[0];return n},shuffle:function(e){var t=e.length,n,r;while(t>0){r=Math.floor(Math.random()*t);t--;n=e[t];e[t]=e[r];e[r]=n}return e}};n.Filter={init:function(e){this.triggers=e;this.binds()},binds:function(){var t=this;Array.prototype.forEach.call(this.triggers,function(n){n.addEventListener("click",function(r){r.preventDefault();var i=n.getAttribute("data-filter"),s=n.getAttribute("data-sorting");t.setTriggerActiveState(this);i===".is-random"&&e.App.PrepairMarkup.setRandom();t.filter(i,s)})})},setTriggerActiveState:function(e){Array.prototype.forEach.call(this.triggers,function(e){e.parentNode.classList.remove("is-active")});e.parentNode.classList.add("is-active")},filter:function(t,n){n=n?n:"random";e.App.Layout.isotope.arrange({filter:t,sortBy:n})}};n.Layout={init:function(e){this.settings=e;this.setupIsotope();this.displayItems()},setupIsotope:function(){this.isotope=new Isotope(this.settings.container,{itemSelector:".temp",sortBy:"random",masonry:{columnWidth:this.settings.columnWidth,gutter:this.settings.gutter,isFitWidth:!0}})},displayItems:function(){var e=this,t=imagesLoaded(this.settings.container);this.isotope.options.itemSelector=this.settings.itemSelector;t.on("progress",function(t,n){var r=n.img.parentNode;r.classList.remove("is-hidden");e.isotope.appended(r)})}};n.PeekLinks={init:function(e,t){this.container=e;this.items=t;this.peekLinks=this.container.querySelectorAll("a");this.setImages()},setImages:function(){var e=this;Array.prototype.forEach.call(this.peekLinks,function(t){var n=t.textContent.replace(/^\s+|\s+$/g,"").toLowerCase();Array.prototype.forEach.call(e.items,function(e){if(t.querySelector("img")!==null)return!1;var r=e.querySelector(".js-artist").textContent.replace(/^\s+|\s+$/g,"").toLowerCase();if(n===r){var i=e.querySelector("img");t.appendChild(i.cloneNode(!0))}})})}};n.Nav={init:function(t){this.items=t.querySelectorAll("li");this.links=t.querySelectorAll("a");this.binds();var n=e.location.pathname,r=e.location.hash.replace("#","").replace("/","");if((n===""||n==="/")&&r!==""){var i=t.querySelector("a[href*="+r+"]");this.setActiveState(i);this.goTo(r)}},binds:function(){var e=this;Array.prototype.forEach.call(this.links,function(t){t.addEventListener("click",function(){e.setActiveState(this);var t=this.getAttribute("href").replace("#","").replace("/","");e.goTo(t)})})},setActiveState:function(e){Array.prototype.forEach.call(this.items,function(e){e.classList.remove("is-active")});e.parentNode.classList.add("is-active")},goTo:function(e){if(e==="filter")this.scrollToSelector("body",0);else if(e==="filter-all"){this.scrollToSelector("body",0);var n=t.querySelector('a[data-filter="*"]');if(n!==null){var r=t.createEvent("HTMLEvents");r.initEvent("click",!0,!1);n.dispatchEvent(r)}}else e==="artists"&&this.scrollToSelector("body",0)},scrollToSelector:function(e,t){EPPZScrollTo.scrollVerticalToElement(e,t)}};e.App=n})(window,document);