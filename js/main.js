$(document).ready(function() {
  initMainSwiper()
  initIntro()

  // Inits for 3d scenes (external JS files)
  //initScene1()
})





/*
---------------------------------------------------------------
  MAIN SWIPER + BACKGROUND CHANGES
---------------------------------------------------------------
*/

var mainSwiper

function initMainSwiper() {
  mainSwiper = $('#mainSlideshow').swiper({
    direction: 'vertical',
    speed: 1500,
    mousewheelControl: true,
    onSlideChangeStart: animateGradient
  })
}

var gradientColors = { // Starting gradient colors. Updates along the way
  color0: '#1A2980',
  color1: '#26D0CE'
};

function animateGradient() {
  var color0, color1;

  if (mainSwiper.activeIndex == 0) {
    color0 = '#1A2980';
    color1 = '#26D0CE';
  } else if (mainSwiper.activeIndex == 1) {
    color0 = '#26D0CE';
    color1 = '#1A80aa';
  } else if (mainSwiper.activeIndex == 2) {
    color0 = '#092632';
    color1 = '#0d3c3c';
  }

  TweenMax.to(gradientColors, 2, {
    color0: color0,
    color1: color1,
    ease: Power1.easeOut,
    onUpdate: applyGradientColors
  });
}

function applyGradientColors() {
  $('body').css('background', 'linear-gradient(to bottom right, '+gradientColors.color0+' , '+gradientColors.color1+')');
}






/*
---------------------------------------------------------------
  FIRST SLIDE, INTRO + LOGO TOY
---------------------------------------------------------------
*/

var logoZoomAnim = new TimelineMax({ onComplete : zoomDone });
var superAnim = new TimelineMax();
var tinyAnim = new TimelineMax();

function initIntro() {
  logoZoomAnim.add(TweenLite.from($('.logoHolder img'), .5, {
    scale: 150,
    rotation: -20,
    ease: Power0.easeOut,
    onComplete: function() { radiusAnim.play() } // referencing fabric.js
  }));

  logoZoomAnim.add(TweenLite.to($('.logoHolder img'), .1, {
    scale: 1.1,
    ease: Power1.easeInOut
  }));

  logoZoomAnim.add(TweenLite.to($('.logoHolder img'), .1, {
    scale: .95,
    ease: Power1.easeInOut
  }));

  logoZoomAnim.add(TweenLite.to($('.logoHolder img'), .1, {
    scale: 1,
    ease: Power1.easeInOut
  }));
}

function zoomDone() {
  $('.logoHolder img').on('mouseover click', touchLogo)
}

function touchLogo(e) {
  if (superAnim.progress() < .2) { return } // Prevent fast slapping so it doesn't get too seizure-y

  radiusAnim.restart() // referencing fabric.js
  var pX = e.clientX - window.innerWidth /2
  var pY = e.clientY - window.innerHeight /2

  superAnim = new TimelineMax();
  superAnim.add(TweenLite.fromTo($('.logoHolder img:first-child'), .2, {
    left: 0,
    top: 0,
  }, {
    left: (Math.random() * .3) * -pX,
    top: (Math.random() * .3) * -pY,
    scale: (Math.random() * .6) + .2,
    ease: Power1.easeOut
  }));
  superAnim.add(TweenLite.to($('.logoHolder img:first-child'), 2, {
    left: 0,
    top: 0,
    scale: 1,
    ease: Elastic.easeOut
  }));

  tinyAnim = new TimelineMax();
  tinyAnim.add(TweenLite.fromTo($('.logoHolder img:last-child'), .2, {
    left: 0,
    top: 0,
  }, {
    left: (Math.random() * .3) * -pX,
    top: (Math.random() * .3) * -pY,
    scale: (Math.random() * .6) + .2,
    ease: Power1.easeOut
  }));
  tinyAnim.add(TweenLite.to($('.logoHolder img:last-child'), 2, {
    left: 0,
    top: 0,
    scale: 1,
    ease: Elastic.easeOut
  }));

  squareAnim = new TimelineMax();
  squareAnim.add(TweenLite.fromTo($('.square'), .2, {
    left: 0,
    top: 0,
  }, {
    left: (Math.random() * .3) * pX,
    top: (Math.random() * .3) * pY,
    ease: Power1.easeOut
  }));
  squareAnim.add(TweenLite.to($('.square'), 2, {
    left: 0,
    top: 0,
    ease: Elastic.easeOut
  }));
}
