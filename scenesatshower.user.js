// ==UserScript==
// @name          SceneSatShower
// @description   SceneSat Show Announce
// @version    0.0.1
// @include http://pouet.net/
// @copyright  2013+, mog@trbl.at
// @downloadURL https://github.com/mog/Pouet-Enhancement-Suite/raw/master/scenesatshower.user.js
// @updateURL https://github.com/mog/Pouet-Enhancement-Suite/raw/master/scenesatshower.user.js
// ==/UserScript==

var CORS_PROXY = "http://www.corsproxy.com/",
    SCENESAT_SHOW_FEED = CORS_PROXY + "scenesat.com/rss/shows",
    SCENESAT_LOGO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAQCAYAAAD52jQlAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAq9JREFUeNq0lN9LWmEYx19/ZB06aYfJNDRNlrUikhoNxDAiiAzHQBi6NSF2t9G/sJHQLvI+NyKaDN2NFw0K11Xtqq2cndUuojG1Loxlw0yqKShn3yNuyEHHGNsDH17PeZ/3y/M+38cj4jiO/OuQ/mGeCOiBFlwBg+X1GzgGb0H0V7Kg0g6gA1RZ4DrQIKdhd3eXVigUdCqVojY3N1uMRmPD6elp7hKB30mr1epBblhY6cOdnZ17EomkSSQSScPhcGMikWDa2tpotVotiUQiJBqNEoPBUMJkMhGLxUIVCgVmbW1NjvPj1UTHV1ZWBjc2Noheryft7e2cSqUqHB0dndXX1182Nzer8/m81G63k76+PkJRFEEBBHs81P7+fm9nZ+c16MQqRcM2m02FQxKZTJZBwnexWJzF+0O+bwh7a2urdXl5uY4XQvUlUdy+VBxa1IS1hxclfE8ruAkGQQsQC/aeLC4uHsvlcq6rq4ubn5/nPB4PNzw8zPX393MzM0/PkfOczxW6v1XDfRk4wQ3O3G73VZZlycLCAjk4OCDFYpGYzWbCMAxf8kk196vFOA4+Wl9fN4RCoW60oKjValO8iUtLSw1wnszOzn6AB6tlo979bk67ecFkMnk7EAiY9vb2mgYGBtJOp5NVKpWHPp/PNTIyQhwOxxYE/ch9VmtOf4Y7l8vdnZub643H4xoYkx8dHf08NjbGV8Kgl3dwdWZycjIyNDT0olKwmqiFr257e9vm9/t74H6dRqNJTk1NfcIIvcxmsw+mp6fNFxcXjRMTE1sYeL9QUDindCaTeRwMBm+w7EdlR4fx3OVyvdfpdK+x94Y3KxaL0ehpHdyP1hIsRcXI0Ol0etXr9Z4FAsEvePaBW4Kxug9elVdSC+H1beW/G1t28uvffKVE/+PT90OAAQCmPmNrUPjTbAAAAABJRU5ErkJggg==",
    req = new XMLHttpRequest();

//load XML from scenesat
req.onreadystatechange = function() {
    if (req.readyState === 4){
        displayItems(req.responseXML);
    }
};
req.open('GET', SCENESAT_SHOW_FEED, true);
req.send(null);

//create holder
var holder = document.createElement('table'),
    boxTitle = document.createElement('th'),
    img = document.createElement("img");

img.setAttribute("src", SCENESAT_LOGO);
img.setAttribute("style", "float:left;");
boxTitle.appendChild(img);

boxTitle.innerHTML += "upcomming scenesat shows";

holder.setAttribute("class", "box");
holder.setAttribute("cellspacing", "1");
holder.setAttribute("cellpadding", "2");
holder.appendChild(boxTitle);

function displayItems(xml){
    
    var entries = xml.getElementsByTagName('item');
    
    for(var i = 0; i < entries.length; i++){
        
        //title comes with date prepended, let's undo that
        var title = entries[i].getElementsByTagName('title')[0].textContent.split(' - ', 2)[1],
            date = entries[i].getElementsByTagName('pubDate')[0].textContent;
        
        var row = document.createElement("tr"),
            td = document.createElement("td"),
            countdownHolder = document.createElement('span');

        row.setAttribute("bgcolor", (i % 2) == 0 ? "#579" : "#468");
        
        td.innerHTML = '<b><a href="'+
            entries[i].getElementsByTagName('link')[0].textContent
            +'" target="_blank">' + title + '</a></b><br>';
        
        td.setAttribute("title",
                        entries[i].getElementsByTagName('description')[0].textContent + '\n'+
                        date);
        
        new Countdown(date, countdownHolder);

        td.appendChild(countdownHolder);
        row.appendChild(td);
        holder.appendChild(row);
    }
}

//insert into pouet page (before the third box)
var lineBreak = document.createElement('br'),
    rightRow =document.querySelectorAll('td[width="20%"]')[1],
  thirdBox = rightRow.getElementsByTagName('table')[2];


thirdBox.parentNode.insertBefore( holder, thirdBox.nextSibling );
thirdBox.parentNode.insertBefore( lineBreak, thirdBox.nextSibling );

var Countdown = function (dateString, element) {

    var end = new Date(dateString).getTime();

    var _dayV, _hourV, _minV;

    init();

    function init() {
        if (Math.round((end - Date.now()) / 1000) > 0) {
            update();
            setInterval(update, 3000);
        }
    }

    function update() {

        var delta = Math.round((end - Date.now()) / 1000),
            days = Math.floor(delta / 86400),
            dayDelta = delta % 86400,
            hours = Math.floor(dayDelta / 3600),
            hourDelta = dayDelta - (hours * 3600),
            minutes = Math.floor(hourDelta / 60);
        
        element.innerText = ':: in ' + days + 'days, ' + hours + 'hours, ' + minutes + 'minutes';
    }
};
