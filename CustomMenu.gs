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
