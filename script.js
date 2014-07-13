(function() {
var
	main = document.querySelector("main"),
	itemsPocket = document.querySelector("#items #items-pockets"),
	itemsAround = document.querySelector("#items #items-around"),

	type_timeout,
	startDelay = 2500,
	scrollCheckerDelay = 5000,

	typeVariability = 3,
	speedUp = 0.5,

	errorCharProbability = 0.01,
	longChar = 500,
	mediumChar = 200,
	shortChar = 50,
$;

/**
 * Shorthand function for XMLHttpRequest.
 */
function x(method, command, obj, callback) {
	var 
		xhr = new XMLHttpRequest(),
		url = command + ".php",
	$;

	xhr.open(method, url, true);
	xhr.addEventListener("load", callback);

	xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	xhr.send(obj);
}

function newParagraph() {
	var p = document.createElement("p");
	p.classList.add("stale");
	main.appendChild(p);

	return p;
}

function scrollChecker() {
	var 
		p = main.lastChild,
		y = p.offsetTop + p.offsetHeight - main.scrollTop,
	$;
	// Check that the paragraph is nearing the bottom of the screen.
	if(y > window.innerHeight * 0.6) {
		scrollMain();
	}
	else {
		setTimeout(scrollChecker, scrollCheckerDelay);
	}
}

function scrollMain(dt) {
	var 
		currentScroll = main.scrollTop++,
	$;

	if(main.scrollTop != currentScroll) {
		requestAnimationFrame(scrollMain);
	}
}

/**
 * Self-invoking function used to initiate typing a message to the main output.
 */
function type(msg, addTo, delay) {
	var
		chars = (msg instanceof Array)
			? msg
			: msg.split(""),
		c,
		t,
	$;

	if(!addTo) {
		addTo = newParagraph();
	}

	if(delay) {
		type_timeout = setTimeout(function() {
			type(msg, addTo);
		}, delay);

		return;
	}


	if(chars[0]
	&& chars[0].charCodeAt(0) >= 97 
	&& chars[0].charCodeAt(0) <= 97 + 26) {
		if(Math.random() <= errorCharProbability) {
			addTo.innerHTML += String.fromCharCode(
				Math.round(97 + (Math.random() * 26))
			);
			
			setTimeout(function() {
				addTo.innerHTML = addTo.innerHTML.substring(0, 
					addTo.innerHTML.length - 1);

				setTimeout(function() {
					type(chars, addTo);
				}, mediumChar);
			}, mediumChar)
			return;
		}		
	}
	
	c = chars.shift();

	if(!c) {
		addTo.classList.add("stale");
		update();
		return;
	}

	addTo.innerHTML += c;

	switch(c) {
	case "\n":
		addTo = newParagraph();
		t = mediumChar;
		break;

	case "*":
		addTo = emphasise(addTo, "strong");
		break;

	case "_":
		addTo = emphasise(addTo, "em");
		break;

	case ".":
	case "!":
	case "?":
		addTo.classList.add("stale");
		t = longChar;
		break;
		
	case ",":
	case ":":
	case ";":
		addTo.classList.add("stale");
		t = mediumChar;
		break;

	default:
		addTo.classList.remove("stale");
		t = shortChar;
		break;
	}

	t = t * (Math.random() * typeVariability);
	t = t * speedUp;

	type_timeout = setTimeout(function() {
		type_timeout = null;
		type(chars, addTo);
	}, t);
}

function emphasise(el, tagName) {
	var 
		returnEl = el,
	$;

	el.innerHTML = el.innerHTML.substring(0, el.innerHTML.length - 1);

	if(el.tagName == "P") {
		el = document.createElement(tagName);
		returnEl.appendChild(el);
		returnEl = el;
	}
	else {
		returnEl = el.parentNode;
	}

	return returnEl;
}

/**
 * Return text of a random element of nodeList and remove all elements from
 * their parent.
 */
function randPara(nodeList) {
	var 
		i = ~~(Math.random() * nodeList.length),
		t = nodeList[i].innerHTML,
		p = nodeList[0].parentNode,
	$;
	
	while(p.firstChild) {
		p.removeChild(p.firstChild);
	}

	return t;
}

/**
 * Constructs the 5x5 navigation grid.
 */
function buildNav() {
	var
		x,
		y,
		max = 5,

		ol,
		li,
		button,

		nav = document.querySelector("form nav"),
	$;

	for(y = 1; y <= max; y++) {
		ol = document.createElement("ol");
		nav.appendChild(ol);

		for(x = 1; x <= max; x++) {
			li = document.createElement("li");
			button = document.createElement("button")
			button.disabled = true;
			button.name = "position";
			button.value = (x - 3) + "/" + (y - 3);

			if(x == 3 && y == 3) {
				button.textContent = "Here";
			}

			li.appendChild(button);
			ol.appendChild(li);
		}
	}
}

/**
 * Puts an item or items into your pockets, or in the area around you.
 */
function item_add(name, list, quantity) {
	var
		idName = name.replace(/\s+/g, '-', "-").toLowerCase(),
		li,
		input,
		label,
		id,
	$;

	if(!list) {
		list = itemsPocket;
	}

	id = "item-"
		+ list.getAttribute("data-container") 
		+ "-"
		+ idName;

	// Find existing item in the list:
	input = list.querySelector("#" + id)
	if(input) {
		li = input.parentNode;
		label = li.querySelector("label");

		if(!quantity) {
			quantity = 1;
		}
		if(li.hasAttribute("data-quantity")) {
			quantity += +li.getAttribute("data-quantity");
		}

		li.setAttribute("data-quantity", quantity);
	}
	else {
		li = document.createElement("li");
		input = document.createElement("input");
		label = document.createElement("label");

		label.textContent = name;

		li.appendChild(input);
		li.appendChild(label);

		input.id = id;
		input.name = "item-" 
			+ list.getAttribute("data-container") 
			+ "[]";
		input.value = idName;
		input.type = "checkbox";
		label.setAttribute("for", id);

		if(quantity) {
			li.setAttribute("data-quantity", quantity);
		}

		list.appendChild(li);
	}
}

/**
 * Empties the list of items around.
 */
function items_around_remove() {
	while(itemsAround.firstChild) {
		itemsAround.removeChild(ul.firstChild);
	}
}

/**
 * Converts mousewheel scrolls to horizontal.
 */
function e_scroll_horizontal(e) {
	e.preventDefault();
	this.scrollLeft -= e.wheelDeltaY;
}

function save(callback) {
	x("head", "save", {}, function() {
		save_callback(callback);
	});
}

function save_callback(callback) {
	console.log("Game saved...");

	if(callback) {
		callback();
	}
}

function update(e) {
	if(e) {
		e.preventDefault();		
	}

	var 
		obj = {},
		method = "get",
	$;

	if(e) {
		method = "post";
		// TODO: Build up obj.		
	}

	x(method, "game", obj, update_callback);
}

function update_callback() {
	var
		obj = JSON.parse(this.responseText),
	$;
	console.log(obj);

	if(!localStorage["save-game"]
	|| localStorage["save-game"] < (+new Date) - (1000 * 60) ) {
		localStorage["save-game"] = +new Date;
		save();
	}
}

// On page load, while the first request is being made, a random quote is typed.
type(randPara(main.querySelectorAll("p")), null, startDelay);
buildNav();

itemsPocket.addEventListener("mousewheel", e_scroll_horizontal);
itemsAround.addEventListener("mousewheel", e_scroll_horizontal);
document.forms[0].addEventListener("submit", update);

save();
setTimeout(scrollChecker, scrollCheckerDelay);

})();