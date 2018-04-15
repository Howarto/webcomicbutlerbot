const DEBUG = true;
const { Composer, log } = require("micro-bot");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const bot = new Composer();

bot.use(log());
bot.start(({ reply }) => reply("Hey there!"));
bot.command("help", ({ reply }) => reply("Help message"));
bot.command("about", ({ reply }) => reply("About message"));
bot.command("/smbc", ctx => {
  getRandomPic(ctx);
});

// Auxiliary functions
function getRandomPic(ctx) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (DEBUG) ctx.reply("Entra al readystatechange con valores " + this.readyState + " " + this.status);
    if (this.readyState == 4 && this.status == 200) {
      var domParser = new DOMParser();
      var smbcHtml = domParser.parseFromString(xhttp.responseText, "text/html");
      var comicImg = smbcHtml.getElementById("cc-comic");
      var comicImgUrl =
        "http://www.smbc-comics.com" + comicImg.getAttribute("src");
      ctx.replyWithPhoto({ url: comicImgUrl });
      if (DEBUG) ctx.reply("state changed1 " + comicImgUrl);
    }
  };
  xhttp.open("GET", "http://www.smbc-comics.com/random.php", true);
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
