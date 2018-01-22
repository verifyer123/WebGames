var orientationTouched = false;
var home = document.getElementById("home");
var homeButton = document.getElementById("homeButton");

//prevent tapping on drag content
var dragging = false;
$("body").on("touchmove", function () {
    dragging = true;
});
$("body").on("touchstart", function () {
    dragging = false;
});


$(document).ready(function () {
    initSizes();
    // setTimeout(function () {
    //     $('.epic-slider').slick({
    //         dots: true,
    //         autoplay: false,
    //         vertical: true,
    //         verticalSwiping: true,
    //         accessibility: true,
    //         arrows: false,
    //         mobileFirst: true,
    //         infinite:false
    //     });
	//
    //     $('.epic-slider').animate({
    //         opacity: '1'
    //     }, 500);
    // }, 500);

    if ($(window).width() <= 768) {
        addEvents();
        isPortrait();
    }

	const ps = new PerfectScrollbar('.epic-slider', {suppressScrollX:true});
	const ps2 = new PerfectScrollbar('#scroll2', {suppressScrollX:true});
	console.log(ps)

	ps.element.addEventListener('ps-scroll-y', function (event) {
		var scrollDown1Display = $(".scrolldown1").css("display")
		var scrollUp1Display = $(".scrollup1").css("display")
		var scrollTop = ps.element.scrollTopMax || ps.containerHeight - 70
		if(ps.element.scrollTop >= scrollTop){
			$(".scrolldown1").css("display", "none")
		}else if(scrollDown1Display === "none")
			$(".scrolldown1").css("display", "block")

		if(ps.element.scrollTop <= 0){
			$(".scrollup1").css("display", "none")
		}else if(scrollUp1Display === "none")
			$(".scrollup1").css("display", "block")
	});

	$('.scrolldown1').click(function () {
		TweenLite.to(ps.element, 0.5, {scrollTop:ps.containerHeight, ease:Quad.easeOut})
	})

	$('.scrollup1').click(function () {
		console.log("scrollTOp")
		TweenLite.to(ps.element, 0.5, {scrollTop:0, ease:Quad.easeOut})
	})

	ps2.element.addEventListener('ps-scroll-y', function (event) {
		var scrollDown1Display = $(".scrolldown2").css("display")
		var scrollUp1Display = $(".scrollup2").css("display")
		if(ps2.element.scrollTop >= ps2.element.scrollTopMax){
			$(".scrolldown2").css("display", "none")
		}else if(scrollDown1Display === "none")
			$(".scrolldown2").css("display", "block")

		if(ps2.element.scrollTop <= 0){
			$(".scrollup2").css("display", "none")
		}else if(scrollUp1Display === "none")
			$(".scrollup2").css("display", "block")
	});

	$('.scrolldown2').click(function () {
		TweenLite.to(ps2.element, 0.5, {scrollTop:ps2.containerHeight, ease:Quad.easeOut})
	})

	$('.scrollup2').click(function () {
		console.log("scrollup")
		TweenLite.to(ps2.element, 0.5, {scrollTop:0, ease:Quad.easeOut})
	})

	// $('#scroll2').addEventListener('ps-y-reach-end', function () {
	// 	$(".arrow-down").css("display", "none")
	// });

	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	var language;
	language = getParameterByName("language");
	language = language || "en"
    language = language.toUpperCase()

	function changeLanguages(){
		$(".advModeText").text(epicLanguages[language]["adventureMode"])
		$(".booksText").text(epicLanguages[language]["books"])
		$(".videosText").text(epicLanguages[language]["videos"])
		$(".minigamesText").text(epicLanguages[language]["minigames"])
	}

	changeLanguages()
});

function isPortrait() {
    var width = $(window).width();
    var height = $(window).height();

    if (height > width) {
        //portrait mode
        $('#landscape').css('display', 'none');
    } else {
        //landscape mode
        $('#landscape').css('display', 'block');
    }
    if (orientationTouched) window.location.reload();
}

function addEvents() {
    var closeButton = document.getElementById("close");
    closeButton.addEventListener("touchstart", close, false);

    close();
}

function initSizes() {
    // 20 px for the player info margin top
    var sliderHeight = $('#left').height() - $('#player-info').height() - 20;
    // $('.epic-slider').css('height', sliderHeight);

    var innerHeight = $('#iframe-box').height() - 40;
    var innerWidth = $('#iframe-box').width() - 40;
    $('#iframe-inner').css('height', innerHeight);
    $('#iframe-inner').css('width', innerWidth);

    $('#iframe').css('height', innerHeight - 40);
    $('#iframe').css('width', innerWidth - 40);

    if (innerWidth < 560) {
        $('#iframe-img').css('width', '100%');
        $('#iframe-img').css('height', 'auto');
    } else {
        $('#iframe-img').css('height', '100%');
        $('#iframe-img').css('width', 'auto');
    }
}

$(window).resize(function () {
    initSizes();
    if ($(window).width() <= 768) {
        addEvents();
        isPortrait();
    }
});

// $(window).on("orientationchange", function (event) {
//     orientationTouched = true;
//     isPortrait();
// });

function close() {
    //$('#iframe-mobile').css('display', 'none');
}

function open(slide) {
    if (dragging) return;
    //slide -> parameter to show content based on selected slice
    // slide (integer // entero) indicates the number of the slide the user selected.
    // 1 = Adventure mode
    // 2 = Books
    // 3 = Minigames
    // 4 = Videos
    $('#iframe-mobile').css('display', 'block');
}



//ESTE ES PARA EL DIV DE LOS MINIJUEGOS
//$("#content-minigames").hide();


//$("#content-minigames").attr("src","http://yogome.com/play.yogome/letsplay.html")