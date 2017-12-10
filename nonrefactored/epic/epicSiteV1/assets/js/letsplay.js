$(document).ready(function () {
  $("#sidebar").niceScroll({
    cursorcolor: '#53619d',
    cursorwidth: 4,
    cursorborder: 'none'
  });

  $('#dismiss, .overlay').on('click', function () {
    $('#sidebar').removeClass('active');
    $('.overlay').fadeOut();
  });

  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').addClass('active');
    $('.overlay').fadeIn();
    $('.collapse.in').toggleClass('in');
    $('a[aria-expanded=true]').attr('aria-expanded', 'false');
  });
  /*  Slick carousel   */

  $('#subject-slider').slick({
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 3,
    arrows: true,
    appendArrows: $(".slick-nav-buttons"),
    responsive: [{
      breakpoint: 599,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '0px',
        slidesToShow: 2
      }
    },{
      breakpoint: 769,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: '0px',
        slidesToShow: 3
      }
    } ]
  });

  hideTabs();

});

function hideTabs() {
  $('#tab-science').css('display', 'none');
  $('#tab-coding').css('display', 'none');
  $('#tab-creativity').css('display', 'none');
  $('#tab-health').css('display', 'none');
  $('#tab-geography').css('display', 'none');
  $('#tab-language').css('display', 'none');
  $('#tab-sustainability').css('display', 'none');
}

function showtab(tab) {
  //hide the first active element
  $('#tab-math').css('display', 'none');
  hideTabs();
  var name = 'tab-' + tab;
  $('#' + name).css('display', 'inline');
}