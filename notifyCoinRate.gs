function main() {
  const NOTIFY_LINE_TOKEN = 'your line notify token';

  const NOTIFY_BORDER_PRICE_UP = 100;
  const NOTIFY_BORDER_PRICE_DOWN = -90;

  const NOTIFY_COIN_NAME = 'bitcoin'; // from https://api.coinmarketcap.com/v1/ticker/ `id`


  const coinData = getCoinData(NOTIFY_COIN_NAME);
  const coinRate = '1jpy : ' + (getJpyRate() * parseFloat(coinData.price_usd)) + NOTIFY_COIN_NAME;

  const isUp = isPriceUp({
    percentage : coinData.percent_change_1h,
    border : NOTIFY_BORDER_PRICE_UP
  });
  const isDown = isPriceDown({
    percentage : coinData.percent_change_1h,
    border : NOTIFY_BORDER_PRICE_DOWN
  });

  var upOrDown = '';
  if(isUp) {
    upOrDown += '高騰'
  }
  if(isDown) {
    upOrDown += '下落'
  }

  if(upOrDown) {
    sendMessage({
      lineToken : NOTIFY_LINE_TOKEN,
      message : NOTIFY_COIN_NAME + 'が' + upOrDown + 'しました\r\n' + coinRate
    });
  }
}


function isPriceUp(props) {
  return parseFloat(props.percentage) >= parseFloat(props.border);
}


function isPriceDown(props) {
  return parseFloat(props.percentage) <= parseFloat(props.border);
}


function sendMessage(props) {
   UrlFetchApp.fetch('https://notify-api.line.me/api/notify', {
     'method'  : 'post',
     'payload' : 'message=' + props.message,
     'headers' : {'Authorization' : 'Bearer '+ props.lineToken}
   });
}


function getCoinData(coinName) {
  const apiUrl = 'https://api.coinmarketcap.com/v1/ticker/';

  const result = UrlFetchApp
          .fetch(apiUrl + coinName)
          .getContentText();
  return JSON.parse(result)[0];
}


function getJpyRate() {
  const rate = 110; //暫定 110円固定
  return rate;
}
