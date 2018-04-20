/*
// このクローム拡張は小説投稿サイトの小説メニュー画面で起動すると小説を一括ダウンロードします。
//
//
*/


'use strict'

// message listener.
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
  DeepSearch(msg.searchText);
});

var DeepSearch = function(searchText) {
  // ドメインに対応したクラスを利用するように処理する.
  var downloaderList = {};
  downloaderList["novel.syosetu.org"] = new Harmeln_Searcher();
  // ドメインに対応したクラスを用いた検索.
  var domainName = window.location.hostname;
  console.log(domainName + " : " + searchText);
  downloaderList[domainName].Search(searchText);
}
// 最初に検索語がデたページを新しいタブで開きます.
var Harmeln_Searcher = function() {
  var myProto = Harmeln_Searcher.prototype;
  // ダウンロードメソッド.
  myProto.Search = function(searchText){
    // エピソード要素を配列に入れる.
    var episodeArr = $("table tr td a");
    var titleArr = [];
    var waitSecond = 1;
    var stopFlg = false;
    // エピソードの中から言葉を検索する.
    for (var i=0; i<episodeArr.length; ) {
      $.ajax({
        type: 'GET',
        url: episodeArr[i].href,
        dataType: 'text',
        async: false,
        timeout: 30000,
        success: function(data){
          console.log("search:"+episodeArr[i].text);
          // 検索処理
          var result = $(data).find("div#honbun")[0].innerText.indexOf(searchText);
          if(~result) {
            // 見つかった場合、タイトルを変数に格納する。
            titleArr.push(episodeArr[i].text);
          }
          // 終了処理
          waitSecond = 30;
          i++;
        },
        // エラーの場合一定秒数待って再度実行する。.
        error: function(reqest, status, error) {
          waitSecond = waitSecond + 3
          if (waitSecond > 33) stopFlg = true;
          console.log("status : " + status);
          console.log("wait   : " + waitSecond + "s");
          myProto.SleepSec(waitSecond)
        },
      });
      if (stopFlg) break;
    }
    // 結果処理.
    if (titleArr.length > 0) {
      $.each(titleArr, function(i, value) {
        console.log("hit:"+i+":"+value);
      });
    } else {
      console.log("nothing");
    }
  };
  // 指定した時間だけ処理を中断する。
  myProto.SleepSec = function(sec) {
    const d1 = new Date();
    while (true) {
      const d2 = new Date();
      if (d2 - d1 > sec*1000) {
        break;
      }
    }
  }
};
