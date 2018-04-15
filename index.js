const { Composer, log } = require("micro-bot");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const bot = new Composer();

bot.use(log());
bot.start(({ reply }) =>
  reply(
    "Hey there, I'm WebComicButlerBot. I can send you webcomics from different websites"
  )
);
bot.command("about", ({ reply }) => reply("Author: Diego Lao <howarto>"));
bot.command("/smbc", ctx => {
  getRandomPicSMBC(ctx);
});
bot.command("/dl", ctx => {
  getRandomPicDarkLegacy(ctx);
});

// Command functions

function getRandomPicSMBC(ctx) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //   It avoids write bug on chatbot framework. It does not write anything visible.
      ctx.reply("Something");
      var smbcHtml = new JSDOM(xhttp.responseText);
      var comicImg = smbcHtml.window.document.getElementById("cc-comic");
      var comicImgUrl =
      "https://www.smbc-comics.com" + comicImg.getAttribute("src");
      ctx.replyWithPhoto({ url: comicImgUrl });
    }
  };
  xhttp.open(
    "GET",
    "https://cors-anywhere.herokuapp.com/https://www.smbc-comics.com/random.php",
    true
  );
  xhttp.setRequestHeader("origin", "*");
  xhttp.setRequestHeader("x-requested-with", "*");
  xhttp.send();
}

function getRandomPicDarkLegacy(ctx) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //   It avoids write bug on chatbot framework. It does not write anything visible.
      ctx.reply("Something");
      var html = xhttp.responseText;
      var stringToSearch = "var iLatestComic = ";
      var startIndex = html.indexOf(stringToSearch);
      var endIndex = html.indexOf(";", startIndex + stringToSearch.length);
      var lastImageNumber = html.substring(startIndex + stringToSearch.length, endIndex);
      // Generates an url with the values between 1 and the last comic uploaded
      var imgUrl = "http://www.darklegacycomics.com/comics/" + getRandomInt(1, lastImageNumber) + ".jpg";
      ctx.replyWithPhoto({ url: imgUrl });
    }
  };
  xhttp.open(
    "GET",
    "https://cors-anywhere.herokuapp.com/http://www.darklegacycomics.com/1",
    true
  );
  xhttp.setRequestHeader("origin", "*");
  xhttp.setRequestHeader("x-requested-with", "*");
  xhttp.send();
}

// Auxiliary functions
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Export bot
module.exports = bot;