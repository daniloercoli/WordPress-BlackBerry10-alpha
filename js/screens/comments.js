function do_screen_comments(element) {
	currentComment = null; //reset the latest comment opened in the app
}

//filtri sulla connessione
var post_id = "";
var offset = 0;
var number = 50;
var status="";
	

function refresh_if_needed() {
	//load the comments if needed. Put here a timeout.
	if ( typeof( currentBlog.comments ) == "undefined" || currentBlog.comments == null )
		get_comments();
	else 
		showCommentsList();
}

function get_comments() {
	$("#loading_indicator").show();
	var url = currentBlog.xmlrpc;
	var username = currentBlog.username;
	var password = currentBlog.password;
	
	//$("#loader").show();
	try {
		var connection = new GetCommentsConn(username, password, url);
		connection.setNumber(number);
		connection.setOffset(offset);			
		connection.addListener(new GetCommentsListener());
		connection.startConn();
	} 
	catch (errrrrrr) {
		console.error(errrrrrr);
	}
}



function showCommentsList (){

	var commentsList = currentBlog.comments;
	var listaCommenti = document.getElementById("comments_list");
	listaCommenti.innerHTML = "";
	
	for(var x = 0; x < commentsList.length; x++) {
		EW.LogSystem.debug("comment_id" + commentsList[x].comment_id);

		//Gravatar
		var gvtUrl = null;
		if( typeof (commentsList[x].author_email) != "undefined" ) {
			var md5Email = MD5(commentsList[x].author_email);
			gvtUrl = "http://www.gravatar.com/avatar/"+md5Email+"?s=48&amp;d=identicon&amp;r=G";
		} else {
			gvtUrl = "http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?s=48&amp;d=identicon&amp;r=G";
		}
		
	
	 	var contenutoCommento = commentsList[x].content;
		if (typeof(contenutoCommento) === "undefined") {
			contenutoCommento = "";
		}	
		if (contenutoCommento.length > 197 ) {
			contenutoCommento = contenutoCommento.substring(0,197)+" ...";				
		} 

		//show only relevant states
		var comment_status = "";
		if(commentsList[x].status.toString() == "hold") {
			comment_status = "pending";
		}
		if(commentsList[x].status.toString() == "spam") {
			comment_status = "spam";
		}
		
		//verifica se esiste il titolo del post
		var on_post ="";
		if (typeof(commentsList[x].post_title) != "undefined") {
			on_post= commentsList[x].post_title;
		}	
		
		// Create the item's DOM in a fragment
		var item = document.createElement('div');
		item.setAttribute('data-bb-type','item');
		item.setAttribute('data-bb-title', commentsList[x].author );
		item.setAttribute('data-bb-accent-text', comment_status);
		item.innerHTML = contenutoCommento;
		item.setAttribute('data-bb-img', gvtUrl);
		item.onclick = 	EW.Utils.createMethodReference(window, "showCommentDetails",  commentsList[x]);
		// Append to list
		listaCommenti.appendItem(item);
	}
 }


function showCommentDetails ( comment ) {
	EW.LogSystem.debug("comment_id" + comment.comment_id);
	currentComment = comment;
	bb.pushScreen('screens/comment_details.html', 'comment_details');
}

function GetCommentsListener() {

}

GetCommentsListener.prototype.connRequestError = function (error) {
	EW.LogSystem.error("GetCommentsListener.connRequestError");
	//$("#loader").fadeOut(100);
	alert(error.name + " - " + error.message);
	$("#loading_indicator").hide();
};

GetCommentsListener.prototype.connRequestStopped = function () {
	EW.LogSystem.debug("GetCommentsListener.connRequestStopped");
	//not used. il cancel button cambia
	$("#loading_indicator").hide();
};

GetCommentsListener.prototype.connRequestCompleted = function (commentsList)
{
	EW.LogSystem.debug("GetCommentsListener.connRequestCompleted");
	$("#loading_indicator").hide();
	EW.LogSystem.debug("CommentsController.connRequestCompleted");
	EW.LogSystem.debug("numero commenti  " +commentsList.length);
//	this.blogObj.isNewComments = false; //azzera la segnalazione di nuovi commenti in home page
	currentBlog.comments = commentsList;
	WP.Model.storeBlogs(); //save the changes
	showCommentsList();
};