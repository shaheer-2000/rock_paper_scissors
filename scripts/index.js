// TODO: refactor and clean

const FADE_OUT_S = 1000 * 2; // 1000ms => 1s

const LOST = 0;
const WON = 1;
const DRAW = 2;

const ROCK = 0;
const PAPER = 1;
const SCISSORS = 2;

const PLAYER = 0;
const COMPUTER = 1;

const choiceMap = {
	"rock": ROCK,
	"paper": PAPER,
	"scissors": SCISSORS
};
const choiceMapArr = Object.entries(choiceMap);

const computerPlay = () => {
	return ~~(Math.random() * 3);
};

const playerPlay = (playerSelection) => {
	playerSelection = playerSelection.toLowerCase().replace(/\s/g, "");

	if (playerSelection in choiceMap) {
		return choiceMap[playerSelection];
	} else {
		return 0;
	}
}

const buildResStr = (result, playerSelection, computerSelection) => {
	if (result === DRAW) {
		return "It's a draw!";
	}

	const choiceConverted = [0, 0];

	for (let i = 0; i < choiceMapArr.length; i++) {
		if (choiceMapArr[i][1] === playerSelection && choiceConverted[0] === 0) {
			playerSelection = choiceMapArr[i][0].charAt(0).toUpperCase() + choiceMapArr[i][0].slice(1);
			choiceConverted[0] = 1;
		}

		if (choiceMapArr[i][1] === computerSelection && choiceConverted[1] === 0) {
			computerSelection = choiceMapArr[i][0].charAt(0).toUpperCase() + choiceMapArr[i][0].slice(1);
			choiceConverted[1] = 1;
		}

		if (choiceConverted[0][0] === 1 && choiceConverted[0][1] === 1) {
			break;
		}
	}

	return `You ${result === LOST ? "lost" : "won"}! ${result === LOST ? computerSelection : playerSelection} beats ${result === LOST ? playerSelection : computerSelection}`;
}

const animatePicks = (playerSelection, computerSelection) => {
	rpsChoiceBoxes.forEach(rpsChoiceBox => {
		if (computerSelection === ROCK && rpsChoiceBox.children[0].id === "rock" ||
		computerSelection === PAPER && rpsChoiceBox.children[0].id === "paper" ||
		computerSelection === SCISSORS && rpsChoiceBox.children[0].id === "scissors") {
			rpsChoiceBox.children[0].classList.add("computer-pick");
		}

		if (playerSelection === ROCK && rpsChoiceBox.children[0].id === "rock" ||
		playerSelection === PAPER && rpsChoiceBox.children[0].id === "paper" ||
		playerSelection === SCISSORS && rpsChoiceBox.children[0].id === "scissors") {
			rpsChoiceBox.children[0].classList.add("player-pick");
		}

	});

	setTimeout(() => {
		rpsChoiceBoxes.forEach(rpsChoiceBox => {
			if (rpsChoiceBox.children[0].classList.contains("computer-pick")) {
				rpsChoiceBox.children[0].classList.remove("computer-pick");
			}

			if (rpsChoiceBox.children[0].classList.contains("player-pick")) {
				rpsChoiceBox.children[0].classList.remove("player-pick");
			}
		});
	}, FADE_OUT_S);
};

const playRound = (playerSelection, computerSelection) => {
	animatePicks(playerSelection, computerSelection);

	if (
		(playerSelection === ROCK && computerSelection === PAPER) ||
		(playerSelection === PAPER && computerSelection === SCISSORS) ||
		(playerSelection === SCISSORS && computerSelection === ROCK)
	) {
		return [LOST, buildResStr(LOST, playerSelection, computerSelection)];
	}
	else if (
		(playerSelection === ROCK && computerSelection === SCISSORS) ||
		(playerSelection === PAPER && computerSelection === ROCK) ||
		(playerSelection === SCISSORS && computerSelection === PAPER)
	) {
		return [WON, buildResStr(WON, playerSelection, computerSelection)];
	} else {
		return [DRAW, buildResStr(DRAW)];
	}
};

const incrementScore = (winner) => {
	winner = winner === PLAYER ? "player" : "computer";

	const score = document.querySelector(`#${winner}-score`);
	score.textContent = `${Number(score.textContent) + 1}`;

	if (Number(score.textContent) >= 5) {
		renderGameOverScreen(); // removes scores and choices and add replay button and a win message
	}
};

const game = (userChoice) => {
	// Validate Choice Here

	const result = playRound(playerPlay(userChoice), computerPlay());

	if (result[0] === WON) {
		incrementScore(PLAYER);
	} else if (result[0] === LOST) {
		incrementScore(COMPUTER);
	}
};

let choiceCounter = 0;

const handleChoiceBox = (rpsChoiceBox) => {
	rpsChoiceBox.addEventListener("click", (e) => {
		// handle choice selection here

		game(rpsChoiceBox.children[0].id);

		choiceCounter++;
		if (choiceCounter >= 1) {
			rpsChoiceBoxes.forEach(rpsChoiceBox => {
				// rpsChoiceBox.classList.add("fade-out");
				rpsChoiceBox.classList.add("disable-pointer");
			});
		}

		setTimeout(() => {
			rpsChoiceBoxes.forEach(rpsChoiceBox => {
				// rpsChoiceBox.classList.remove("fade-out");
				rpsChoiceBox.classList.remove("disable-pointer");
			});
			choiceCounter = 0;
		}, FADE_OUT_S);
	});
};

const rpsChoiceBoxes = document.querySelectorAll(".rps-choice-box");
const idleBoxes = document.querySelectorAll(".idle");

rpsChoiceBoxes.forEach(handleChoiceBox);
