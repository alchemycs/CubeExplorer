/* jshint browser:true */
/* global define */

define(['controllers/cli-controller', 'controllers/colour-explorer-controller'], function(CLIController, ColourExplorerController) {
    'use strict';
    function attach(module) {
        CLIController.attach(module);
        ColourExplorerController.attach(module);
    }

    return {
        attach:attach
    };
});