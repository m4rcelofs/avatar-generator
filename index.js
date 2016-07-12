/* jslint esversion: 6 */
(function(){
  'use strict';

  const IMG_WIDTH = 128;
  const IMG_HEIGHT = 128;
  const IMG_FILL = '#000000';

  let cropper;
  let preview;
   
  $(document).ready(() => {
    $.material.init(); 

    $('#hidden').hide();
    $('#input').change(loadPreview);
    
    preview = new fabric.StaticCanvas('preview');
    preview.setOverlayImage(
      'http://placekitten.com/128/128', //TODO get proper image, notice the CORS headers
      preview.renderAll.bind(preview), 
      {
        originX: 'left',
        originY: 'top',
        crossOrigin: 'anonymous'
      }
    );
    
  });
  
  function loadPreview() {
    let file = $('#input')[0].files[0];
    let reader = new FileReader();
    reader.addEventListener('load', () => {
      $('#cropArea').attr('src', reader.result);
      startEditor();
    }, false);
    if(file) {
      reader.readAsDataURL(file);
    }
  }
  
  function startEditor() {
    if(cropper) {
      cropper.destroy();
    }
    let cropArea = document.getElementById('cropArea');
    cropper = new Cropper(cropArea, {
      aspectRatio: IMG_WIDTH / IMG_HEIGHT,
      minCropBoxWidth: IMG_WIDTH,
      minCropBoxHeight: IMG_HEIGHT,
      crop: function() {
        updatePreview(cropper);
      }
    });
    showHidden();
  }
  
  function updatePreview(cropper) {
    let cropped = cropper.getCroppedCanvas({
      width: IMG_WIDTH, 
      height: IMG_HEIGHT,
      fillColor: IMG_FILL
    });
    preview.setBackgroundImage(
      cropped.toDataURL(),
      preview.renderAll.bind(preview),
      {
        originX: 'left',
        originY: 'top'
      }
    );
  }
  
  function showHidden() {
    let save = $('#save');
    save.click(() => {
      save.attr('href', preview.toDataURL());
      save.attr('download', 'avatar.png');
    });
    $('#hidden').show();
  }
    
})();
