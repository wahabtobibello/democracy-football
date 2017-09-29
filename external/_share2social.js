var Base64Binary = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

  /* will return a  Uint8Array type */
  decodeArrayBuffer: function (input) {
    var bytes = (input.length / 4) * 3;
    var ab = new ArrayBuffer(bytes);
    this.decode(input, ab);

    return ab;
  },

  decode: function (input, arrayBuffer) {
    //get last chars to see if are valid
    var lkey1 = this._keyStr.indexOf(input.charAt(input.length - 1));
    var lkey2 = this._keyStr.indexOf(input.charAt(input.length - 2));

    var bytes = (input.length / 4) * 3;
    if (lkey1 == 64) bytes--; //padding chars, so skip
    if (lkey2 == 64) bytes--; //padding chars, so skip

    var uarray;
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    var j = 0;

    if (arrayBuffer)
      uarray = new Uint8Array(arrayBuffer);
    else
      uarray = new Uint8Array(bytes);

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    for (i = 0; i < bytes; i += 3) {
      //get the 3 octects in 4 ascii chars
      enc1 = this._keyStr.indexOf(input.charAt(j++));
      enc2 = this._keyStr.indexOf(input.charAt(j++));
      enc3 = this._keyStr.indexOf(input.charAt(j++));
      enc4 = this._keyStr.indexOf(input.charAt(j++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      uarray[i] = chr1;
      if (enc3 != 64) uarray[i + 1] = chr2;
      if (enc4 != 64) uarray[i + 2] = chr3;
    }

    return uarray;
  }
};
// $ = jquery object;
// canvas = HTMLCanvasElement
var share2social = ($, canvas) => {
  const $facebookShare = $("#facebook-share");
  const $twitterShare = $("#twitter-share");
  const $instagramShare = $("#instagram-share");
  const postImageToFacebook = (authToken, filename, mimeType, imageData) => {
    // this is the multipart/form-data boundary we'll use
    var boundary = '----ThisIsTheBoundary1234567890';
    // let's encode our image file, which is contained in the var
    var formData = '--' + boundary + '\r\n'
    formData += 'Content-Disposition: form-data; name="source"; filename="' + filename + '"\r\n';
    formData += 'Content-Type: ' + mimeType + '\r\n\r\n';
    for (var i = 0; i < imageData.length; ++i) {
      formData += String.fromCharCode(imageData[i] & 0xff);
    }
    formData += '\r\n';
    formData += '--' + boundary + '--\r\n';

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://graph.facebook.com/me/photos?access_token=' + authToken, true);
    xhr.onload = xhr.onerror = function () {
      $('#share-modal').iziModal('close');
      $(document).on('closed', '#share-modal', function (e) {
        e.preventDefault();
        $('#sent-to-facebook').iziModal('open');
        $('#share-modal .modal-inner').children().toggle();
      });
    };
    xhr.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
    xhr.sendAsBinary(formData);
  };
  if (XMLHttpRequest.prototype.sendAsBinary === undefined) {
    XMLHttpRequest.prototype.sendAsBinary = function (string) {
      var bytes = Array.prototype.map.call(string, function (c) {
        return c.charCodeAt(0) & 0xff;
      });
      this.send(new Uint8Array(bytes).buffer);
    };
  };
  var authToken;

  function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }


  $(document).on("click", "#facebook-share", function (e) {
    $('#share-modal .modal-inner').children().toggle();
    // TODO: Implement facebook share
    var data = canvas.toDataURL("image/png");
    var encodedPng = data.substring(data.indexOf(',') + 1, data.length);
    var decodedPng = Base64Binary.decode(encodedPng);
    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        postImageToFacebook(response.authResponse.accessToken, "What Lies Within", "image/png", decodedPng, "#WhatLiesWithin");
      } else if (response.status === "not_authorized") {
        FB.login(function (response) {
          postImageToFacebook(response.authResponse.accessToken, "What Lies Within", "image/png", decodedPng, "#WhatLiesWithin");
        }, { scope: "publish_actions" });

      } else {
        FB.login(function (response) {
          postImageToFacebook(response.authResponse.accessToken, "What Lies Within", "image/png", decodedPng, "#WhatLiesWithin");
        }, { scope: "publish_actions" });
      }
    });
  });


  $(document).on("click", "#twitter-share", function (event) {
    var imgdata = canvas.toDataURL("image/png");
    var encodedPng = imgdata.substring(imgdata.indexOf(',') + 1, imgdata.length);
    OAuth.popup("twitter").then(function (result) {
      var data = new FormData();
      data.append('status', "#WhatLiesWithin");
      data.append('media[]', b64toBlob(encodedPng), 'WhatLiesWithin.png');
      return result.post('/1.1/statuses/update_with_media.json', {
        data: data,
        cache: false,
        processData: false,
        contentType: false
      });
    }).done(function (data) {
      $('#share-modal').iziModal('close');
      $(document).on('closed', '#share-modal', function (e) {
        e.preventDefault();
        $('#sent-to-twitter').iziModal('open');
        $('#share-modal .modal-inner').children().toggle();
      });
    }).fail(function (e) {
      alert("Something went wrong. Did not send to twitter");
      console.log(JSON.stringify(e, null, 2));
    });
  });
  $(document).on("click", "#instagram-share", function (event) {
    // TODO: Implement instagram share
  });
};