/*
Copyright 2008 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

fluid = fluid || {};

fluid.debug = function () {
    var printId = function (element) {
        return (element) ? element.id : element;
    };

    var outputEventDetails = function (eventType, event, caughtBy) {
        if (typeof console !== 'undefined') {
            console.debug (new Date() + " " + eventType + " was called on target " + printId (event.target) + ", caught by " + printId (caughtBy));
        }
    };

    var focusOutputter = function (evt) {
        outputEventDetails ("Focus", evt, this);
    };

    var blurOutputter = function (evt) {
        outputEventDetails ("Blur", evt, this);
    };

    var addFocusChangeListeners = function (jQueryElements) {
        jQueryElements.focus (focusOutputter);
        jQueryElements.blur (blurOutputter);
    };

    return {
        listenForFocusEvents: function () {
            var focussableElements  = [];

            var everything = jQuery ("*");
            everything.each (function () {
               if (jQuery (this).hasTabindex ()) {
                   focussableElements.push (this);
               }
            });

            addFocusChangeListeners (jQuery (focussableElements));
        }
    }; // End of public return.
} (); // End of fluid.debug namespace.

// Call listenForFocusEvents when the document is ready.
jQuery (document).ready (fluid.debug.listenForFocusEvents);