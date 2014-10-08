(function (win, doc, undefined)
{
	'use strict';

	var game = {

			init: function (options)
			{
				this.socket = io('/' + this.getGameId());

				this.size = options.size;

				return this.mapDom().addListeners();
			}

		,	getGameId: function ()
			{
				return location.pathname.split('/')[2];
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
				this.message = this.$('#js-message')[0];

				return this;
			}

		,	addListeners: function ()
			{
				this.board.addEventListener('click', this.clickHandler.bind(this));

				this.socket
					.on('ready', this.ready.bind(this))
					.on('select', this.select.bind(this))
					.on('setPlayerId', this.setPlayerId.bind(this));

				return this;
			}

		,	clickHandler: function (e)
			{
				var id = this.id
					,	target = e.target
					,	data = target.dataset;

				if (this.isMyTurn && !this.isSelected(target))
				{
					this.select({
						player: id
					,	row: data.row
					,	column: data.column
					});
				}
			}

		,	ready: function ()
			{
				var id = this.id;

				this.isMyTurn = id === 1;

				return this.clearMessage().updateStatus().generateBoard();
			}

		,	clearMessage: function ()
			{
				var message = this.message;

				while (message.firstChild)
					message.removeChild(message.firstChild);

				return this;
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

		,	setPlayerId: function (id)
			{
				this.id = id;

				return this;
			}

		,	isSelected: function (element)
			{
				return element.classList.contains('selected');
			}

		,	select: function (options)
			{
				var id = this.id
					,	row = options.row
					,	column = options.column
					,	player = options.player
					,	element = this.$('[data-row="' + row + '"][data-column="' + column + '"]')[0];

				element.classList.add('selected', 'tile-' + player);

				// Tell the other guy I selected
				if (player === id)
					this.socket.emit('select', {
						row: row
					,	column: column
					});

				if (!this.isGameOver())
					this.togglePlayer();

				else if (this.winner === id)
					this.celebrate();

				else
					this.setStatus('You lose!');

				return this;
			}

		,	togglePlayer: function ()
			{
				this.isMyTurn = !this.isMyTurn;

				return this.updateStatus();
			}

		,	updateStatus: function ()
			{
				this.setStatus(this.isMyTurn ? 'Your turn.' : '');

				return this;
			}

		,	isGameOver: function ()
			{
				if (this.hasPlayerWon(1))
					return (this.winner = 1);

				if (this.hasPlayerWon(2))
					return (this.winner = 2);

				if (!this.$(':not(.selected)').length)
					return true;

				return false;
			}

		,	hasPlayerWon: function (id)
			{
				this.playerTiles = this.board.getElementsByClassName('tile-' + id);

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
				return this.hasDiagonal();
			}

		,	hasRightDiagonal: function ()
			{
				return this.hasDiagonal(true);
			}

		,	hasStraight: function (data)
			{
				var size = this.size
					,	valid = false
					,	grouped = {}
					,	attr = null;

				this.forEach(this.playerTiles, function (element)
				{
					grouped[element.dataset[data]] = ++grouped[element.dataset[data]] || 1;
				});

				for (attr in grouped)
					valid = valid || grouped[attr] === size;

				return valid;
			}

		,	hasDiagonal: function (inverse)
			{
				var size = this.size
					,	valid = true
					,	i = 0;

				if (inverse)
					for (i = 0; i < size; i++)
						valid = valid && this.hasTile(i, size - i - 1);

				else
					for (i = 0; i < size; i++)
						valid = valid && this.hasTile(i, i);

				return valid;
			}

		,	hasTile: function (row, column)
			{
				var valid = false;

				row = row.toString();
				column = column.toString();

				this.forEach(this.playerTiles, function (element)
				{
					if (element.dataset.row === row && element.dataset.column === column)
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
