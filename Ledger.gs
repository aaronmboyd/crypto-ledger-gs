// *********************************************************************************************************************
// Financial functions
// *********************************************************************************************************************
//

// Find the CoinMarketCap API key in the Data/D5 cell

function appendCoinMarketCapAPIKey(url){
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet ();
  var dataSheet = spreadSheet.getSheetByName("Data");
  var apiKey = dataSheet.getRange("D5").getValue();
  return url + "&CMC_PRO_API_KEY="+apiKey;
}

// Find the CoinMarketCap API key in the Data/D4 cell

function appendCryptoCompareAPIKey(url){
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet ();
  var dataSheet = spreadSheet.getSheetByName("Data");
  var apiKey = dataSheet.getRange("D4").getValue();
  return url + "&api_key="+apiKey;
}

// Checks the "Refresh Cache" cell and returns a random number if it is true
// which we can pass to the caching service which will force a new MD5 hash

function getCacheNonce(){
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet ();
  var dataSheet = spreadSheet.getSheetByName("Data");
  var refreshCache = dataSheet.getRange("D6").getValue();
  
  // Kludge a random 0-60 number
  if(refreshCache)
    return Math.round(Math.random()*60);
  else
    return 0;  
}

// Concatenate all symbols from the Assets sheet
// Because CoinMarketCap API can take multiple symbols in the one call
// Cache the result of ALL symbols to reduce Sheet iteration of cells

function getAllSymbols(){  
  var concatenatedSymbols = getFromCache('getAllSymbols');
  
  if(concatenatedSymbols == null){  
  
    var spreadSheet = SpreadsheetApp.getActiveSpreadsheet ();
    var assets = spreadSheet.getSheetByName("Assets");
    
    startingRow = 3;
    startingColumn = 3;
    
    concatenatedSymbols = "";
    var firstSymbol = true;
    
    var symbol = assets.getRange(startingRow,startingColumn).getValue(); 
    var name = assets.getRange(startingRow,1).getValue();

    while(symbol != "")
    {      
      // Ignore fiat symbols
      // Ignore ICO names labelled "Pend"
      // Ignore forced refresh names labelled "Refresh"
      if (!isFiat(symbol) && !(name.indexOf("Pend")>-1) && !(symbol.indexOf("Refresh")>-1)){
        if(firstSymbol){
          concatenatedSymbols = symbol;
          firstSymbol = false;
        }
        else{
          concatenatedSymbols = concatenatedSymbols + "," + symbol;
        }
      }      
      startingRow++;
      symbol = assets.getRange(startingRow,startingColumn).getValue(); 
      name = assets.getRange(startingRow,1).getValue();
    }
    putToCache('getAllSymbols', concatenatedSymbols, 30); // 30 second cache expiry
  }
  return concatenatedSymbols;
}

// Returns current cryptocurrency price from CoinMarketcap API
// Reference: https://coinmarketcap.com/api/documentation/v1/#section/Endpoint-Overview

function getQuoteCoinMarketCapPro (cryptoSymbol, convertToSymbol, quoteRequired) {
  
  const allSymbols = getAllSymbols();

  var url = "https://pro-api.coinmarketcap.com" + "/v1/cryptocurrency/quotes/latest" + "?symbol=" + allSymbols + "&convert=" + convertToSymbol;
  url = appendCoinMarketCapAPIKey(url);
  
  try{
    if(cryptoSymbol.indexOf("_refresh")>-1){
      return 0;
    }

    var cacheExpiryInSeconds = (60 * 60) + getCacheNonce(); 
    var json = getCachedUrlContent(url, cacheExpiryInSeconds);
    var parsedJson = JSON.parse(json);
    
    var quote = parsedJson.data[cryptoSymbol].quote[convertToSymbol][quoteRequired];    

    log(url, Number(quote));
    return Number(quote);
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
  url = appendCryptoCompareAPIKey(url);
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
  url = appendCryptoCompareAPIKey(url);
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
  url = appendCryptoCompareAPIKey(url);
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
