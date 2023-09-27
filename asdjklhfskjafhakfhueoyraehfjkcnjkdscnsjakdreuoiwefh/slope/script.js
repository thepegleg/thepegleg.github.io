window.addEventListener('DOMContentLoaded', function() {
    var adCircle = document.getElementById('ad-circle');
    var popup = document.getElementById('popup');
    var closeBtn = document.getElementById('close-btn');
  
    adCircle.addEventListener('click', function() {
      popup.style.display = 'block';
    });
  
    closeBtn.addEventListener('click', function() {
      popup.style.display = 'none';
    });
  });
  