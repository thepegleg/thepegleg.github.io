document.cookie = 'cross-site-cookie2=noneCookie; SameSite=None; Secure';
function openInNewTab(url) {
  
  if(new URLSearchParams(location.search).get("noblank") != null)
  {
    window.location= url;
    return;
  }
  

  win = window.open();
  win.document.body.style.margin = '0';
  win.document.body.style.height = '100vh';

  const icon = win.document.createElement('link')
  icon.rel = "shortcut icon"
  icon.href = `${window.location.origin}/icon.png`
  icon.type = "image/png"
  win.document.head.appendChild(icon)
  
  /*
  var arc = win.document.createElement('script')
  arc.async = true
  arc.src = "https://arc.io/widget.min.js#RqQiAHK7"
  win.document.head.appendChild(arc)*/

const title = win.document.createElement('title')
  title.innerText = "Calculator"
  win.document.head.appendChild(title)

  /*
  var home = win.document.createElement('a')
  home.style.display = "block"
  home.style.position = "absolute"
  home.style.fontFamily = "'Courier New', Courier, monospace";
  home.style.color = "rgb(76, 160, 55)"
  home.href="#"
  home.onclick = 'return console.log("hi") && false'
  home.innerText = "home"
  win.document.body.appendChild(home);
  */

  const iframe = win.document.createElement('iframe');
  iframe.style.border = 'none';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.margin = '0';
  iframe.id = 'content';
  iframe.src = url;
  win.document.body.appendChild(iframe);

}
