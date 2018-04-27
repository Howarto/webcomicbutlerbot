const { Composer, log } = require("micro-bot");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const bot = new Composer();
/**
 * There is global functions setTimeout and similars thanks to the package 'timers'.
 * This means that is not mandatory declare the next line, but it is here as a global.
 */
// const timers = require('timers');

bot.use(log());
bot.start(({ reply }) =>
  reply(
    "Hey there, I'm WebComicButlerBot. I can send you webcomics from different websites"
  )
);

// Main commands.
bot.command("about", ({ reply }) => reply("Author: Diego Lao <howarto>"));
bot.command("/smbc", ctx => {
  getRandomPicSMBC(ctx);
});
bot.command("/dl", ctx => {
  getRandomPicDarkLegacy(ctx);
});
bot.command("/sub_smbc", ctx => {
  var so = new ScheduleObject(ctx, getRandomPicSMBC);
  so.setDailyTimer(10, 0, 0);
});
bot.command("/sub_dl", ctx => {
  var so = new ScheduleObject(ctx, getRandomPicDarkLegacy);
  so.setDailyTimer(10, 1, 0);
});

// Command functions.

/**
 * Function to get a random pic from SMBC.
 * @param {Object} ctx bot context.
 */
function getRandomPicSMBC(ctx) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //   It avoids write bug on chatbot framework. It does not write anything visible.
      ctx.reply("Something");
      var smbcHtml = new JSDOM(xhttp.responseText);
      var comicImg = smbcHtml.window.document.getElementById("cc-comic");
      var comicImgUrl = "https://www.smbc-comics.com" + comicImg.getAttribute("src");
      ctx.replyWithPhoto({ url: comicImgUrl });
    }
  };
  xhttp.open(
    "GET",
    "https://cors-anywhere.herokuapp.com/https://www.smbc-comics.com/random.php",
    true
  );
  // Mandatory headers for cors anywhere.
  xhttp.setRequestHeader("origin", "*");
  xhttp.setRequestHeader("x-requested-with", "*");
  xhttp.send();
}

/**
 * Function to get a random pic from Dark Legacy Comics.
 * @param {Object} ctx bot context.
 */
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
      // Generates an url with the values between 1 and the last comic uploaded.
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

/**
 * Set time interval to send the webcomic related with the comicGetterFunction.
 * @param {Object} ctx bot context.
 * @param {function} comicGetterFunction webcomic getter.
 * @param {number} milliseconds time between repetitions.
 */
function subscribeComic(ctx, comicGetterFunction, milliseconds = 86400000) {  // By default, one day.
  comicGetterFunction(ctx);
  setTimeout(function(ctx) {
    subscribeComic(ctx, comicGetterFunction, milliseconds);
  }, milliseconds, ctx, comicGetterFunction, milliseconds);
}

// Auxiliary objects.

/**
 * Schedule object to set timers on webcomics getters.
 * @param {Object} ctx bot context.
 * @param {function} comicGetterFunction webcomic getter.
 */
function ScheduleObject(ctx, comicGetterFunction) {
  this.ctx = ctx;
  this.comicGetterFunction = comicGetterFunction;
}

/**
 * Set a timer that it will send a webcomic each day at time specified.
 * @param {number} hour hour when receive the webcomic.
 * @param {number} minute minute when receive the webcomic.
 * @param {number} second second when receive the webcomic.
 */
ScheduleObject.prototype.setDailyTimer = function(hour = 10, minute = 0, second = 0) {
  var date = new Date();
  var currentTime = ((date.getHours()*3600) + (date.getMinutes()*60) + date.getSeconds())*1000;
  var time = ((hour*3600) + (minute*60) + second)*1000; // In milliseconds.
  // 3600*24*1000 are the milliseconds of 1 day.
  var timing = currentTime > time ? (time + (3600*24*1000 - currentTime)) : (time - currentTime);
  var ctx = this.ctx;
  var comicGetterFunction = this.comicGetterFunction;
  setTimeout(function() {
    subscribeComic(ctx, comicGetterFunction, 86400000); // One day interval.
  }, timing, ctx, comicGetterFunction);
}

// Auxiliary functions.
/**
 * Returns a random integer inside the interval [min, max].
 * @param {*} min 
 * @param {*} max 
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Export bot
module.exports = bot;