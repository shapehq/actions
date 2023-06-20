"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompositionRoot_1 = require("./CompositionRoot");
const getOptions_1 = require("./getOptions");
const action = CompositionRoot_1.CompositionRoot.getAction();
action.run((0, getOptions_1.getOptions)()).catch(err => {
    console.log(err);
});
