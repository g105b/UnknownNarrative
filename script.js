(function() {
var
	main = document.querySelector("main"),
	itemsPocket = document.querySelector("#items #items-pockets"),
	itemsAround = document.querySelector("#items #items-around"),
$;

/**
 * Shorthand function for XMLHttpRequest.
 */
function x(command, args) {
	var 
		xhr = new XMLHttpRequest(),
	$;
}

/**
 * Self-invoking function used to initiate typing a message to the main output.
 */
function type(msg, addTo) {
	var
		chars = (msg instanceof Array)
			? msg
			: msg.split(""),
		c = chars.shift(),
		t,
	$;

	if(!addTo) {
		addTo = document.createElement("p");
		main.insertBefore(addTo, main.firstChild);
	}

	if(!c) {
		return;
	}

	addTo.textContent += c;

	switch(c) {
	case ".":
	case "!":
	case "?":
		t = 500;
		break;
		
	case ",":
	case ":":
	case ";":
		t = 200;
		break;

	default:
		t = 50;
		break;
	}

	setTimeout(function() {
		type(chars, addTo);
	}, t);
}

/**
 * Return text of a random element of nodeList and remove all elements from
 * their parent.
 */
function randPara(nodeList) {
	var 
		i = ~~(Math.random() * nodeList.length),
		t = nodeList[i].textContent,
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

// On page load, while the first request is being made, a random quote is typed.
type(randPara(main.querySelectorAll("p")));
buildNav();

itemsPocket.addEventListener("mousewheel", e_scroll_horizontal);
itemsAround.addEventListener("mousewheel", e_scroll_horizontal);

for(var i = 0; i < 10; i++) {
	item_add("Item " + i);
}

})();