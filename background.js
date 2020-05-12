"use strict";

chrome.runtime.onInstalled.addListener(function () {
  // store the appropriate default values
  chrome.storage.local.set(
    {
      videoDuration: 1,

      showRecommended: true,

      showComments: true,

      loop: false,

      loopStart: 0,

      loopEnd: 1,

      mirror: false,
    },
    function () {}
  );

  // only allow opening of popup when on video
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "youtube.com/watch" },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
