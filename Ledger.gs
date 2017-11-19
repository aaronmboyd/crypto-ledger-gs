
// *********************************************************************************************************************
// Spreadsheet functions
// *********************************************************************************************************************

function newEntry()
{   var spreadSheet = SpreadsheetApp.getActiveSpreadsheet ();
    var ledgerSheet = spreadSheet.getSheetByName("Ledger");
    var lastRow = ledgerSheet.getLastRow();
    Logger.log("lastRow =" + lastRow);
    var lastColumn = ledgerSheet.getLastColumn();
    Logger.log("lastColumn =" + lastColumn);
    var lastEntry = ledgerSheet.getRange(lastRow,1, 1, lastColumn);
    Logger.log("lastEntry =" + lastEntry);
    var destinationEntry = ledgerSheet.getRange(lastRow+1,1,1,lastColumn);
    lastEntry.copyTo (destinationEntry);
    ledgerSheet.getRange(lastRow+1,1).setValue(Utilities.formatDate(new Date(), "GMT", "dd/MMM/yyyy"));
}

function deleteEntry()
{   var spreadSheet = SpreadsheetApp.getActiveSpreadsheet ();
    var ledgerSheet = spreadSheet.getSheetByName("Ledger");
    var lastRow = ledgerSheet.getLastRow();
    var lastColumn = ledgerSheet.getLastColumn();
    var lastEntry = ledgerSheet.getRange(lastRow,1, 1, lastColumn);
    lastEntry.clear();
    lastEntry.clearDataValidations();
    lastEntry.clearFormat();
}

function onOpen() {
SpreadsheetApp.getUi().createMenu('Ledger')
.addItem('New Entry','newEntry')
.addItem('Delete Last','deleteEntry')
.addToUi()
}

// *********************************************************************************************************************
// Financial functions
// *********************************************************************************************************************

// Returns current cryptocurrency price from CoinMarketcap API
// Reference: https://coinmarketcap.com/api/

function getUSDPriceCoinMarketCap (name) {

  var url = "https://api.coinmarketcap.com/v1/ticker/" + name + "?convert=USD"

  var cachedValue = getFromCache(url);
  if(cachedValue!=null)
    return Number(cachedValue);

  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();

  if (response.getResponseCode() != 200)
    return -1 * response.getResponseCode();

  var data = JSON.parse(json);
  var priceval = {"USD" : data[0].price_usd };
  var price = priceval["USD"];

  var cacheExpiryInSeconds = 60 * 10; // 10 minutes
  putToCache(url, price, cacheExpiryInSeconds);

  return Number(price)
}

// Returns current cryptocurrency price from CryptoCompare API for a particular fiat currency symbol
// Reference: https://min-api.cryptocompare.com/

function getPriceCryptoCompare (name, currencySymbol) {
  var url = "https://min-api.cryptocompare.com/data/price?fsym=" + name.toUpperCase() + "&tsyms=" + currencySymbol.toUpperCase();

  var cachedValue = getFromCache(url);
  if(cachedValue!=null)
    return Number(cachedValue);

  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();

  if (response.getResponseCode() != 200)
    return -1 * response.getResponseCode();

  var data = JSON.parse(json);
  var price = data[currencySymbol.toUpperCase()];

  var cacheExpiryInSeconds = 60 * 10; // 10 minutes
  putToCache(url, price, cacheExpiryInSeconds);

  return Number(price)
}

// Convert date to epoch seconds for use with CryptoCompare API

function toEpochSeconds(date){
  return date.getTime() / 1000
}

// Return currency cryptocurrency price CryptoCompare API for a particular fiat symbol and date

function getPriceCryptoCompareAtDate(cryptoSymbol, currencySymbol, date){

  var dateInEpochSeconds = toEpochSeconds(date);
  var url = "https://min-api.cryptocompare.com/data/pricehistorical?fsym="+cryptoSymbol.toUpperCase()+"&tsyms="+currencySymbol.toUpperCase()+"&ts="+dateInEpochSeconds;

  var cachedValue = getFromCache(url);
  if(cachedValue!=null)
    return Number(cachedValue);

  var response = UrlFetchApp.fetch(url);
  var json = response.getContentText();

  if (response.getResponseCode() != 200)
    return -1 * response.getResponseCode();

  var data = JSON.parse(json);
  var pair = data[cryptoSymbol.toUpperCase()];
  var price = pair[currencySymbol.toUpperCase()];

  var cacheExpiryInSeconds = 60 * 60 * 24; // 1 day
  putToCache(url, price, cacheExpiryInSeconds);

  return Number(price);
}

// Return currency rate vs USD for given fiat symbol
// Reference: http://fixer.io/

function getCurrencyRateAgainstUSD(currencySymbol){

  if(currencySymbol == "USD") {
    return 1.0;
  }
  else {
    var url = "http://api.fixer.io/latest?base=USD";

    var cachedValue = getFromCache(url);
    if(cachedValue!=null)
      return Number(cachedValue);

    var response = UrlFetchApp.fetch(url);
    var json = response.getContentText();

    if (response.getResponseCode() != 200)
      return -1 * response.getResponseCode();

    var data = JSON.parse(json);
    var price = data.rates[currencySymbol];

    var cacheExpiryInSeconds = 60 * 30; //30 minutes
    putToCache(url, price, cacheExpiryInSeconds);

    return Number(price);
  }
}

// Return historical currency rate vs USD for given fiat symbol and date
// Reference: http://fixer.io/

function getCurrencyRateAgainstUSDAtDate(currencySymbol, date){

  var dateString = Utilities.formatDate(date, "GMT+10", "yyyy-MM-dd");
  Logger.log("dateString="+ dateString);
  var url = "http://api.fixer.io/"+dateString+"?base=USD";

  var cachedValue = getFromCache(url);
  if(cachedValue!=null)
    return Number(cachedValue);

  var response = UrlFetchApp.fetch(url);

  if (response.getResponseCode() != 200)
    return -1 * response.getResponseCode();

  var json = response.getContentText();
  var data = JSON.parse(json);
  var price = data.rates[currencySymbol];

  var cacheExpiryInSeconds = 60 * 60 * 24;
  putToCache(url, price, cacheExpiryInSeconds);

  return Number(price);
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
