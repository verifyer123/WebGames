var preloaderIntro = function(){

	var assets = {
		atlases: [
			/*{
				name: "logoAtlas",
				json: "../../shared/minigames/images/preloaders/amazing/atlas.json",
				image: "../../shared/minigames/images/preloaders/amazing/atlas.png"}*/
		],
		images: [],
		sounds: [],
	}

	var loadingBar = null

	return {
		assets: assets,
		name: "preloaderIntro",
		updateLoadingBar: function(loadedFiles, totalFiles){
			if(loadingBar){
				var loadingStep = loadingBar.width / totalFiles
				loadingBar.topBar.width = loadingStep * loadedFiles
			}
		},

		create: function(event){
            
            //game.stage.backgroundColor = "#d1196d"
            
			var a = game.add.sprite(game.world.centerX-142,game.world.centerY,"a")
	        a.anchor.setTo(0.5)
	        a.scale.setTo(0.2)
	        var m = game.add.sprite(game.world.centerX-89,game.world.centerY,"m")
	        m.anchor.setTo(0.5)
	        m.scale.setTo(0.2)
	        var a2 = game.add.sprite(game.world.centerX-37,game.world.centerY,"a")
	        a2.anchor.setTo(0.5)
	        a2.scale.setTo(0.2)
	        var z = game.add.sprite(game.world.centerX+4,game.world.centerY,"z")
	        z.anchor.setTo(0.5)
	        z.scale.setTo(0.2)
	        var i = game.add.sprite(game.world.centerX+33,game.world.centerY,"i")
	        i.anchor.setTo(0.5)
	        i.scale.setTo(0.2)
	        var n = game.add.sprite(game.world.centerX+63,game.world.centerY,"n")
	        n.anchor.setTo(0.5)
	        n.scale.setTo(0.2)
	        var g = game.add.sprite(game.world.centerX+105,game.world.centerY,"g")
	        g.anchor.setTo(0.5)
	        g.scale.setTo(0.2)
	        var signo = game.add.sprite(game.world.centerX+141,game.world.centerY,"signo")
	        signo.anchor.setTo(0.5)
	        signo.scale.setTo(0.2)
	        var getIn = game.add.sprite(game.world.centerX+43,game.world.centerY+35,"by_g")
	        getIn.anchor.setTo(0.5)
	        getIn.scale.setTo(0.2)

	        var mask = game.add.graphics(game.world.centerX,game.world.centerY)
	        mask.beginFill(0xffffff)
	        mask.drawRect(-175,-50,340,100)
	        mask.endFill()

	        a.mask = mask
	        m.mask = mask
	        a2.mask = mask
	        z.mask = mask
	        i.mask = mask
	        n.mask = mask
	        g.mask = mask
	        //signo.mask = mask

	        a.y -=100
	        m.y -=100
	        a2.y -=100
	        z.y -=100
	        i.y -=100
	        n.y -=100
	        g.y -=100
	        signo.x = game.world.width + 50

	        var maskGetIn = game.add.graphics(game.world.centerX+43,game.world.centerY+35)
	        maskGetIn.beginFill(backgroundColor)
	        maskGetIn.drawRect(-50,-15,100,30)
	        maskGetIn.endFill()
	        //maskGetIn.scale.setTo(1,1)

	        //getIn.mask = maskGetIn

	        game.add.tween(a).to({y:game.world.centerY},150,Phaser.Easing.linear,true)
	        game.add.tween(m).to({y:game.world.centerY},150,Phaser.Easing.linear,true,150)
	        game.add.tween(a2).to({y:game.world.centerY},150,Phaser.Easing.linear,true,300)
	        game.add.tween(z).to({y:game.world.centerY},150,Phaser.Easing.linear,true,450)
	        game.add.tween(i).to({y:game.world.centerY},150,Phaser.Easing.linear,true,600)
	        game.add.tween(n).to({y:game.world.centerY},150,Phaser.Easing.linear,true,750)
	        game.add.tween(g).to({y:game.world.centerY},150,Phaser.Easing.linear,true,900)

	        game.add.tween(maskGetIn.scale).to({x:0},300,Phaser.Easing.linear,true,900)

	        var t1 =game.add.tween(signo).to({x:game.world.centerX+141},200,Phaser.Easing.linear,true,1200)
	        t1.onComplete.add(function(){
	            game.add.tween(signo).to({angle:-10},50,Phaser.Easing.linear,true).onComplete.add(function(){
	                game.add.tween(signo).to({angle:10},100,Phaser.Easing.linear,true).onComplete.add(function(){
	                    game.add.tween(signo).to({angle:-10},100,Phaser.Easing.linear,true).onComplete.add(function(){
	                        game.add.tween(signo).to({angle:0},50,Phaser.Easing.linear,true).onComplete.add(function(){
	                        	setTimeout(function(){
	                        		completeAnimation = true
	                        		if(completeLoading){
	                        			sceneloader.show(window.game.nextTitleScene)
	                        		}
	                        	},1000)
	                        })
	                    })
	                })
	            })
	        })

		},
	}
}()