(function (win, doc, undefined)
{
    var game = {
            board: doc.getElementById('js-board')
        ,   indicator: doc.getElementById('js-player-indicator')
        ,   playerOne: true
        ,   init: function ()
            {
                var self = this;

                this.board.addEventListener('click', function (e)
                {
                    !self.isSelected(e.target) && self.select(e.target);
                });
            }

        ,   isSelected: function (element)
            {
                return element.classList.contains('selected');
            }

        ,   isGameOver: function ()
            {
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
            }

        ,   select: function (element)
            {
                element.classList.add('selected');
                element.classList.add('player-' + this.getPlayerId());

                if (!this.isGameOver())
                    this.togglePlayer();

                return this;
            }
        };

    game.init();

})(window, document);