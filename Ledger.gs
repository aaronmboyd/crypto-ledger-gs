// *********************************************************************************************************************
// Financial functions
// *********************************************************************************************************************

// Returns current cryptocurrency price from CoinMarketcap API
// Reference: https://coinmarketcap.com/api/

function getUSDPriceCoinMarketCap (name) {

  var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=USD";
  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }

    var cacheExpiryInSeconds = 60 * 60; // 1 hour
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var price = data[0].price_usd;

    log(url, Number(price));
    return Number(price);
  }
  catch(ex){
    var msg = "Exception: " + ex;
    log(url,msg);
    return msg;
  }
}

// Returns current cryptocurrency price CoinMarketcap API in ETH
// Reference: https://coinmarketcap.com/api/

function getETHPriceCoinMarketCap (name) {

  var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=ETH";

  try{
    if(name.indexOf("_refresh")>-1){
      return 0;
    }

    var cacheExpiryInSeconds = 60 * 60; // 1 hour
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var price = data[0].price_eth;

    log(url, Number(price));
    return Number(price);
  }
  catch(ex){
    var msg = "Exception: " + ex;
    log(url,msg);
    return msg;
  }

}

// Returns current cryptocurrency market cap from CoinMarketcap API
// Reference: https://coinmarketcap.com/api/

function getUSDMarketCap (name) {

  var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=USD";
  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }

    var cacheExpiryInSeconds = 60 * 60; // 1 hour
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var marketcap = data[0].market_cap_usd;

    log(url, Number(marketcap));
    return Number(marketcap);
  }
  catch(ex){
    var msg = "Exception: " + ex;
    log(url,msg);
    return msg;
  }
}

// Returns token available supply from CoinMarketcap API
// Reference: https://coinmarketcap.com/api/

function getAvailableSupply (name) {

  var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=USD";
  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }

    var cacheExpiryInSeconds = 60 * 60 * 24 * 3; // 3 days
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var supply = data[0].available_supply;

    log(url, Number(supply));
    return Number(supply);
  }
  catch(ex){
    var msg = "Exception: " + ex;
    log(url,msg);
    return msg;
  }

}

// Returns token total supply from CoinMarketcap API
// Reference: https://coinmarketcap.com/api/

function getTotalSupply (name) {

  var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=USD";
  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }

    var cacheExpiryInSeconds = 60 * 60 * 24 * 7; // 1 week
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var supply = data[0].total_supply;

    log(url, Number(supply));
    return Number(supply);
  }
  catch(ex){
    var msg = "Exception: " + ex;
    log(url,msg);
    return msg;
  }

}

// Returns 24 hour price change CoinMarketcap API
// Reference: https://coinmarketcap.com/api/

function get24HourChange (name) {

  var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=USD";
  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }

    var cacheExpiryInSeconds = 60 * 60; // 1 hour
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var dailyChange = data[0].percent_change_24h;

    log(url, Number(dailyChange));
    return Number(dailyChange);
  }
  catch(ex){
    var msg = "Exception: " + ex;
    log(url,msg);
    return msg;
  }

}

// Returns current cryptocurrency price from CryptoCompare API for a particular fiat currency symbol
// Reference: https://min-api.cryptocompare.com/

function getPriceCryptoCompare (name, currencySymbol) {

  var url = "https://min-api.cryptocompare.com/data/price?extraParams=crypto-ledger-gs&tryConversion=true&fsym=" + name.toUpperCase() + "&tsyms=" + currencySymbol.toUpperCase();
  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }

    var cacheExpiryInSeconds = 60 * 60; // 1 hour
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var price = data[currencySymbol.toUpperCase()];

    log(url, Number(price));
    return Number(price);
  }
  catch(ex){
    var msg = "Exception: "+ ex;
    log(url,msg);
    return msg;
  }
}

// Returns historical API calls remaining this hour for this IP address
// Reference: https://min-api.cryptocompare.com/
function getCryptoCompareRateLimits(){

  var url = "https://min-api.cryptocompare.com/stats/rate/limit?extraParams=crypto-ledger-gs";
  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();
  var data = JSON.parse(json);
  return data.Hour.CallsLeft.Histo;
}

// Convert date to epoch seconds for use with CryptoCompare API

function toEpochSeconds(date){
  return date.getTime() / 1000
}

// Return currency cryptocurrency price CryptoCompare API for a particular fiat symbol and date

function getPriceCryptoCompareAtDate(cryptoSymbol, currencySymbol, date){

  var dateInEpochSeconds = toEpochSeconds(date);
  var url = "https://min-api.cryptocompare.com/data/pricehistorical?extraParams=crypto-ledger-gs&tryConversion=true&fsym="+cryptoSymbol.toUpperCase()+"&tsyms="+currencySymbol.toUpperCase()+"&ts="+dateInEpochSeconds;
  try{

    if(cryptoSymbol.indexOf("_refresh")>-1){
      return 0;
    }

    var cacheExpiryInSeconds = 60 * 60 * 24; // 1 day
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var pair = data[cryptoSymbol.toUpperCase()];
    var price = pair[currencySymbol.toUpperCase()];

    log(url, Number(price));
    return Number(price);
  }
  catch(ex){
    var msg = "Exception: " + ex;
    log(url,msg);
    return msg;
  }

}

function getFixerIOAPIKey(){
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet ();
  var dataSheet = spreadSheet.getSheetByName("Data");
  var apiKey = dataSheet.getRange("D2").getValue();
  return apiKey;
}

// Return currency rate vs USD for given fiat symbol
// Reference: http://fixer.io/

function getCurrencyRateAgainstUSD(currencySymbol){

  var url = "http://data.fixer.io/latest?access_key=" + getFixerIOAPIKey();
  try{
    if(currencySymbol == "USD") {
      return 1.0;
    }
    else {

      var cacheExpiryInSeconds = 60 * 60 * 24; // 1 day
      var json = getCachedUrlContent(url, cacheExpiryInSeconds);
      var data = JSON.parse(json);

      var usd = 1/ data.rates["USD"];
      var price = usd / (1 / data.rates[currencySymbol]);

      log(url, Number(price));
      return Number(price);
    }
  }
  catch(ex){
    var msg = "Exception: " + ex;
    log(url,msg);
    return msg;
  }

}

// Return historical currency rate vs USD for given fiat symbol and date
// Reference: http://fixer.io/

function getCurrencyRateAgainstUSDAtDate(currencySymbol, date){

  var dateString = Utilities.formatDate(date, "GMT+10", "yyyy-MM-dd");
  var url = "http://data.fixer.io/"+dateString+"?access_key=" + getFixerIOAPIKey();

  try{
    var cacheExpiryInSeconds = 60 * 60 * 24; // 1 day
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);

    var usd = 1/ data.rates["USD"];
    var price = usd / (1 / data.rates[currencySymbol]);

    log(url, Number(price));
    return Number(price);
  }
  catch(ex){
    var msg = "Exception: " + ex;
    log(url,msg);
    return msg;
  }

}

// Iterate used fiat symbols and return true/false if matched

function isFiat (symbolToCompare){
  var isFiat = false;
  var symbol = symbolToCompare.toUpperCase();
  isFiat = (symbol == "AUD") ||
           (symbol == "THB") ||
           (symbol == "USD");
  return isFiat;
}

// Determine asset price from unknown asset

function assetPrice(selectedCurrency, assetSymbol, date){

  try{
    var assetPrice = 0;

    if (selectedCurrency == assetSymbol)
      assetPrice = Number(1.0);
    else
    {
      if(isFiat(assetSymbol)) {
        assetPrice = Number(getCurrencyRateAgainstUSDAtDate(selectedCurrency, date));
      }
      else {
        assetPrice = Number(getPriceCryptoCompareAtDate(assetSymbol, selectedCurrency, date));
      }
    }

    return assetPrice;
  }
  catch(ex){
    var msg = "Exception: " + ex;
    log(url,msg);
    return msg;
  }
}
