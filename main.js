let mute = false;
let auto = true;
let per = "All";
let language = "en";
let channel = "";
let botuser = "";
let token = "";
let pokemon;
let pokeDex = "true";
let heightTxt = "Height";
let weightTxt = "Weight";
let foundByTxt = "Found By";
let wasRightTxt = "You Was Right";

let isSolved = false;
let min = 1;
let max = 151;

let resource;
let ext;
let rType = "animated";
let cry = true;
let pokemonID;
let tShow = true;

// Mine
let pokeNum = 0;
let currentName = "";

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

if (urlParams.has("token")) {
  token = urlParams.get("token");
} else {
  token = "";
}

if (urlParams.has("channel")) {
  channel = urlParams.get("channel");
} else {
  channel = "";
}

if (botuser) {
  ComfyJS.Init(botuser, token, channel);
  console.log("Bot Send");
} else if (token) {
  ComfyJS.Init(channel, token);
  console.log("Channel Send");
} else {
  ComfyJS.Init(channel);
  console.log("No Send");
}

function getRandomNumber() {
  let randNumber = Math.floor(Math.random() * 151) + 1;
  var amountOfZeros = getAmoutOfZeros(randNumber);
  return amountOfZeros + randNumber;
}

function getAmoutOfZeros(number) {
  if (number < 10) {
    return "00";
  } else if (number >= 10 && number < 100) {
    return "0";
  } else {
    return "";
  }
}

function startGame() {
  isSolved = false;

  if (rType === "original") {
    resource = "original";
    ext = "png";
  } else {
    resource = "animated";
    ext = "gif";
  }

  pokeNum = getRandomNumber();

  currentName = pokemonList[pokeNum].name;
  console.log(currentName);

  document.getElementById("ball").style.visibility = "visible";

  document.getElementById("ballVid").play();
  if (!mute) {
    document.getElementById("who-that-pokemon-audio").play();
  }
}

function stopVid() {
  document.getElementById("ball").style.visibility = "hidden";
  showBlurredImage();
  console.log("HIDE");
}

function showBlurredImage() {
  let blurredImage = document.createElement("img");
  blurredImage.src = "./assets/" + pokeNum + ".gif";
  blurredImage.className = "blurred";
  blurredImage.id = "pokemon-image";

  let parentElement = document.getElementById("pokemon-holder");
  parentElement.appendChild(blurredImage);
}

function giveUp() {
  guess(currentName);
}

function skip() {
  winReset();
  startGame();
}

// message, user
function guess(x, n) {
  console.log(x);
  console.log(n);
  let guessedName = x.toLowerCase().replaceAll(/\s/g, "");
  if (guessedName == currentName) {
    isSolved = true;
    currentName = "";
    document.getElementById("pokemon-image").className = "";
    ComfyJS.Say("Congratz " + n + ". You guessed that it was " + guessedName);
    setTimeout(function () {
      winReset();
    }, 5000);
  }
}

ComfyJS.onCommand = (user, command, message, flags, extra) => {
  if (
    (flags.broadcaster && command === "wtp") ||
    (flags.mod && command === "wtp")
  ) {
    if (!isSolved) {
      startGame();
    } else {
      skip();
    }
  }
  if (
    (flags.broadcaster && command === "resetwtp") ||
    (flags.mod && command === "resetwtp")
  ) {
    winReset();
  }
  if (
    (flags.broadcaster && command === "skipwtp") ||
    (flags.mod && command === "skipwtp")
  ) {
    skip();
  }
  if (
    (flags.broadcaster && command === "giveup") ||
    (flags.mod && command === "giveup")
  ) {
    giveUp();
  }
  if (
    (flags.broadcaster && command === "stopwtp") ||
    (flags.mod && command === "stopwtp")
  ) {
    stopGame();
  }
  if (
    (flags.broadcaster && command === "stopwtpauto") ||
    (flags.mod && command === "stopwtpauto")
  ) {
    stopAuto();
  }
  if (
    (flags.broadcaster && command === "startwtpauto") ||
    (flags.mod && command === "startwtpauto")
  ) {
    startAuto();
  }
};

ComfyJS.onChat = (user, message, flags, self, extra) => {
  if (!isSolved) {
    message = message.replace("?", "");
    message = message.replace("@", "");
    message = message.split(" ");

    if (per === "All") {
      guess(message[0].toLowerCase(), user);
    } else if (per === "Subs") {
      if (flags.subscriber || flags.mod || flags.broadcaster) {
        guess(message[0].toLowerCase(), user);
      }
    } else if (per === "Vips" || flags.mod || flags.broadcaster) {
      if (flags.vip) {
        guess(message[0].toLowerCase(), user);
      }
    } else if (per === "Vip/Subs") {
      if (flags.vip || flags.subscriber || flags.mod || flags.broadcaster) {
        guess(message[0].toLowerCase(), user);
      }
    }
  }
};

function winReset() {
  isSolved = false;
  document.getElementById("pokemon-image").remove();
}

function stopGame() {
  location.reload();
}

let autoStart = false;

if (autoStart) {
  startGame();
}

function stopAuto() {
  auto = false;
  winReset();
}

function startAuto() {
  auto = true;
  startGame();
}
