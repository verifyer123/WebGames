
      var newURL = window.location;

var pop = document.getElementById("pop");
var flipcard = document.getElementById("flipcard");
var magic = document.getElementById("magic");
var videoLanguage;
var videoId;
var credentials = loginModal.getChildData();

var tag = document.createElement('script');



tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

for(i=1;i<=videolist.length;i++){
	$("#wallpaper-slider").append('<div id="button'+i+'" class="video-item text-center"></div>')
	console.log(i);

    if(language == "ES"){
        var video_thumbnail = $('<img class="wallpaper-thumb low-padding videoButton" src="assets/images/videoThumbnail/'+ videolist[i-1].thumbnail +'_ES.png">');
    }
    else{
        var video_thumbnail = $('<img class="wallpaper-thumb low-padding videoButton" src="assets/images/videoThumbnail/'+ videolist[i-1].thumbnail +'_EN.png">');
    }
    //var video_thumbnail = $('<img class="wallpaper-thumb low-padding videoButton" src="assets/images/videoThumbnail/'+videolist[i-1].thumbnail+'.png">');
	$("#button"+ i).append(video_thumbnail);
	$("#button"+ i).append('<img class="video-icon" src="assets/images/video_icon.png"/>');

}



function loadVideos(index){

	if(language == "ES"){
		$("#player").attr("src","https://www.youtube.com/embed/" + videolist[index].url_ES);
		$(".text43").text(videolist[index].NAME_ES);
		videoLanguage = videolist[index].url_ES;
	}else{
		$("#player").attr("src","https://www.youtube.com/embed/" + videolist[index].url_EN);
		$(".text43").text(videolist[index].NAME_EN);
		videoLanguage = videolist[index].url_EN;
	}

	loadYTPlayer(videoLanguage,videolist[index].videoID,videolist[index].NAME_ES)

}


for(i=1;i<=videolist.length;i++){
	if(language == "ES"){
		$("#textVideo" + i).text(videolist[i-1].NAME_ES)
	}else{
		$("#textVideo" + i).text(videolist[i-1].NAME_EN)
	}
	$("#button" + i).attr("number",i-1);
	if(!$("#button" + i).hasClass("lock") ){
		$("#button" + i).click(function(){
			// $( "#player" ).remove();
			// $( "#videoContainer" ).append("<div id='player'></div>");
			pop.play();
			// console.log(parseInt($(this).attr("number")) );
			loadVideos(parseInt($(this).attr("number")));
		});

	}
}


function callBackLogIn(){
	var credentials = getCredentials()
	var email = credentials.email
	if(email){
		$("#menuUserMovil").css("display","block");
		$("#menuUser").css("display","flex");
		$(".accesButtons").hide();
		$(".accesButtonsMovil").hide();
		$(".navbar").addClass("navbar-login");
		$("#id_user").text(email)
		$("#id_userMovil").text(email)
	}


}

var player;
function onYouTubeIframeAPIReady() {
	loadVideos(0);
}

function onPlayerReady(event) {
	console.log('Video Ready');
}
// The API calls this function when the player's state changes.
var done = false;
var countPlay = 0;

function onPlayerStateChange(event) {
	console.log('Video change');
	if (event.data == YT.PlayerState.PLAYING && !done) {
		countPlay += 1;
		if (countPlay === 1) {
			//console.log('video is playing');
			mixpanel.track('videoStart',
				{
					"user_id": credentials.educationID,
					videoId: videoId,
					app: "web",
					id:idnumber,
					name_video: namevideo
				}
			);
		}
		else{
			//console.log('Video is continuing');
			mixpanel.track('videoUnpause',
				{
					"user_id": credentials.educationID,
					videoId: videoId,
					app: "web",
					id:idnumber,
					name_video: namevideo
				}
			);
		}
	}
	if (event.data == YT.PlayerState.PAUSED && !done) {

		mixpanel.track('videoPaused',
			{
				"user_id": credentials.educationID,
				videoId: videoId,
				PauseTime: player.getCurrentTime(),
				app: "web",
				id:idnumber,
				name_video: namevideo
			}
		);

	}
	if (event.data == YT.PlayerState.ENDED) {
		//console.log('video complete');
		mixpanel.track('videoStop',
			{
				"user_id": credentials.educationID,
				videoId: videoId,
				EndTime: player.getCurrentTime(),
				app: "web",
				id:idnumber,
				name_video: namevideo
			}
		);

	}
}

function stopVideo() {
	player.stopVideo();
}

function loadYTPlayer(videoLanguage, idnumber, namevideo){

	if($("#player").length == 0) {
		//it doesn't exist
		console.log('no pasa nada');
	} else {
		console.log('cargando video');
		//Youtube video API
		//This code loads the IFrame Player API code asynchronously.

        if(!player) {
			player = new YT.Player('player', {
				videoId: videoLanguage, //get var videoLanguage to load videoId
				host:'https://www.youtube.com',
				playerVars: {
					rel: 0,
					modestbranding: 1,
					enablejsapi: 1
				},
				events: {
					'onReady': onPlayerReady,
					'onStateChange': onPlayerStateChange
				}
			});
		}else{
			player.loadVideoById({videoId:videoLanguage})
        }



 onYouTubeIframeAPIReady()
		//The API will call this function when the video player is ready.

		//End Youtube video API
	}
}


$('#wallpaper-slider').slick({
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
