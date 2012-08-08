function do_screen_test_filters(element) {
	var image = element.getElementById("bigpic");
	image.setAttribute('src', 'img/filtrr_back.jpg');
	window.setTimeout(attach_event_to_imgs, 1000);
}

function attach_event_to_imgs() {
	/* Predefine our effects as functions for easy calling. */
	var EFFECTS = {
		
		e1 : function() {
		
			/* This is the starting point to apply filtrr on your images.
			 * Using the img() function you can pass in an id or the img element,
			 * and a callback function, to be called when the image has been loaded.
			 * The callback function is given a filtr parameter which is a wrapper around
			 * the canvas element, and contains all the filter and blending methods. 
			 */
			filtrr.img("bigpic", function(filtr) {
			
				/* filtr.duplicate() can be used to get a duplicate of the filtr object
				 * so you can blend many together.*/
				var topFiltr = filtr.duplicate();
				
				/* filtr.core contains all the core filters. Filter calls can be chained.
				 * filtr.blend contains all the blending modes. */
				topFiltr.core.saturation(0).blur();
				
				/* Here we are blending the topFiltr on top of the filtr object. */
				filtr.blend.multiply(topFiltr);
				
				/* All filters after a blending, will apply on the blended filtr object */
				filtr.core.tint([60, 35, 10], [170, 140, 160]).contrast(0.8).brightness(10);
				
				/* You need to call put() on a filtr object to see your filter applied on 
				 * the image. This is explained in the commented version of filtrr.js */
				filtr.put();
				
				/* filtr also gives a reference to the underlying canvas object using filtr.canvas().
				 * This is very useful in drawing frames or other images on top - so for example you 
				 * can draw the white frame as in my example, or a wrinkly pattern.
				 */
				filtr.canvas().getContext("2d").drawImage(whiteFrame, 0, 0);
				
				/* Here I'm just removing the 'Working..' loader. */
				$("#loader").fadeOut(100);
			});	
		},
		
		e2 : function() {
			filtrr.img("bigpic", function(filtr) {
				filtr.core.saturation(0.3).posterize(70).tint([50, 35, 10], [190, 190, 230]);	
				filtr.put();
				filtr.canvas().getContext("2d").drawImage(whiteFrame, 0, 0);
				$("#loader").fadeOut(100);
			});
		},
		
		e3 : function() {
			filtrr.img("bigpic", function(filtr) {
				filtr.core.tint([60, 35, 10], [170, 170, 230]).contrast(0.8);
				filtr.put();
				filtr.canvas().getContext("2d").drawImage(whiteFrame, 0, 0);
				$("#loader").fadeOut(100);
			});
		},
		
		e4 : function() {
			filtrr.img("bigpic", function(filtr) {
				filtr.core.grayScale().tint([60,60,30], [210, 210, 210]);
				filtr.put();
				filtr.canvas().getContext("2d").drawImage(whiteFrame, 0, 0);
				$("#loader").fadeOut(100);
			});
		},
		
		e5 : function() {
			filtrr.img("bigpic", function(filtr) {
				filtr.core.tint([30, 40, 30], [120, 170, 210])
						  .contrast(0.75)
						  .bias(1)
					      .saturation(0.6)
					      .brightness(20);
				filtr.put();
				filtr.canvas().getContext("2d").drawImage(whiteFrame, 0, 0);
				$("#loader").fadeOut(100);
			});
		},
		
		e6 : function() {
			filtrr.img("bigpic", function(filtr) {
				filtr.core.saturation(0.4).contrast(0.75).tint([20, 35, 10], [150, 160, 230]);
				filtr.put();
				filtr.canvas().getContext("2d").drawImage(whiteFrame, 0, 0);
				$("#loader").fadeOut(100);
			});
		},
		
		e7 : function() {
			filtrr.img("bigpic", function(filtr) {
				var topFiltr = filtr.duplicate();
				topFiltr.core.tint([20, 35, 10], [150, 160, 230]).saturation(0.6);
				filtr.core.adjust(0.1,0.7,0.4).saturation(0.6).contrast(0.8);
				filtr.blend.multiply(topFiltr);
				filtr.put();
				filtr.canvas().getContext("2d").drawImage(whiteFrame, 0, 0);
				$("#loader").fadeOut(100);
			});
		},
		
		e8 : function() {
			filtrr.img("bigpic", function(filtr) {
				
				/* In this example we are creating 3 different duplicate layers. Each one is filtered
				 * and then blended on the filtr object. Note that you could say blend topFiltr1 and 
				 * topFiltr2 together and then blend the resuln on filtr.
				 */
				var topFiltr = filtr.duplicate();				
				var topFiltr1 = filtr.duplicate();
				var topFiltr2 = filtr.duplicate();
				topFiltr2.core.fill(167, 118, 12);
				topFiltr1.core.gaussianBlur();
				topFiltr.core.saturation(0);
				filtr.blend.overlay(topFiltr);
				filtr.blend.softLight(topFiltr1);
				filtr.blend.softLight(topFiltr2);
				filtr.core.saturation(0.5).contrast(0.86);
				filtr.put();
				filtr.canvas().getContext("2d").drawImage(whiteFrame, 0, 0);
				$("#loader").fadeOut(100);
			});
		},
		
		e9 : function() {
			filtrr.img("bigpic", function(filtr) {
				var topFiltr = filtr.duplicate();
				var topFiltr1 = filtr.duplicate();
				topFiltr1.core.fill(226, 217, 113).saturation(0.2);
				topFiltr.core.gaussianBlur().saturation(0.2);
				topFiltr.blend.multiply(topFiltr1);
				filtr.core.saturation(0.2).tint([30, 45, 40], [110, 190, 110]);
				filtr.blend.multiply(topFiltr);
				filtr.core.brightness(20).sharpen().contrast(1.1);
				filtr.put();
				filtr.canvas().getContext("2d").drawImage(whiteFrame, 0, 0);
				$("#loader").fadeOut(100);
			});
		},
		
		e10 : function() {
			filtrr.img("bigpic", function(filtr) {
				filtr.core.sepia().bias(0.6);
				filtr.put();
				filtr.canvas().getContext("2d").drawImage(whiteFrame, 0, 0);
				$("#loader").fadeOut(100);
			});	
		}
	};
	
	/* Preload the frame image which we will draw around the filtered images for a more vintage look. */
	var whiteFrame = new Image();
	whiteFrame.src = "img/whiteframe.png";
	$("#overflow-cntr img").click(function(){
		$this = $(this);
		$("#loader").show();
		$("#bigpic-cntr canvas").remove();	
		$("#bigpic-cntr #bigpic").css("display", "block");
		window.setTimeout(function(){
			EFFECTS[$this.attr("id")]();
			}, 30);
	});	
}

function upload_picture() {
	var content = prepare_to_upload();
	
	var url = currentBlog.xmlrpc;
	var username = currentBlog.username;
	var password = currentBlog.password;
	
	$("#loader").show();
	
	try {
		var connection = new NewMedia(username, password, url, content);
		connection.addListener(new UploadMediaListener());
		connection.startConn();
	} 
	catch (errrrrrr) {
		console.error(errrrrrr);
	}
}

function UploadMediaListener() {

}

UploadMediaListener.prototype.connRequestError = function (error) {
	EW.LogSystem.error("UploadMediaListener.connRequestError");
	$("#loader").fadeOut(100);
	alert(error.name + " - " + error.message);
	
};

UploadMediaListener.prototype.connRequestStopped = function () {
	EW.LogSystem.debug("UploadMediaListener.connRequestStopped");
	//not used. il cancel button cambia
	$("#loader").fadeOut(100);
};

UploadMediaListener.prototype.connRequestCompleted = function (resp)
{
	EW.LogSystem.debug("UploadMediaListener.connRequestCompleted");
	$("#loader").fadeOut(100);
	alert("uploaded: "+resp.url);
};


function prepare_to_upload( ) {
	var canvas = document.getElementsByTagName('canvas')[0]; //document.getElementById("area");
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
		
		//calculate the file name
		var fileName = "webos.jpg";
		var myTime = new Date();
		for (var z = 0; z < mimeType.length && z < 50; z++) {
			if ( scc(mimeType.charCodeAt(z)) == '/' ) {
				fileName = myTime.getMilliseconds() + "." + mimeType.substring(z+1);
				console.log("file name : " + fileName);
				break;
			}
		}
		
		var responseObj = {'error': false, 'bits': new Base64(imageData, true), 'type': mimeType, 
				'name':fileName, 'height':canvas.height, 'width':canvas.width };
		return responseObj;
	} else {
		//"Something went wrong! Please, try again later."
	}
}



//tmp function
function bw( ) {
	var canvas = document.getElementById("area");
	var context = canvas.getContext("2d");
	var image = document.getElementById("canvasSource");
	
    var height = image.height;
    var width = image.width;
	canvas.setAttribute("height", height);
	canvas.setAttribute("width", width);
	
	context.drawImage(image, 0, 0);	
	
	WP.Utils.Debug.log("bw", "canvas height"+height, WP.Utils.Debug.info);
	WP.Utils.Debug.log("bw", "canvas width"+width, WP.Utils.Debug.info);
	
	var imgd = context.getImageData(0, 0, width, height);
	var pix = imgd.data;
	for (var i = 0, n = pix.length; i < n; i += 4) {
		var grayscale = pix[i  ] * .3 + pix[i+1] * .59 + pix[i+2] * .11;
		pix[i  ] = grayscale; 	// red
		pix[i+1] = grayscale; 	// green
		pix[i+2] = grayscale; 	// blue
		// alpha
	}
	context.putImageData(imgd, 0, 0);
	
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
		
		//calculate the file name
		var fileName = "webos.jpg";
		var myTime = new Date();
		for (var z = 0; z < mimeType.length && z < 50; z++) {
			if ( scc(mimeType.charCodeAt(z)) == '/' ) {
				fileName = myTime.getMilliseconds() + "." + mimeType.substring(z+1);
				console.log("file name : " + fileName);
				break;
			}
		}
		
		var responseObj = {'error': false, 'bits': new Base64(imageData, true), 'type': mimeType, 
				'name':fileName, 'height':canvas.height, 'width':canvas.width };
		return responseObj;
	} else {
		//"Something went wrong! Please, try again later."
	}
}