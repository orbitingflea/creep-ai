// args = {roomName}
var util = require('util');
var creepCommon = require('creep.common');

module.exports = (args) => ({
    prepare: creep => {
        const s_room = Game.rooms[args.roomName];
        if (creep.room != s_room) {
            creep.moveTo(new RoomPosition(25, 25, args.sourceRoom), {visualizePathStyle: {stroke: '#ffffff', range: 10}});
            return false;
        }
        const controller = s_room.controller;
        if (creep.pos.inRangeTo(controller, 1)) {
            return true;
        } else {
            creep.moveTo(controller, {visualizePathStyle: {stroke: '#ffffff', range: 1}});
            return false;
        }
    },

    source: creep => {
        return true;
    },

    target: creep => {
        const target = Game.rooms[args.roomName].controller;
        creep.reserveController(target);
        return false;
    }
});
