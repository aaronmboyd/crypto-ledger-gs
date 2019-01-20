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
  SpreadsheetApp.getUi().createMenu('Assets')
  .addItem('Refresh Crypto Assets','refreshCryptoAssets')
  .addToUi()
  
  SpreadsheetApp.getUi().createMenu('Ledger')
  .addItem('New Entry','newEntry')
  .addItem('Delete Last','deleteEntry')
  .addToUi()
}

function refreshCryptoAssets(){
  refreshCoinsInvalidateName();
  refreshCoinsValidateName();
}

function refreshCoinsInvalidateName(){
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var assets = spreadSheet.getSheetByName("Assets");
  startingRow = 3;
  startingColumn = 3;
  
  while(startingRow < 47)
  {
    var coinCell = assets.getRange(startingRow,startingColumn);
    coinCell.setValue(coinCell.getValue() + "_refresh");
    startingRow++;
  }
}

function refreshCoinsValidateName(){
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var assets = spreadSheet.getSheetByName("Assets");
  startingRow = 3;
  startingColumn = 3;  
  
  while(startingRow < 47)
  {
    var coinCell = assets.getRange(startingRow,startingColumn);
    coinCell.setValue(coinCell.getValue().substring(0, coinCell.getValue().length-8));
    startingRow++;
  }
}
