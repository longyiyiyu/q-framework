var Base = require('common/bases/reducer');

module.exports = Base.string(function(state, action) {
    switch (action.type) {
        case 'CHANGE_ITEM':
            return action.name;
    }
});
