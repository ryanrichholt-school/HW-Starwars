// Star Wars RPG Ryan Richholt
var player;
var enemy;
var enemies = [];
var board = new Board();


// Better string formatting method by Stack Overflow https://stackoverflow.com/a/18234317/3924113
String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

// Log messages to the game board
function message(msg){
	console.log(msg)
	board.messages.add(msg)
}

// createCard objects

// game starts

// move all cards to bench

// select_character:
// message to player 'Choose your character'
// attach click event to all cards
	// move to player

// select_enemy:
// message to player 'Choose enemy'
// attach click event to all cards on bench
	// move to enemy

function Card(name, playable, side, health, power, thumbnail){
	this.name = name;
	this.playable = playable;
	this.side = side;
	this.health = health;
	this.power = power;
	this.thumbnail = thumbnail || 'assets/Unknown.jpg'

	this.staged_action = null;

	this.template = `
	<div class="card {side}" id={name}>
		<h1>{name}</h1>
		<img class="img-responsive img-circle" src={thumbnail}>
		<br><br>
		<strong>{side}</strong>
		<br>
		<strong>Power: </strong>{power} <strong>Health: </strong>{health}
	</div>
	`
	this.element = $("<div>", {id: this.name}).html(this.template.formatUnicorn(this))


	this.update = function(){
		this.element.html(this.template.formatUnicorn(this))
	}

	this.move_to = function(slot){
		slot.add(this.element)
		this.update()
	}

	this.attack = function(defender){
		defender.defend(this);
		this.update();
	}

	this.defend = function(attacker){
		damage = attacker.power;
		this.health = this.health - attacker.power
		this.update();
		message(this.name + ' suffers ' + damage + ' damage from ' + attacker.name)
	}
}


function Board() {
	// Sets up the game board
	$(".gameboard").html(`
	<div class="container gameboard">
		<div class="row title"><h1>Star Wars RPG</h1></div>	
		<div class="row messages"></div>
		
		<div class="row bench player-select"></div>
		<div class="row.row-eq-height battlefield">
			<div class="player-slot"></div>
			<div class="col-md-2 actions">
				<img class="img-responsive" src="assets/LightsaberCollection.png">
				<br>
				<button class="btn-danger btn-lg actions" id="attack">Attack!</button>
			</div>
			<div class="enemy-slot"></div>
		</div>

		<div class="row enemies"></div>
	</div>
	`)

	this.actions = {
		element: $(".actions")
	}

	this.messages = {
		element: $(".messages"),
		add: function(msg){
			this.element.text(msg)
		}
	}

	this.player_slot = {
		element: $(".player-slot"),
		add: function(card){
			var content = $('<div>', {class: "col-md-5"}).append(card)
			this.element.html(content)
		} 
	}

	this.enemy_slot = {
		element: $(".enemy-slot"),
		add: function(card){
			var content = $('<div>', {class: "col-md-5"}).append(card)
			this.element.html(content)
		} 
	}

	this.enemies = {
		element: $(".enemies"),
		add: function(card){
			var content = $('<div>', {class: "col-md-3"}).append(card)
			this.element.prepend(content)
			}
	}

	this.player_select = {
		element: $(".player-select"),
		add: function(card){
			var content = $('<div>', {class: "col-md-3"}).append(card)
			this.element.prepend(content)
			}
	}

	this.actions.element.hide()
}


// Create the characters
var characters = [
	new Card('Mark', true, 'dark', 150, 23),
	new Card('Chris', true, 'dark', 150, 23),
	new Card('Rango', true, 'dark', 150, 23),
	new Card('Jim', true, 'light', 150, 23),
	new Card('Vader', false, 'dark', 150, 9001),
	new Card('Skywalker', false, 'light', 150, 9001)
]



function Start(event){
	$('.player-select').remove()
	player = event.data
	console.log(player.name)

	message(player.name + "!")

	setTimeout(function(){
		message('Choose your first enemy!')
	}, 1000)

	var enemy_side;
	if(player.side === 'light'){
		enemy_side = 'dark'
	}
	else {
		enemy_side = 'light'
	}

	player.move_to(board.player_slot)

	for(i in characters){
		char = characters[i];
		char.element.off("click")

		if(char.name == player.name){

		}
		else if(char.side == player.side){
			char.element.remove()
		}
		else{
			char.move_to(board.enemies);
			enemies.push(char)
			char.element.click(char, battle)
		}
	}

}


function attack(){
	player.attack(enemy);

	if(enemy.health <= 0){
		enemy.element.remove()
		// Allow the next enemy to be chosen
		for(i in enemies){
			enemies[i].element.click(char, battle)
		}
		message("Choose the next enemy!")
		return
	}

	$("#attack").prop('disabled', true);
	setTimeout(function(){
		enemy.attack(player);
		if (player.health <= 0){
			message('Game Over!');
			return
		}
		$("#attack").prop('disabled', false);
	}, 1000)
}


function battle(event){
	enemy = event.data;
	message(enemy.name + "!");

	setTimeout(function(){
		message('Fight!');
	}, 1000)

	enemy.move_to(board.enemy_slot)

	for(i in characters){
		characters[i].element.off("click");
	}


	board.actions.element.show();


	$("#attack").click(attack)

}


// Let the player choose character
message('Choose your character!')
for(i in characters){
	var char = characters[i];
	var name = char.name;
	if(char.playable === true){
		console.log(char)
		char.move_to(board.player_select);
		char.element.click(char, Start);
	}
}

