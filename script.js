// resize the div containing the iframe to fit the iframe height
// callbacks for window resize (stack exchange)

"use strict";

const embeds = document.getElementsByClassName("pollly-embed");
const pollInfo = document.getElementsByClassName("poll-info") || [null, null];

const upperNav = document.getElementsByClassName("mobile-tabs")[0];
const nav = document.getElementsByClassName("navigation")[0];

const titleButton = nav.children[0];
const elementsButton = nav.children[1];

const makeVisible = (arrToMakeVisible) => {
   arrToMakeVisible.forEach((thing) => {
      if (thing.classList.contains("invisible") === true) {
         thing.classList.remove("invisible");
      }
   });
};

const makeInvisible = (arrToMakeInvisible) => {
   arrToMakeInvisible.forEach((thing) => {
      if (thing.classList.contains("invisible") === false) {
         thing.classList.add("invisible");
      }
   });
};

const handleClickTitleButton = (e) => {
   if (elementsButton.classList !== undefined) {
      elementsButton.classList.remove("selected");
   }
   if (titleButton.classList.contains("selected")) {
      titleButton.classList.remove("selected");
      makeInvisible([embeds[0], pollInfo[0]]);
   } else {
      titleButton.classList.add("selected");
      makeVisible([embeds[0], pollInfo[0]]);
      makeInvisible([embeds[1], pollInfo[1]]);
   }
};

const handleClickElementsButton = (e) => {
   if (titleButton.classList !== undefined) {
      titleButton.classList.remove("selected");
   }
   if (elementsButton.classList.contains("selected")) {
      elementsButton.classList.remove("selected");
      makeInvisible([embeds[1], pollInfo[1]]);
   } else {
      elementsButton.classList.add("selected");
      makeVisible([embeds[1], pollInfo[1]]);
      makeInvisible([embeds[0], pollInfo[0]]);
   }
};

const switchToMobileView = () => {
   makeInvisible([embeds[0], embeds[1], pollInfo[0], pollInfo[1]]);
   makeVisible([nav, upperNav]);
};

// switchToMobileView();

const switchToFullView = () => {
   makeVisible([embeds[0], embeds[1], pollInfo[0], pollInfo[1]]);
   makeInvisible([nav, upperNav]);
   if (titleButton.classList !== undefined) {
      titleButton.classList.remove("selected");
   }
   if (elementsButton.classList !== undefined) {
      elementsButton.classList.remove("selected");
   }
};

titleButton.onclick = handleClickTitleButton;
elementsButton.onclick = handleClickElementsButton;

let x = window.matchMedia("(max-width: 800px)");

if (x.matches) {
   switchToMobileView();
} else {
   switchToFullView();
}

let lastWidth = document.documentElement.clientWidth;

window.addEventListener("resize", (e) => {
   // resize logic
   let newWidth = document.documentElement.clientWidth;

   if (lastWidth >= 800 && newWidth < 800) {
      switchToMobileView();
   } else if (lastWidth <= 800 && newWidth > 800) {
      switchToFullView();
   }

   lastWidth = newWidth;

   // document.documentElement.clientWidth;

   // $(window).resize(function(){
   //    if($(window).width()!=lastWidth){
   //       //execute code here.
   //       lastWidth = $(window).width();
   //    }
   // })
});

if (embeds) {
   for (let i = 0; i < embeds.length; i++) {
      if (x.matches) {
         makeInvisible([embeds[i]]);
      }

      var id = embeds[i].getAttribute("data-id");
      embeds[i].innerHTML =
         '<iframe id="pollly-iframe-' +
         id +
         '" scrolling="no" style="overflow:hidden;border:0;max-width:730px;width:100%" src="https://poll.ly/#/' +
         id +
         '/iframe"></iframe>';
   }

   window.addEventListener("message", function (e) {
      const eventName = e.data[0];
      const data = e.data[1];

      if (eventName.includes("embedHeight.")) {
         const id = eventName.split(".")[1];
         document.getElementById("pollly-iframe-" + id).style.height =
            data + "px";
      }
   });
}
