const DEBUG = true;
const { Composer, log } = require("micro-bot");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const bot = new Composer();

bot.use(log());
bot.start(({ reply }) => reply("Hey there!"));
bot.command("help", ({ reply }) => reply("Help message"));
bot.command("about", ({ reply }) => reply("About message"));
bot.command("/img1", (ctx) => ctx.replyWithPhoto({ url: "https://spectratherapies.com/wp-content/uploads/2017/06/LSS-Autism-Acceptance.jpg" }));
bot.command("/smbc", ctx => {
  getRandomPic(ctx);
});

// Auxiliary functions
function getRandomPic(ctx) {
  if (DEBUG) ctx.reply(this.readyState + " " + this.status + " " + this.statusText + " " + this.responseURL);
  var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function() {
	console.log("State: " + this.readyState);
	
	if (this.readyState === 4) {
		console.log("Complete.\nBody length: " + this.responseText.length);
		console.log("Body:\n" + this.responseText);
	}
};

xhr.open("GET", "http://driverdan.com");
xhr.send();
}

function goToImgLinkToDownload(url) {
  var linkElement = document.createElement("a");
  linkElement.href = url;
  linkElement.download = "img.png";
  document.body.append(linkElement);
  linkElement.click();
  linkElement.remove();
}

// Export bot
module.exports = bot;
