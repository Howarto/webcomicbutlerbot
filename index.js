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
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (DEBUG) ctx.reply(this.readyState + " " + this.status + " " + this.statusText + " " + toString(this));
    if (this.readyState == 4 && this.status == 200) {
      debugger;
      var domParser = new DOMParser();
      var smbcHtml = domParser.parseFromString(xhttp.responseText, "text/html");
      var comicImg = smbcHtml.getElementById("cc-comic");
      var comicImgUrl =
        "https://www.smbc-comics.com" + comicImg.getAttribute("src");
      ctx.replyWithPhoto({ url: comicImgUrl });
    }
  };
  xhttp.onerror = function() {
  };
  xhttp.open("GET", "https://cors-anywhere.herokuapp.com/https://www.smbc-comics.com/random.php", true);
  xhttp.send();
  if (DEBUG) ctx.reply("END");
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
