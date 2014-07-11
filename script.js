(function() {
var
	main = document.querySelector("main"),
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

			li.appendChild(button);
			ol.appendChild(li);
		}
	}
}

// On page load, while the first request is being made, a random quote is typed.
type(randPara(main.querySelectorAll("p")));
buildNav();

})();