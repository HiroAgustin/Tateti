var Player = function Player (socket, id)
{
    this.socket = socket;
    this.game = id;

    this.init();
};

Player.prototype = {

    init: function ()
    {
        this.socket.join(this.game);

        this.addListeners();

        return this;
    }

,   addListeners: function ()
    {
        var socket = this.socket
        ,   game = this.game
        ,   self = this;

        socket.on('select', function (tile)
        {
            socket.broadcast.to(game).emit('otherPlayerSelected', {
                playerId: self.playerId
            ,   row: tile.row
            ,   column: tile.column
            });
        });

        return this;
    }

,   setPlayerNumber: function (number)
    {
        this.playerId = number;

        this.socket.emit('setPlayerNumber', number);

        return this;
    }
};

module.exports = Player;