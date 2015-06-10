// ==UserScript==
// @name       preFlight
// @version    0.0.3
// @description  shows the preview of a thread response under the message field
// @match      http://pouet.net/topic.php?which*
// @match      http://www.pouet.net/topic.php?which*
// @match      http://pouet.net/prod.php?which*
// @match      http://www.pouet.net/prod.php?which*
// @copyright  2013+, mog@trbl.at
// ==/UserScript==
var textArea = document.querySelector("textarea"),
    bb_buttons = document.querySelector("#pouet_bb_editor"),
    quote_buttons = document.querySelectorAll(".foot .tools a"),
    
    form = document.querySelector('form[action="add.php"]'),
    previewFrame = document.createElement('iframe'),
    
    isProdPage = !!document.querySelector('textarea[name="comment"]'),
    cooldownTimer,
    lastHash = 0;

previewFrame.setAttribute('name', 'previewFrame');
previewFrame.setAttribute('scrolling', 'no');
previewFrame.style.cssText = 'border:0;width:100%;';

previewFrame.onload = resizePreview;

textArea.oninput = startKBPreviewUpdateDDoSPreventionTimer;
bb_buttons.onclick = startKBPreviewUpdateDDoSPreventionTimer;

for(var q = 0; q < quote_buttons.length; q++){
    console.log(quote_buttons[q]);
    quote_buttons[q].onclick = startKBPreviewUpdateDDoSPreventionTimer;
}

//from http://stackoverflow.com/a/7616484
function hashString(str) {

    var hash = 0,
        i, char;

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
        oldAction = form.action;

    if (isProdPage)
        textArea.setAttribute("name", "message");

    clearTimeout(cooldownTimer);

    //if nothing changed we change nothing either
    if (lastHash !== newHash)
        lastHash = newHash;
    else
        return;

    if (!previewFrame.parentNode)
        form.parentNode.insertBefore(previewFrame, form.nextSibling);
    
    previewFrame.setAttribute('src', 'preview.php');

    form.action = 'preview.php';
    form.target = 'previewFrame';

    //welp, never give the submit button the id "submit" - as it overrides the function
    //this is the workaround *sigh*
    document.createElement('form').submit.call(form);
    form.click();

    if (isProdPage)
        textArea.setAttribute("name", "comment");

    form.action = oldAction;
    form.target = '_self';
}

function resizePreview() {
    try {
        //it nags that it can't find "style" though writes it nonetheless
        previewFrame.contentDocument.querySelector('h2').remove();

        previewFrame.contentDocument.querySelector('#content').style.cssText = "margin:0;padding:0;";
        previewFrame.contentDocument.querySelector('.pouettbl').style.cssText = "padding:0;width:100%;";
        previewFrame.contentDocument.querySelector('.content').style.cssText = "position:absolute;top:0;right:0;bottom:0;left:0;border:2px solid #000;border-bottom:0px;margin:0;";

        previewFrame.height = previewFrame.contentDocument.body.scrollHeight + 'px';
    } catch (e) {}
}
