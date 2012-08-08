function do_screen_quick_photo(element) {
	element.getElementById('txtFile').addEventListener('change', handleFileSelect, false);
	element.getElementById('pick_from_library').onclick = function() { $("#txtFile").click(); };
}

var testingCamera = true; //set to true to by-pass the camera app. Seems that the camera app is not working on BB10 yet.
var images_to_upload = new Array(); //keep the reference to images on disk
var images_uploaded = new Array(); //Keep a references to images already uploaded to the server

//Called when a file is selected from the library
function doOnLoad(theFile) {
	return function (e) {
		//e = ProgressEvent object
		//e.target = FileReader object
		
		WP.Utils.Debug.log("doOnLoad", e.target.result, WP.Utils.Debug.info);
		if (theFile.type.match('image.*')) {
			// Render thumbnail.
			addPhotoToPost(e.target.result);
		}
		
		/*
		else if (theFile.type.match('text.*')) {
			output += " <textarea disabled cols='50' rows='3'>" + e.target.result + "</textarea>";
		}
		else if (theFile.type.match('audio.*')) {
			output += " <audio controls width='100' height='50'><source src='" + e.target.result + "'/>Your browser does not support the <code>Audio</code> element</audio>";
		}
		else if (theFile.type.match('video.*')) {
			output += " <video controls src='" + e.target.result + "' class='thumbnail'>Your browser does not support the <code>Video</code> element</video>";
		}
		*/
	};
}

//Called when the input file element is clicked
function handleFileSelect(evt) {
	try {
		var reader, files, size, i, f;
		WP.Utils.Debug.log("handleFileSelect", "start", WP.Utils.Debug.info);
		reader = new FileReader();
		files = evt.target.files; 
		size = files.length;
		WP.Utils.Debug.log("handleFileSelect", "in handleFileSelect # files selected : " + size, WP.Utils.Debug.info);
		for (i = 0; i < size; i = i + 1) {
			WP.Utils.Debug.log("handleFileSelect", "in handleFileSelect parsing file index " + i, WP.Utils.Debug.info);
			f = files[i];
			reader.onload = doOnLoad;

			if ((f.type.match('image.*')) || (f.type.match('audio.*')) || (f.type.match('video.*'))) {
				WP.Utils.Debug.log("handleFileSelect", "in handleFileSelect calling reader.readAsDataURL for type " + f.type, WP.Utils.Debug.info);
				// Read in the media file as a data URL.
				reader.readAsDataURL(f);
			}
			else if (f.type.match('text.*')) {
				WP.Utils.Debug.log("handleFileSelect", "in handleFileSelect calling reader.readAsText for type " + f.type, WP.Utils.Debug.info);
				// Read in the text file as plain text.
				reader.readAsText(f);
			}
		}
	
		WP.Utils.Debug.log("handleFileSelect", "end handleFileSelect", WP.Utils.Debug.info);
	}
	catch (e) {
		console.error(e);
	}
}

//Render thumbnail.
function addPhotoToPost(filePath) {
	var imgEl = document.createElement('img');
	imgEl.setAttribute('src', filePath);
	imgEl.setAttribute('width', '250px');
	imgEl.setAttribute('id', Math.floor((Math.random()*1000000)+1));
	document.getElementById('media_box').appendChild(imgEl);
	$('#media_box').fadeIn(100);
}

/* Photo capture Coed */
function takePicture() {
	if ( testingCamera !== true && WP.Utils.isBlackBerrySmartphone() ) {
		try {
			blackberry.media.camera.takePicture(onPhotoCaptured, onCameraClosed, onCameraError);
		} catch(e) {
			alert("Error in supported: " + e);
		}
	}
	else {
		onPhotoCaptured("http://localhost/wp4bb10/img/splash.png");
		//onPhotoCaptured("http://daniloercoli.files.wordpress.com/2012/01/20120108-004118.jpg");
	}
}

function onPhotoCaptured(filePath) {
	WP.Utils.Debug.log("onPhotoCaptured", filePath, WP.Utils.Debug.info);
	if ( testingCamera !== true && WP.Utils.isBlackBerrySmartphone() ) { //add the prefix only on real device when not testing with predefined images
		filePath = "file://" + filePath;
	}	
	addPhotoToPost(filePath); // Render thumbnail.
}

function onCameraClosed() {
//	alert("Camera closed event");
}

function onCameraError(e) {
	alert("Error occured: " + e);
}
/* End of photo capture code*/


function startUpload() {
	var allImgs = document.getElementById('media_box').getElementsByTagName('img');
	images_to_upload = new Array(); //clean the array
	images_uploaded = new Array();
	// Loop through all images
	for (var i=0;i<allImgs.length;i++){
		var image = allImgs[i];
		images_to_upload.push(image);
	}
	$('#loading_indicator').show();
	uploadNextPicture();
}

function uploadNextPicture() {
	if( images_to_upload.length > 0 ) {
		var currentImage = images_to_upload.shift();
		var filePath = currentImage.src;
		upload_picture(filePath);
	} else {
		uploadPost();
	}
}

function uploadPost() {
	var postContent = $("#newPostContent").val();
	for (var i=0;i<images_uploaded.length;i++){
		var image = images_uploaded[i];
		postContent += '<br />' + '<img src="'+image.url+'" />';
	}
	var content = {
			'title' : $("#newPostTitle").val(),
			'description' : postContent,
			'mt_keywords' : $("#newPostTags").val(),
			'publish' : true
	};
	var url = currentBlog.xmlrpc;
	var username = currentBlog.username;
	var password = currentBlog.password;
	try {
		var connection = new NewPost(username, password, url, content);
		connection.addListener(new UploadPostListener());
		connection.startConn();
	} 
	catch (errrrrrr) {
		console.error(errrrrrr);
	}
}

function UploadPostListener() {

}

UploadPostListener.prototype.connRequestError = function (error) {
	EW.LogSystem.error("UploadPostListener.connRequestError");
	alert(error.name + " - " + error.message);
	$('#loading_indicator').hide();
};

UploadPostListener.prototype.connRequestStopped = function () {
	EW.LogSystem.debug("UploadPostListener.connRequestStopped");
	//not used. il cancel button cambia 
};

UploadPostListener.prototype.connRequestCompleted = function (resp)
{
	EW.LogSystem.debug("UploadPostListener.connRequestCompleted");
	$('#loading_indicator').hide();
	bb.popScreen();
};

function upload_picture(filePath) {
	var content = getImageDataObj(filePath);
	var url = currentBlog.xmlrpc;
	var username = currentBlog.username;
	var password = currentBlog.password;
	try {
		var connection = new NewMedia(username, password, url, content);
		connection.addListener(new UploadMediaListener());
		connection.startConn();
	} 
	catch (errrrrrr) {
		console.error(errrrrrr);
		$('#loading_indicator').hide();
	}
}

function UploadMediaListener() {

}

UploadMediaListener.prototype.connRequestError = function (error) {
	EW.LogSystem.error("UploadMediaListener.connRequestError");
	alert(error.name + " - " + error.message);
	$('#loading_indicator').hide();
};

UploadMediaListener.prototype.connRequestStopped = function () {
	EW.LogSystem.debug("UploadMediaListener.connRequestStopped");
	//not used. il cancel button cambia 
};

UploadMediaListener.prototype.connRequestCompleted = function (resp)
{
	EW.LogSystem.debug("UploadMediaListener.connRequestCompleted");
	alert("uploaded: "+resp.url);
	images_uploaded.push(resp);
	uploadNextPicture();
};

function getImageDataObj( filePath ) {	
	var tmpImg = new Image();
	/*  img.onload = function(){
	    ctx.drawImage(img,0,0);
	    ctx.beginPath();
	    ctx.moveTo(30,96);
	    ctx.lineTo(70,66);
	    ctx.lineTo(103,76);
	    ctx.lineTo(170,15);
	    ctx.stroke();
	  };*/
	tmpImg.src = filePath;
	tmpImg.style.position = 'absolute';
	tmpImg.style.top = '-9999px';
	tmpImg.style.left = '-9999px';
    var height = tmpImg.height;
    var width = tmpImg.width;
    document.body.appendChild(tmpImg);
    
	var canvas = document.getElementById("area");
	var context = canvas.getContext("2d");
	canvas.setAttribute("height", height);
	canvas.setAttribute("width", width);
	canvas.style.position = 'absolute';
	canvas.style.top = '-9999px';
	canvas.style.left = '-9999px';
	
	context.drawImage(tmpImg, 0, 0);	
	
	/*var imgd = context.getImageData(0, 0, width, height);
	var pix = imgd.data;
	for (var i = 0, n = pix.length; i < n; i += 4) {
		var grayscale = pix[i  ] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
		pix[i  ] = grayscale; 	// red
		pix[i+1] = grayscale; 	// green
		pix[i+2] = grayscale; 	// blue
		// alpha
	}
	context.putImageData(imgd, 0, 0);
	*/
	var imageData = canvas.toDataURL(); 
	console.log("canvas.toDataURL " +imageData.substring(0,50));
	
	var mx = imageData.length;   
	var scc= String.fromCharCode;
	var i=0; var j=0; var k=0;
	for (var z = 0; z < mx && z < 50; z++) {
		if ( scc(imageData.charCodeAt(z)) == ':' )
			i = z;
		if ( scc(imageData.charCodeAt(z)) == ';' )
			j = z;
		if ( scc(imageData.charCodeAt(z)) == ',' )
			k = z;
	}
	
	if( ( i < j ) && ( j < k ) ) {
		var mimeType = imageData.substring(i+1,j); 
		console.log("mimeType : " + mimeType);
		imageData = imageData.substring(k+1); 
		console.log("img data : " +imageData.substring(0,50)); 
		
		//set a simple file name
		var fileName = new Date().getMilliseconds();
		for (var z = 0; z < mimeType.length && z < 50; z++) {
			if ( scc(mimeType.charCodeAt(z)) == '/' ) {
				fileName = new Date().getMilliseconds() + "." + mimeType.substring(z+1);
				console.log("file name : " + fileName);
				break;
			}
		}
		//try to set the real filename
		var n = filePath.split("/");
		if ( n.length > 0 ) {
			filename = n[n.length-1];
		}
		var responseObj = {'error': false, 'bits': new Base64(imageData, true), 'type': mimeType, 
				'name':fileName, 'height':canvas.height, 'width':canvas.width };
		return responseObj;
	} else {
		//"Something went wrong! Please, try again later."
	}
}