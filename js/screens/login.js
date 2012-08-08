function do_screen_login(element) {
	var url = "http://wordpress.com/xmlrpc.php";
	var username = "";
	var password = "";

	if (blackberry === false) {
		url = "http://localhost/wordpress31rc3/xmlrpc.php";
		username = "editore";
		password = "";
	}
	
	element.getElementById("url_input_field").value = url ;
	element.getElementById("username_input_field").value = username ;
	element.getElementById("password_input_field").value = password ;
}

function sign_up(e) {
	WP.Utils.openUrl('http://wordpress.com/signup/?ref=bbapp');
	e.preventDefault();
	return false;
}

function getEndPoint(url) {
	/* Trim the spaces */
	url =  url.replace(/^\s+|\s+$/, '');
	if(url.substr(url.length - 3) == "php") return url; /* We have xmlrpc url no changes required */
	if(url.substr(url.length - 1) == "/") url += "xmlrpc.php" ;
	else url += "/xmlrpc.php";		
	return url;		
}

function sign_in() {
    try {	
        var connection = new AddBlogConn(document.getElementById("username_input_field").value,
        		document.getElementById("password_input_field").value, 
        		getEndPoint( document.getElementById("url_input_field").value ) );
        connection.addListener(new AddBlogsListener(null));
        connection.startConn();
    } 
    catch (errrrrrr) {
		console.error(errrrrrr.message);
    }
}

function AddBlogsListener(parentObj) {
	this._parent = parentObj;
}

AddBlogsListener.prototype.connRequestError = function (error) {
	EW.LogSystem.error("AddBlogsListener.connRequestError");
	WP.Utils.errorDialog(error);
};

AddBlogsListener.prototype.connRequestStopped = function () {
	EW.LogSystem.debug("AddBlogsListener.connRequestStopped");
};

AddBlogsListener.prototype.connRequestCompleted = function (userBlogs)
{
	EW.LogSystem.debug("AddBlogsListener.connRequestCompleted");
/*
 * risposta dal server	
 * [{"isAdmin":false,"url":"http://localhost/wp_mopress/","blogid":"1","blogName":"Local &amp; Tes\"","xmlrpc":"http://localhost/wp_mopress/xmlrpc.php","username":"mopress","password":"mopress"}]
 */
	
	EW.LogSystem.debug("numero blog " +userBlogs.length);
	
	if(userBlogs.length == 0) {	
		
	} else {
		EW.LogSystem.debug("adding new blogs to the main blogs list"); 
	
		for(var x = 0; x < userBlogs.length; x++)
		{
			EW.LogSystem.debug("Provo a scrivere in memoria il nuovo blog "+x);
			EW.LogSystem.debug("la pasword impostata è: "+ userBlogs[x].password );
			var presence = false;
			var blogs = WP.Model.getBlogs();
			for(var j = 0; j < blogs.length; j++) {
				EW.LogSystem.debug("il nuovo blog ha url "+blogs[j].xmlrpc);
				EW.LogSystem.debug("il vecchio blog ha url "+userBlogs[x].xmlrpc);
				if(blogs[j].xmlrpc.toString() == userBlogs[x].xmlrpc.toString()) {
					presence = true;
					EW.LogSystem.debug("il nuovo blog "+x+ " e' gia' presente nell'applicativo");
					break;
				}
			}

			if(!presence) {
				EW.LogSystem.debug("aggiungo il nuovo blog nell'applicativo "+x);
				//aggiungo le informazioni fittizie relativi ai commenti
				userBlogs[x].comments_count={approved:(new String("0")), awaiting_moderation:(new String("0")), spam:(new String("0")), total_comments:(new Number(0))};
				userBlogs[x].isNewComments = false;
				userBlogs[x].comments = new Array();										
				WP.Model.addBlog(userBlogs[x]); 
			}
		}
		WP.Model.storeBlogs();
	}
	showMainScreen();
};