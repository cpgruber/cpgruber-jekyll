var header = document.getElementsByClassName('name')[0];
var subheaders = document.getElementsByClassName('subname');
var footer = document.getElementsByClassName('footername')[0];

hoverify(header);
for (var i=0;i<subheaders.length;i++){
  hoverify(subheaders[i]);
}
hoverifyFooter(footer);

function hoverify(element){
  var text = element.textContent;
  var letters = text.split('');
  var div = document.createElement('div');
  div.className = element.className;

  for (var i=0;i<letters.length;i++){
    var span = document.createElement('span');
    span.textContent = letters[i];
    if (letters[i] == " "){
      span.textContent = 'i';
      span.style.opacity = 0;
    }
    div.appendChild(span);
  }
  var parent = element.parentElement;
  parent.appendChild(div);
  parent.removeChild(element);
}

function hoverifyFooter(element){
  var text = element.textContent;
  var letters = text.split('');
  var div = document.createElement('div');
  div.className = element.className;
  var link = document.createElement('a');
  link.setAttribute('href','../index.html');

  for(var i=0;i<letters.length;i++){
    var span = document.createElement('span');
    span.textContent = letters[i];
    link.appendChild(span);
  }
  div.appendChild(link);
  var parent = element.parentElement;
  parent.removeChild(element);
  parent.insertBefore(div,parent.firstChild);
}
