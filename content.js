window.onload = () => {
  // only allow the video player listener to be added once
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
    chrome.storage.local.set(
      {
        videoDuration: !videoSection ? 1 : Math.floor(videoSection.duration),

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

        loopEnd: !videoSection ? 1 : Math.floor(videoSection.duration),

        mirror: !videoSection
          ? false
          : videoSection.style.transform === "scaleX(-1)",
      },
      function () {}
    );

    // set up listener for video player
    if (!addedListener) {
      videoSection.ontimeupdate = () => {
        chrome.storage.local.get(["loop", "loopStart", "loopEnd"], function (
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

  // listener for navigating to new pages
  window.addEventListener("yt-navigate-finish", function () {
    if (window.location.href.includes("youtube.com/watch")) {
      console.log("updated");
      updateStorage();
    }
  });

  // initial configuration when script is first injected
  if (window.location.href.includes("youtube.com/watch")) {
    updateStorage();
  }
};
