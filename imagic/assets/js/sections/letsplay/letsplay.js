var epicsite;

$(document).ready(function () {
	$("#sidebar").niceScroll({
		cursorcolor: '#53619d',
		cursorwidth: 4,
		cursorborder: 'none'
	});


	$('#dismiss, .overlay').on('click', function () {
		pop.play()
		$('#sidebar').removeClass('active');
		$('.overlay').fadeOut();
	});

	$('#sidebarCollapse').on('click', function () {
		pop.play()
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
				arrows: true,
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



function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}


epicsite = getParameterByName("epicsite");
if(epicsite){
	$(".navbar").css("display","none");
}else{

}


var pop = document.getElementById("pop");
var flipcard = document.getElementById("flipcard");
var magic = document.getElementById("magic");

var subjectsButtons =
	[
		{
			name:"All subjects",
			ES:"TODAS LAS MATERIAS",
			EN:"ALL SUBJECTS",
			PT:"TODOS OS ASSUNTOS",
			ZH:"所有科目",
			JA:"すべての科目",
			KO:"모든 과목들",
			img:"allsubjects"
		},
		{
			name:"MATH",
			ES:"MATEMÁTICAS",
			EN:"MATH",
			PT:"MATEMATICA",
			ZH:"数学",
			JA:"算数",
			KO:"수학",
			img:"math"
		},
		{
			name:"Coding",
			ES:"PROGRAMACIÓN",
			EN:"CODING",
			PT:"CODIFICAÇÃO",
			ZH:"编码",
			JA:"コーディング",
			KO:"소프트웨어",
			img:"coding"
		},
		{
			name:"Science",
			ES:"CIENCIA",
			EN:"SCIENCE",
			PT:"CIÊNCIAS",
			ZH:"科学",
			JA:"サイエンス",
			KO:"과학",
			img:"science"
		},
		{
			name:"Geography",
			ES:"GEOGRAFÍA",
			EN:"GEOGRAPHY",
			PT:"GEOGRAFIA",
			ZH:"地理",
			JA:"地理",
			KO:"지리학",
			img:"geo"
		},
		{
			name:"Creativity",
			ES:"CREATIVIDAD",
			EN:"CREATIVITY",
			PT:"CREATIVIDADE",
			ZH:"创造力",
			JA:"創造性",
			KO:"창의력",
			img:"crea"
		},
		{
			name:"Language",
			ES:"IDIOMA",
			EN:"LANGUAGE",
			PT:"IDIOMA",
			ZH:"语言",
			JA:"言語",
			KO:"언어",
			img:"lang"
		},
		{
			name:"Health",
			ES:"SALUD",
			EN:"HEALTH",
			PT:"SAÚDE",
			ZH:"健康",
			JA:"健康",
			KO:"건강",
			img:"health"
		},
		{
			name:"Sustainability",
			ES:"SUSTENTABILIDAD",
			EN:"SUSTENTABILITY",
			PT:"SUSTENTABILIDADE",
			ZH:"环境可持续发展",
			JA:"サステナビリティ",
			KO:"지속 가능성!",
			img:"sust"
		}
	]
var pathGames = "games/nonrefactored/"
var games = yogomeGames.getGames();

for(var i= 0;i<=subjectsButtons.length-1;i++){
	$("#subject-slider").append('<b><div class="subject-select-btns" style="color:#FFF;"><div class="subject-btn '+subjectsButtons[i].img+'"></div><div class="subject-name text-center" style="color:#ecd06c; font-size:11pt">'+subjectsButtons[i][language]+'</div></div></b>');

	$("." + subjectsButtons[i].img).attr("index",i);
	$("." + subjectsButtons[i].img).click(function(){
		magic.play()
		var index = $(this).attr("index");
		$("#nameSubject").find("p").text(subjectsButtons[index][language]);
		$("#nameSubject").find("p").css("font-size","1.7em");

		for(var p = 0 ; p<= games.length-1 ;p++){
			if(subjectsButtons[index].name == "All subjects"){
				$("#minigamesContainer").find("." + games[p].subject).show();
			}else{
				$("#minigamesContainer").find("." + games[p].subject).hide();
			}
		}

		$("#minigamesContainer").find("." + subjectsButtons[index].name.toLowerCase()).show();
	})
}




function showGames(){
	$("#minigamesContainer").html("");
	var pathGames = "games/nonrefactored/"
	var games = yogomeGames.getGames("absolute");
	for(var i = 0 ; i<= games.length-1 ;i++){
		var num = i;
			var minigameHref;
			if(language != "ES" ){
				minigameHref = games[i].mapUrl + "?language=EN";

			}else{
				minigameHref = games[i].mapUrl + "?language=" + language;
			}



			if(epicsite){
				$("#minigamesContainer").append("<div id='minigameNumber" +num +"' rev='"+games[i].name+"' class='gameCatalog " +games[i].subject +"' id='gameimg" + num +"'><div id='btnMinigame" + i + "' class='minigameBg col-xs-6 col-sm-4'></div></div>");
				$("#minigameNumber" + num).attr("https://play.yogome.com/" + "data-url",minigameHref)
				$("#minigameNumber" + num).click(function(){
					parent.location.href =  $(this).attr("data-url");
				});
			}else{
				$("#minigamesContainer").append("<a href='https://play.yogome.com/"+ minigameHref +"' rev='"+games[i].name+"' class='gameCatalog " +games[i].subject +"' id='gameimg" + num +"'><div id='btnMinigame" + i + "' class='minigameBg col-xs-6 col-sm-4'></div></a>");
			}

            $("#btnMinigame" + num).append("<img src='https://play.yogome.com/playweb/shared/minigames/images/icons/" + games[i].sceneName + ".png'>")
            //$("#btnMinigame" + num).append("<img src='https://play.yogome.com/" + games[i].url +  "images/fbpost.png'>")
            $("#btnMinigame" + num).append("<p>"+games[num].name+"</p>")
        
            $("#btnMinigame" + num).find("img").on("error", function(){
            
			$(this).attr('src', 'assets/images/noimage.png');
		    });
        
        
			$("#gameimg" + num).attr("value",i);

	}
}

function minigamesEpicsite(url){
	parent.location.href = url;
}


//function showDemoGames(){
//	$("#minigamesContainer").html("");
//    var pathGames = "games/nonrefactored/"
//	var games = yogomeGames.getGames("absolute");
//	for(var i = 0 ; i<= games.length-1 ;i++){
//		var num = i;
//			var minigameHref;
//			if(language != "ES" ){
//				minigameHref = games[i].mapUrl + "?language=EN";
//
//			}else{
//				minigameHref = games[i].mapUrl + "?language=" + language;
//			}
//
//
//
//			if(epicsite){
//				$("#minigamesContainer").append("<div id='minigameNumber" +num +"' rev='"+games[i].name+"' class='gameCatalog " +games[i].subject +"' id='gameimg" + num +"'><div id='btnMinigame" + i + "' class='minigameBg col-xs-6 col-sm-4'></div></div>");
//				$("#minigameNumber" + num).attr("data-url",minigameHref)
//				$("#minigameNumber" + num).click(function(){
//					parent.location.href =  $(this).attr("data-url");
//				});
//			}else{
//				$("#minigamesContainer").append("<a href='"+ minigameHref +"' rev='"+games[i].name+"' class='gameCatalog " +games[i].subject +"' id='gameimg" + num +"'><div id='btnMinigame" + i + "' class='minigameBg col-xs-6 col-sm-4'></div></a>");
//			}
//
//
//			$("#btnMinigame" + num).css("background-image","url('https://play.yogome.com/epicweb/shared/minigames/images/icons/" + games[i].sceneName + ".png')");
//			$("#gameimg" + num).attr("value",i);
//		
//	}
//}


function callBackLogIn(){
	var credentials = loginModal.getChildData()
	var email = credentials.parentMail
	if(email){
		$("#menuUserMovil").css("display","block");
		$("#menuUser").css("display","flex");
		$(".accesButtons").hide();
		$(".accesButtonsMovil").hide();
		$(".navbar").addClass("navbar-login");
		$("#id_user").text(email)
		$("#id_userMovil").text(email)
	}

	showGames();

}

showGames();

