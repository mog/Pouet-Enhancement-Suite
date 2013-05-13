// ==UserScript==
// @name       DemozooSugar
// @version    0.1
// @description  Fetches more information about the prod from Demozoo.org, and displays it.
// @match      http://pouet.net/prod.php?which=*
// @copyright  2013+, mog@trbl.at
// @downloadURL https://github.com/mog/Pouet-Enhancement-Suite/raw/master/demozoo-sugar.user.js
// ==/UserScript==
var API_BASE = "http://dev.demozoo.org",
    API_ACTION_SEARCH = "/search/live/?q=";

var appendToElement = document.querySelector('#mainDownload')
    .parentNode;

var prodName = ((document.querySelector('table>tbody>tr>td>b>font') || {})
    .innerText || "")
    .toLowerCase(),
    groupName = ((document.querySelector('table>tbody>tr>td>b>a') || {})
        .text || "")
        .toLowerCase();

//search the prod on demozoo, by using the prodname
request(API_ACTION_SEARCH, prodName, prodInfoLoaded, prodInfoLoadFail);

function prodInfoLoaded(prodInfoAsJSON) {

    //walk through the response to find the prod with groupName
    var prod = findProdInDemozooResponse(prodInfoAsJSON),
        container = document.createElement('span');

    if (prod && (groupName != "")) {
        container.innerHTML = '[<a href="' + API_BASE + prod.url + '">demozoo: Exact match</a>]';

    } else if (prodInfoAsJSON.length == 1) {

        container.innerHTML = '[<a href="' + API_BASE + prodInfoAsJSON[0].url + '">demozoo: Could be his one?</a>]';

    } else if (prodInfoAsJSON.length == 0) {

        container.innerHTML = '[<a href="' + API_BASE + '/search/?q=' + prodName + '">demozoo: Missing?</a>]';

    } else if (prodInfoAsJSON.length > 1) {

        container.innerHTML = '[<a href="' + API_BASE + '/search/?q=' + prodName + '">demozoo: Missing, or different author, name,..?</a>]';
    }

    appendToElement.appendChild(container);
}

function prodInfoLoadFail(errorMessage) {
    console.error("fail", errorMessage);
}

function findProdInDemozooResponse(prodInfo) {
    for (var idx = 0; idx < prodInfo.length; idx++) {

        if (prodInfo[idx].type == "production") {
            //value property is "Spot - Fairlight" - so split it, to compare the author
            var demozooGroupName = (prodInfo[idx].value.split(' - ')[1])
                .toLowerCase();

            if (demozooGroupName) {
                if (demozooGroupName.indexOf(groupName) > -1) {
                    return prodInfo[idx];
                }
            }
        }
    }
}

function request(action, term, callbackOnResult, callbackOnLoadFail) {

    GM_xmlhttpRequest({
        method: 'GET',
        url: API_BASE + action + term,

        onload: function (response) {
            callbackOnResult(JSON.parse(response.responseText));
        },

        onerror: callbackOnLoadFail
    });
}
