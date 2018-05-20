// *********************************************************************************************************************
// Financial functions
// *********************************************************************************************************************

// Returns current cryptocurrency price from CoinMarketcap API
// Reference: https://coinmarketcap.com/api/

function getUSDPriceCoinMarketCap (name) {

  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }
    var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=USD"
    var cacheExpiryInSeconds = 60 * 60; // 1 hour
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var price = data[0].price_usd;

    return Number(price);
  }
  catch(ex){ return "Exception:"+ ex; }
}

// Returns current cryptocurrency price CoinMarketcap API in ETH
// Reference: https://coinmarketcap.com/api/

function getETHPriceCoinMarketCap (name) {

  try{
    if(name.indexOf("_refresh")>-1){
      return 0;
    }
    var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=ETH"
    var cacheExpiryInSeconds = 60 * 60; // 1 hour
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var price = data[0].price_eth;

    return Number(price);
  }
  catch(ex){ return "Exception:"+ ex; }

}

// Returns current cryptocurrency market cap from CoinMarketcap API
// Reference: https://coinmarketcap.com/api/

function getUSDMarketCap (name) {

  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }
    var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=USD"
    var cacheExpiryInSeconds = 60 * 60; // 1 hour
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var marketcap = data[0].market_cap_usd;

    return Number(marketcap);
  }
  catch(ex){ return "Exception:"+ ex; }
}

// Returns token available supply from CoinMarketcap API
// Reference: https://coinmarketcap.com/api/

function getAvailableSupply (name) {

  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }
    var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=USD"
    var cacheExpiryInSeconds = 60 * 60 * 24 * 3; // 3 days
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var supply = data[0].available_supply;

    return Number(supply);
  }
  catch(ex){ return "Exception:"+ ex; }

}

// Returns token total supply from CoinMarketcap API
// Reference: https://coinmarketcap.com/api/

function getTotalSupply (name) {

  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }
    var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=USD"
    var cacheExpiryInSeconds = 60 * 60 * 24 * 7; // 1 week
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var supply = data[0].total_supply;

    return Number(supply);
  }
  catch(ex){ return "Exception:"+ ex; }

}

// Returns 24 hour price change CoinMarketcap API
// Reference: https://coinmarketcap.com/api/

function get24HourChange (name) {

  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }
    var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=USD"
    var cacheExpiryInSeconds = 60 * 60; // 1 hour
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var dailyChange = data[0].percent_change_24h;

    return Number(dailyChange);
  }
  catch(ex){ return "Exception:"+ ex; }

}

// Returns current cryptocurrency price from CryptoCompare API for a particular fiat currency symbol
// Reference: https://min-api.cryptocompare.com/

function getPriceCryptoCompare (name, currencySymbol) {

  try{

    if(name.indexOf("_refresh")>-1){
      return 0;
    }
    var url = "https://min-api.cryptocompare.com/data/price?fsym=" + name.toUpperCase() + "&tsyms=" + currencySymbol.toUpperCase();
    var cacheExpiryInSeconds = 60 * 60; // 1 hour
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var price = data[currencySymbol.toUpperCase()];

    return Number(price);
  }
  catch(ex){ return "Exception:"+ ex; }

}

// Convert date to epoch seconds for use with CryptoCompare API

function toEpochSeconds(date){
  return date.getTime() / 1000
}

// Return currency cryptocurrency price CryptoCompare API for a particular fiat symbol and date

function getPriceCryptoCompareAtDate(cryptoSymbol, currencySymbol, date){

  try{

    if(cryptoSymbol.indexOf("_refresh")>-1){
      return 0;
    }
    var dateInEpochSeconds = toEpochSeconds(date);
    var url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="+cryptoSymbol.toUpperCase()+"&tsyms="+currencySymbol.toUpperCase()+"&ts="+dateInEpochSeconds;
    var cacheExpiryInSeconds = 60 * 60 * 24; // 1 day
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var pair = data[cryptoSymbol.toUpperCase()];
    var price = pair[currencySymbol.toUpperCase()];

    return Number(price);
  }
  catch(ex){ return "Exception:"+ ex; }

}

// Return currency rate vs USD for given fiat symbol
// Reference: http://fixer.io/

function getCurrencyRateAgainstUSD(currencySymbol){

  try{
    if(currencySymbol == "USD") {
      return 1.0;
    }
    else {
      var url = "http://api.fixer.io/latest?base=USD";
      var cacheExpiryInSeconds = 60 * 60 * 24; // 1 day
      var json = getCachedUrlContent(url, cacheExpiryInSeconds);
      var data = JSON.parse(json);
      var price = data.rates[currencySymbol];
      return Number(price);
    }
  }
  catch(ex){ return "Exception:"+ ex; }

}

// Return historical currency rate vs USD for given fiat symbol and date
// Reference: http://fixer.io/

function getCurrencyRateAgainstUSDAtDate(currencySymbol, date){

  try{
    var dateString = Utilities.formatDate(date, "GMT+10", "yyyy-MM-dd");
    Logger.log("dateString="+ dateString);
    var url = "http://api.fixer.io/"+dateString+"?base=USD";
    var cacheExpiryInSeconds = 60 * 60 * 24; // 1 day
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var data = JSON.parse(json);
    var price = data.rates[currencySymbol];

    return Number(price);
  }
  catch(ex){ return "Exception:"+ ex; }

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

    Logger.log('assetPrice : selectedCurrency = ' + selectedCurrency);
    Logger.log('assetPrice : assetSymbol      = ' + assetSymbol);
    Logger.log('assetPrice : date             = ' + date);

    if (selectedCurrency == assetSymbol)
      assetPrice = Number(1.0);
    else
    {
      if(isFiat(assetSymbol)) {
        Logger.log("assetPrice : asset is fiat");
        assetPrice = Number(getCurrencyRateAgainstUSDAtDate(selectedCurrency, date));
      }
      else {
        Logger.log("assetPrice : asset is crypto");
        assetPrice = Number(getPriceCryptoCompareAtDate(assetSymbol, selectedCurrency, date));
      }
    }

    return assetPrice;
  }
  catch(ex){ return "Exception:"+ ex; }
}
