// ==UserScript==
// @name       UserHover
// @version    0.0.1
// @description  Shows information about user on hovering a userlink
// @match      *://www.pouet.net/*
// @copyright  2014+, mog@trbl.at
// @downloadURL https://github.com/mog/Pouet-Enhancement-Suite/raw/master/userhover.user.js
// @updateURL https://github.com/mog/Pouet-Enhancement-Suite/raw/master/userhover.user.js
// ==/UserScript==

var STYLE = '#hoverInfo{border:2px solid #000;}'+
			'.hoverHeader{background-color:#325F92;padding:4px;border-bottom:1px solid #000;}'+
    		'.hoverBody{background-color:#4077B8; padding:7px;}'+
			'.hoverHeader:before,.hoverHeader:after{content:"";position:absolute;border-style:solid;display:block;width:0;}'+
			'.hoverHeader:before{top:-2px;left:-18px;border-width: 13px 18px 13px 0;border-color: rgba(0, 0, 0, 0) #000;}'+
    		'.hoverHeader:after{top:0;left: -15px;border-width: 11px 15px 11px 0;border-color: rgba(0, 0, 0, 0) #325F92;}'+
    		'.hoverRow{width: 110px;display: inline-block;}'+
    		'.hoverBody.hoverLoading{padding:16px;background-image:url(/content/avatars/sucks-rot2.gif);background-repeat: no-repeat;background-position: 50% 50%;';

//-- maybe don't edit below here --
var _cache = {},
    _delayTimer,
    _holder = document.createElement('div'),
	_linksToUsers = document.querySelectorAll('a[href^="user.php?who="]'),
    styleElement = document.createElement('style');

styleElement.innerHTML = STYLE;
document.body.appendChild(styleElement);

_holder.setAttribute("id", "hoverInfo");
document.body.appendChild(_holder)
_holder.addEventListener('mouseleave', hideHover, false);

//add listeners
for(var i = 0; i < _linksToUsers.length; i++){
    
    //don't attach to demoblog links
    if(_linksToUsers[i].href.indexOf('&') === -1){
        
        //title pops into our popup so prevent that
        if(_linksToUsers[i].getAttribute('title')){
        	_linksToUsers[i].setAttribute('data-title', _linksToUsers[i].getAttribute('title'));
        	_linksToUsers[i].removeAttribute('title');
        }
        
		_linksToUsers[i].addEventListener('mouseenter', startDelay, false);
    }
}

//after hovering a bit, show the info
function startDelay(e){
    console.log(">> in", e.target);
	stopDelay();
    
    e.target.addEventListener('mouseleave', stopDelay, false);
    
    _delayTimer = setTimeout(requestUserPage, 800, e.target);
}

//not hovering anymore, so don't load the userPage
function stopDelay(e){
    if(e)
    	console.log("<< out", e);
    clearTimeout(_delayTimer);
}

function requestUserPage(element){
    stopDelay();
    element.removeEventListener('mouseleave', stopDelay, false);
    
    showHover();
    
    var scrollOffset = getScrollOffset(),
        elementPos = element.getBoundingClientRect(),
        positionString = 'position:absolute;left:'+ (elementPos.right + scrollOffset.x + 16) +'px;top:'+ (elementPos.top + scrollOffset.y - (elementPos.height * .5) ) +'px;',
        link = element.href || element.parentNode.href,
        id = link.split('who=')[1];

    _holder.style.cssText = positionString;

	//hacky loadstate view
    var name = element.getAttribute('data-title') || element.innerHTML;
    _holder.innerHTML = '<div class="hoverHeader"><a href="'+ link +'">'+ name +'</a></div>'+
        '<div class="hoverBody hoverLoading"></div>';
    
    if(_cache[id]){
    
    	fillHoverThing(_cache[id]);
        
    } else {
        console.log("!! load", element);
        requestURL(link, function(response){
            if(response.readyState == 4 && response.status == 200){
    
                var userInfo = parseUserPage(response.responseXML);
                
                _cache[userInfo.id] = userInfo;
                
                fillHoverThing(userInfo);
            }
        });
    }
}

function fillHoverThing(info){
    var rowStyle = '"';
    _holder.innerHTML = '<div class="hoverHeader"><a href="'+ info.link +'">'+ info.name +'</a> ('+ info.level +')</div>'+
        '<div class="hoverBody">'+
            '<div><span class="hoverRow">Pouetan since:</span><span>'+ info.created +'</span></div>'+
            '<div><span class="hoverRow">Glöps:</span><span>'+ info.glops +'</span></div>'+
            '<div><span class="hoverRow">Prod contributions:</span><span>'+ info.contributions +'<span></div>'+
        '</div>';
}

function parseUserPage(userPage){
    var accountCreated = userPage.querySelector('.foot').innerHTML.split('on the ')[1],
        glops = userPage.querySelector('#glops span').innerHTML,
        userLevel = userPage.querySelector('#userdata li:nth-child(2)').innerHTML.split('</span>')[1].trim(),
        prodsContributedTo = 0,
        name = userPage.querySelector('#pouetbox_usermain span').innerHTML,
        link = userPage.querySelector('head link[rel^="canonical"]').getAttribute('href'),
        id = link.split('who=')[1];
    
    var contribs = userPage.querySelectorAll('.contribheader');
    
    //walk all userpage headers, find the prod amount, if any
    for(var i = 0; i < contribs.length; i++){
        if(contribs[i].innerHTML.indexOf('contributions to prods') > -1){
            //only dev pouet has the amount for now hence the {}
            prodsContributedTo = ((contribs[i].querySelector('span') || {}).innerHTML) || NaN;
            break;
        }
    }
    
    return {
        "name": name,
        "id":id,
        "link":link,
        "created": accountCreated,
        "glops": glops,
        "level": userLevel,
        "contributions": prodsContributedTo
    };
}

//== helper functions ==
function getScrollOffset(){
	var doc = document.documentElement,
		left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
		top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);
    
    return {x:left, y:top};
}

function requestURL(url, callback){
	var request = new XMLHttpRequest(); 
    request.responseType = 'document';
    request.onreadystatechange = function(){callback(request);};
	request.open('GET', url);
	request.send(null);
}

function hideHover(){
	_holder.style.display = 'none';
}

function showHover(){
	_holder.style.display = 'block';
}
