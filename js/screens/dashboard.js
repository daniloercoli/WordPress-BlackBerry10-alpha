function do_screen_dashboard(element) {
	var blogs = WP.Model.getBlogs();
	if (blogs.length > 0) {
		var listaBlogs = element.getElementById("blogs_list");
		//new Option(userBlogs[x].blogName, userBlogs[x].blogid)
		for (var j = 0; j < blogs.length; j++) {
			AddSelectOption(listaBlogs, ( "undefined" == typeof(blogs[j].blogName) ? blogs[j].url :  blogs[j].blogName ), blogs[j].blogid, false);
		}
		currentBlog = blogs[0];
	} else {
		currentBlog = null;
	}
}

function AddSelectOption(selectObj, text, value, isSelected) 
{
    if (selectObj != null && selectObj.options != null)
    {
        selectObj.options[selectObj.options.length] = new Option(text, value, false, isSelected);
    }
}

function blog_changed() {
	var blogs = WP.Model.getBlogs();
	currentBlog = blogs[document.getElementById('blogs_list').selectedIndex];
}

function delete_blog(){
	var idx = document.getElementById('blogs_list').selectedIndex;
	WP.Model.removeBlog(idx);
	showMainScreen();
}