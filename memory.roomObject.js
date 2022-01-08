RoomObject.prototype.memory = Memory.roomObjects[this.id];

function CleanUp() {
    for (let id in Memory.roomObjects) {
        if (!Game.getObjectById(id)) {
            delete Memory.roomObjects[id];
        }
    }
};

module.exports.CleanUp = CleanUp;