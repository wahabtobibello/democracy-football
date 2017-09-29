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
  const maxchars = 15,
    defaultColor = "#fff",
    lucozadeRed = "#f00",
    acceptedFileTypes = ["image/jpeg", "image/png"],
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
      width: 846,
      height: 846,
      selection: false,
      allowTouchScrolling: true,
      evented: false,
    }),
    renderClipArtAndTextbox = new Promise((resolve, reject) => {
      fabric.loadSVGFromURL('./img/what-lies-within.svg', function (objects, options) {
        let clipArtObj = fabric.util.groupSVGElements(objects, options);
        clipArtObj.selectable = false;
        clipArtObj.evented = false;
        clipArtObj.hasControls = false;
        clipArtObj.hasRotatingPoint = false;
        clipArtObj.hasBorders = false;
        clipArtObj.setOriginX("center");
        clipArtObj.setOriginY("center");
        resolve(clipArtObj);
      }, () => { });
    }),
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
            , "whatlieswithin.png"
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
        fontFamily: "MysticItalic",
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
        left: canvas.width / 2,
        top: canvas.height / 2,
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
        left: canvas.width / 2,
        top: canvas.height / 2,
      });

      canvas.clear();
      canvas.defaultCursor = "default";
      canvas.add(imageObj);
      if (imageObj.width <= imageObj.height) {
        imageObj.scaleToWidth(imageObj.canvas.width);
      }
      else if (imageObj.width > imageObj.height) {
        imageObj.scaleToHeight(imageObj.canvas.height);
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
      }).animate("top", obj.canvas.height / 2 + 150, {
        duration: 1000,
        onChange: canvas.renderAll.bind(canvas),
        ease: "easeOutSine"
      });
      return true;
    },
    startUp = (canvas) => {
      canvas.clear();
      renderClipArtAndTextbox.then((clipArtObj) => {
        let textbox = new fabric.Textbox("", {
          fontFamily: "MysticItalic",
          fontStyle: "italic",
          textAlign: "center",
          fill: "#fff",
          originX: "center",
          originY: "center",
          cursorColor: "#f00",
          cursorWidth: 10,
          hasControls: false,
          hasRotatingPoint: false,
          hasBorders: false,
          lockMovementX: true,
          lockMovementY: true,
          width: 600,
          top: 700,
          left: 410,
          scaleRatio: 4,
        });
        textbox.on('mouseup', function (e) {
          textbox.enterEditing();
        });
        textbox.on('changed', function (e) {
          let textStr = this.getText().toUpperCase();
          let length = textStr.length;
          if ($moreOptions.css('display') === "none") {
            $addPhotoOnly.show();
            activateButtonOnText($addPhotoOnly, textStr);
          } else {
            activateButtonOnText($moreOptions, textStr);

          }
          if (length > 9) {
            editFontSize(canvas, this, getAdjustedScale(length));
          } else {
            editFontSize(canvas, this, 4);
          }
          this.setText(textStr);
        });
        clipArtObj.setTop(423);
        clipArtObj.setLeft(423);
        textbox.enterEditing();
        addClipArt(canvas, clipArtObj, textbox, 4);
        canvas.renderAll();
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
    contrastToolHandler = () => { filter(canvas.item(0), 0, 'contrast', $slider.slider('value')) },
    brightnessToolHandler = () => { filter(canvas.item(0), 1, 'brightness', $slider.slider('value')) },
    rePositionImage = (canvas, imageObj) => {
      let tlX = imageObj.aCoords.tl.x;
      let tlY = imageObj.aCoords.tl.y;
      let brX = imageObj.aCoords.br.x;
      let brY = imageObj.aCoords.br.y;
      let canvasWidth = canvas.width;
      let canvasHeight = canvas.height;
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
    $moreOptions.hide();
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
    title: 'What Lies Within - Trailer',
    overlayClose: true,
    iframe: true,
    iframeURL: 'https://www.youtube.com/embed/LmXfwhWtmL0',
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