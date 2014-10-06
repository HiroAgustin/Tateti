(function (win, doc, undefined)
{
	'use strict';
	
	var game = {

			init: function (options)
			{
				this.socket = io();

				this.size = options.size;

				return this.mapDom().addListeners();
			}

		,	$: function (selector)
			{
				return doc.querySelectorAll(selector);
			}

		,	forEach: function (list, iterator)
			{
				return Array.prototype.forEach.call(list, iterator);
			}

		,	mapDom: function ()
			{
				this.board = this.$('#js-board')[0];
				this.status = this.$('#js-status')[0];

				return this;
			}

		,	addListeners: function ()
			{
				this.board.addEventListener('click', this.clickHandler.bind(this));

				this.socket
					.on('ready', this.ready.bind(this))
					.on('setPlayerNumber', this.setPlayerNumber.bind(this))
					.on('otherPlayerSelected', this.otherPlayerSelected.bind(this));

				return this;
			}

		,	clickHandler: function (e)
			{
				if (!this.isGameOver(this.id) && this.isMyTurn && !this.isSelected(e.target))
					this.select(e.target);
			}

		,	ready: function ()
			{
				var id = this.id;

				this.isMyTurn = id === 1;

				this.updateStatus();

				return this.generateBoard();
			}

		,	generateBoard: function ()
			{
				var size = this.size
				,	element = null
				,	i = 0
				,	j = 0;

				for (i = 0; i < size; i++)
				{
					for (j = 0; j < size; j++)
					{
						element = doc.createElement('div');

						element.classList.add('tile');

						element.dataset.row = i;
						element.dataset.column = j;

						this.board.appendChild(element);
					}
				}

				return this;
			}

		,	setPlayerNumber: function (number)
			{
				this.id = number;

				return this;
			}

		,	isSelected: function (element)
			{
				return element.classList.contains('selected');
			}

		,	otherPlayerSelected: function (data)
			{
				var element = this.$('[data-row="' + data.row + '"][data-column="' + data.column + '"]')[0];

				element.classList.add('selected');
				element.classList.add('player-' + data.playerId);

				if (!this.isGameOver(data.playerId))
					this.togglePlayer();
				else
					this.setStatus('You lose bitch!');

				return this;
			}

		,	select: function (element)
			{
				element.classList.add('selected');
				element.classList.add('player-' + this.id);

				this.socket.emit('select', element.dataset);

				if (!this.isGameOver(this.id))
					this.togglePlayer();
				else
					this.celebrate();

				return this;
			}

		,	togglePlayer: function ()
			{
				this.isMyTurn = !this.isMyTurn;
				this.updateStatus();

				return this;
			}

		,	updateStatus: function ()
			{
				var id = this.id;

				this.setStatus('Soy el <span class="player-' + id + '">' + id + '</span> y ' + (!this.isMyTurn ? 'no ' : '') + 'es mi turno');

				return this;
			}

		,	isGameOver: function (id)
			{
				if (this.hasPlayerWon(id))
					return (this.winner = id);
				else if (!this.$(':not(.selected)').length)
					return true;

				return false;
			}

		,	hasPlayerWon: function (id)
			{
				this.playerTiles = this.board.getElementsByClassName('player-' + id);

				return this.playerTiles.length >= this.size && (
					this.hasRow() || this.hasColumn() || 
					this.hasLeftDiagonal() || this.hasRightDiagonal()
				);
			}

		,	hasRow: function ()
			{
				return this.hasStraight('row');
			}

		,	hasColumn: function ()
			{
				return this.hasStraight('column');
			}

		,	hasLeftDiagonal: function ()
			{
				var size = this.size
				,	valid = true
				,	i = 0;

				for (i = 0; i < size; i++)
				{
					valid = valid && this.hasTile(i, i);
				}

				return valid;
			}

		,	hasRightDiagonal: function ()
			{
				var valid = true
				,	size = this.size
				,	i = 0;

				for (i = 0; i < size; i++)
				{
					valid = valid && this.hasTile(i, size - i - 1);
				}

				return valid;
			}

		,	hasStraight: function (data)
			{
				var valid = false
				,	grouped = {}
				,	attr = null
				,	size = this.size;

				this.forEach(this.playerTiles, function (element)
				{
					grouped[element.dataset[data]] = ++grouped[element.dataset[data]] || 1;
				});

				for (attr in grouped)
					valid = valid || grouped[attr] === size;

				return valid;
			}

		,	hasTile: function (row, column)
			{
				var valid = false;

				this.forEach(this.playerTiles, function (element)
				{
					if (element.dataset.row == row && element.dataset.column == column)
						valid = true;
				});

				return valid;
			}

		,	setStatus: function (text)
			{
				this.status.innerHTML = text;

				return this;
			}

		,	celebrate: function ()
			{
				if (this.winner)
					this.setStatus('Congrats Player <b class="player-' + this.winner + '">' + this.winner + ' ☺</b>');
				else
					this.setStatus('It\'s a tie <b>☹</b>');

				return this;
			}
		};

	game.init({
		size: 3
	});

})(window, document);