window.onload = () => {
  let addedListener = false;

  const updateStorage = () => {
    // style.visibility = hidden or visible
    const commentsSection = document.querySelector("ytd-item-section-renderer");

    // style.visibility = hidden or ""
    const recommendedSection = document.querySelector(
      "div#items.style-scope.ytd-watch-next-secondary-results-renderer"
    );

    // style.transform = "scaleX(-1/1)"
    const videoSection = document.querySelector("video");

    // store the appropriate values
    chrome.storage.sync.set(
      {
        videoDuration: Math.floor(videoSection.duration),

        showRecommended: !recommendedSection
          ? true
          : recommendedSection.style.visibility === "" ||
            recommendedSection.style.visibility === "visible",

        showComments: !commentsSection
          ? true
          : commentsSection.style.visibility === "" ||
            commentsSection.style.visibility === "visible",

        loop: false,

        loopStart: 0,

        loopEnd: Math.floor(videoSection.duration),

        mirror: videoSection.style.transform === "scaleX(-1)",
      },
      function () {}
    );

    // set up listener for video player
    if (!addedListener) {
      videoSection.ontimeupdate = () => {
        chrome.storage.sync.get(["loop", "loopStart", "loopEnd"], function (
          data
        ) {
          if (data.loop) {
            if (
              videoSection.currentTime >= data.loopEnd ||
              videoSection.currentTime < data.loopStart
            ) {
              videoSection.currentTime = data.loopStart;
            }
          }
        });
      };
      addedListener = true;
    }
  };

  window.addEventListener("yt-navigate-finish", function () {
    if (window.location.href.includes("youtube.com/watch")) {
      updateStorage();
    }
  });

  if (window.location.href.includes("youtube.com/watch")) {
    updateStorage();
  }
};
