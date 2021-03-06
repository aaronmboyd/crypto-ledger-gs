function test_newEntry(){
 newEntry(); 
}

function test_all(){
  
  // Run all, check logs afterwards (Ctrl+Enter)
  
  test_GetUSDPriceCoinMarketCap();
  test_GetPriceCryptoCompare();  
  test_GetPriceCryptoCompareAtDate();  
  test_currencyRateAgainstUSD();
  test_currencyRateAgainstUSDAtDate();
  test_assetPriceFiat();
  test_assetPriceCrypto();
  test_getUrlFetchCount();
  test_getPriceCoinMarketCapPro();  
}

function test_GetUSDPriceCoinMarketCap() {  
  var price = getUSDPriceCoinMarketCap("bitcoin");
  Logger.log("getUSDPriceCoinMarketCap = $" + price);
}

function test_GetPriceCryptoCompare() {  
  var price = getPriceCryptoCompare("btc","aud");
  Logger.log("getPriceCryptoCompare = $" + price);  
}

function test_GetPriceCryptoCompareAtDate() {  
  var price = getPriceCryptoCompareAtDate("dash","aud", new Date("2017/07/08"));
  Logger.log("getPriceCryptoCompareAtDate = $" + price);  
}

function test_currencyRateAgainstUSD() {  
  var currencySymbol = "THB";
  var price = getCurrencyRateAgainstUSD(currencySymbol);
  Logger.log("getCurrencyRateAgainstUSD $1 USD = " + currencySymbol + " " + price);  
}

function test_currencyRateAgainstUSD() {  
  var currencySymbol = "USD";
  var price = getCurrencyRateAgainstUSD(currencySymbol);
  Logger.log("getCurrencyRateAgainstUSD $1 USD = " + currencySymbol + " " + price);  
}

function test_currencyRateAgainstUSDAtDate() {  
  var currencySymbol = "THB";
  var testDate = new Date("2009/10/21");
  var price = getCurrencyRateAgainstUSDAtDate(currencySymbol, testDate);
  Logger.log("At date = " + testDate + ", getCurrencyRateAgainstUSDAtDate $1 USD = " + currencySymbol + " " + price);  
}

function test_assetPriceFiat(){
  var selectedCurrency = "AUD";
  var asset = "USD";
  var date = new Date("2013/10/15");
  var price = assetPrice(selectedCurrency,asset,date);
  Logger.log("assetPrice =" + price);
}
  
function test_assetPriceCrypto(){
  var selectedCurrency = "AUD";
  var asset = "ETH";
  var date = new Date("2017/10/12");
  var price = assetPrice(selectedCurrency,asset,date);
  Logger.log("assetPrice =" + price);
}

function test_assetPriceCrypto2(){
  var selectedCurrency = "AUD";
  var asset = "BTC";
  var date = new Date("2014/02/20");
  var price = assetPrice(selectedCurrency,asset,date);
  Logger.log("assetPrice =" + price);
}

function test_assetPriceCrypto3(){
  var selectedCurrency = "AUD";
  var asset = "ETH";
  var date = new Date("2017/09/16");
  var price = assetPrice(selectedCurrency,asset,date);
  Logger.log("assetPrice =" + price);
}

function test_putCache()
{
  putToCache("testkey123", "value123", 10);
}

function test_getCache_Hit()
{
  test_putCache();
  var cacheHit = getFromCache("testkey123");
  Logger.log("Expecting hit - cache value = " + cacheHit);
             
  var cacheMiss = getFromCache("testkey123999999");
  Logger.log("Expecting miss - cache value = " + cacheMiss);             
}

function test_getUrlFetchCount()
{
  Logger.log("urlFetchCount = " + getUrlFetchCount());
}
function test_getCacheFetchCount()
{
  Logger.log("cacheFetchCount = " + getCacheFetchCount());
}

function test_getCachedUrlContent()
{
  putToCache("https://api.coinmarketcap.com/v1/ticker/ethereum?convert=USD","CACHED DATA", 60 * 10);
  var content = getCachedUrlContent("https://api.coinmarketcap.com/v1/ticker/ethereum?convert=USD", 60 * 10);
  Logger.log("getCachedUrlContent = " + content);
}

function test_getCoinmarketCapIDForSymbol(){
  
  var symbols = ["BTC","ETH","XLM","XMR","FKX"];
  for(var i = 0; i < symbols.length; i++) {
    var id = getCoinmarketCapIDForSymbol(symbols[i]);
    Logger.log("Symbol = " + symbols[i] + ", id = " + id);
  }  
}

function test_getQuoteCoinMarketCapPro_price(){
  
  var symbols = ["BTC","ETH","XLM","XMR","FKX"];
  for(var i = 0; i < symbols.length; i++) {
    var price = getQuoteCoinMarketCapPro(symbols[i], "USD", "price");
    Logger.log("Symbol = " + symbols[i] + ", price = " + price);
  }  
}

function test_getQuoteCoinMarketCapPro_percent_change_24h(){
  
  var symbols = ["BTC","ETH","XLM","XMR","FKX"];
  for(var i = 0; i < symbols.length; i++) {
    var price = getQuoteCoinMarketCapPro(symbols[i], "USD", "percent_change_24h");
    Logger.log("Symbol = " + symbols[i] + ", % change 24 hour = " + price);
  }  
}

function test_getAllSymbols(){
  Logger.log("Get all symbols: " + getAllSymbols()); 
}




