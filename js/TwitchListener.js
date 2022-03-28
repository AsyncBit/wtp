let channel = "";
let token = "";

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

if (token) {
  ComfyJS.Init(channel, token);
  console.log("Channel Send");
} else {
  ComfyJS.Init(channel);
  console.log("No Send");
}

ComfyJS.onCommand = (user, command, message, flags, extra) => {
  if (
    (flags.broadcaster && command === "wtp") ||
    (flags.mod && command === "wtp")
  ) {
    startGame();
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
  console.log(message);
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
