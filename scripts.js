(function (win, doc, undefined)
{
    'use strict';
    
    var game = {

            init: function (options)
            {
                this.size = options.size;
                this.isPlayerOne = true;

                return this.mapDom().generateBoard().addListeners();
            }

        ,   $: function (id)
            {
                return doc.getElementById(id)
            }

        ,   forEach: function (list, iterator)
            {
                return Array.prototype.forEach.call(list, iterator);
            }

        ,   mapDom: function ()
            {
                this.board = this.$('js-board')
                this.marker = this.$('js-marker')
                this.indicator = this.$('js-player-indicator')

                return this;
            }

        ,   generateBoard: function ()
            {
                var size = this.size
                ,   element = null
                ,   i = 0
                ,   j = 0;

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

                this.board.style.width = 200 * size + 'px';
                this.board.style.height = 200 * size + 'px';

                return this;
            }

        ,   addListeners: function ()
            {
                var self = this;

                this.board.addEventListener('click', function (e)
                {
                    if (!self.winner && !self.isSelected(e.target))
                        self.select(e.target);
                });

                return this;
            }

        ,   isSelected: function (element)
            {
                return element.classList.contains('selected');
            }

        ,   getPlayerId: function ()
            {
                return this.isPlayerOne ? '1' : '2';
            }

        ,   select: function (element)
            {
                element.classList.add('selected');
                element.classList.add('player-' + this.getPlayerId());

                if (!this.isGameOver())
                    this.togglePlayer();
                else
                    this.celebrate();

                return this;
            }

        ,   togglePlayer: function ()
            {
                this.isPlayerOne = !this.isPlayerOne;
                this.indicator.innerHTML = this.getPlayerId();
                this.indicator.classList.toggle('player-2');

                return this;
            }

        ,   isGameOver: function ()
            {
                if (this.hasPlayerWon())
                    return (this.winner = this.getPlayerId());
                else if (!this.board.querySelectorAll(':not(.selected)').length)
                    return true;

                return false;
            }

        ,   hasPlayerWon: function ()
            {
                this.playerTiles = this.board.getElementsByClassName('player-' + this.getPlayerId());

                return this.playerTiles.length >= this.size && (
                    this.hasRow() || this.hasColumn() || 
                    this.hasLeftDiagonal() || this.hasRightDiagonal()
                );
            }

        ,   hasRow: function ()
            {
                return this.hasStraight('row');
            }

        ,   hasColumn: function ()
            {
                return this.hasStraight('column');
            }

        ,   hasLeftDiagonal: function ()
            {
                var valid = true
                ,   size = this.size
                ,   i = 0;

                for (i = 0; i < size; i++)
                {
                    valid = valid && this.hasTile(i, i);
                }

                return valid;
            }

        ,   hasRightDiagonal: function ()
            {
                var valid = true
                ,   size = this.size
                ,   i = 0;

                for (i = 0; i < size; i++)
                {
                    valid = valid && this.hasTile(i, size - i - 1);
                }

                return valid;
            }

        ,   hasStraight: function (data)
            {
                var valid = false
                ,   grouped = {}
                ,   attr = null
                ,   size = this.size;

                this.forEach(this.playerTiles, function (element)
                {
                    grouped[element.dataset[data]] = ++grouped[element.dataset[data]] || 1;
                });

                for (attr in grouped)
                    valid = valid || grouped[attr] === size;

                return valid;
            }

        ,   hasTile: function (row, column)
            {
                var valid = false;

                this.forEach(this.playerTiles, function (element)
                {
                    if (element.dataset.row == row && element.dataset.column == column)
                        valid = true;
                });

                return valid;
            }

        ,   celebrate: function ()
            {
                if (this.winner)
                    this.marker.innerHTML = 'Congrats Player <b class="player-' + this.winner + '">' + this.winner + ' ☺</b>';
                else
                    this.marker.innerHTML = 'It\'s a tie <b>☹</b>';

                return this;
            }
        };

    game.init({
        size: 3
    });

})(window, document);