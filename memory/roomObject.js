RoomObject.prototype.memory = Memory.roomObjects[this.id];

export function CleanUp() {
    for (let id in Memory.roomObjects) {
        if (!Game.getObjectById(id)) {
            delete Memory.roomObjects[id];
        }
    }
};