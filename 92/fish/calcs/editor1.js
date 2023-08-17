
var textarea = document.getElementById('content');
try{
textarea.value = JSON.parse(getCookie("notepad"))
}
catch{
}

function uploadContent() {
    console.log("Update!")
    
    // If textarea value changes.
    if (content != textarea.value) {
        console.log("Saved!")
        content = textarea.value;
        setCookie("notepad", JSON.stringify(content), 365)
        var temp = textarea.value;
        printable.removeChild(printable.firstChild);
        printable.appendChild(document.createTextNode(temp));
    }
    
    setTimeout(uploadContent, 1000);
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


var printable = document.getElementById('printable');
var content = textarea.value;

// Make the content available to print.
printable.appendChild(document.createTextNode(content));

textarea.focus();
uploadContent();
