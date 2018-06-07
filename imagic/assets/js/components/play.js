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

   $('#menu-videos').slick({
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 3,
      arrows: true,
      appendArrows: $(".slick-nav-buttons"),
      responsive: [
    {
      breakpoint: 480,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: '0px',
        slidesToShow: 2
      }
    },
    {
      breakpoint: 768,
      settings: {
        arrows: true,
        centerMode: true,
        centerPadding: '0px',
        slidesToShow: 3
      }
    }
  ]
   });

   /*  Webgames menu   */
    $('#menu-webgames').slick({
       infinite: true,
       slidesToShow: 8,
       arrows: true,
       appendArrows: $("#webgames-select-buttons"),
       responsive: [
       {
         breakpoint: 768,
         settings: {
           arrows: false,
           centerMode: true,
           centerPadding: '0px',
           slidesToShow: 6.7,
           slidesToScroll:4
         }
       },{
         breakpoint: 500,
         settings: {
           arrows: false,
           centerMode: false,
           centerPadding: '0px',
           slidesToShow: 3.7,
           slidesToScroll:3
         }
       }

     ]

    });


});
