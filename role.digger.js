var roleDigger = {
    // must spawn with information
    // memory.sourceId
    // memory.containerId

    run: function(creep) {
        var container = Game.getObjectById(creep.memory.containerId);
        var source = Game.getObjectById(creep.memory.sourceId);
        if (creep.pos != container.pos) {
            // routing mode
            creep.moveTo(container);
        } else {
            // working mode
            creep.harvest(source);
        }
    }
}

module.exports = roleDigger;
