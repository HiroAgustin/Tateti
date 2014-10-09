;(function (win, doc, undefined)
{
	'use strict';

	var game = {

			init: function (options)
			{
				this.socket = io('/' + this.getGameId());

				this.size = options.size;

				return this.mapDom().setName().addListeners();
			}

		,	getGameId: function ()
			{
				return location.pathname.split('/')[2];
			}

		,	mapDom: function ()
			{
				this.$name = utils.$('#js-name')[0];
				this.$board = utils.$('#js-board')[0];
				this.$status = utils.$('#js-status')[0];
				this.$message = utils.$('#js-message')[0];

				return this;
			}

		,	addListeners: function ()
			{
				utils.on('click', this.$board, this.clickHandler.bind(this));

				this.socket
					.on('ready', this.ready.bind(this))
					.on('select', this.select.bind(this))
					.on('setStatus', this.setStatus.bind(this))
					.on('setPlayerId', this.setPlayerId.bind(this))
					.on('togglePlayer', this.togglePlayer.bind(this));

				return this;
			}

		,	setName: function ()
			{
				this.emit('setName', this.$name.innerHTML);

				return this;
			}

		,	emit: function (key, message)
			{
				this.socket.emit(key, message);

				return this;
			}

		,	clickHandler: function (e)
			{
				var target = e.target
					,	data = target.dataset;

				// TODO Game is over
				if (this.isMyTurn && !this.isSelected(target))
				{
					this.select({
						player: this.id
					,	row: data.row
					,	column: data.column
					});
				}

				return this;
			}

		,	clearMessage: function ()
			{
				var $message = this.$message;

				while ($message.firstChild)
					$message.removeChild($message.firstChild);

				return this;
			}

		,	ready: function ()
			{
				var id = this.id;

				this.isMyTurn = id === 1;

				return this.clearMessage().generateBoard();
			}

		,	generateBoard: function ()
			{
				var size = this.size
					,	element = null
					,	i = 0, j = 0;

				// TODO optimizable, do not append on iterations.

				for (i = 0; i < size; i++)
				{
					for (j = 0; j < size; j++)
					{
						element = doc.createElement('div');

						element.classList.add('tile');

						element.dataset.row = i;
						element.dataset.column = j;

						this.$board.appendChild(element);
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

		,	selectTile: function (tile)
			{
				var selector = '[data-row="' + tile.row + '"][data-column="' + tile.column + '"]'
					,	element = utils.$(selector, this.$board)[0];

				element.classList.add('selected', 'tile-' + tile.player);

				return this;
			}

		,	select: function (tile)
			{
				this.selectTile(tile);

				// Tell the server I selected a tile
				if (tile.player === this.id)
					this.emit('select', tile);

				return this;
			}

		,	togglePlayer: function (id)
			{
				this.isMyTurn = this.id === id;

				return this;
			}

		,	setStatus: function (text)
			{
				this.$status.innerHTML = text;

				return this;
			}
		};

	game.init({
		size: 3
	});

}(window, document));
