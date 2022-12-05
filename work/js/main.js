var file = 0;
var event = 0;

window.onload = function() {
	if (typeof(window.FileReader) == 'undefined') {
    	alert("Your browser doesn't support drag and drop! Try to update it or try another browser!");
	}
}

function getXhrType() {

    let x;
    
    try {
        x = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
        try {
            x = new ActiveXObject("Microsoft.XMLHTTP");
        } catch (E) {
            x = 0;
        }
    }
    
    if(!x && typeof XMLHttpRequest != 'undefined') x = new XMLHttpRequest();
    
    return x;
}

function ord(string) {
	var ch = string.charCodeAt(0);
	if (ch>0xFF) ch-=0x350;
	
	return ch;
}

function dragOverHandler(ev) {
    ev.preventDefault();
}

function dropHandler(ev) {

    ev.preventDefault();
  
    if (ev.dataTransfer.items) {
  
    	if(ev.dataTransfer.files.length > 1) {
    	  	alert("You can upload only one file per once!");
    	  	return;
    	}
  	
    	if(ev.dataTransfer.items[0].kind === 'file' && (ev.dataTransfer.items[0].type === 'image/jpeg' || ev.dataTransfer.items[0].type === 'image/png' || ev.dataTransfer.items[0].type === 'image/bmp')) {
    	  	if (ev.dataTransfer.files[0].size > 0) {
    	  		file = ev.dataTransfer.items[0].getAsFile();

    	  		document.getElementsByClassName('drag-txt')[0].innerHTML = file.name;
    	  	
                event = ev;
    	  	} else {
    	  		alert("The photo is probably damaged!");
    	 		return;	
    	  	}
    	} else {
    		alert("Only photos allowed!");
    		return;
    	}
    }
}

function uploadProgress(event) {
    var percent = parseInt(event.loaded / event.total * 100);
    document.getElementsByClassName('drag-txt')[0].innerHTML = 'Loading:' + percent + '%';
}

function removeDragData(ev) {
	document.getElementsByClassName('drag-txt')[0].innerHTML = 'Drag file to this <i>drop zone</i>.';
  
    if (ev.dataTransfer.items) {
      ev.dataTransfer.items.clear();
    } else {
      ev.dataTransfer.clearData();
    }

    event = 0;
}

function crypt(arr) {

    if(document.getElementById("key").value.length != 0 || document.getElementById("block").value.length != 0) {
        if(document.getElementById("key").value.length == 16 || document.getElementById("key").value.length == 24 || document.getElementById("key").value.length == 32) {
            if(document.getElementById("block").value.length == 16) {

                var key = [];
                var block = [];
            
                for(var i = 0;i < document.getElementById("key").value.length;i++) {
                    key.push(this.ord(document.getElementById("key").value[i]));
                }
            
                for(var i = 0;i < document.getElementById("block").value.length;i++) {
                    block.push(this.ord(document.getElementById("block").value[i]));
                }
            
                if(arr.length < 16) {
                    var empty_spaces = 16 - arr.length;
                    for(var j = 0; j < empty_spaces;j++) {
                      arr += " ";
                    }
                }
            
                var textBytes = aesjs.utils.utf8.toBytes(arr);
                
                var aesCbc = new aesjs.ModeOfOperation.ofb(key, block);
                var encryptedBytes = aesCbc.encrypt(textBytes);
            
                arr = aesjs.utils.hex.fromBytes(encryptedBytes);

                console.log(arr);

                return arr;

            } else {
                alert("Tse size of block must be 16!");
            }
        } else {
            alert("Tse size of key must be 16, 24 or 32! Try again!");
        }
    } else {
        alert("The key and block fields are empty! Please, fill it!");
    }
}

function request() {
	if(file != 0) {

        let fileReader = new FileReader();

        fileReader.readAsBinaryString(file);

        fileReader.onload = function(event) {
            let arrayBuffer = fileReader.result;

            //console.log(arrayBuffer[1].charCodeAt(0));

            let chiper = crypt(arrayBuffer);
            
            const xhr = getXhrType();
            
            xhr.upload.addEventListener('progress', uploadProgress, false);
            
            xhr.open('POST', 'http://localhost:80/work/php/upload.php', true);
            //xhr.setRequestHeader('X-FILE-NAME', file.name);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            
            xhr.onload = function () {
                document.getElementsByClassName('drag-txt')[0].innerHTML = '<p class="drag-txt">Drag file to this <i>drop zone</i>.</p>';
                if (xhr.status === 200) {
                    if(x.responseText == 1) {
                        alert('Image successfully uploaded');
                        file = 0;
                        removeDragData(event);
                    } else {
                        alert('Image upload failed!');
                    }
                } else {
                    alert('Image upload failed!');
                }
            };
            
            xhr.send("arr="+encodeURIComponent(chiper));
        };
	}
}
