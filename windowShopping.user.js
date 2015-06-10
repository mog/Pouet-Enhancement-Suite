// ==UserScript==
// @name       PouetWindowShopping
// @version    0.0.1
// @description  Small screenshots on prodlists views
// @match      http://pouet.net/groups.php?which*
// @match      http://pouet.net/party.php?which*
// @match      http://*.pouet.net/groups.php?which*
// @match      http://*.pouet.net/party.php?which*
// @copyright  2013+, mog@trbl.at
// ==/UserScript==

var MAX_IMG_HEIGHT = 48,
    IMG_BACKGROUND = '',//'#000',
    TYPES = ['jpg', 'gif', 'png'];

var isPartyPage = !!document.querySelector("#pouetbox_partyheader");

//prod rows
var p = document.querySelectorAll('.prod a[href^="prod"]');

//group prod listing | fix header table (groupname/..) | bottom one as well
if(document.querySelectorAll("th[colspan='9']").length > 0) {
    document.querySelectorAll("th[colspan='9']")[0].setAttribute("colspan", "10");
	document.querySelectorAll("td[colspan='9']")[0].setAttribute("colspan", "10");
}

//sortable header need another TH in the beginning
var sortableRowList = document.querySelectorAll("tr.sortable");

for(var a = 0; a < sortableRowList.length; a++){
    sortableRowList[a].insertBefore(document.createElement('th'), sortableRowList[a].firstElementChild);
}

function handleImg404(e){
    var currentURL = e.target.getAttribute('src').split('.'),
        typeIndex = TYPES.indexOf(currentURL[1]);
        
    if((++typeIndex) < TYPES.length)
        e.target.setAttribute('src', currentURL[0] + '.' + TYPES[typeIndex]);
}

for(var i = 0; i < p.length; i++){
    
    //ignore the links on the type images
    if(p[i].getElementsByTagName('img').length === 0) {
        
        var prodURL = p[i].getAttribute("href"),
            prodScreenshotURL = 'screenshots/' + prodURL.split('=')[1] + '.' + TYPES[0],
            img = document.createElement('img');
            td = document.createElement('td'),
            link = document.createElement('a'),
            prodLinkCell = isPartyPage ? p[i].parentNode : p[i].parentNode.parentNode;
                    
        	td.style.cssText = "padding:0;text-align:center;background:" + IMG_BACKGROUND+";";
            link.setAttribute("href", prodURL);
            
            img.setAttribute("height", MAX_IMG_HEIGHT + 'px');
            img.style.cssText = "display:block;margin:0 auto;";
            img.onerror = handleImg404;
            img.setAttribute("src", prodScreenshotURL);
            
            link.appendChild(img);
            td.appendChild(link);
            prodLinkCell.parentNode.insertBefore(td, prodLinkCell);
    }
}
