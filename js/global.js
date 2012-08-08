if (typeof(WP) == "undefined") {
	var WP = {};
}	

if ( typeof(blackberry) == "undefined" ) {
	var blackberry = false;
}

var currentBlog = null;
var currentComment = null;
var tutorialWasSeen = null;

if (typeof localStorage !== 'undefined') {
	tutorialWasSeen = localStorage.getItem("tutorialWasSeen");
}

// The "traffic cop" function controlling what JS gets executed when a screen has loaded (but is not yet displayed), so refer to element.
function pre_traffic_cop(element, id) {
	switch ( id ) {
		case 'dashboard_home':
			do_screen_dashboard(element);
			break;
		case 'login_home':
			do_screen_login(element);
			break;
		case 'quick_photo':
			do_screen_quick_photo(element);
			break;
		case 'about':
			do_screen_about(element);
			break;
		case 'test_filters':
			do_screen_test_filters(element);
			break;
		case 'comments':
			do_screen_comments(element);
			break;
		case 'comment_details':
			do_screen_comment_details(element);
			break;
	}
};
function post_traffic_cop(element, id) {
	switch ( id ) {
	case 'comments':
		refresh_if_needed();
		break;
	default:
		break;
	}
};

function do_just_launched() {
	attach_to_system_events();
	attach_to_application_events();
	showMainScreen();
}

function showMainScreen () {
	//load the prec blogs
	WP.Model.loadStoredBlogs();
		
	// If WP has never before been run, launch the tutorial.
	// Else consider the other options.
	if ( tutorialWasSeen == null ) {
		tutorialWasSeen = 1;
		localStorage.setItem('tutorialWasSeen', tutorialWasSeen);
		bb.pushScreen('screens/tutorial_1.html', 'tutorial_1');
	} else if ( WP.Model.getBlogs().length > 0 ) {
		bb.pushScreen('screens/dashboard.html', 'dashboard_home');
	} else {
		bb.pushScreen('screens/login.html', 'login_home');
	}
}



//Displays a notification.
function showLoadingPopup(displayTime, type, text, progress, stopFunc) {
	document.getElementById("loaderLoadingTitle").innerHTML = 'LOADING';
	document.getElementById("loaderLoadingSubtitle").innerHTML = 'Please wait while we process data...';
	document.getElementById("results_loader").style.height = ""+ window.innerHeight+"px";
	document.getElementById("results_loader").style.width = ""+window.innerWidth+"px";
	document.getElementById("results_loader").style.display = '';

	if (typeof(stopFunc) != "undefined") {
		document.getElementById("loaderLoadingButton").style.display = '';
		document.getElementById("loaderLoadingButton").onclick = stopFunc;	
	} else {
		document.getElementById("loaderLoadingButton").style.display = 'none';
	}
};

//Hides the currently displayed notification.
function hideLoadingPopup() {
	document.getElementById("results_loader").style.display = 'none';
 // hide the notification popup
};


WP.Model = {};

WP.Model.blogs = [];

WP.Model.getBlogs = function() {
	return WP.Model.blogs;
};
WP.Model.addBlog = function(_blog) {
	WP.Model.blogs.push(_blog);
};
WP.Model.getBlog = function(indice) {
	return WP.Model.blogs[indice];
};

WP.Model.removeBlog = function(indice) {
	WP.Model.blogs.splice(indice, 1);
	WP.Model.storeBlogs();
};

WP.Model.loadStoredBlogs = function() {
    try {
        var res = localStorage.getItem('my_blogs');
        if (res != null && res != undefined && res.length > 0) {
            EW.LogSystem.debug("Caricato i seguenti blogs: "+ res);
			eval("WP.Model.blogs = " + res);
            //alert(JSON.stringify(WP.Model.blogs));
        }
        else {
			EW.LogSystem.debug("non è stato trovato alcun blog memorizzato nella applicazione");
            //array dei blog è già vuoto
        }
    } 
    catch (errSerializz) {
       EW.LogSystem.error("errore caricamento blog - " + errSerializz.description);
       alert("Error while loading blogs\n" + errSerializz.name + "\n" + errSerializz.message);
	   //resetto tutti i blog salvati
	   WP.Model.blogs = [];
	   WP.Model.storeBlogs();
    }
};

WP.Model.storeBlogs  = function () { 
	try {
		EW.LogSystem.debug("Memorizzo sul device i seguenti blogs: "+ JSON.stringify(WP.Model.blogs));
		//alert(JSON.stringify(WP.Model.blogs));
		localStorage.setItem( 'my_blogs', JSON.stringify( WP.Model.blogs ) );
		EW.LogSystem.debug("Memorizzazione ok");
	} catch (errSerializz) {
		EW.LogSystem.error("errore nel salvataggio su disco dei blogs");
	}
};


//Attach to Application Event - https://bdsc.webapps.blackberry.com/html5/apis/blackberry.app.event.html
function attach_to_application_events() {
	
	if ((window.blackberry === undefined) || (blackberry.app === undefined) || (blackberry.app.event === undefined)) {
		WP.Utils.Debug.log("attach_to_application_events", "'blackberry.app' or 'blackberry.app.event' object is undefined.", WP.Utils.Debug.error);
		return false;
	} else {
		blackberry.app.event.onExit(exitApp);
	}
}
function exitApp() {
	try {
		EW.LogSystem.debug("exitApp");

		if ((window.blackberry === undefined) || (blackberry.app === undefined)) {
			return false;
		}

		if (confirm("Would you like to exit?")) {
			blackberry.app.exit();
		}
	} 
	catch(e) {
		EW.LogSystem.error("Error exit");
	}
}

//Attach to system.event - https://bdsc.webapps.blackberry.com/html5/apis/blackberry.system.event.html
function attach_to_system_events() {
	try {
		WP.Utils.Debug.log("attach_to_system_events", "in setHandlers", WP.Utils.Debug.info);
		
		if ((window.blackberry === undefined) || (blackberry.system === undefined) || (blackberry.system.event === undefined)) {
			WP.Utils.Debug.log("attach_to_system_events", "'blackberry.system' or 'blackberry.system.event' object is undefined.", WP.Utils.Debug.error);
			return false;
		}
/*
		if (blackberry.system.event.deviceBatteryLevelChange === undefined) {
			WP.Utils.prependContent("details", "<p><i><b>blackberry.system.event.deviceBatteryLevelChange</b> method is not supported by this application.</i></p>");			
			WP.Utils.hide("batteryLevelBar");
		}
		else {
			blackberry.system.event.deviceBatteryLevelChange(handleBatteryLevel);
		}

		
		if (blackberry.system.event.deviceBatteryStateChange === undefined) {
			WP.Utils.prependContent("details", "<p><i><b>blackberry.system.event.deviceBatteryStateChange</b> method is not supported by this application.</i></p>");			
			WP.Utils.hide("batteryLevelBar");
		}
		else {
			blackberry.system.event.deviceBatteryStateChange(handleBatteryState);
		}

		
		if (blackberry.system.event.onCoverageChange === undefined) {
			WP.Utils.appendContent("coveragedetails", "<p><i><b>blackberry.system.event.onCoverageChange</b> method is not supported by this application.</i></p>");			
		}
		else {
			blackberry.system.event.onCoverageChange(handleOnCoverageChange);
		}

		
		if (blackberry.system.event.onHardwareKey === undefined) {
			WP.Utils.Debug.log("attach_to_system_events", "blackberry.system.event.onHardwareKey method is not supported by this application", WP.Utils.Debug.warning);			
		}
		else {
			blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_BACK, handleBackHardwareKey);
		//	blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_MENU, handleMenuHardwareKey);
		//	blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_VOLUMEUP, handleVolumeUpHardwareKey);
		//	blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_VOLUMEDOWN, handleVolumeDownHardwareKey);
		}
		
		*/
	} 
	catch(e) {
		WP.Utils.Debug.log("doPageLoad", e, WP.Utils.Debug.exception);
	}
}

function handleBackHardwareKey() {
	var num_screens = bb.screens.length;
	if ( num_screens > 1 ) {
		bb.popScreen();
	}
	else {
		exitApp();
	}
}

//------------------------------------------------------
// to be defined...


function display_action_message( num_action, element ) {
	var str_action = '';

	switch ( num_action ) {
		case CONST_ACTION_LOADING:
			str_action = '<img src="images/ajax-loader.gif" /> <span style="color: #00CCFF;">Loading, please wait...</span>';
			break;
		case CONST_ACTION_READY:
			str_action = 'Touch to refresh';
			break;
		case CONST_ACTION_BLANK:
			str_action = '';
			break;
	}
	
	if ( document.getElementById('div_titleaction') !== null ) {
		document.getElementById('div_titleaction').innerHTML = str_action;
	}
	else if ( element !== undefined ) {
		element.getElementById('div_titleaction').innerHTML = str_action;
	}
}