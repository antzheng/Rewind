"use strict";

// set up constant references to DOM elements
const slider = document.getElementById("slider");
const sliderValue = document.getElementById("slider-value");
const toggleLoop = document.getElementById("toggleLoop");
const toggleMirror = document.getElementById("toggleMirror");
const toggleComments = document.getElementById("toggleComments");
const toggleRecommended = document.getElementById("toggleRecommended");

// get the values upon opening popup
chrome.storage.local.get(
  [
    "videoDuration",
    "showRecommended",
    "showComments",
    "mirror",
    "loop",
    "loopStart",
    "loopEnd",
  ],
  function (data) {
    // create slider
    noUiSlider.create(slider, {
      start: [data.loopStart, data.loopEnd],
      step: 1,
      connect: true,
      range: {
        min: 0,
        max: data.videoDuration,
      },
    });

    // set up event listener for when slider moves
    slider.noUiSlider.on("update", function (values) {
      // display changes above slider
      sliderValue.innerHTML =
        "Loop from: " +
        values
          .map(
            (val) =>
              Math.floor(parseInt(val.split(".")[0]) / 60)
                .toString()
                .padStart(2, "0") +
              ":" +
              (parseInt(val.split(".")[0]) % 60).toString().padStart(2, "0")
          )
          .join(" - ");
    });

    // set up event listener for saving slider changes when it stops moving
    slider.noUiSlider.on("change", function (values) {
      // get the slider values
      const start = parseInt(values[0].split(".")[0]);
      const end = parseInt(values[1].split(".")[0]);

      // save the new start and end
      chrome.storage.local.set(
        {
          loopStart: start,
          loopEnd: end,
        },
        function () {}
      );
    });

    // set up state of toggles
    toggleLoop.checked = data.loop;
    toggleMirror.checked = data.mirror;
    toggleComments.checked = data.showComments;
    toggleRecommended.checked = data.showRecommended;
  }
);

// ----------------- set up listener for loop toggle -----------------

toggleLoop.onclick = () => {
  // store the new state
  chrome.storage.local.set(
    {
      loop: toggleLoop.checked,
    },
    function () {}
  );
};

// ----------------- set up listener for mirror toggle -----------------

toggleMirror.onclick = () => {
  // save new mirror direction
  const direction = toggleMirror.checked ? "scaleX(-1)" : "scaleX(1)";

  // store the new state
  chrome.storage.local.set(
    {
      mirror: toggleMirror.checked,
    },
    function () {}
  );

  // enact changes on the DOM
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code:
        'document.querySelector("video").style.transform = "' +
        direction +
        '";',
    });
  });
};

// ----------------- set up listener for comments toggle -----------------

toggleComments.onclick = () => {
  // save new visibility
  const visibility = toggleComments.checked ? "visible" : "hidden";

  // store the new state
  chrome.storage.local.set(
    {
      showComments: toggleComments.checked,
    },
    function () {}
  );

  // enact changes on the DOM
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code:
        'document.querySelector("ytd-item-section-renderer").style.visibility = "' +
        visibility +
        '";',
    });
  });
};

// ----------------- set up listener for recommended toggle -----------------

toggleRecommended.onclick = () => {
  // save new visibility
  const visibility = toggleRecommended.checked ? "visible" : "hidden";

  // store the new state
  chrome.storage.local.set(
    {
      showRecommended: toggleRecommended.checked,
    },
    function () {}
  );

  // enact changes on the DOM
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.executeScript(tabs[0].id, {
      code:
        'document.querySelector("div#items.style-scope.ytd-watch-next-secondary-results-renderer").style.visibility = "' +
        visibility +
        '";',
    });
  });
};
