Object.defineProperty(RoomObject.prototype, 'memory', {
    get: function() {
        if (!Memory.roomObjects) {
            //Memory.roomObjects = {};
        }
        return Memory.roomObjects[this.id];
    },
    set: function(value) {
        if (!Memory.roomObjects) {
            //Memory.roomObjects = {};
        }
        Memory.roomObjects[this.id] = value;
    }
});

//RoomObject.prototype.memory = Memory.roomObjects[this.id];

function CleanUp() {
    for (let id in Memory.roomObjects) {
        if (!Game.getObjectById(id)) {
            delete Memory.roomObjects[id];
        }
    }
};

module.exports.CleanUp = CleanUp;