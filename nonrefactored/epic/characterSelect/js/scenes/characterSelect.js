
var soundsPath = "../../shared/minigames/sounds/"
var characterSelect = function(){
    
    var localizationData = {
		"EN":{
            "howTo":"How to Play?",
            "moves":"Moves left",
			"stop":"Stop!"
		},

		"ES":{
            "moves":"Movimientos extra",
            "howTo":"¿Cómo jugar?",
            "stop":"¡Detener!"
		}
	}
    

	assets = {
        images: [

		],
		sounds: [
            {	name: "magic",
				file: soundsPath + "magic.mp3"},
		],
    }
    
        
	var sceneGroup = null
	var background
	var particlesGroup, particlesUsed
    var gameIndex = 7
	var indexGame
    var overlayGroup
    var spaceSong
    
    var character
	var character2
	var character3
	var character4
	var character5
	var selected=false
	var next, prev, continuar
	var move=false
	var actual=4
	var space=300
	var secondText
	var style = { font: "40px Arial", fill: "#ffffff", align: "center" };
	var style2 = { font: "30px Arial", fill: "#ffffff", align: "center" };
	var selectedCharacter=null;
	var yogotars = [
    {name:"yogotarEagle", element:"wind", namey:"name_eagle", offsetxn:0, offsetxc:-90,scalec:.8,scalen:.8, offsetyc:-100},//0
    {name:"yogotarLuna", element:"earth" , namey:"name_luna" , offsetxn:20, offsetxc:-90,scalec:.8,scalen:.8, offsetyc:-100},//1
    {name:"yogotarNao", element:"water" , namey:"name_nao", offsetxn:20 , offsetxc:-60,scalec:.7,scalen:.8, offsetyc:-100},//2
    {name:"yogotarTomiko", element:"wind" , namey:"name_tomiko" , offsetxn:0, offsetxc:-80,scalec:.8,scalen:.8, offsetyc:-100},//3
	{name:"yogotarDinamita", element:"fire" , namey:"name_dinamita", offsetxn:0, offsetxc:-80,scalec:.8,scalen:.8, offsetyc:-100} ,//4
	{name:"yogotarEstrella", element:"water" , namey:"name_estrella" , offsetxn:0, offsetxc:-90,scalec:.8,scalen:.8, offsetyc:-100},//5
    {name:"yogotarArthurius", element:"earth" , namey:"name_arthurius" , offsetxn:0, offsetxc:-60,scalec:.8,scalen:.8, offsetyc:-100},//6
    {name:"yogotarTheffanie", element:"fire" , namey:"name_theffanie", offsetxn:0, offsetxc:-90,scalec:.8,scalen:.8, offsetyc:-80},//7
    {name:"yogotarRazzle", element:"water" , namey:"name_razzle" , offsetxn:-30, offsetxc:-90,scalec:.7,scalen:.6, offsetyc:-100},//8
	{name:"yogotarDazzle", element:"fire" , namey:"name_dazzle" , offsetxn:-5, offsetxc:-90,scalec:.7,scalen:.6, offsetyc:-100},//9
    {name:"yogotarOof", element:"earth" , namey:"name_oof" , offsetxn:40, offsetxc:-90,scalec:.8,scalen:.8, offsetyc:-100},//10
	{name:"yogotarOona", element:"wind" , namey:"name_oona" , offsetxn:20, offsetxc:-90,scalec:.8,scalen:.8, offsetyc:-100},//11
	{name:"yogotarJustice", element:"earth" , namey:"name_justice" , offsetxn:0, offsetxc:-90,scalec:.8,scalen:.8, offsetyc:-100},//12
    {name:"yogotarPaz", element:"fire" , namey:"name_paz" , offsetxn:50, offsetxc:-70,scalec:.8,scalen:.8, offsetyc:-80},//13

    
	
    
	]
	
	function loadSounds(){
		sound.decode(assets.sounds)
	}

	function initialize(){

        game.stage.backgroundColor = "#ffffff"
        loadSounds()
		
		
	}
    
    function preload(){
        
		buttons.getImages(game)
		
        game.stage.disableVisibilityChange = false;
        
        game.load.audio('spaceSong', soundsPath + 'songs/childrenbit.mp3');
		
		game.load.image("selectBar","../characterSelect/images/select.png")
		game.load.image("acceptBtn","../characterSelect/images/accept.png")
		game.load.image("arrow","../characterSelect/images/arrows.png")
		
		game.load.image("contin","../characterSelect/images/contaainer_gradient.png")
		game.load.image("contout","../characterSelect/images/container_border.png")
		
		game.load.image("eagle","../characterSelect/images/yogotarEagle.png")
		game.load.image("eagle_name","../characterSelect/images/name_eagle.png")
		
		game.load.image("luna","../characterSelect/images/yogotarLuna.png")
		game.load.image("eagle_luna","../characterSelect/images/name_luna.png")
		
		for(var order=0; order<yogotars.length; order++){
			
			game.load.image(yogotars[order].name,"../characterSelect/images/"+yogotars[order].name+".png")
			game.load.image(yogotars[order].namey,"../characterSelect/images/"+yogotars[order].namey+".png")
			
		}
		
			game.load.image("wind","../characterSelect/images/wind.png")
			game.load.image("fire","../characterSelect/images/fire.png")
			game.load.image("earth","../characterSelect/images/earth.png")
			game.load.image("water","../characterSelect/images/water.png")
		
		
		console.log(localization.getLanguage() + ' language')
        
			
		
    }
    

	function createBackground(){
		backgroundGroup = game.add.group()
        sceneGroup.add(backgroundGroup)
		
		character=new Array(yogotars.length)
		character2=new Array(yogotars.length)
		character3=new Array(yogotars.length)
		character4=new Array(yogotars.length)
		character5=new Array(yogotars.length)
		

		
        //Interpote color
		
		
		game.stage.backgroundColor = "#0c9fc7";



    var out = [];

    var bmd = game.add.bitmapData(game.world.width, game.world.height);
     var backgroud = bmd.addToWorld();
     backgroundGroup.add(backgroud)
	
    var y = 0;

    for (var i = 0; i < game.world.height; i++)
    {
        var c = Phaser.Color.interpolateColor(0x504de3, 0x250363, game.world.height, i);

        // console.log(Phaser.Color.getWebRGB(c));

        bmd.rect(0, y, game.world.width, y, Phaser.Color.getWebRGB(c));

        out.push(Phaser.Color.getWebRGB(c));

        y += 1;
    }

		
		//End interpolate
		
		for(var put=0;put<yogotars.length;put++){
		
		character4[put]=backgroundGroup.create(game.world.centerX-space-100,game.world.centerY-70,"contin")
		character4[put].anchor.setTo(.5)
		character5[put]=backgroundGroup.create(character4[put].centerX-2,character4[put].centerY+5,"contout")
		character5[put].anchor.setTo(.5)
		character[put]=backgroundGroup.create(character4[put].centerX+yogotars[put].offsetxc,character4[put].centerY+yogotars[put].offsetyc,yogotars[put].name)
		
		
		character2[put]=backgroundGroup.create(character4[put].centerX+yogotars[put].offsetxn,character4[put].centerY+180,yogotars[put].namey)
		character2[put].scale.setTo(yogotars[put].scalen)
		
		character3[put]=backgroundGroup.create(character4[put].centerX+70,character4[put].centerY+250,yogotars[put].element)
		character[put].scale.setTo(yogotars[put].scalec)
		character3[put].scale.setTo(.8)

		if(yogotars[put].element=="fire"){
			character4[put].tint = 0xCE2946;
		}
		if(yogotars[put].element=="wind"){
			character4[put].tint = 0xF1CC30;
		}
		if(yogotars[put].element=="earth"){
			character4[put].tint = 0x8AE937;
		}
		if(yogotars[put].element=="water"){
			character4[put].tint = 0x62ACFB;
		}
		
			character[put].tag=yogotars[put].name
			character2[put].tag=yogotars[put].name
			character3[put].tag=yogotars[put].name
			character4[put].tag=yogotars[put].name
			character5[put].tag=yogotars[put].name
		
			
			character[put].inputEnabled=true
			character2[put].inputEnabled=true
			character3[put].inputEnabled=true
			character[put].events.onInputDown.add(opacateAll,character[put])
			character2[put].events.onInputDown.add(opacateAll,character[put])
			character3[put].events.onInputDown.add(opacateAll,character[put])
		
		    space-=200
			if(put>actual){
				character2[put].alpha=0
				character3[put].alpha=0
				character4[put].alpha=0
				character5[put].alpha=0
				character[put].alpha=0
			}
		}
		
		for(var adding=0; adding<yogotars.length;adding++){
			backgroundGroup.add(character4[adding])
			backgroundGroup.add(character5[adding])
		}
		for(var adding2=0; adding2<yogotars.length;adding2++){
			backgroundGroup.add(character[adding2])
		}
		
		var sel= backgroundGroup.create(game.world.centerX,game.world.centerY/5,"selectBar")
		sel.anchor.setTo(.5)
		continuar=backgroundGroup.create(game.world.centerX-160,game.world.centerY+350,"acceptBtn")
		prev=backgroundGroup.create(game.world.centerX-600,game.world.centerY-100,"arrow")
		next=backgroundGroup.create(game.world.centerX+600,game.world.centerY-100,"arrow")
		next.scale.setTo(-1,1)
		continuar.alpha=0
		
		//textos
		
		var firstText=game.add.text(sel.centerX-250, sel.centerY-18, "SELECT YOUR YOGOTAR:",style);
		 secondText=game.add.text(continuar.centerX-75,continuar.centerY-15,"CONTINUE",style2)
		 secondText.alpha=0
		backgroundGroup.add(firstText)
		backgroundGroup.add(secondText)

         prev.inputEnabled = true
		 next.inputEnabled = true
		 continuar.inputEnabled = true
        
		next.events.onInputDown.add(function(){
			if(actual<13){
				fadeOut(character[actual-4], character2[actual-4], character3[actual-4], character4[actual-4], character5[actual-4])
				actual++
				move=true
				fadeIn(character[actual], character2[actual], character3[actual], character4[actual], character5[actual])
				
				for(var check=0;check<yogotars.length;check++){
				carrousel(character[check], character2[check], character3[check], character4[check], character5[check],move)
				}
			}
        })
		prev.events.onInputDown.add(function(){
			if(actual>4){
				fadeOut(character[actual], character2[actual], character3[actual], character4[actual], character5[actual])
				actual--
				move=false
				fadeIn(character[actual-4],character2[actual-4],character3[actual-4],character4[actual-4],character5[actual-4])
				
				for(var check=0;check<yogotars.length;check++){
					carrousel(character[check],character2[check],character3[check],character4[check],character5[check],move)
				}
			}
        })
		
		continuar.events.onInputDown.add(function(){
			//Aqui ira el redireccionamiento
			if(continuar.alpha==1){
				selectedCharacter = selectedCharacter.replace("yogotar", "")
				console.log(selectedCharacter)
				console.log(sceneGroup)
				game.add.tween(sceneGroup).to({alpha:0}, 500, Phaser.Easing.Cubic.Out, true).onComplete.add(function () {
					console.log("end")
					game.destroy()
					// game.paused = true
					epicSiteMain.charSelected(selectedCharacter)
				})
			}
        })
		
		
		
		
    }
	
	function opacateAll(obj){
		
		
		if(obj.alpha==1){
		selectedCharacter=obj.tag
		secondText.alpha=1
		continuar.alpha=1
		
		for(var opacate=0; opacate<yogotars.length;opacate++){
		
				if(character[opacate].tag==obj.tag){
					if(yogotars[opacate].element=="fire"){
						character4[opacate].tint = 0xCE2946;
							character[opacate].tint=0xffffff
							character2[opacate].tint=0xffffff
							character3[opacate].tint=0xffffff
							character5[opacate].tint=0xffffff
					}
					if(yogotars[opacate].element=="wind"){
						character4[opacate].tint = 0xF1CC30;
							character[opacate].tint=0xffffff
							character2[opacate].tint=0xffffff
							character3[opacate].tint=0xffffff
							character5[opacate].tint=0xffffff
					}
					if(yogotars[opacate].element=="earth"){
						character4[opacate].tint = 0x8AE937;
							character[opacate].tint=0xffffff
							character2[opacate].tint=0xffffff
							character3[opacate].tint=0xffffff
							character5[opacate].tint=0xffffff
					}
					if(yogotars[opacate].element=="water"){
						character4[opacate].tint = 0x62ACFB;
							character[opacate].tint=0xffffff
							character2[opacate].tint=0xffffff
							character3[opacate].tint=0xffffff
							character5[opacate].tint=0xffffff
					}
				}
			if(character[opacate].tag!=obj.tag){
				character[opacate].tint=0x696969;
				character2[opacate].tint=0x696969;
				character3[opacate].tint=0x696969;
				character4[opacate].tint=0x696969;
				character5[opacate].tint=0x696969;
				
				}
			
			}
			
			
		}
		
	}

	function carrousel(obj,obj2,obj3,obj4,obj5, moving){
	
		if(moving==true){
			
			game.add.tween(obj).to( { x: obj.position.x-200 }, 100, Phaser.Easing.Out, true);
			game.add.tween(obj2).to( { x: obj2.position.x-200 }, 100, Phaser.Easing.Out, true);
			game.add.tween(obj3).to( { x: obj3.position.x-200 }, 100, Phaser.Easing.Out, true);
			game.add.tween(obj4).to( { x: obj4.position.x-200 }, 100, Phaser.Easing.Out, true);
			game.add.tween(obj5).to( { x: obj5.position.x-200 }, 100, Phaser.Easing.Out, true);
			
			
		}
		if(moving==false){
			
			game.add.tween(obj).to( { x: obj.position.x+200 }, 100, Phaser.Easing.Out, true);
			game.add.tween(obj2).to( { x: obj2.position.x+200 }, 100, Phaser.Easing.Out, true);
			game.add.tween(obj3).to( { x: obj3.position.x+200 }, 100, Phaser.Easing.Out, true);
			game.add.tween(obj4).to( { x: obj4.position.x+200 }, 100, Phaser.Easing.Out, true);
			game.add.tween(obj5).to( { x: obj5.position.x+200 }, 100, Phaser.Easing.Out, true);
			
		}
	
	}
    function fadeIn(obj, obj2, obj3, obj4, obj5){
			
		game.add.tween(obj).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
		game.add.tween(obj2).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
		game.add.tween(obj3).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
		game.add.tween(obj4).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
		game.add.tween(obj5).to({alpha:1}, 100, Phaser.Easing.Cubic.In, true,100)
		
	}
	function fadeOut(obj , obj2, obj3, obj4, obj5){
		
		game.add.tween(obj).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true,100)
		game.add.tween(obj2).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true,100)
		game.add.tween(obj3).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true,100)
		game.add.tween(obj4).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true,100)
		game.add.tween(obj5).to({alpha:0}, 300, Phaser.Easing.Cubic.Out, true,100)
	}
    
	function selected(obj){
		
		if(selectedCharacter!=null){
		//continuar-alpha=1
		}
	}
	
	return {
		
		assets: assets,
		name: "characterSelect",
        preload:preload,
		create: function(event){
            
			sceneGroup = game.add.group()

			game.add.tween(sceneGroup).from({alpha:0}, 500, Phaser.Easing.Cubic.In, true)
			createBackground()
                        			
            // spaceSong = game.add.audio('spaceSong')
            // game.sound.setDecodedCallback(spaceSong, function(){
                // spaceSong.loopFull(0.6)
            // }, this);
            
            
            initialize()
		
            
		},
		show: function(event){
			loadSounds()
			initialize()
		}
	}
}()