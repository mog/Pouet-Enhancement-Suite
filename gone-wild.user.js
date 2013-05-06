// ==UserScript==
// @name       PouetGoneWild
// @version    0.1
// @description  Do you see red too?
// @include http://pouet.net/*
// @include http://www.pouet.net/*
// @copyright  2013+, mog
// ==/UserScript==

function addCss(cssString) { 
    var head = document.getElementsByTagName('head')[0],
        newCss = document.createElement('style'); 
    
    newCss.type = "text/css"; 
    newCss.innerHTML = cssString; 
    head.appendChild(newCss); 
}

addCss ( 
    'html {-webkit-filter: hue-rotate(141deg);-moz-filter: hue-rotate(141deg);filter: hue-rotate(141deg);}');
