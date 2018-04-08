const { Composer, log } = require("micro-bot");

const bot = new Composer();

bot.use(log());
bot.start(({ reply }) => reply("Hey there!"));
bot.command("help", ({ reply }) => reply("Help message"));
bot.command("about", ({ reply }) => reply("About message"));
bot.command("/smbc", ctx => {
  ctx.reply("Smbc command");
  getRandomPic(ctx);
});

// Auxiliary functions
function getRandomPic(ctx) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var domParser = new DOMParser();
      var smbcHtml = domParser.parseFromString(xhttp.responseText, "text/html");
      var comicImg = smbcHtml.getElementById("cc-comic");
      var comicImgUrl =
        "https://www.smbc-comics.com" + comicImg.getAttribute("src");
      ctx.replyWithPhoto({ url: comicImgUrl });
    }
  };
  xhttp.open("GET", "https://www.smbc-comics.com/random.php", true);
  xhttp.send();
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
