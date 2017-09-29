"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function (root, fabric, $) {
  'use strict';

  $(root).resize(function () {
    var WH = $(root).height();
    var t = 548;
    t > WH ? $(".header").height(t) : $(".header").height(WH);
  });
  $(root).trigger('resize');
  if (!root.Promise._immediateFn) {
    root.Promise._immediateFn = setAsap;
  }
  var CONSTANTS = {
    canvasWidth: 1500,
    canvasHeight: 740
  };

  var acceptedFileTypes = ["image/jpeg", "image/png"],
      $addPhotoOnly = $('#addPhotoOnly'),
      $moreOptions = $('#moreOptions'),
      $saveLink = $('#saveLink'),
      $saveLinkBtn = $('#saveLinkBtn'),
      $startOver = $('#startOver'),
      $addPhoto = $('#add-photo'),
      $shareBtn = $('#shareBtn'),
      $fileInput = $("#file-input"),
      $shareModal = $("#share-modal"),
      $slider = $("#slider"),
      $tool = $("#tools span"),
      $zoomTool = $("#zoom-tool"),
      $brightnessTool = $("#brightness-tool"),
      $contrastTool = $("#contrast-tool"),
      $loading = $('#loading span'),
      $modalTrailer = $('#modal-trailer'),
      canvas = new fabric.Canvas('image-canvas', {
    width: CONSTANTS.canvasWidth,
    height: CONSTANTS.canvasHeight,
    selection: false,
    allowTouchScrolling: true,
    evented: false
  }),
      formation433 = {
    lf: {
      top: 100,
      left: 490,
      shirtNumber: 4,
      name: "Obafemi Awolowo",
      path: "./assets/images/Awolowo.png"
    },
    cf: {
      top: 70,
      left: CONSTANTS.canvasWidth / 2.28 + 90,
      shirtNumber: 4,
      name: "Nnamdi Azikwe",
      path: "./assets/images/Azikwe.png"
    },
    rf: {
      top: 100,
      left: CONSTANTS.canvasWidth / 1.14 - 310,
      shirtNumber: 4,
      name: "Tafewa Balewa",
      path: "./assets/images/Balewa.png"
    },
    lm: {
      top: CONSTANTS.canvasHeight / 3 + 40,
      left: 490,
      shirtNumber: 4,
      name: "Odumegwu Ojukwu",
      path: "./assets/images/Ojukwu.png"
    },
    cm: {
      top: CONSTANTS.canvasHeight / 3 + 70,
      left: CONSTANTS.canvasWidth / 2.28 + 90,
      shirtNumber: 4,
      name: "Murtala Mohammed",
      path: "./assets/images/Murtala.png"
    },
    rm: {
      top: CONSTANTS.canvasHeight / 3 + 40,
      left: CONSTANTS.canvasWidth / 1.14 - 310,
      shirtNumber: 4,
      name: "Dora Akunyili",
      path: "./assets/images/Akunyili.png"
    },
    lb: {
      top: CONSTANTS.canvasHeight / 3 * 2 - 30,
      left: 290,
      shirtNumber: 4,
      name: "Fela Kuti",
      path: "./assets/images/Kuti.png"
    },
    lcb: {
      top: CONSTANTS.canvasHeight / 3 * 2 - 10,
      left: CONSTANTS.canvasWidth / 3.42 + 170,
      shirtNumber: 4,
      name: "Gani Fawehinmi",
      path: "./assets/images/Wiwa.png"
    },
    rcb: {
      top: CONSTANTS.canvasHeight / 3 * 2 - 10,
      left: CONSTANTS.canvasWidth / 3.42 * 2 + 10,
      shirtNumber: 4,
      name: "Dr. Stella Adadevoh",
      path: "./assets/images/Wiwa.png"
    },
    rb: {
      top: CONSTANTS.canvasHeight / 3 * 2 - 30,
      left: CONSTANTS.canvasWidth / 3.42 * 3 - 110,
      shirtNumber: 4,
      name: "Ken Saro Wiwa",
      path: "./assets/images/Wiwa.png"
    },
    gk: {
      top: CONSTANTS.canvasHeight - 150,
      left: CONSTANTS.canvasWidth / 2.28 + 90,
      shirtNumber: 4,
      name: "Herbert Macauly",
      path: "./assets/images/Macauly.png"
    }
  },
      getAdjustedScale = function getAdjustedScale(noOfChars) {
    return (noOfChars * 2 - 6) / 3;
  },
      convertCanvasToImage = function convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL("image/png");
    return image;
  },
      saveAsCanvas = function saveAsCanvas(canvas) {
    if (saveAs !== undefined) {
      canvas.toBlobHD(function (blob) {
        saveAs(blob, "whatlieswithin.png");
      }, "image/png");
    }
  },
      editFontSize = function editFontSize(parent, iText, size) {
    if (size > 0) iText.scaleRatio = size;
    iText.scaleToHeight(parent.height / size);
  },
      addClipArt = function addClipArt(parent, clipArtObj, iText, textScaleRatio) {
    // clipArtObj.scaleToHeight(parent.height);
    clipArtObj.scaleToWidth(parent.width);
    editFontSize(parent, iText, textScaleRatio);
    parent.add(clipArtObj);
    parent.add(iText);
  },
      renderImage = function renderImage(canvas, img) {
    var clipArtObj = canvas.getObjects('path-group')[0];
    var textboxObj = canvas.getObjects('textbox')[0];
    var inputText = textboxObj.getText();
    var scaleRatio = textboxObj.scaleRatio;
    var textObj = new fabric.Text(inputText, {
      left: -13,
      top: 275,
      fontFamily: "Futura-Medium",
      fontStyle: "italic",
      textAlign: "center",
      fill: "#fff",
      originX: "center",
      originY: "center",
      evented: false,
      hasControls: false,
      hasRotatingPoint: false,
      hasBorders: false
    });
    var imageObj = new fabric.Image(img, {
      hasRotatingPoint: false,
      hasControls: false,
      hasBorders: false,
      originX: "center",
      originY: "center",
      left: CONSTANTS.canvasWidth / 2,
      top: CONSTANTS.canvasHeight / 2
    });
    imageObj.on('mouseup', function (e) {
      rePositionImage(canvas, this);
    });
    var groupObj = new fabric.Group([], {
      hasControls: false,
      hasRotatingPoint: false,
      hasBorders: false,
      selectable: false,
      evented: false,
      width: 846,
      height: 846,
      originX: "center",
      originY: "center",
      left: CONSTANTS.canvasWidth / 2,
      top: CONSTANTS.canvasHeight / 2
    });

    canvas.clear();
    canvas.defaultCursor = "default";
    canvas.add(imageObj);
    if (imageObj.width <= imageObj.height) {
      imageObj.scaleToWidth(CONSTANTS.canvasWidth);
    } else if (imageObj.width > imageObj.height) {
      imageObj.scaleToHeight(CONSTANTS.canvasHeight);
    }
    imageObj.newScaleX = imageObj.scaleX;
    imageObj.newScaleY = imageObj.scaleY;
    imageObj.filters.push(new fabric.Image.filters.Contrast({
      contrast: 0
    }));
    imageObj.filters.push(new fabric.Image.filters.Brightness({
      brightness: 0
    }));
    imageObj.applyFilters(canvas.renderAll.bind(canvas));

    canvas.add(groupObj);
    addClipArt(groupObj, clipArtObj, textObj, scaleRatio);
    clipArtObj.setLeft(0);
    clipArtObj.setTop(0);
    canvas.sendToBack(imageObj);
    return new Promise(function (resolve) {
      resolve(true);
    });
  },
      animateScaleDown = function animateScaleDown(obj, scale) {
    obj.animate("scaleX", obj.scaleX * scale, {
      duration: 1000,
      onChange: canvas.renderAll.bind(canvas),
      ease: "easeOutSine"
    }).animate("scaleY", obj.scaleY * scale, {
      duration: 1000,
      onChange: canvas.renderAll.bind(canvas),
      ease: "easeOutSine"
    }).animate("top", obj.CONSTANTS.canvasHeight / 2 + 150, {
      duration: 1000,
      onChange: canvas.renderAll.bind(canvas),
      ease: "easeOutSine"
    });
    return true;
  },
      startUp = function startUp(canvas) {
    var renderPlayer = function renderPlayer(oTab, oPic, pos, canvas) {
      var oShirtNo = new fabric.Text("" + pos.shirtNumber, {
        fontFamily: "Futura-Medium",
        top: 123,
        left: -130,
        originX: "center",
        originY: "center",
        propName: "shirtNumber"
      });
      var oPlayerName = new fabric.Text(pos.name, {
        fontFamily: "Futura-Medium",
        top: 123,
        left: 25,
        fontSize: 26,
        fill: "white",
        originX: "center",
        originY: "center",
        propName: "name"
      });
      var groupObj = new fabric.Group([], _extends({
        hasControls: false,
        hasRotatingPoint: false,
        hasBorders: false,
        selectable: false,
        // evented: false,
        width: 300,
        height: 300,
        originX: "center",
        originY: "center"
      }, pos));
      canvas.on("mouse:down", function (e) {
        if (e.target === null) {
          return;
        }
        if (groupObj !== e.target) {
          // oTab.set("stroke", null);
          // oPic.set("stroke", null);
          return;
        }
        if (canvas.isPlayerSelected) {
          if (canvas.selectedGroup === e.target) {
            canvas.isPlayerSelected = false;
            oTab.set("stroke", null);
            var osPic = canvas.selectedGroup._objects.find(function (ele) {
              return ele.propName === "picture";
            });
            osPic.set("stroke", null);
            return;
          }
          var previousSelectedGroup = canvas.selectedGroup;
          var newSelectedGroup = e.target;

          var opsShirtNumber = previousSelectedGroup._objects.find(function (ele) {
            return ele.propName === "shirtNumber";
          });
          var opsName = previousSelectedGroup._objects.find(function (ele) {
            return ele.propName === "name";
          });
          var opsPic = previousSelectedGroup._objects.find(function (ele) {
            return ele.propName === "picture";
          });
          var opsTab = previousSelectedGroup._objects.find(function (ele) {
            return ele.propName === "tab";
          });

          var onsShirtNumber = newSelectedGroup._objects.find(function (ele) {
            return ele.propName === "shirtNumber";
          });
          var onsName = newSelectedGroup._objects.find(function (ele) {
            return ele.propName === "name";
          });
          var onsPic = newSelectedGroup._objects.find(function (ele) {
            return ele.propName === "picture";
          });
          var onsTab = newSelectedGroup._objects.find(function (ele) {
            return ele.propName === "tab";
          });

          canvas.isPlayerSelected = false;
          opsPic.set("stroke", null);
          onsPic.set("stroke", null);
          opsTab.set("stroke", null);
          onsTab.set("stroke", null);

          previousSelectedGroup.remove(opsShirtNumber, opsName, opsPic);
          newSelectedGroup.remove(onsShirtNumber, onsName, onsPic);
          previousSelectedGroup.add(onsShirtNumber, onsName, onsPic);
          newSelectedGroup.add(opsShirtNumber, opsName, opsPic);

          onsPic.sendToBack();
          opsPic.sendToBack();

          canvas.renderAll();
        } else {
          canvas.isPlayerSelected = true;
          oTab.set("stroke", "white");
          canvas.selectedGroup = e.target;
          var _osPic = canvas.selectedGroup._objects.find(function (ele) {
            return ele.propName === "picture";
          });
          _osPic.set("stroke", "white");
        }
        console.log(canvas.isPlayerSelected);
      });
      groupObj.scale(0.5).set("left", pos.left).set("top", pos.top);
      oTab.set("top", 120).set("strokeWidth", 10).set("originX", "center").set("originY", "center").set("propName", "tab");

      oPic.set("strokeWidth", 10).set("originX", "center").set("originY", "center").set("propName", "picture");
      canvas.getObjects("image")[0] && canvas.getObjects("image")[0].sendToBack();
      groupObj.add(oTab);
      groupObj.add(oPic);
      groupObj.add(oPlayerName);
      groupObj.add(oShirtNo);
      oPic.sendToBack();
      return groupObj;
    };
    canvas.clear();
    fabric.Image.fromURL('./assets/images/pitch.png', function (oImg) {
      oImg.scaleToWidth(CONSTANTS.canvasWidth);
      oImg.set("hasControls", false);
      oImg.set("hasRotatingPoint", false);
      oImg.set("hasBorders", false);
      oImg.set("selectable", false);
      oImg.set("evented", false);
      canvas.add(oImg);
      oImg.sendToBack();
      canvas.renderAll();
    });
    fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
      fabric.Image.fromURL(formation433.lf.path, function (oPic) {
        canvas.add(renderPlayer(oTab, oPic, formation433.lf, canvas));
        canvas.renderAll();
      });
    });
    fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
      fabric.Image.fromURL(formation433.cf.path, function (oPic) {
        canvas.add(renderPlayer(oTab, oPic, formation433.cf, canvas));
        canvas.renderAll();
      });
    });
    fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
      fabric.Image.fromURL(formation433.rf.path, function (oPic) {
        canvas.add(renderPlayer(oTab, oPic, formation433.rf, canvas));
        canvas.renderAll();
      });
    });
    fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
      fabric.Image.fromURL(formation433.lm.path, function (oPic) {
        canvas.add(renderPlayer(oTab, oPic, formation433.lm, canvas));
        canvas.renderAll();
      });
    });
    fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
      fabric.Image.fromURL(formation433.cm.path, function (oPic) {
        canvas.add(renderPlayer(oTab, oPic, formation433.cm, canvas));
        canvas.renderAll();
      });
    });
    fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
      fabric.Image.fromURL(formation433.rm.path, function (oPic) {
        canvas.add(renderPlayer(oTab, oPic, formation433.rm, canvas));
        canvas.renderAll();
      });
    });
    fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
      fabric.Image.fromURL(formation433.lb.path, function (oPic) {
        canvas.add(renderPlayer(oTab, oPic, formation433.lb, canvas));
        canvas.renderAll();
      });
    });
    fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
      fabric.Image.fromURL(formation433.lcb.path, function (oPic) {
        canvas.add(renderPlayer(oTab, oPic, formation433.lcb, canvas));
        canvas.renderAll();
      });
    });
    fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
      fabric.Image.fromURL(formation433.rcb.path, function (oPic) {
        canvas.add(renderPlayer(oTab, oPic, formation433.rcb, canvas));
        canvas.renderAll();
      });
    });
    fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
      fabric.Image.fromURL(formation433.rb.path, function (oPic) {
        canvas.add(renderPlayer(oTab, oPic, formation433.rb, canvas));
        canvas.renderAll();
      });
    });
    fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
      fabric.Image.fromURL(formation433.gk.path, function (oPic) {
        canvas.add(renderPlayer(oTab, oPic, formation433.gk, canvas));
        canvas.renderAll();
      });
    });
  },
      filter = function filter(imageObj, index, prop, value) {
    if (value === undefined) {
      return imageObj.filters[index][prop];
    }
    if (imageObj.filters[index]) {
      imageObj.filters[index][prop] = value;
      imageObj.applyFilters(canvas.renderAll.bind(canvas));
    }
  },
      zoomToolHandler = function zoomToolHandler() {
    var imageObj = canvas.item(0);
    var value = $slider.slider('value');
    imageObj.setScaleX(imageObj.newScaleX * value);
    imageObj.setScaleY(imageObj.newScaleY * value);
    imageObj.setCoords();
    rePositionImage(canvas, imageObj);
    canvas.renderAll();
  },
      contrastToolHandler = function contrastToolHandler() {
    filter(canvas.item(0), 0, 'contrast', $slider.slider('value'));
  },
      brightnessToolHandler = function brightnessToolHandler() {
    filter(canvas.item(0), 1, 'brightness', $slider.slider('value'));
  },
      rePositionImage = function rePositionImage(canvas, imageObj) {
    var tlX = imageObj.aCoords.tl.x;
    var tlY = imageObj.aCoords.tl.y;
    var brX = imageObj.aCoords.br.x;
    var brY = imageObj.aCoords.br.y;
    var canvasWidth = CONSTANTS.canvasWidth;
    var canvasHeight = CONSTANTS.canvasHeight;
    var currentWidth = imageObj.width * imageObj.scaleX;
    var currentHeight = imageObj.height * imageObj.scaleY;
    if (tlX >= 0) {
      imageObj.setLeft(currentWidth / 2);
    }
    if (tlY >= 0) {
      imageObj.setTop(currentHeight / 2);
    }
    if (brX <= canvasWidth) {
      imageObj.setLeft(canvasWidth - currentWidth / 2);
    }
    if (brY <= canvasHeight) {
      imageObj.setTop(canvasHeight - currentHeight / 2);
    }
    imageObj.setCoords();
  },
      activateButtonOnText = function activateButtonOnText($el, text) {
    if (text === "") $el.find('button').attr('disabled', 'true');else {
      $el.find('button').removeAttr('disabled');
    }
  };
  fabric.Textbox.prototype.insertNewline = function (_super) {
    return function () {};
  }(fabric.Textbox.prototype.insertNewline);
  fabric.Textbox.prototype.initHiddenTextarea = function (_super) {
    return function () {
      _super.call(this);
      $(this.hiddenTextarea).attr('maxLength', maxchars);
      $(this.hiddenTextarea).attr('autocomplete', 'off');
      $(this.hiddenTextarea).attr('autocorrect', 'off');
      $(this.hiddenTextarea).attr('spellcheck', false);
    };
  }(fabric.Textbox.prototype.initHiddenTextarea);
  fabric.Textbox.prototype.onInput = function (_super) {
    return function (e) {
      while (this.text.length > this.hiddenTextarea.value.length) {
        this.removeChars(e);
      }
      _super.call(this, e);
    };
  }(fabric.Textbox.prototype.onInput);
  startUp(canvas);
  canvas.on('mouse:down', function (e) {
    canvas.forEachObject(function (obj) {
      if (obj.type !== "image") {
        canvas.setActiveObject(obj);
      }
    });
  });
  $(document).ready(function () {
    $("a").on('click', function (event) {
      if (this.hash !== "") {
        event.preventDefault();
        var hash = this.hash;
        $('html, body').animate({
          scrollTop: $(hash).offset().top
        }, 700, function () {
          window.location.hash = hash;
        });
      }
    });
  });
  $fileInput.click(function () {
    this.value = "";
  });
  $fileInput.change(function () {
    $loading.css('z-index', '2');
    $loading.show();
    if (!this.files[0]) {
      console.error("No image selected");
      $loading.css('z-index', '0');
      $loading.hide();
      return;
    }
    if (acceptedFileTypes.indexOf(this.files[0].type) < 0) {
      $loading.css('z-index', '0');
      $loading.hide();
      return;
    }
    var u = URL.createObjectURL(this.files[0]);
    var img = new Image();
    img.src = u;
    img.onload = function () {
      renderImage(canvas, img).then(function (done) {
        $loading.css('z-index', '0');
        $loading.hide();
        $addPhotoOnly.hide();
        $moreOptions.show();
        $contrastTool.css('color', lucozadeRed).click();
        animateScaleDown(canvas.item(1), 0.5);
      });
    };
  });
  $saveLinkBtn.click(function (e) {
    saveAsCanvas(canvas.getElement());
  });
  $startOver.click(function (e) {
    startUp(canvas);
    $moreOptions.hide();
  });
  $(document).on("click", "#add-photo", function (e) {
    $('#file-input').click();
  });
  $shareBtn.click(function (e) {
    e.preventDefault();
    $shareModal.iziModal('open');
  });
  $shareModal.iziModal({
    title: "Share",
    icon: 'fa fa-share-alt',
    headerColor: '#000',
    autoOpen: false,
    closeButton: true
  });
  $modalTrailer.iziModal({
    headerColor: '#000',
    title: 'Video Sample',
    overlayClose: true,
    iframe: true,
    iframeURL: 'https://www.youtube.com/embed/V_U6czbDHLE',
    fullscreen: true,
    openFullscreen: false,
    borderBottom: false
  });
  $(document).on('click', '.trigger-trailer', function (event) {
    event.preventDefault();
    $modalTrailer.iziModal('open', event);
  });
  $slider.slider({
    orientation: "horizontal"
  });
  $tool.click(function (e) {
    $tool.css('color', defaultColor);
    $(e.target).css('color', lucozadeRed);
  });
  $zoomTool.click(function (e) {
    $slider.slider('option', 'min', 1);
    $slider.slider('option', 'max', 5);
    $slider.slider('option', 'step', 0.1);
    $slider.slider('option', 'change', zoomToolHandler);
    $slider.slider('option', 'value', Math.round(canvas.item(0).scaleX / canvas.item(0).newScaleX * 10) / 10);
  });
  $contrastTool.click(function (e) {
    $slider.slider('option', 'min', -200);
    $slider.slider('option', 'max', 200);
    $slider.slider('option', 'step', 10);
    $slider.slider('option', 'change', contrastToolHandler);
    $slider.slider('option', 'value', filter(canvas.item(0), 0, 'contrast'));
  });
  $brightnessTool.click(function (e) {
    $slider.slider('option', 'min', -200);
    $slider.slider('option', 'max', 200);
    $slider.slider('option', 'step', 10);
    $slider.slider('option', 'change', brightnessToolHandler);
    $slider.slider('option', 'value', filter(canvas.item(0), 1, 'brightness'));
  });
  $(document).on("click", "#choose-photo-modal li", function (e) {
    $("#choose-photo-modal li").removeClass('selected');
    $(this).addClass('selected');
  });
  $("#sent-to-facebook").iziModal({
    title: "Sent To Facebook",
    icon: 'fa fa-facebook-square',
    headerColor: '#3b5998',
    width: 600,
    timeout: 3000,
    transitionIn: 'fadeInDown',
    transitionOut: 'fadeOutDown'
  });
  $("#sent-to-twitter").iziModal({
    title: "Sent to Twitter",
    icon: 'fa fa-twitter-square',
    headerColor: '#4099FF',
    width: 600,
    timeout: 3000,
    transitionIn: 'fadeInDown',
    transitionOut: 'fadeOutDown'
  });
  share2social($, canvas.getElement());
})(window, fabric, jQuery);