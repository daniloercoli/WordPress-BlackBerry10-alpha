function do_screen_comment_details(element) {	
	if ( currentComment.status.toString() == "hold") {
		//show approve
		element.getElementById("approve_hold").innerHTML = "Approve";
	} else {
		//show unapprove
		element.getElementById("approve_hold").innerHTML = "Unapprove";
	}
	//Author info
	var gvtUrl = null;
	if( typeof (currentComment.author_email) != "undefined" ) {
		var md5Email = MD5(currentComment.author_email);
		gvtUrl = "http://www.gravatar.com/avatar/"+md5Email+"?s=48&amp;d=identicon&amp;r=G";
	} else {
		gvtUrl = "http://www.gravatar.com/avatar/3b3be63a4c2a439b013787725dfce802?s=48&amp;d=identicon&amp;r=G";
	}
	element.getElementById("gravatar").setAttribute('src', gvtUrl );

	element.getElementById("author_name").innerHTML = currentComment.author;
	
	if (typeof(currentComment.author_email) != "undefined") {
		element.getElementById("author_email").innerHTML = 'Email: ' + currentComment.author_email;
	}
	
	if (typeof(currentComment.author_url) != "undefined") {
		element.getElementById("author_url").innerHTML = 'Site: ' + currentComment.author_url;
	}
	
	//Comment Info
	if (typeof(currentComment.post_title) != "undefined") {
		element.getElementById("post_title").innerHTML = 'On: '+ currentComment.post_title;
	}
	
	var comment_status = "";
	if(currentComment.status.toString() == "hold") {
		comment_status = "pending";
	}
	if(currentComment.status.toString() == "approve") {
		comment_status = "approved";
	}
	element.getElementById("status").innerHTML = 'Status: ' + comment_status;
	
	if (typeof(currentComment.content) !== undefined) {
		element.getElementById("comment_content").innerHTML = currentComment.content;
	}
	
	//Setting up the actions on the buttons
	if ( currentComment.status.toString() == "hold") {
		//show approve
		element.getElementById("approve_hold").onclick = EW.Utils.createMethodReference(window, "editComm", "approve");
	} else {
		//show unapprove
		element.getElementById("approve_hold").onclick = EW.Utils.createMethodReference(window, "editComm", "hold");
	}
	element.getElementById("spam").onclick = EW.Utils.createMethodReference(window, "editComm", "spam");
	element.getElementById("delete").onclick = EW.Utils.createMethodReference(window, "deleteComm");
}

function editComm(comm_action){
	try {
		//this.commentObj.status = comm_action;
		var modObj = {
				"comment_id" : currentComment.comment_id,
				"status" : comm_action ,
				"content" :currentComment.content
		};
		this.connection = new EditComment(currentBlog.username, currentBlog.password, currentBlog.xmlrpc, modObj);
		//this.connection.addListener(new EditCommentListener(this, comm_action));
		this.connection.startConn();
	}
	catch(errrrrrr) {
		WP.Controller.showErrorDialog ("Err", errrrrrr);
	}
	
	var commentsList = currentBlog.comments;
	for (var x = 0; x < commentsList.length; x++) {
		if (commentsList[x].comment_id == currentComment.comment_id) {
			commentsList[x].status = comm_action;
			WP.Model.storeBlogs(); //save the changes
			break;
		}
	}
	bb.popScreen();
}

function deleteComm() {
	try {

		var url = currentBlog.xmlrpc;
		var username = currentBlog.username;
		var password = currentBlog.password;
		var connection = new DeleteComment(username, password, url, currentComment.comment_id);
		connection.startConn();
		/*
		var commentsList = this._parent.blogObj.comments;
		for (var x = 0; x < commentsList.length; x++) {
			EW.LogSystem.debug("comment_id" + commentsList[x].comment_id);
			if (commentsList[x].comment_id == this._parent.commentObj.comment_id) {
				//found the parent comment. Inser here the reply
				 this._parent.blogObj.comments.splice ( (x+1), 0, _response );
				break;
			}
		}
		 */
		var commentsList = currentBlog.comments;
		for (var x = 0; x < commentsList.length; x++) {
			EW.LogSystem.debug("comment_id" + commentsList[x].comment_id);
			if (commentsList[x].comment_id == currentComment.comment_id) {
				currentBlog.comments.splice(x, 1);
				WP.Model.storeBlogs(); //save the changes
				break;
			}
		}

	}
	catch(errrrrrr) {
		WP.Controller.showErrorDialog ("Err", errrrrrr);
	}

	bb.popScreen();
}

function reply2Comment(){
	var response = prompt("Write your response below", "Response here!");
	try {
		var replyObj = {
				"comment_parent" : currentComment.comment_id,
				"content" : response
		};
		this.connection = new ReplyComment(currentBlog.username, currentBlog.password, currentBlog.xmlrpc,currentComment.post_id, replyObj);
		this.connection.startConn();
	}
	catch(errrrrrr) {
		WP.Controller.showErrorDialog ("Err", errrrrrr);
	}
	bb.popScreen();
}