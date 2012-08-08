function do_screen_about(element) {
	try {
		WP.Utils.Debug.log("do_screen_about", "in displayDetails", WP.Utils.Debug.info);
		
		var ele = element.getElementById("app-details-container");
		
		if ((window.blackberry === undefined) || (blackberry.app === undefined)) {
			WP.Utils.Debug.log("do_screen_about", "blackberry.app object is undefined.", WP.Utils.Debug.error);
			ele.insertAdjacentHTML("beforeend", "<p><i><b>blackberry.app</b> object not found (likely cause is WebWorks APIs are not supported by this user agent).</i></p>");
			return false;
		} 
		
		var sb = new StringBuilder();
		sb.append("<table>");
		sb.append("<tr><th>Name</th><td>" + blackberry.app.name + "</td></tr>");
		sb.append("<tr><th>ID</th><td>" + blackberry.app.id + "</td></tr>");
		sb.append("<tr><th>Version</th><td>" + blackberry.app.version + "</td></tr>");
		sb.append("<tr><th>Copyright</th><td>" + blackberry.app.copyright + "</td></tr>");
		sb.append("<tr><th>Description</th><td>" + blackberry.app.description + "</td></tr>");
		sb.append("<tr><th>Author</th><td>" + blackberry.app.author + "</td></tr>");
		sb.append("<tr><th>Author Email</th><td>" + blackberry.app.authorEmail + "</td></tr>");
		sb.append("<tr><th>Author URL</th><td>" + blackberry.app.authorURL + "</td></tr>");
		sb.append("<tr><th>License</th><td>" + blackberry.app.license + "</td></tr>");
		sb.append("<tr><th>License URL</th><td>" + blackberry.app.licenseURL + "</td></tr>");
		sb.append("</table>");
		
//			ele.innerHTML = ele.innerHTML + content;
		ele.insertAdjacentHTML("beforeend", sb.toString());		//try a faster construct instead of insertHTML
		WP.Utils.Debug.log("do_screen_about", "Complete", WP.Utils.Debug.info);

	} 
	catch(e) {
		WP.Utils.Debug.log("do_screen_about", e, WP.Utils.Debug.exception);
	}
}
