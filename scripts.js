(function (win, doc, undefined)
{
    'use strict';
    
    function forEach(list, iterator)
    {
        return Array.prototype.forEach.call(list, iterator);
    }

    var game = {

            init: function ()
            {
                this.isPlayerOne = true;
                return this.mapDom().tagTiles().addListeners();
            }

        ,   mapDom: function ()
            {
                this.board = doc.getElementById('js-board')
                this.marker = doc.getElementById('js-marker')
                this.indicator = doc.getElementById('js-player-indicator')

                return this;
            }

        ,   tagTiles: function ()
            {
                forEach(this.board.children, function (element, index)
                {
                    element.dataset.row = parseInt(index / 3);
                    element.dataset.column = index % 3;
                });

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

                return this.playerTiles.length >= 3 && (
                    this.hasThreeInRow() || this.hasThreeInColumn() || 
                    this.hasLeftDiagonal() || this.hasRightDiagonal()
                );
            }

        ,   hasThreeInRow: function ()
            {
                return this.hasThreeStraight('row');
            }

        ,   hasThreeInColumn: function ()
            {
                return this.hasThreeStraight('column');
            }

        ,   hasLeftDiagonal: function ()
            {
                return this.hasCenterTile() && this.hasTile(0, 0) && this.hasTile(2, 2);
            }

        ,   hasRightDiagonal: function ()
            {
                return this.hasCenterTile() && this.hasTile(0, 2) && this.hasTile(2, 0);
            }

        ,   hasCenterTile: function ()
            {
                return this.hasTile(1, 1);
            }

        ,   hasThreeStraight: function (data)
            {
                var valid = false
                ,   grouped = {}
                ,   attr = null;

                forEach(this.playerTiles, function (element)
                {
                    grouped[element.dataset[data]] = ++grouped[element.dataset[data]] || 1;
                });

                for (attr in grouped)
                    valid = valid || grouped[attr] === 3;

                return valid;
            }

        ,   hasTile: function (row, column)
            {
                var valid = false;

                forEach(this.playerTiles, function (element)
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

    game.init();

})(window, document);