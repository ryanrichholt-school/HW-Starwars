// Heyo
var player;
var enemy;
var messages = [];
var enemies = [];
var characters = [];

function message(msg){
	console.log(msg)
	messages.unshift(msg)
}

function Card(name, playable, side, health, power, thumbnail){
	this.name = name;
	this.playable = playable;
	this.side = side;
	this.health = health;
	this.power = power;
	this.thumbnail = thumbnail || 'assets/Unknown.jpg'
	this.alive = true;

	this.update = function(classes){
		this.element = $("<div>", {id: this.name, class: "col-xs-4 card " + this.side})
		this.element.append($("<span>Health: "+this.health+" Power: "+this.power+"</span>"))
		this.element.append($("<img>", {src:this.thumbnail, class: "img-responsive img-circle center-block character-img"}))
		this.element.append("<h1>" + this.name + "</h1>")
	}

	this.attack = function(defender){
		if(this.alive){
			this.power += 5;
			defender.defend(this);
			this.update();
		}
	}

	this.defend = function(attacker){
		damage = attacker.power;
		this.health = this.health - attacker.power
		this.update();
		message(this.name + ' suffers ' + damage + ' damage from ' + attacker.name)
		if(this.health <= 0){
			this.alive = false;
			message(this.name + ' has died!')
		}
	}

	this.update()
}

function makechars(){
	characters = [
		new Card('BobaFett', true, 'dark', 150, 23, 'assets/bobafett.png'),
		new Card('Stormtrooper', true, 'dark', 150, 23, 'assets/stormtrooper.png'),
		new Card('Vader', false, 'dark', 150, 23, 'assets/darthvader.png'),
		new Card('R2D2', true, 'light', 150, 23, 'assets/r2d2.png'),
		new Card('Yoda', true, 'light', 150, 26, 'assets/yoda.png'),
		new Card('Skywalker', false, 'light', 150, 42, 'assets/skywalker.png')
	]
}

function playerselect(){
	message('Choose a character:')
	$(".characters").show()
	for(i in characters){
		char = characters[i]
		if(char.playable === true){
			char.element.click(char, function(event){
				player = event.data
				$(".characters").hide()
				$(".characters").empty()
				console.log('Player selected', player.name)
				enemyselect()
			})
			$(".characters").append(char.element)
		}
	}
}


function enemyselect(){	
	message('Choose an enemy:')
	$(".battlefield").hide()
	$(".enemies").show()
	$(".enemies").empty()
	$(".characters").hide()

	for(i in characters){
		char = characters[i]
		console.log(char.name, char.side)
		if(char.side !== player.side){
			console.log('pushing')
			enemies.push(char)
		}
	}

	nextenemy()
}

function nextenemy(){
	$(".battlefield").hide()
	$(".enemies").show()
	$(".characters").hide()
	$(".characters").empty()

	if(enemies.length > 0){
		message('Choose an enemy:')
		for(i in enemies){
			en = enemies[i]
			if(en.alive){
				console.log('listing', en.name)
				en.element.click(en, function(event){
					enemy = event.data
					$(".enemies").hide()
					$(".enemies").empty()
					start()
				})
				$(".enemies").append(en.element)
			}
		}
	}
	else {
		win()
	}
}


function win(){
	message('Congratulations, you win!')
	newgame()
}

function gameover(){
	message('Game Over!')
	newgame()
}

function start(){
	$(".attack").prop('disabled', false)
	console.log(player.name)
	console.log(enemy.name)
	message(player.name + ' vs ' + enemy.name)

	player.update()
	enemy.update()
	$(".player-slot").html(player.element)
	$(".enemy-slot").html(enemy.element)
	$(".battlefield").show()

	$(".attack").click(function(){
		player.attack(enemy)
		enemy.attack(player)
		if(!enemy.alive){
			player.health += 100;
			$(".attack").prop('disabled', true);
			setTimeout(function(){
				nextenemy()
			}, 1000)
		}
		else if(!player.alive){
			$(".attack").prop('disabled', true)
			setTimeout(function(){
				gameover()
			}, 1000)
		}
		player.update()
		enemy.update()
		$(".player-slot").html(player.element)
		$(".enemy-slot").html(enemy.element)
	})
}


function newgame(){
	//reset everytihng
	$(".battlefield").hide()
	$(".characters").empty()
	$(".characters").hide()
	$(".enemies").empty()
	$(".enemies").hide()
	messages = [];
	enemies = [];
	characters = [];
	player = null;
	enemy = null;

	makechars()
	$(".startgame").show()
	$(".startgame").click(function(){
		$(".startgame").hide()
		playerselect()
	})
}

setInterval(function(){
	msg = messages.pop()
	$('.messages').text(msg)
}, 250)

newgame()


