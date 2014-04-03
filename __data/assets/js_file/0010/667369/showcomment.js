// for full documentataion: http://wiki.webcentre.unimelb.edu.au/doku.php/templates/javascript

var uM = {
addLoadListener: function(fn)
{
	if (typeof window.addEventListener != 'undefined')
	{
		window.addEventListener('load', fn, false);
	}
	else if (typeof document.addEventListener != 'undefined')
	{
		document.addEventListener('load', fn, false);
	}
	else if (typeof window.attachEvent != 'undefined')
	{
		window.attachEvent('onload', fn);
	}
	else
	{
		var oldfn = window.onload;

		if (typeof window.onload != 'function')
		{
			window.onload = fn;
		}
		else
		{
			window.onload = function()
			{
				oldfn();
				fn();
			};
		}
	}
},

attachEventListener: function(target, eventType, functionRef, capture)
{
	if (typeof target.addEventListener != "undefined")
	{
		target.addEventListener(eventType, functionRef, capture);
	}
	else if (typeof target.attachEvent != "undefined")
	{
		target.attachEvent("on" + eventType, functionRef);
	}
	else
	{
		eventType = "on" + eventType;

		if (typeof target[eventType] == "function")
		{
			var oldListener = target[eventType];

			target[eventType] = function()
			{
				oldListener();

				return functionRef();
			}
		}
		else
		{
			target[eventType] = functionRef;
		}
	}

	return true;
},

detachEventListener: function(target, eventType, functionRef, capture)
{
	if (typeof target.removeEventListener != "undefined")
	{
		target.removeEventListener(eventType, functionRef,
		capture)
	}
	else if (typeof target.detachEvent != "undefined")
	{
		target.detachEvent("on" + eventType, functionRef);
	}
	else
	{
		target["on" + eventType] = null;
	}

	return true;
},

schedule: function(objectID, functionCall, iteration)
{
	if (iteration == null)
	{
		iteration = 0;
	}
	
	if (document.getElementById(objectID))
	{
		functionCall();
	}
	else if (iteration < 300)
	{
		setTimeout(function()
		{
			uM.schedule(objectID, functionCall, iteration + 1);
		}, 50);
	}
	
	return true;
},

addClass: function(target, classValue)
{
	var pattern = new RegExp("(^| )" + classValue + "( |$)");

	if (!pattern.test(target.className))
	{
		if (target.className == "")
		{
			target.className = classValue;
		}
		else
		{
			target.className += " " + classValue;
		}
	}

	return true;
},

removeClass: function(target, classValue)
{
	var removedClass = target.className;
	var pattern = new RegExp("(^| )" + classValue + "( |$)");

	removedClass = removedClass.replace(pattern, "$1");
	removedClass = removedClass.replace(/ $/, "");

	target.className = removedClass;

	return true;
},

hasClass: function(target, classValue)
{
	var pattern = new RegExp("(^| )" + classValue + "( |$)");
	if (pattern.test(target.className))
	{
		return true;
	}
	else
	{
		return false;
	}
},

getElementsByTagAndAttributes: function(stem, leaf_tag, leaf_attributes)
{
	var element_list = stem.getElementsByTagName(leaf_tag);
	var result = [];
	for (var i =0; i < element_list.length; i++)
	{
		var has_all_attributes = true;
		for (var j in leaf_attributes)
		{
			if (j == "class")
			{
				if (!uM.hasClass(element_list[i], leaf_attributes[j]))
				{
					has_all_attributes = false;
				}
			}
			else if (j== "for" || j == "htmlFor" )
			{
				if (!((element_list[i].getAttribute('for') == leaf_attributes[j]) || (element_list[i].getAttribute('htmlFor') == leaf_attributes[j])))
				{
					has_all_attributes = false;
				}
			}
			else
			{
				if (!(element_list[i].getAttribute(j) == leaf_attributes[j]))
				{
					has_all_attributes = false;
				}
			}
		}
		if (has_all_attributes)
		{
			result.push(element_list[i]);
		}
	}
	return result;
},

plainTextChildren: function(el)
{
	var text = '';
	for (var i = 0; i < el.childNodes.length; i++)
	{
		if (el.childNodes[i].nodeType == 3)
		{
			text += el.childNodes[i].nodeValue;
		}
		else if (el.childNodes[i].nodeType == 1)
		{
			text += uM.plainTextChildren(el.childNodes[i]);
		}
	}
	return text;
},

debug: function(text)
{
	if (document.getElementById("debug"))
	{
		var node = document.createElement('p');
		var child = document.createTextNode(text);
		node.appendChild(child);
		document.getElementById("debug").appendChild(node);
	}
}
};

var uM_menu = {
menu_id: "topmenu",
tree: null,
default_index: '/index.html',
use_get_variables: false,
parent_path: null,
newLink: function (prnt, action)
{
	var new_link = document.createElement('a');
	var new_image = document.createElement('img');
	new_image.className = 'bullet';
	new_image.setAttribute('height', '13');
	new_image.setAttribute('width', '12');
	var target_kids = prnt.childNodes;
	var target_ans = [];
	for (var i = 0; i < target_kids.length; i++)
	{
		if (target_kids[i].nodeName.toLowerCase() == 'a')
		{
			target_ans.push(target_kids[i]);
		}
	}
	var link_text = uM.plainTextChildren(target_ans[target_ans.length - 1]) + ' menu';
	switch (action)
	{
		case "expand":
			new_image.setAttribute('src', 'http://www.unimelb.edu.au/template-assets/07/images/menu/plus.gif');
			new_image.setAttribute('alt', 'Expand ' + link_text);
			new_image.setAttribute('title', 'Expand ' + link_text);
			uM.attachEventListener(new_link, 'click', uM_menu.expandSection, false);
			uM.removeClass(prnt, 'expand');
			uM.addClass(prnt, 'collapse');
			new_link.appendChild(new_image);
		break;
		case "collapse":
			new_image.setAttribute('src', 'http://www.unimelb.edu.au/template-assets/07/images/menu/minus.gif');
			new_image.setAttribute('alt', 'Collapse ' + link_text);
			new_image.setAttribute('title', 'Collapse ' + link_text);
			uM.attachEventListener(new_link, 'click', uM_menu.collapseSection, false);
			uM.removeClass(prnt, 'collapse');
			uM.addClass(prnt, 'expand');
			new_link.appendChild(new_image);
		break;
		default:
			new_link = document.createElement('span');
			new_link.className = 'bullet';
			var empty_space = document.createTextNode('');
			new_link.appendChild(empty_space);
	}
	return new_link;
},

prepare: function()
{
	if (!document.getElementById || !document.getElementsByTagName || !document.createElement || !document.getElementById(uM_menu.menu_id))
	{
		return;
	}

	uM_menu.tree = document.getElementById(uM_menu.menu_id);

	var lis = uM_menu.tree.getElementsByTagName('li');
	for (var i = 0; i < lis.length; i++)
	{
		lis[i].insertBefore(uM_menu.newLink(lis[i]), lis[i].firstChild);
	}

	var menu_uls = uM_menu.tree.getElementsByTagName("ul");
	for (var i = 0; i < menu_uls.length; i++ )
	{
		menu_uls[i].parentNode.replaceChild(uM_menu.newLink(menu_uls[i].parentNode, 'expand'), menu_uls[i].parentNode.firstChild);
	}
	uM_menu.highlightCurrentLink();
},

expandSection: function(e)
{
	var link;
	if (window.event && window.event.srcElement)
	{
		link = window.event.srcElement;
	}
	else if (e && e.target)
	{
		link = e.target;
	}
	if (!link)
	{
		return;
	}

	while (link.nodeName.toLowerCase() != 'li' && link.nodeName.toLowerCase() != 'div')
	{
		link = link.parentNode;
	}
	var menu_lis = link.parentNode.childNodes;
	for (var i = 0; i < menu_lis.length; i++)
	{
		var exp = menu_lis[i];
		if (exp.nodeName.toLowerCase() == "li" && exp != link && uM.hasClass(exp, "expand"))
		{
			exp.replaceChild(uM_menu.newLink(exp, 'expand'), exp.firstChild);
		}
	}
	link.replaceChild(uM_menu.newLink(link, 'collapse'), link.firstChild);
},

collapseSection: function(e)
{
	var link;
	if (window.event && window.event.srcElement)
	{
		link = window.event.srcElement;
	}
	else if (e && e.target)
	{
		link = e.target;
	}
	if (!link)
	{
		return;
	}

	while (link.nodeName.toLowerCase() != 'li' && link.nodeName.toLowerCase() != 'div')
	{
		link = link.parentNode;
	}
	link.replaceChild(uM_menu.newLink(link, 'expand'), link.firstChild);
},

highlightCurrentLink: function()
{
	var ans = uM_menu.tree.getElementsByTagName('a');
	var breadcrumb = document.getElementById('breadcrumbs');
	var delim = document.createTextNode(' > ');
	var path = window.location.pathname;
	path = path.replace(/\/$/, uM_menu.default_index);
	var domain_path = window.location.protocol + '//' + window.location.hostname;
	var path_IE = domain_path;
	if (window.location.port)
	{
		path_IE += ':' + window.location.port;
	}
	if (uM_menu.use_get_variables)
	{
		path += window.location.search;
	}
	path_IE += path;
	if (uM_menu.parent_path)
	{
		uM_menu.parent_path = uM_menu.parent_path.replace(/\/$/, uM_menu.default_index);
	}
	for (var i = 0; i < ans.length; i++)
	{
		var ref = ans[i].getAttribute('href');
		if (ref)
		{
			ref = ref.replace(/\/$/, uM_menu.default_index);
			if ((ref == path || ref == path_IE || ref == uM_menu.parent_path || ref == domain_path + uM_menu.parent_path) && !uM.hasClass(ans[i], 'duplicate'))
			{
				uM.addClass(ans[i], "current_link");
				var crumb = document.createTextNode(uM.plainTextChildren(ans[i]));
				breadcrumb.appendChild(crumb);
				breadcrumb.insertBefore(delim.cloneNode(true), breadcrumb.lastChild);
				var first_parent = 1;
				for (var x = ans[i].parentNode; x.nodeName.toLowerCase() == "li"; x = x.parentNode.parentNode)
				{
					if (first_parent == 1)
					{
						uM.addClass(x, "parent");
						first_parent--;
					}
					else
					{
						uM.addClass(x, "ancestor");
					}
					if (uM.hasClass(x, "collapse"))
					{
						x.replaceChild(uM_menu.newLink(x, 'collapse'), x.firstChild);
						var ul_kids = x.getElementsByTagName('ul');
						if (ul_kids.length > 0 && x != ans[i].parentNode)
						{
							var crumb_link = x.getElementsByTagName('a')[1];
							breadcrumb.insertBefore(crumb_link.cloneNode(true), breadcrumb.getElementsByTagName('a')[0].nextSibling);
							breadcrumb.insertBefore(delim.cloneNode(true), breadcrumb.getElementsByTagName('a')[0].nextSibling);

						}
					}
				}
			}
		}
	}
}

};

var uM_search = {
search_form: 'searchform',
submit_button: false,
timer: false,
prepare: function ()
{
	var search = document.getElementById(uM_search.search_form);
	if (search)
	{
		uM_search.submit_button = uM.getElementsByTagAndAttributes(search, 'input', {'type':'submit'})[0];
		uM_search.submit_button.setAttribute('disabled', 'disabled');
		var si = uM.getElementsByTagAndAttributes(search, 'input', {'type':'text'})[0];
		if (si)
		{
			var si_text = '';
			if (si.getAttribute('title'))
			{
				si.setAttribute('value', si.getAttribute('title'));
			}
			uM.addClass(si, 'default_text');
			uM.attachEventListener(si, 'focus', uM_search.startCheck, false);
			uM.attachEventListener(si, 'blur', uM_search.endCheck, false);
		}
	}
},

startCheck: function (e)
{
	var input;
	if (window.event && window.event.srcElement)
	{
		input = window.event.srcElement;
	}
	else if (e && e.target)
	{
		input = e.target;
	}
	if (!input)
	{
		return;
	}

	if (input.value == input.getAttribute('title'))
	{
		input.value = '';
	}
	uM_search.timer = setInterval(function () {uM_search.toggleSubmit(input)}, 50);
},

toggleSubmit: function (input)
{
	if (input.value == '' || input.value == input.getAttribute('title'))
	{
		uM_search.submit_button.setAttribute('disabled', 'disabled');
	}
	else
	{
		uM_search.submit_button.removeAttribute('disabled');
	}
},

endCheck: function(e)
{
	clearInterval(uM_search.timer);

	var input;
	if (window.event && window.event.srcElement)
	{
		input = window.event.srcElement;
	}
	else if (e && e.target)
	{
		input = e.target;
	}
	if (!input)
	{
		return;
	}
	uM_search.toggleSubmit(input);
	if (input.value == '')
	{
		input.value = input.getAttribute('title');
	}
}

};

var uM_stripe = {
prepare: function()
{
	var tables = uM.getElementsByTagAndAttributes(document, 'table', {'class':'striped'});
	if (tables)
	{
		for (var i = 0; i < tables.length; i++)
		{
			var trs = tables[i].getElementsByTagName('tr');
			for (var j = 0; j < trs.length; j += 2)
			{
				uM.addClass(trs[j], 'even');
			}
		}
	}
}
};

uM.schedule('quicklinks', uM_search.prepare);
uM.schedule('content', uM_menu.prepare);
uM.addLoadListener(uM_stripe.prepare);

// google analytics from Val Lyashov, inserted by Andrew Harris

var _gaq = _gaq || [];
_gaq.push(['inj._setAccount', 'UA-21795369-1']);
_gaq.push(['inj._setDomainName', '.unimelb.edu.au']);
_gaq.push(['inj._trackPageview']);
 
(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
