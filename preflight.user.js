// ==UserScript==
// @name       preFlight
// @version    0.0.3
// @description  shows the preview of a thread response under the message field
// @match      http://pouet.net/topic.php?which*
// @match      http://www.pouet.net/topic.php?which*
// @copyright  2013+, mog@trbl.at
// ==/UserScript==

var textArea = document.querySelector("textarea[name='message']"),
    form = document.querySelector("form[action='add.php']"),
    previewFrame = document.createElement('iframe'),
    cooldownTimer,
    lastHash = 0;

previewFrame.setAttribute('name', 'previewFrame');
previewFrame.setAttribute('scrolling', 'no');
previewFrame.style.cssText = 'border:0;width:100%;';

previewFrame.onload = resizePreview;

textArea.onkeyup = startKBPreviewUpdateDDoSPreventionTimer;

//from http://stackoverflow.com/a/7616484
function hashString(str){
  
    var hash = 0, i, char;
  
    if (str.length == 0)
      return hash;
  
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
  
    return hash;
}

function startKBPreviewUpdateDDoSPreventionTimer(e) {
  
    clearTimeout(cooldownTimer);
	cooldownTimer = setTimeout(updatePreview, 1000);
}

function updatePreview() {
	
  	var newHash = hashString(textArea.value),
        type = 'topic',
		oldAction = form.action;
  
    clearTimeout(cooldownTimer);

 	//if nothing changed we change nothing either
	if(lastHash !== newHash)
      lastHash = newHash;
  	else
      return;
    
    if(!previewFrame.parentNode)
        form.parentNode.insertBefore(previewFrame, form.nextSibling);
    
    previewFrame.setAttribute('src', 'preview_' + type + '.php');
	form.action = 'preview_' + type + '.php';
	form.target = 'previewFrame';
  	form.submit();
    
    form.action = oldAction;
    form.target = '_self';
}

function resizePreview() {
	previewFrame.height = previewFrame.contentWindow.document.body.scrollHeight + 'px';
}
