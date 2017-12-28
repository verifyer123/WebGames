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
		// console.log(cards)
		for(var key in epicCharacters){
			// console.log(key, "key")
			var enemyData = epicCharacters[key]
			for(var cardIndex = 0; cardIndex<cards.length; cardIndex++){
				//TODO uncomment this when charSelector is ready
				var card = cards[cardIndex]//cards[cardIndex]
				// console.log(card.id, key, "card")
				var discard = false
				if(key !== card.id){
					// console.log(enemyData)
					var cardData = epicCharacters[card.id]
					var multiplier = ELEMENT_MULTIPLIERS[cardData.stats.element][enemyData.stats.element] || 1
					// console.log(multiplier)
					discard = multiplier<1
				}else{
					discard = true
					break
				}
			}
			if(!discard){
				var cardEnemy = {id:enemyData.id, xp:0, data:enemyData}
				enemies.push(cardEnemy)
			}
		}

		Phaser.ArrayUtils.shuffle(enemies)
		// console.log(enemies, "enemies")

		return enemies

	}
	
	function getMaxXp(cards) {
		var maxXp = 0

		for(var cardIndex = 0; cardIndex < cards.length; cardIndex++){
			var card = cards[cardIndex]
			// console.log(card, "card")
			maxXp = card.xp > maxXp ? card.xp : maxXp
		}

		return maxXp
	}
	
	function generateOpponents(numOpponents) {
		var opponents = []

		var players = parent.epicModel || epicModel
		var currentPlayer = players.getPlayer()
		var cards = currentPlayer.cards
		
		var enemyCards = generateEnemyCards(cards)
		var maxXp = getMaxXp(cards)

		for (var numIndex = 0; numIndex < numOpponents; numIndex++){
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