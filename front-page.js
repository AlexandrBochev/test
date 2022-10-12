"use strict";

var mobile = window.matchMedia('(min-width: 0px) and (max-width: 768px)');
var tablet = window.matchMedia('(min-width: 769px) and (max-width: 1023px)');
var desktop = window.matchMedia('(min-width: 1023px) and (max-width: 1279px)'); // Enable (for mobile)

var desktop_pc = window.matchMedia('(min-width: 1280px)');
var controller = new ScrollMagic.Controller();

function glitchSettings() {
  var elements = document.querySelectorAll('.text-glitch');
  elements.forEach(function (el, index) {
    var phrases = $(el).text();
    var fx = new TextScramble(el);
    var counter = 0;

    var next = function next() {
      fx.setText(phrases).then(function () {
        setTimeout(next, 4000);
      });
    };

    next();
  });
  var number = document.querySelector('.number-glitch');
  var tel = $(number).data('val');
  var phrases = $(number).text();
  var fx = new TextScramble(number);
  var counter = 0;
  var hoverLeft = true;
  $(number).hover(function () {
    // console.log('enter')
    if (hoverLeft) {
      hoverLeft = false;
      fx.setText(tel);
    }
  }, function () {
    // console.log('leave')
    fx.setText(phrases);
    hoverLeft = true;
  });
}

function addContentInput(where) {
  where.each(function (i, formItem) {
    // get input/textarea placeholder
    var $formItemLabel = $(formItem).find('input, textarea').attr('placeholder'); // create label element

    $formItemLabel = "<span class='form-item__label'>".concat($formItemLabel, "</span>"); // append label after input/textarea

    $(formItem).find('.wpcf7-form-control-wrap').append($formItemLabel); // set input/textarea attr autocomplete off

    $(formItem).find('input, textarea').attr('autocomplete', 'off');
  });
}

$(function () {
  if (desktop.matches || desktop_pc.matches) {
    glitchSettings();
  }

  $('body').addClass('loading');

  if (0 && $('.modal__overlay').length) {
    $('header').slideUp();
    $('body').addClass('modal-open');
    $('.modal__window-wrap_help').show();
    $('.modal__window-wrap_help .modal__window-close, .modal__exit').on('click', function () {
      $('.modal__window-wrap_help').fadeOut(400, function () {
        $('body').removeClass('modal-open');
        $('header').slideDown();
        afterSubmitHelp();
      });
    });
    $('.modal__window-wrap_success .modal__window-close, .modal-success__button').on('click', function () {
      $('.modal__window-wrap_success').fadeOut(400, function () {
        $('body').removeClass('modal-open');
      });
    });
  } else {
    $('body').removeClass('modal-open');
    $('header').slideDown();
    afterSubmitHelp();
  }

  var wpcf7Elm = document.querySelector('.contact__form .wpcf7');
  wpcf7Elm.addEventListener('wpcf7mailsent', function (event) {
    $('body').addClass('modal-open');
    $('.modal__window-wrap_success').fadeIn();
  }, false);
  var preloading = true;
  setTimeout(function () {
    $('.preloader').fadeOut();
    $('body').addClass('animate');
    preloading = false;
  }, 1100);
  var video = document.querySelector('.video video');
  video.controls = false;
  video.addEventListener('canplay', function () {
    $('.video').find('video').trigger('play');
  });
  var videoChanged = false;
  $(video).click(function () {
    if (!videoChanged) {
      $(video).removeAttr('muted, autoplay');
      $(video).html("<source src=\"".concat($('.video').data('short'), "\" type=\"video/mp4\"></source>"));
      $("video").prop("volume", 1);
      $("video").prop("muted", false);
      $(video)[0].load();
      videoChanged = true;
      return false;
    }

    if (this.paused) {
      this.play();
    } else {
      this.pause();
    }
  });
  var miniCursor = document.querySelector(".video-cursor");
  document.addEventListener("mousemove", function (e) {
    miniCursor.style.left = e.clientX - 80 + "px";
    miniCursor.style.top = e.clientY - 80 + "px";
  });
  addContentInput($('.form-item'));
  $("input.wpcf7-form-control, textarea.wpcf7-form-control").attr("autocomplete", "negative"); //cases
  // disable for mob

  if (desktop.matches || desktop_pc.matches) {
    var videoScene = new ScrollMagic.Scene({
      triggerElement: $('.video-track').get(0),
      triggerHook: 0.1,
      duration: $('.video-track').height()
    }).on('progress', function (event) {
      if (event.progress <= 0.4) {
        // console.log(event.progress);
        if (!preloading) {
          $('body').addClass('animate_progress');
          var progress = event.progress < 0.1 ? 0 : event.progress * 2.5;
          gsap.to(".front-start__date", {
            x: 0 - 100 * progress
          });
          gsap.to(".front-start__content", {
            y: 0 - 100 * progress,
            autoAlpha: 1 - 1 * progress,
            ease: 'none'
          });
          gsap.to(".front-start__big-text_1 > span", {
            x: 0 - 300 * progress
          });
          gsap.to(".front-start__star_orange", {
            x: 0 + 300 * progress,
            rotation: 0 + 480 * progress
          });
          gsap.to(".front-start__big-text_2", {
            x: 0 + 300 * progress
          });
          gsap.to(".front-start__big-text_3", {
            x: 0 - 300 * progress
          });
          gsap.to(".front-start__star_white", {
            x: 0 - 300 * progress,
            rotation: 0 - 480 * progress
          });
          gsap.to(".front-start__file-container", {
            y: 0 + 100 * progress,
            ease: 'none'
          });
          gsap.to(".front-start__text > p", {
            x: 0 - 400 * progress
          });
        }

        $('.front-start').css({
          'pointer-events': 'auto'
        });
        $('.front-start__circles').css({
          'opacity': 1
        });
        $(video).css({
          'opacity': 0.10
        });
      } else {
        $(".front-start__content").css({
          'opacity': 0
        });
        $('.front-start').css({
          'pointer-events': 'none'
        });
        $(video).css({
          'opacity': '1',
          'transition': 'opacity 0.3s ease-in'
        });

        if (!preloading) {
          // $('body').removeClass('animate')
          $('.front-start__circles').css({
            'opacity': 0
          });
        }
      }
    }).on('leave', function (event) {
      $('.video-cursor').fadeOut();
    }).addTo(controller);
    var swiperBlog = new Swiper('.blog-swiper', {
      slidesPerView: 'auto',
      centeredSlides: false,
      freeMode: true,
      mousewheel: false,
      speed: 600
    }); // ANCHOR Menu button curved words
    // ==============================================

    $('.video-cursor').css({
      'display': 'none',
      'visibility': 'visible'
    });

    var setCircledLetters = function setCircledLetters(text, circle) {
      var letters = text,
          lettersArr = letters.split('');
      circle.html('');
      lettersArr.forEach(function (letter) {
        circle.append("<div class='item'><span>".concat(letter, "</span></div>"));
      });
      var $circleItems = circle.find('.item');
      $circleItems.each(function (index, letter) {
        $(letter).css({
          'left': circle.width() / 2 - $(letter).width() / 2,
          'transform': "rotate(".concat(225 + index * 360 / $circleItems.length, "deg)"),
          'transform-origin': "50% " + circle.width() / 2 + "px"
        });
      });
    };

    setCircledLetters($('.video-cursor__inner').data('letters'), $('.video-cursor__inner'));
    $(window).resize(function () {
      return setCircledLetters($('.video-cursor__inner').data('letters'), $('.video-cursor__inner'));
    });
    var rotationVal = 0;
    var rotationInterval,
        rotating = false;

    function rotationAnimation() {
      rotating = true;
      gsap.to('.video-cursor__inner', {
        rotate: rotationVal += 120
      });
    }

    function stopRotationInterval() {
      rotating = false;
      clearInterval(rotationInterval);
    }

    video.addEventListener('mouseenter', function (e) {
      $('.video-cursor').fadeIn();
      rotationAnimation();
      rotationInterval = setInterval(rotationAnimation, 2000);
    });
    video.addEventListener('mouseleave', function (e) {
      $('.video-cursor').fadeOut();
      stopRotationInterval();
    });
  } else {// invertHeader()
  }

  function afterInitHorizontal() {
    var servicesScene = new ScrollMagic.Scene({
      triggerElement: '.two-screens_services',
      triggerHook: 0.4,
      reverse: true,
      duration: $('.services').outerHeight()
    }).on('progress', function (event) {
      // console.log(event)
      $('.services__star_orange').css({
        'transform': "rotate(".concat(event.progress * 1.5 * 360, "deg)")
      });
    }).on('enter', function (event) {
      $('.services').addClass('animation');
    }).on('leave', function () {
      console.log('leave');
    }) // .addIndicators()
    .addTo(controller); // invertHeader()
  }

  var casesScene = new ScrollMagic.Scene({
    triggerElement: '.cases__absolute',
    triggerHook: 0.5,
    reverse: true,
    duration: $('.cases').outerHeight() * 0.5
  }).on('enter', function (event) {
    $('.cases__absolute').css({
      'z-index': 5
    });
  }).on('progress', function (event) {
    // console.log(event.progress)
    // let leftKef = event.progress > 0.5 ? (1 - event.progress) * 0.5 : event.progress * 0.5
    var rightKef = event.progress > 0.5 ? (1 - event.progress) * 0.5 : event.progress * 0.5;
    var right = (1 - event.progress - rightKef) * 100;
    var left = (1 - event.progress) * 100;
    left = left > 0 ? left : 0;
    right = right > 0 ? right : 0;

    if (desktop.matches || desktop_pc.matches) {
      if (event.progress > 0.5) {
        $('.cases, .cases__title').css({
          'opacity': (event.progress - 0.5) * 2
        });
      } else {
        $('.cases, .cases__title').css({
          'opacity': 0
        });
      }
    }

    $('.cases__star').css({
      'transform': "rotate(".concat(event.progress * 1.5 * 360, "deg)")
    });
    $('.services').css({
      'clip-path': "polygon(0 0, 100% 0, 100% ".concat(right, "%, 0 ").concat(left, "%)"),
      '-webkit-clip-path': "polygon(0 0, 100% 0, 100% ".concat(right, "%, 0 ").concat(left, "%)")
    });
  }).on('leave', function (event) {
    $('.cases__absolute').css({
      'z-index': 15
    });
  }) // .addIndicators()
  .addTo(controller); // ==================== slider horizontal scroll Services section ==================== 

  gsap.registerPlugin(ScrollTrigger);
  var container = document.querySelector(".horizontal-container");
  var speedRatio = 0.8;

  function afterSubmitHelp() {
    ScrollTrigger.matchMedia({
      // desktop
      "(min-width: 1023px) and (max-width: 1439px)": function minWidth1024pxAndMaxWidth1439px() {
        var params = {
          scrollString: {
            start: '0',
            end: '0'
          },
          scrollCircle: {
            start: '0',
            end: '0'
          }
        };
        horizontalScroll(params);
      },
      "(min-width: 1440px)": function minWidth1440px() {
        var params = {
          scrollString: {
            start: '200',
            end: '0'
          },
          scrollCircle: {
            start: '200',
            end: '0'
          }
        };
        horizontalScroll(params);
      }
    });

    var params = {
      scrollString: {
        start: '200',
        end: '0'
      },
      scrollCircle: {
        start: '200',
        end: '0'
      }
    };
    horizontalScroll(params);
  }

  var kefHeight;

  function horizontalScroll(params) {
    var tl = gsap.timeline();
    tl.to(container, {
      x: function x() {
        return -(container.scrollWidth - document.documentElement.clientWidth) + "px";
      },
      ease: "none",
      scrollTrigger: {
        trigger: $('.cases'),
        start: params.start,
        invalidateOnRefresh: true,
        pin: true,
        scrub: true,
        onRefresh: function onRefresh(_ref) {
          var progress = _ref.progress,
              direction = _ref.direction,
              isActive = _ref.isActive;
          // console.log('onRefresh fire')
          // console.log(isActive)
          // console.log(progress, direction, isActive)
          $('.two-screens_services').height($('.pin-spacer').outerHeight() + $('.services').outerHeight());
          afterInitHorizontal();
        },
        onEnter: function onEnter(_ref2) {
          var progress = _ref2.progress,
              direction = _ref2.direction,
              isActive = _ref2.isActive;
          console.log('onenter');
          $('.cases').addClass('animation');
        },
        onUpdate: function onUpdate(_ref3) {
          var progress = _ref3.progress,
              direction = _ref3.direction,
              isActive = _ref3.isActive;
        },
        onLeaveBack: function onLeaveBack(_ref4) {
          var progress = _ref4.progress,
              direction = _ref4.direction,
              isActive = _ref4.isActive;
          console.log('onLeaveBack');
          $('.cases').removeClass('animation');
        },
        onLeave: function onLeave(_ref5) {
          var progress = _ref5.progress,
              direction = _ref5.direction,
              isActive = _ref5.isActive;
        },
        end: function end() {
          var allWidth = $('.horizontal-block').map(function (index, el) {
            return el.offsetWidth;
          });
          var allWidthVal = allWidth.toArray().reduce(function (previous, next) {
            return previous + next;
          });
          kefHeight = Number.parseInt(allWidthVal);
          return allWidthVal * speedRatio;
        }
      }
    });
    console.log($('.cases__info').innerWidth());
    var containerPadd = 0;
    // let containerPadd = parseInt($(".horizontal-container").css('padding-left'))

    var casesAll = ($('.cases-dual').get(0).offsetLeft + containerPadd - window.innerWidth - $('.cases__all').outerWidth()) * $('.pin-spacer').outerHeight() / kefHeight;
    var marginBottomString = ($('.cases-dual').get(0).offsetLeft + containerPadd - window.innerWidth) * $('.pin-spacer').outerHeight() / kefHeight;
    var marginTopCircles = ($('.cases-dual').get(0).offsetLeft + containerPadd - window.innerWidth + $('.cases-dual__title_main').outerWidth()) * $('.pin-spacer').outerHeight() / kefHeight;
    var marginBottomCircles = ($('.cases-dual').get(0).offsetLeft + containerPadd - window.innerWidth + $('.cases-dual__title_main').outerWidth() + $('.cases-dual__circles_1').outerWidth() + $('.cases-dual__title_pc').outerWidth()) * $('.pin-spacer').outerHeight() / kefHeight;
    var marginStrings = ($('.cases-dual').get(0).offsetLeft + containerPadd - window.innerWidth + $('.cases-dual__circle').outerWidth() + $('.cases-dual__text_4').get(0).offsetLeft) * $('.pin-spacer').outerHeight() / kefHeight;
    var marginImg = ($('.cases-dual').get(0).offsetLeft + containerPadd - window.innerWidth + $('.cases-dual__circle').outerWidth() + $('.cases-dual__text_4').get(0).offsetLeft + $('.cases-dual__text_4').outerWidth()) * $('.pin-spacer').outerHeight() / kefHeight;
    $('.cases__title').each(function (index, item) {
      gsap.to(item, {
        left: -250,
        scrollTrigger: {
          trigger: ".horizontal-container",
          start: "bottom bottom-=" + index * 50,
          end: "bottom center-=" + index * 50,
          scrub: true,
          markers: false,
          id: "cases-titles" + index
        }
      });
    });
    gsap.to('.cases__text', {
      right: 250,
      scrollTrigger: {
        trigger: ".horizontal-container",
        start: "bottom bottom",
        end: "bottom center",
        scrub: true,
        markers: false,
        id: "cases-text"
      }
    });
    gsap.to(".cases__all", {
      startAt: {
        scaleX: 0.5,
        scaleY: 0.5,
        x: 200
      },
      scaleX: 1,
      scaleY: 1,
      x: 0,
      scrollTrigger: {
        trigger: ".horizontal-container",
        start: "bottom+=" + casesAll + " bottom-=" + "50",
        end: "bottom+=" + casesAll + " bottom-=" + "250",
        scrub: true,
        markers: false,
        id: "cases-all"
      }
    });
    gsap.to(".cases-dual__circle", {
      startAt: {
        rotation: 360,
        x: 400
      },
      rotation: 0,
      x: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-container",
        start: "bottom+=" + marginBottomString + " bottom-=" + params.scrollCircle.start,
        end: "bottom+=" + marginBottomString + " top+=" + params.scrollCircle.end,
        scrub: true,
        markers: false,
        id: "circle"
      }
    });
    gsap.to(".cases-dual__texts", {
      startAt: {
        x: 400
      },
      x: 0,
      ease: Power1.easeIn,
      scrollTrigger: {
        trigger: ".horizontal-container",
        start: "bottom+=" + marginBottomString + " bottom-=" + params.scrollString.start,
        end: "bottom+=" + marginBottomString + " top+=" + params.scrollString.end,
        scrub: true,
        markers: false,
        id: "string",
        onLeave: function onLeave(_ref6) {
          var progress = _ref6.progress,
              direction = _ref6.direction,
              isActive = _ref6.isActive;
          console.log(progress);
        }
      }
    });
    gsap.to(".cases-dual__circles_1 .cases-dual__circle-inner", {
      startAt: {
        rotation: 360
      },
      rotation: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-container",
        start: "bottom+=" + marginTopCircles + " bottom-=" + "0",
        end: "bottom+=" + marginTopCircles + " center+=" + "0",
        scrub: true,
        markers: false,
        id: "circles1"
      }
    });
    gsap.to(".cases-dual__circles_2 .cases-dual__circle-inner", {
      startAt: {
        rotation: 360
      },
      rotation: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-container",
        start: "bottom+=" + marginBottomCircles + " bottom+=" + "100",
        end: "bottom+=" + marginBottomCircles + " center+=" + "100",
        scrub: true,
        markers: false,
        id: "circles2"
        // toggleClass: {targets: sct, className: "active"}

      }
    });
    gsap.to(".cases-dual__text-img", {
      startAt: {
        top: 'calc(100% + 30vh)',
        right: '50%'
      },
      top: 0,
      right: 0,
      y: '-130vh',
      rotation: 16,
      ease: "none",
      scrollTrigger: {
        trigger: ".horizontal-container",
        start: "bottom+=" + marginImg + " bottom+=" + "200",
        end: "bottom+=" + marginImg + " center+=" + "0",
        scrub: true,
        markers: false,
        id: "image" // toggleClass: {targets: sct, className: "active"}

      }
    });
    gsap.to(".cases-dual__texts, .cases-dual__circle", {
      left: -500,
      ease: Back.easeIn.config(1.4),
      scrollTrigger: {
        trigger: ".horizontal-container",
        start: "bottom+=" + marginStrings + " bottom-=" + "0",
        end: "bottom+=" + marginStrings + " top+=" + "0",
        scrub: true,
        markers: false,
        id: "string-bottom"
      }
    });
    gsap.to(".cases-dual__title_main, .cases-dual__title_pc, .cases-dual__link-container, .cases-dual__circle-inner", {
      left: -500,
      ease: Back.easeOut.config(1.4),
      scrollTrigger: {
        trigger: ".horizontal-container",
        start: "bottom+=" + marginStrings + " bottom-=" + "0",
        end: "bottom+=" + marginStrings + " top+=" + "0",
        scrub: true,
        markers: false,
        id: "string-top"
      }
    });
    // $('.two-screens_clients').height($('.clients').outerHeight() + $('.blog').outerHeight())
    // $('.blog').css({
    //   'top' : $('.clients').outerHeight() + 'px',
    // })
    // THIS IS THE KEY! Return a function that'll get called when the breakpoint no longer matches so we can kill() the animation (or whatever)

    return function () {
      tl.kill();
    };
  }

  var clientsTitles = [{
    x: -20,
    y: -110,
    rotation: 6
  }, {
    x: 0,
    y: -170,
    rotation: -12
  }, {
    x: 0,
    y: -105,
    rotation: 13
  }];

  if (desktop_pc.matches) {
    clientsTitles[2].y = -110;
  }

  var clientsScene = new ScrollMagic.Scene({
    triggerElement: '.clients',
    triggerHook: 0.3,
    duration: $('.clients').height() * 0.5
  }).on('enter', function (event) {
    $('.clients').addClass('animation');

    if (event.scrollDirection == 'FORWARD' && (desktop.matches || desktop_pc.matches)) {
      $('.clients__title span').each(function (index, item) {
        gsap.to($(item), {
          startAt: {
            x: 0,
            y: 0,
            rotation: 0
          }
        });
      });
      gsap.to(".clients__list-container", {
        startAt: {
          y: -50
        }
      });
    }
  }).on('progress', function (event) {
    console.log(event.progress);

    if (desktop.matches || desktop_pc.matches) {
      if (event.progress <= 0.25) {
        var progress = event.progress * 4;
        gsap.to('.clients__title', {
          y: -200 + 200 * progress
        });
      }

      if (event.progress > 0.25) {
        $('.clients').addClass('animation-next');
      } else {
        $('.clients').removeClass('animation-next');
      }

      if (event.progress >= 0.25 && event.progress <= 0.5) {
        var _progress = (event.progress - 0.25) * 4;

        $('.clients__title span').each(function (index, item) {
          gsap.to($(item), {
            x: _progress * clientsTitles[index].x,
            y: _progress * clientsTitles[index].y,
            rotation: _progress <= 0.5 ? _progress * clientsTitles[index].rotation * 2 : clientsTitles[index].rotation
          });
        });
        gsap.to(".clients__list-container", {
          y: -50 - 100 * _progress
        });
        gsap.to(".clients__item_1", {
          y: 20 - 40 * _progress
        });
        gsap.to(".clients__item_2", {
          y: 40 - 60 * _progress
        });
        gsap.to(".clients__item_3", {
          y: 40 - 80 * _progress
        });
        gsap.to(".clients__item_4", {
          y: 40 - 60 * _progress
        });
        gsap.to(".clients__item_5", {
          y: 20 - 40 * _progress
        });
        gsap.to(".clients__item_9", {
          y: 40 - 60 * _progress
        });
      } else {}
    }

    $('.clients__star_orange1').css({
      'transform': "rotate(".concat(event.progress * 2 * 360, "deg)")
    });
  }).on('leave', function (event) {
    console.log(event);

    if (event.scrollDirection == 'REVERSE') {
      $('.clients').removeClass('animation');
    }
  }) // .addIndicators()
  .addTo(controller);
  gsap.to(".blog__star, .blog__title-star", {
    rotation: 2160,
    ease: 'none',
    scrollTrigger: {
      trigger: ".blog",
      start: "top bottom-=" + "0",
      end: "bottom top+=" + "0",
      scrub: true,
      markers: false,
      id: "blogStar"
    }
  });
  var blogScene = new ScrollMagic.Scene({
    triggerElement: '.blog',
    triggerHook: 1,
    reverse: true,
    duration: $('.blog').height()
  }).on('enter', function (event) {}).on('progress', function (event) {
    if (desktop.matches || desktop_pc.matches) {
      $('.clients__star_black1').css({
        'transform': " matrix(".concat(-event.progress * 90 - 0.95, ", ").concat(event.progress * 100 + 0.33, ", ").concat(event.progress * 100 + 0.33, ", ").concat(event.progress * 90 + 0.95, ", 0, 0)"),
        'z-index': Math.round(event.progress * 100)
      });
    } // console.log(event.progress)


    if (event.scrollDirection == "FORWARD" && event.progress > 0.7) {
      $('.blog').addClass('animation');
    } else {
      $('.blog').removeClass('animation');
    }
  }).on('leave', function (event) {
    $('.clients__star_black1').css({
      'transform': "matrix(-0.95, 0.33, 0.33, 0.95, 0, 0)",
      'z-index': 5
    });
  }) // .addIndicators()
  .addTo(controller);
  var contactScene = new ScrollMagic.Scene({
    triggerElement: '.contact',
    triggerHook: 0.7,
    reverse: true,
    duration: $('.contact').outerHeight()
  }).on('enter', function (event) {
    gsap.to(".blog", {
      startAt: {
        "clip-path": "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        "-webkit-clip-path": "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
      }
    });
    $('.contact').addClass('animation');
  }).on('progress', function (event) {
    // console.log(event.progress)
    var rightKef = event.progress > 0.5 ? (1 - event.progress) * 0.5 : event.progress * 0.5;
    var right = (1 - event.progress - rightKef) * 100;
    var left = (1 - event.progress) * 100;
    left = left > 0 ? left : 0;
    right = right > 0 ? right : 0; // console.log(left + ' ' + right)
    // $('.blog').css({
    //   'clip-path' : `polygon(0 0, 100% 0, 100% ${right}%, 0 ${left}%)`
    // })

    gsap.to(".blog", {
      "clip-path": "polygon(0 0, 100% 0, 100% ".concat(right, "%, 0 ").concat(left, "%)"),
      "-webkit-clip-path": "polygon(0 0, 100% 0, 100% ".concat(right, "%, 0 ").concat(left, "%)")
    });
    $('.contact__star').css({
      'transform': "rotate(".concat(event.progress * 3 * 360, "deg)")
    });
  }).on('leave', function (event) {
    if (event.scrollDirection == 'REVERSE') {
      $('.contact').removeClass('animation');
    }
  }).addTo(controller);

  function isElementInViewport(el) {
    // Special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
      el = el[0];
    }

    var rect = el.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    /* or $(window).height() */
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    /* or $(window).width() */
    ;
  } // footer 


  var footerScene = new ScrollMagic.Scene({
    triggerElement: '.footer',
    triggerHook: 0.9,
    duration: $('.footer').height()
  }).on('enter', function (event) {
    $('.footer').addClass('animation');
  }).addTo(controller); // $('.clients__item a').click(function (e) {
  //   e.preventDefault();
  // })
});
$(function () {
  if (mobile.matches) {
    $('.header__language > button').on('click', function () {
      if ($('body').hasClass('menu-open')) {
        return false;
      }

      $(this).toggleClass('active');
    });
    $('.header__burger').on('click', function () {
      $('.header__language > button').removeClass('active');
    });
  }

  $('.header__menu-list li a').on('click', function () {
    if ($('body').hasClass('menu-open')) {
      $('body').removeClass('menu-open');
    }
  }); // $(".header__language").hover(
  //   function () {
  //     if ($('body').hasClass('menu-open')) {
  //       return false
  //     }
  //     $(this).toggleClass('active');
  //   }, function () {
  //     $('.header__language').removeClass('active');
  //   }
  // );
  // ANCHOR VARIABLES
  // ==============================================  

  var ST = $(window).scrollTop(),
      isDesk = $('body').hasClass('desktop'),
      isIE = $('body').hasClass('isIe'),
      menuOpen = false,
      controller = new ScrollMagic.Controller(); // ANCHOR HEADER SCROLL LISTENER
  // ==============================================  

  var st = $(window).scrollTop(),
      prevSt = st;
  window.st = st; // hide header if page was alredy scrolled after loading

  if (mobile.matches && $(document).scrollTop() > 200) {
    $("header").addClass("header--scrolled");
  } else if ($(document).scrollTop() > 800) {
    $("header").addClass("header--scrolled");
  }

  $(document).scroll(function () {
    st = $(window).scrollTop();
    window.st = st;

    if (!window.autoscrolling) {
      // check if scroll not happening during anchor scrolling
      if (st < prevSt && prevSt - st < 500) {
        // scroll UP
        $('header').removeClass("header--hide");
      } else {
        // scroll DOWN
        if (st > $('header').height()) {
          $('header').addClass("header--hide");
        }
      }
    } else {
      $('header').addClass("header--hide");
    }

    if (mobile.matches) {
      if (window.scrollY > 200) {
        $('header').addClass("header--scrolled");
      } else {
        $('header').removeClass("header--scrolled");
      }
    } else {
      if (window.scrollY > 800) {
        $('header').addClass("header--scrolled");
      } else {
        $('header').removeClass("header--scrolled");
      }
    }

    prevSt = st;
  });
});
$(document).ready(function () {
  $('.contact__form input[type="file"]').change(function (event) {
    if (this.files.length) {
      var file_size = this.files[0].size;
      var file_name = this.files[0].name;
      var fSExt = new Array('Bytes', 'KB', 'MB', 'GB'),
          i = 0;

      while (file_size > 900) {
        file_size /= 1024;
        i++;
      }

      var exactSize = Math.round(file_size * 100) / 100 + ' ' + fSExt[i];
      $(this).closest('.file-area').find('.file-name').text(file_name);
      $(this).closest('.file-area').find('.file-size').text(exactSize);
      $(this).closest('.file-area').addClass('active');
    } else {
      $(this).next('.file-dummy').removeClass('active');
    }
  });
  $('.contact__form .file-reset').on('click', function () {
    $(".contact__form input[type='file']").val('');
    $('.contact__form .file-area').removeClass('active');
  });
});