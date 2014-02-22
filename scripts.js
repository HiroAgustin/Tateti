(function (win, doc, undefined)
{
    var game = {
            board: doc.getElementById('js-board')
        ,   marker: doc.getElementById('js-marker')
        ,   indicator: doc.getElementById('js-player-indicator')
        ,   playerOne: true
        ,   init: function ()
            {
                var self = this;

                this.board.addEventListener('click', function (e)
                {
                    !self.isSelected(e.target) && self.select(e.target);
                });

                return this;
            }

        ,   isSelected: function (element)
            {
                return element.classList.contains('selected');
            }

        ,   isGameOver: function ()
            {
                var board = this.board
                ,   tiles = board.children;


                if (!board.querySelectorAll(':not(.selected)').length)
                    return true;

                return false;
            }

        ,   getPlayerId: function ()
            {
                return this.playerOne ? '1' : '2';
            }

        ,   togglePlayer: function ()
            {
                this.playerOne = !this.playerOne;
                this.indicator.innerHTML = this.getPlayerId();
                this.indicator.classList.toggle('player-2');

                return this;
            }

        ,   celebrate: function ()
            {
                if (this.winner)
                    return;
                else
                    this.marker.innerHTML = 'It\'s a tie <b>☹</b>';

                return this;
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
        };

    game.init();

})(window, document);