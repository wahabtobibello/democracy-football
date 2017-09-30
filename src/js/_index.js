(function (root, fabric, $) {
  'use strict';
  $(root).resize(() => {
    let WH = $(root).height();
    let t = 548;
    t > WH
      ?
      $(".header").height(t)
      :
      $(".header").height(WH)
  });
  $(root).trigger('resize');
  if (!root.Promise._immediateFn) {
    root.Promise._immediateFn = setAsap;
  }
  const CONSTANTS = {
    canvasWidth: 900,
    canvasHeight: 954,
  }

  const acceptedFileTypes = ["image/jpeg", "image/png"],
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
      evented: false,
    }),
    formation433 = {
      lf: {
        top: 120,
        left: 240,
        shirtNumber: 11,
        name: "Obafemi Awolowo",
        path: "./assets/images/Awolowo.png"
      },
      cf: {
        top: 75,
        left: (CONSTANTS.canvasWidth) / 2,
        shirtNumber: 9,
        name: "Nnamdi Azikwe",
        path: "./assets/images/Azikwe.png"
      },
      rf: {
        top: 120,
        left: CONSTANTS.canvasWidth - 240,
        shirtNumber: 7,
        name: "Tafewa Balewa",
        path: "./assets/images/Balewa.png"
      },
      lm: {
        top: (CONSTANTS.canvasHeight) / 4 + 50,
        left: 290,
        shirtNumber: 6,
        name: "Odumegwu Ojukwu",
        path: "./assets/images/Ojukwu.png"
      },
      cm: {
        top: (CONSTANTS.canvasHeight) / 4 + 150,
        left: (CONSTANTS.canvasWidth) / 2,
        shirtNumber: 31,
        name: "Murtala Mohammed",
        path: "./assets/images/Murtala.png"
      },
      rm: {
        top: (CONSTANTS.canvasHeight) / 4 + 50,
        left: CONSTANTS.canvasWidth - 290,
        shirtNumber: 22,
        name: "Dora Akunyili",
        path: "./assets/images/Akunyili.png"
      },
      lb: {
        top: (CONSTANTS.canvasHeight) / 3 + 150,
        left: 180,
        shirtNumber: 2,
        name: "Fela Kuti",
        path: "./assets/images/Kuti.png"
      },
      lcb: {
        top: (CONSTANTS.canvasHeight) / 3 + 255,
        left: (CONSTANTS.canvasWidth) / 3 + 50,
        shirtNumber: 4,
        name: "Gani Fawehinmi",
        path: "./assets/images/Fawehinmi.png"
      },
      rcb: {
        top: (CONSTANTS.canvasHeight) / 3 + 255,
        left: (CONSTANTS.canvasWidth) / 3 * 2 - 50,
        shirtNumber: 5,
        name: "Dr. Stella Adadevoh",
        path: "./assets/images/Adadevoh.png"
      },
      rb: {
        top: (CONSTANTS.canvasHeight) / 3 + 150,
        left: CONSTANTS.canvasWidth - 180,
        shirtNumber: 3,
        name: "Ken Saro Wiwa",
        path: "./assets/images/Wiwa.png"
      },
      gk: {
        top: (CONSTANTS.canvasHeight) - 220,
        left: (CONSTANTS.canvasWidth) / 2 + 10,
        shirtNumber: 1,
        name: "Herbert Macauly",
        path: "./assets/images/Macauly.png"
      },
      sub1: {
        top: (CONSTANTS.canvasHeight) - 90,
        left: 130,
        shirtNumber: 14,
        name: "Chinua Achebe",
        path: "./assets/images/Achebe.png"
      },
      sub2: {
        top: (CONSTANTS.canvasHeight) - 90,
        left: (CONSTANTS.canvasWidth) / 3 + 45,
        shirtNumber: 23,
        name: "MKO Abiola",
        path: "./assets/images/Abiola.png"
      },
      sub3: {
        top: (CONSTANTS.canvasHeight) - 90,
        left: (CONSTANTS.canvasWidth) / 3 * 2 - 45,
        shirtNumber: 15,
        name: "Abu Ali",
        path: "./assets/images/Ali.png"
      },
      sub4: {
        top: (CONSTANTS.canvasHeight) - 90,
        left: CONSTANTS.canvasWidth - 130,
        shirtNumber: 20,
        name: "Ahmadu Bello",
        path: "./assets/images/Bello.png"
      }
    },
    getAdjustedScale = (noOfChars) => {
      return (noOfChars * 2 - 6) / 3;
    },
    convertCanvasToImage = canvas => {
      let image = new Image();
      image.src = canvas.toDataURL("image/png");
      return image;
    },
    saveAsCanvas = (canvas) => {
      if (saveAs !== undefined) {
        canvas.toBlobHD(function (blob) {
          saveAs(
            blob
            , "teamSuperHero.png"
          );
        }, "image/png");
      }
    },
    editFontSize = (parent, iText, size) => {
      if (size > 0)
        iText.scaleRatio = size;
      iText.scaleToHeight(parent.height / size);
    },
    addClipArt = (parent, clipArtObj, iText, textScaleRatio) => {
      // clipArtObj.scaleToHeight(parent.height);
      clipArtObj.scaleToWidth(parent.width);
      editFontSize(parent, iText, textScaleRatio);
      parent.add(clipArtObj);
      parent.add(iText);
    },
    renderImage = (canvas, img) => {
      let clipArtObj = canvas.getObjects('path-group')[0];
      let textboxObj = canvas.getObjects('textbox')[0];
      let inputText = textboxObj.getText();
      let scaleRatio = textboxObj.scaleRatio;
      let textObj = new fabric.Text(inputText, {
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
        hasBorders: false,
      });
      let imageObj = new fabric.Image(img, {
        hasRotatingPoint: false,
        hasControls: false,
        hasBorders: false,
        originX: "center",
        originY: "center",
        left: CONSTANTS.canvasWidth / 2,
        top: CONSTANTS.canvasHeight / 2,
      });
      imageObj.on('mouseup', function (e) {
        rePositionImage(canvas, this);
      });
      let groupObj = new fabric.Group([], {
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
        top: CONSTANTS.canvasHeight / 2,
      });

      canvas.clear();
      canvas.defaultCursor = "default";
      canvas.add(imageObj);
      if (imageObj.width <= imageObj.height) {
        imageObj.scaleToWidth(CONSTANTS.canvasWidth);
      }
      else if (imageObj.width > imageObj.height) {
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
      return new Promise((resolve) => {
        resolve(true);
      });
    },
    animateScaleDown = (obj, scale) => {
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
    startUp = (canvas) => {
      const renderPlayer = (oTab, oPic, pos, canvas) => {
        let oShirtNo = new fabric.Text(`${pos.shirtNumber}`, {
          fontFamily: "Futura-Medium",
          top: 123,
          left: -130,
          originX: "center",
          originY: "center",
          propName: "shirtNumber"
        });
        let oPlayerName = new fabric.Text(pos.name, {
          fontFamily: "Futura-Medium",
          top: 123,
          left: 25,
          fontSize: 26,
          fill: "white",
          originX: "center",
          originY: "center",
          propName: "name"
        });
        let groupObj = new fabric.Group([], {
          hasControls: false,
          hasRotatingPoint: false,
          hasBorders: false,
          selectable: false,
          // evented: false,
          width: 300,
          height: 300,
          originX: "center",
          originY: "center",
          ...pos
        });
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
              let osPic = canvas.selectedGroup._objects.find((ele) => ele.propName === "picture");
              osPic.set("stroke", null);
              return;
            }
            let previousSelectedGroup = canvas.selectedGroup;
            let newSelectedGroup = e.target;

            // let opsShirtNumber = previousSelectedGroup._objects.find((ele) => ele.propName === "shirtNumber");
            let opsName = previousSelectedGroup._objects.find((ele) => ele.propName === "name");
            let opsPic = previousSelectedGroup._objects.find((ele) => ele.propName === "picture");
            let opsTab = previousSelectedGroup._objects.find((ele) => ele.propName === "tab");

            // let onsShirtNumber = newSelectedGroup._objects.find((ele) => ele.propName === "shirtNumber");
            let onsName = newSelectedGroup._objects.find((ele) => ele.propName === "name");
            let onsPic = newSelectedGroup._objects.find((ele) => ele.propName === "picture");
            let onsTab = newSelectedGroup._objects.find((ele) => ele.propName === "tab");

            canvas.isPlayerSelected = false;
            opsPic.set("stroke", null);
            onsPic.set("stroke", null);
            opsTab.set("stroke", null);
            onsTab.set("stroke", null);

            previousSelectedGroup.remove(/*opsShirtNumber,*/ opsName, opsPic);
            newSelectedGroup.remove(/*onsShirtNumber,*/ onsName, onsPic);
            previousSelectedGroup.add(/*onsShirtNumber,*/ onsName, onsPic);
            newSelectedGroup.add(/*opsShirtNumber,*/ opsName, opsPic);

            onsPic.sendToBack();
            opsPic.sendToBack();

            canvas.renderAll();
          } else {
            canvas.isPlayerSelected = true;
            oTab.set("stroke", "white");
            canvas.selectedGroup = e.target;
            let osPic = canvas.selectedGroup._objects.find((ele) => ele.propName === "picture");
            osPic.set("stroke", "white");
          }
        })
        groupObj.scale(0.5)
          .set("left", pos.left)
          .set("top", pos.top);
        oTab.set("top", 120)
          .set("strokeWidth", 10)
          .set("originX", "center")
          .set("originY", "center")
          .set("propName", "tab");

        oPic.set("strokeWidth", 10)
          .set("originX", "center")
          .set("originY", "center")
          .set("propName", "picture");
        canvas.getObjects("image")[0] && canvas.getObjects("image")[0].sendToBack();
        groupObj.add(oTab);
        groupObj.add(oPic);
        groupObj.add(oPlayerName);
        groupObj.add(oShirtNo);
        oPic.sendToBack();
        return groupObj;
      }
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
      fabric.Image.fromURL('./assets/images/substituteTab.png', function (oImg) {
        oImg.scaleToWidth(CONSTANTS.canvasWidth);
        oImg.set("hasControls", false);
        oImg.set("hasRotatingPoint", false);
        oImg.set("hasBorders", false);
        oImg.set("selectable", false);
        oImg.set("evented", false);
        oImg.set("top", CONSTANTS.canvasWidth - 70);
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
      fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
        fabric.Image.fromURL(formation433.sub1.path, function (oPic) {
          canvas.add(renderPlayer(oTab, oPic, formation433.sub1, canvas));
          canvas.renderAll();
        });
      });
      fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
        fabric.Image.fromURL(formation433.sub2.path, function (oPic) {
          canvas.add(renderPlayer(oTab, oPic, formation433.sub2, canvas));
          canvas.renderAll();
        });
      });
      fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
        fabric.Image.fromURL(formation433.sub3.path, function (oPic) {
          canvas.add(renderPlayer(oTab, oPic, formation433.sub3, canvas));
          canvas.renderAll();
        });
      });
      fabric.Image.fromURL('./assets/images/button.png', function (oTab) {
        fabric.Image.fromURL(formation433.sub4.path, function (oPic) {
          canvas.add(renderPlayer(oTab, oPic, formation433.sub4, canvas));
          canvas.renderAll();
        });
      });
    },
    filter = (imageObj, index, prop, value) => {
      if (value === undefined) {
        return imageObj.filters[index][prop];
      }
      if (imageObj.filters[index]) {
        imageObj.filters[index][prop] = value;
        imageObj.applyFilters(canvas.renderAll.bind(canvas));
      }
    },
    zoomToolHandler = () => {
      let imageObj = canvas.item(0);
      let value = $slider.slider('value');
      imageObj.setScaleX(imageObj.newScaleX * value);
      imageObj.setScaleY(imageObj.newScaleY * value);
      imageObj.setCoords();
      rePositionImage(canvas, imageObj);
      canvas.renderAll();
    },
    contrastToolHandler = () => {
      filter(canvas.item(0), 0, 'contrast', $slider.slider('value'))
    },
    brightnessToolHandler = () => {
      filter(canvas.item(0), 1, 'brightness', $slider.slider('value'))
    },
    rePositionImage = (canvas, imageObj) => {
      let tlX = imageObj.aCoords.tl.x;
      let tlY = imageObj.aCoords.tl.y;
      let brX = imageObj.aCoords.br.x;
      let brY = imageObj.aCoords.br.y;
      let canvasWidth = CONSTANTS.canvasWidth;
      let canvasHeight = CONSTANTS.canvasHeight;
      let currentWidth = imageObj.width * imageObj.scaleX;
      let currentHeight = imageObj.height * imageObj.scaleY;
      if (tlX >= 0) {
        imageObj.setLeft(currentWidth / 2);
      }
      if (tlY >= 0) {
        imageObj.setTop(currentHeight / 2);
      }
      if (brX <= canvasWidth) {
        imageObj.setLeft(canvasWidth - (currentWidth / 2));
      }
      if (brY <= canvasHeight) {
        imageObj.setTop(canvasHeight - (currentHeight / 2));
      }
      imageObj.setCoords();
    },
    activateButtonOnText = ($el, text) => {
      if (text === "")
        $el.find('button').attr('disabled', 'true');
      else {
        $el.find('button').removeAttr('disabled');
      }
    };
  fabric.Textbox.prototype.insertNewline = (function (_super) {
    return function () {
    }
  })(fabric.Textbox.prototype.insertNewline);
  fabric.Textbox.prototype.initHiddenTextarea = (function (_super) {
    return function () {
      _super.call(this);
      $(this.hiddenTextarea).attr('maxLength', maxchars);
      $(this.hiddenTextarea).attr('autocomplete', 'off');
      $(this.hiddenTextarea).attr('autocorrect', 'off');
      $(this.hiddenTextarea).attr('spellcheck', false);
    }
  })(fabric.Textbox.prototype.initHiddenTextarea);
  fabric.Textbox.prototype.onInput = (function (_super) {
    return function (e) {
      while (this.text.length > this.hiddenTextarea.value.length) {
        this.removeChars(e);
      }
      _super.call(this, e);
    }
  })(fabric.Textbox.prototype.onInput);
  startUp(canvas);
  canvas.on('mouse:down', (e) => {
    canvas.forEachObject((obj) => {
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
    let u = URL.createObjectURL(this.files[0]);
    let img = new Image;
    img.src = u;
    img.onload = function () {
      renderImage(canvas, img).then((done) => {
        $loading.css('z-index', '0');
        $loading.hide();
        $addPhotoOnly.hide();
        $moreOptions.show();
        $contrastTool.css('color', lucozadeRed).click();
        animateScaleDown(canvas.item(1), 0.5);
      });
    };
  });
  $saveLinkBtn.click((e) => {
    saveAsCanvas(canvas.getElement());
  });
  $startOver.click((e) => {
    startUp(canvas);
  });
  $(document).on("click", "#add-photo", function (e) {
    $('#file-input').click();
  });
  $shareBtn.click((e) => {
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
    orientation: "horizontal",
  });
  $tool.click((e) => {
    $tool.css('color', defaultColor);
    $(e.target).css('color', lucozadeRed);
  });
  $zoomTool.click((e) => {
    $slider.slider('option', 'min', 1);
    $slider.slider('option', 'max', 5);
    $slider.slider('option', 'step', 0.1);
    $slider.slider('option', 'change', zoomToolHandler);
    $slider.slider('option', 'value', Math.round((canvas.item(0).scaleX / canvas.item(0).newScaleX) * 10) / 10);
  });
  $contrastTool.click((e) => {
    $slider.slider('option', 'min', -200);
    $slider.slider('option', 'max', 200);
    $slider.slider('option', 'step', 10);
    $slider.slider('option', 'change', contrastToolHandler);
    $slider.slider('option', 'value', filter(canvas.item(0), 0, 'contrast'));
  });
  $brightnessTool.click((e) => {
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
    transitionOut: 'fadeOutDown',
  });
  $("#sent-to-twitter").iziModal({
    title: "Sent to Twitter",
    icon: 'fa fa-twitter-square',
    headerColor: '#4099FF',
    width: 600,
    timeout: 3000,
    transitionIn: 'fadeInDown',
    transitionOut: 'fadeOutDown',
  });
  share2social($, canvas.getElement());
}(window, fabric, jQuery));