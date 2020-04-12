id = name => document.getElementById(name);
cl = name => document.getElementsByClassName(name);

// Pour remplacer les virgules par des points
function comReplace(value) {
	return value.replace(",", ".");
}

// Indication d'erreur quand mauvaise touche
function error(input) {
	event.preventDefault();
	input.classList.add("error");
	setTimeout(() => { input.classList.remove("error"); }, 150);
}

function launcher(input) {

	// filtre les inputs
	input.addEventListener('keypress', function(e) {
		const allowed = ["0","1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "."];

		if (!allowed.includes(e.key)) {
			error(input);
		//truc compliqué pour empêcher d'avoir plusieurs virgules
		} else if ((input.innerText.indexOf('.') > -1 || input.innerText.indexOf(',') > -1) && (e.key === "." || e.key === ",")) {
			error(input);
		}
	});

	// à chaque entrée de texte
	input.addEventListener('input', function(e) {
		// indique si les inputs sont pleins/vides (pour  le % de la bonne couleur)
		if (input.innerText.length > 0) {
			input.classList.add("full");
		} else {
			input.classList.remove("full");
		}

		// lance le calculs
		processor(input);
	});
}

function processor(input) {
	// Récupère le parent pour savoir à qui on a affaire
	let parent = input.parentNode;

	let x = comReplace(parent.querySelector("#x").innerText);
	let y = comReplace(parent.querySelector("#y").innerText);

	let zInput = parent.querySelector("#resultat");

	if (parent.classList.contains("solde")) {
		// si les deux inputs sont pleins
		if (x && y) {
			// lance le calcul puis le traite
			processResult(calcul("solde", x, y), false, zInput);
		} else {
			// reset quand les inputs sont vides
			reset(zInput);
		}
	} else if (parent.classList.contains("quant")) {
		if (x && y) {
			processResult(calcul("quant", x, y), true, zInput);
		} else {
			reset(zInput);
		}
	} else if (parent.classList.contains("evo")) {
		if (x && y) {
			processResult(calcul("evo", x, y), false, zInput);
		} else {
			reset(zInput);
		}
	}
}

// Limite les décimales à 6, inscrit le résultat et ajoute la class .valid
function processResult(value, isPercent, resultInput) {
	let result = parseFloat(value.toFixed(6));

	if (isPercent) {
		resultInput.innerText = result + "%";
	} else {
		resultInput.innerText = result;
	}

	resultInput.classList.add("valid");
}

// Pour savoir combien y a de décimales
Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}

function reset(toReset) {
	// removes previous result
	toReset.innerText = "\u00A0";
	toReset.classList.remove("valid");
}

// des belles mathématiques
function calcul(type,x,y) {
	switch(type) {
		case "solde":
			return y * (x / 100);
		case "quant":
			return (100 * x) / y;
		case "evo":
			return ((y - x) / x) * 100;
	}
}

let inputs = document.querySelectorAll(".input");
inputs.forEach(launcher);
