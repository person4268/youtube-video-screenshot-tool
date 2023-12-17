// https://stackoverflow.com/a/12300351
function dataURItoBlob(dataURI) {
	// convert base64 to raw binary data held in a string
	// doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	var byteString = atob(dataURI.split(',')[1]);
  
	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
  
	// write the bytes of the string to an ArrayBuffer
	var ab = new ArrayBuffer(byteString.length);
  
	// create a view into the buffer
	var ia = new Uint8Array(ab);
  
	// set the bytes of the buffer to the correct values
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}
  
	// write the ArrayBuffer to a blob, and you're done
	var blob = new Blob([ab], {type: mimeString});
	return blob;
  
  }

/**
 * Have noted a case before where there are multiple video elements, and one has a width and height of 0,
 * likely do do with video preview feature. 
 */
function getVideoWithResolutionGtZero() {
	var videos = document.getElementsByClassName("video-stream html5-main-video");
	for(let i = 0; i < videos.length; i++) {
		if(videos[i].nodeName === "VIDEO" && videos[i].videoWidth > 0 && videos[i].videoHeight > 0) {
			return videos[i];
		} else {
			console.warn("[youtube-video-screenshot-tool] video resolution == 0, skipping");
		}
	}
}

function screenshot() {
	var video = getVideoWithResolutionGtZero();
	var canvas = document.createElement("canvas");
	//	canvas.width = video.style.width.slice(0,-2) /* Pull it from the CSS */
	//	canvas.height = video.style.height.slice(0,-2)
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;

	var ctx = canvas.getContext("2d");
	ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

	var dataURI = canvas.toDataURL("image/png");
	window.open(URL.createObjectURL(dataURItoBlob(dataURI)));
}

function createEntry() {
	/* Create an entry in the youtube settings panel */
	var menuitem_icon = document.createElement("div");
	menuitem_icon.setAttribute("class", "ytp-menuitem-icon");

	var menuitem_content = document.createElement("div");
	menuitem_content.setAttribute("class", "ytp-menuitem-content");


	var menuitem_label = document.createElement("div");
	menuitem_label.setAttribute("class", "ytp-menuitem-label");
	menuitem_label.append(document.createTextNode("Take Screenshot"));

	var menuitem = document.createElement("div");
	menuitem.setAttribute("class", "ytp-menuitem");
	menuitem.setAttribute("role", "menuitem");
	menuitem.setAttribute("tabindex", "0");
	menuitem.append(menuitem_icon);
	menuitem.append(menuitem_label);
	menuitem.append(menuitem_content);

	let menus = document.getElementsByClassName("ytp-panel-menu");

	/* There appears to be more than one of them now for some reason */
	for (let i = 0; i < menus.length; i++) {
		menus[i].append(menuitem);
	}

	menuitem.addEventListener("click", screenshot);

}

/* Wait for ytp-panel-menu to appear */
var pollPanelMenuInterval;
function pollPanelMenu() {
	if(document.getElementsByClassName("ytp-panel-menu").length !== 0) {
		clearInterval(pollPanelMenuInterval);
		createEntry();
	}
}
pollPanelMenuInterval = setInterval(pollPanelMenu, 500);
