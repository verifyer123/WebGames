var battleService = function () {

	var ELEMENT_MULTIPLIERS = {
		"fire": {
			"water": 0.5,
			"earth": 2,
		},
		"water": {
			"fire": 2,
			"wind": 0.5,
		},
		"wind": {
			"water": 2,
			"earth": 0.5,
		},
		"earth": {
			"fire": 0.5,
			"wind": 2,
		}
	}

	function generateEnemyCards(cards) {
		var enemies = []
		for(var key in epicCharacters){
			for(var cardIndex = 0; cardIndex<cards.length; cardIndex++){
				var card = cards[cardIndex]
				if(key !== card.id){
					var enemyData = epicCharacters[key]
					var cardData = epicCharacters[card.id]
					var multiplier = ELEMENT_MULTIPLIERS[cardData.element][enemyData.element] || 1
					if(multiplier>=1){
						var contains = false
						for(var eIndex = 0; eIndex<enemies.length; eIndex++){
							var enemy = enemies[eIndex]
							if(enemy.id === key){
								contains = true
								break
							}
						}
						if(!contains){
							var cardEnemy = {id:enemyData.id, xp:0}
							enemies.push(cardEnemy)
						}
					}
				}
			}
		}

		Phaser.ArrayUtils.shuffle(enemies)
		console.log(enemies)

		return enemies

	}
	
	function getMaxXp(cards) {
		var maxXp = 0

		for(var cardIndex = 0; cards.length; cardIndex++){
			var card = cards[cardIndex]
			maxXp = card.xp > maxXp ? card.xp : maxXp
		}

		return maxXp
	}
	
	function generateOpponents(numOpponents) {
		var opponents = []

		var currentPlayer = epicModel.getPlayer()
		var cards = currentPlayer.cards
		
		var enemyCards = generateEnemyCards(cards)
		var maxXp = getMaxXp()

		for (var numIndex = 0; numIndex < numOpponents; numIndex){
			var enemyCard = enemyCards[numIndex]
			enemyCard.xp = maxXp
			opponents.push(enemyCard)
		}
		return opponents

	}

	return{
		getOpponents:generateOpponents
	}
}()