/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/*global fluid_1_5:true, jQuery*/

// JSLint options 
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {

    fluid.defaults("fluid.uiOptions.enactor", {
        gradeNames: ["fluid.modelComponent", "fluid.eventedComponent", "fluid.uiOptions.modelRelay", "autoInit"]
    });
    
    /**********************************************************************************
     * styleElements
     * 
     * Adds or removes the classname to/from the elements based upon the model value.
     * This component is used as a grade by emphasizeLinks & inputsLarger
     **********************************************************************************/
    fluid.defaults("fluid.uiOptions.enactor.styleElements", {
        gradeNames: ["fluid.uiOptions.enactor", "autoInit"],
        cssClass: null,  // Must be supplied by implementors
        invokers: {
            applyStyle: {
                funcName: "fluid.uiOptions.enactor.styleElements.applyStyle",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            resetStyle: {
                funcName: "fluid.uiOptions.enactor.styleElements.resetStyle",
                args: ["{arguments}.0", "{arguments}.1"]
            },
            handleStyle: {
                funcName: "fluid.uiOptions.enactor.styleElements.handleStyle",
                args: ["{arguments}.0", {expander: {func: "{that}.getElements"}}, "{that}"]
            },
            
            // Must be supplied by implementors
            getElements: "fluid.uiOptions.enactor.getElements"
        },
        listeners: {
            onCreate: {
                listener: "{that}.handleStyle",
                args: ["{that}.model.value"]
            }
        }
    });
    
    fluid.uiOptions.enactor.styleElements.applyStyle = function (elements, cssClass) {
        elements.addClass(cssClass);
    };

    fluid.uiOptions.enactor.styleElements.resetStyle = function (elements, cssClass) {
        $(elements, "." + cssClass).andSelf().removeClass(cssClass);
    };

    fluid.uiOptions.enactor.styleElements.handleStyle = function (value, elements, that) {
        if (value) {
            that.applyStyle(elements, that.options.cssClass);
        } else {
            that.resetStyle(elements, that.options.cssClass);
        }
    };

    fluid.uiOptions.enactor.styleElements.finalInit = function (that) {
        that.applier.modelChanged.addListener("value", function (newModel) {
            that.handleStyle(newModel.value);
        });
    };
    
    /*******************************************************************************
     * emphasizeLinks
     * 
     * The enactor to emphasize links in the container according to the value
     *******************************************************************************/

    // Note that the implementors need to provide the container for this view component
    fluid.defaults("fluid.uiOptions.enactor.emphasizeLinks", {
        gradeNames: ["fluid.viewComponent", "fluid.uiOptions.enactor.styleElements", "autoInit"],
        cssClass: null,  // Must be supplied by implementors
        invokers: {
            getElements: {
                funcName: "fluid.uiOptions.enactor.emphasizeLinks.getLinks",
                args: "{that}.container"
            }
        }
    });
    
    fluid.uiOptions.enactor.emphasizeLinks.getLinks = function (container) {
        return $("a", container);
    };
    
    /*******************************************************************************
     * inputsLarger
     * 
     * The enactor to enlarge inputs in the container according to the value
     *******************************************************************************/

    // Note that the implementors need to provide the container for this view component
    fluid.defaults("fluid.uiOptions.enactor.inputsLarger", {
        gradeNames: ["fluid.viewComponent", "fluid.uiOptions.enactor.styleElements", "autoInit"],
        cssClass: null,  // Must be supplied by implementors
        invokers: {
            getElements: {
                funcName: "fluid.uiOptions.enactor.inputsLarger.getInputs",
                args: "{that}.container"
            }
        }
    });
    
    fluid.uiOptions.enactor.inputsLarger.getInputs = function (container) {
        return $("input, button", container);
    };
    
    /*******************************************************************************
     * ClassSwapper
     *
     * Has a hash of classes it cares about and will remove all those classes from
     * its container before setting the new class.
     * This component tends to be used as a grade by textFont and theme
     *******************************************************************************/
    
    // Note that the implementors need to provide the container for this view component
    fluid.defaults("fluid.uiOptions.enactor.classSwapper", {
        gradeNames: ["fluid.viewComponent", "fluid.uiOptions.enactor", "autoInit"],
        classes: {},  // Must be supplied by implementors
        invokers: {
            clearClasses: {
                funcName: "fluid.uiOptions.enactor.classSwapper.clearClasses",
                args: ["{that}.container", "{that}.classStr"]
            },
            swap: {
                funcName: "fluid.uiOptions.enactor.classSwapper.swap",
                args: ["{arguments}.0", "{that}"]
            }
        },
        listeners: {
            onCreate: {
                listener: "{that}.swap",
                args: ["{that}.model.value"]
            }
        },
        members: {
            classStr: {
                expander: {
                    func: "fluid.uiOptions.enactor.classSwapper.joinClassStr",
                    args: "{that}.options.classes"
                }
            }
        }
    });
    
    fluid.uiOptions.enactor.classSwapper.clearClasses = function (container, classStr) {
        container.removeClass(classStr);
    };
    
    fluid.uiOptions.enactor.classSwapper.swap = function (value, that) {
        that.clearClasses();
        that.container.addClass(that.options.classes[value]);
    };
    
    fluid.uiOptions.enactor.classSwapper.joinClassStr = function (classes) {
        var classStr = "";
        
        fluid.each(classes, function (oneClassName) {
            if (oneClassName) {
                classStr += classStr ? " " + oneClassName : oneClassName;
            }
        });
        return classStr;
    };
    
    fluid.uiOptions.enactor.classSwapper.finalInit = function (that) {
        that.applier.modelChanged.addListener("value", function (newModel) {
            that.swap(newModel.value);
        });
    };
    
    /*******************************************************************************
     * Functions shared by textSizer and lineSpacer
     *******************************************************************************/
    
    /**
     * return "font-size" in px
     * @param (Object) container
     * @param (Object) fontSizeMap: the mapping between the font size string values ("small", "medium" etc) to px values
     */
    fluid.uiOptions.enactor.getTextSizeInPx = function (container, fontSizeMap) {
        var fontSize = container.css("font-size");

        if (fontSizeMap[fontSize]) {
            fontSize = fontSizeMap[fontSize];
        }

        // return fontSize in px
        return parseFloat(fontSize);
    };

    /*******************************************************************************
     * textSizer
     *
     * Sets the text size on the container to the multiple provided.
     *******************************************************************************/
    
    // Note that the implementors need to provide the container for this view component
    fluid.defaults("fluid.uiOptions.enactor.textSizer", {
        gradeNames: ["fluid.viewComponent", "fluid.uiOptions.enactor", "autoInit"],
        fontSizeMap: {},  // must be supplied by implementors
        invokers: {
            set: {
                funcName: "fluid.uiOptions.enactor.textSizer.set",
                args: ["{arguments}.0", "{that}"]
            },
            getTextSizeInPx: {
                funcName: "fluid.uiOptions.enactor.getTextSizeInPx",
                args: ["{that}.container", "{that}.options.fontSizeMap"]
            },
            getTextSizeInEm: {
                funcName: "fluid.uiOptions.enactor.textSizer.getTextSizeInEm",
                args: [{expander: {func: "{that}.getTextSizeInPx"}}, {expander: {func: "{that}.getPx2EmFactor"}}]
            },
            getPx2EmFactor: {
                funcName: "fluid.uiOptions.enactor.textSizer.getPx2EmFactor",
                args: ["{that}.container", "{that}.options.fontSizeMap"]
            }
        },
        listeners: {
            onCreate: {
                listener: "{that}.set",
                args: "{that}.model.value"
            }
        }
    });
    
    fluid.uiOptions.enactor.textSizer.set = function (times, that) {
        // Calculating the initial size here rather than using a members expand because the "font-size"
        // cannot be detected on hidden containers such as fat paenl iframe.
        if (!that.initialSize) {
            that.initialSize = that.getTextSizeInEm();
        }
        
        if (that.initialSize) {
            var targetSize = times * that.initialSize;
            that.container.css("font-size", targetSize + "em");
        }
    };

    /**
     * Return "font-size" in em
     * @param (Object) container
     * @param (Object) fontSizeMap: the mapping between the font size string values ("small", "medium" etc) to px values
     */
    fluid.uiOptions.enactor.textSizer.getTextSizeInEm = function (textSizeInPx, px2emFactor) {
        // retrieve fontSize in px, convert and return in em 
        return Math.round(textSizeInPx / px2emFactor * 10000) / 10000;
    };
    
    /**
     * Return the base font size used for converting text size from px to em
     */
    fluid.uiOptions.enactor.textSizer.getPx2EmFactor = function (container, fontSizeMap) {
        // The base font size for converting text size to em is the computed font size of the container's 
        // parent element unless the container itself has been the DOM root element "HTML"
        // The reference to this algorithm: http://clagnut.com/blog/348/
        if (container.get(0).tagName !== "HTML") {
            container = container.parent();
        }
        return fluid.uiOptions.enactor.getTextSizeInPx(container, fontSizeMap);
    };

    fluid.uiOptions.enactor.textSizer.finalInit = function (that) {
        that.applier.modelChanged.addListener("value", function (newModel) {
            that.set(newModel.value);
        });
    };
    
    /*******************************************************************************
     * lineSpacer
     *
     * Sets the line spacing on the container to the multiple provided.
     *******************************************************************************/
    
    // Note that the implementors need to provide the container for this view component
    fluid.defaults("fluid.uiOptions.enactor.lineSpacer", {
        gradeNames: ["fluid.viewComponent", "fluid.uiOptions.enactor", "autoInit"],
        fontSizeMap: {},  // must be supplied by implementors
        invokers: {
            set: {
                funcName: "fluid.uiOptions.enactor.lineSpacer.set",
                args: ["{arguments}.0", "{that}"]
            },
            getTextSizeInPx: {
                funcName: "fluid.uiOptions.enactor.getTextSizeInPx",
                args: ["{that}.container", "{that}.options.fontSizeMap"]
            },
            getLineHeight: {
                funcName: "fluid.uiOptions.enactor.lineSpacer.getLineHeight",
                args: "{that}.container"
            },
            numerizeLineHeight: {
                funcName: "fluid.uiOptions.enactor.lineSpacer.numerizeLineHeight",
                args: [{expander: {func: "{that}.getLineHeight"}}, {expander: {func: "{that}.getTextSizeInPx"}}]
            }
        },
        listeners: {
            onCreate: {
                listener: "{that}.set",
                args: "{that}.model.value"
            }
        }
    });
    
    // Return "line-height" css value
    fluid.uiOptions.enactor.lineSpacer.getLineHeight = function (container) {
        var lineHeight;
        
        // A work-around of jQuery + IE bug - http://bugs.jquery.com/ticket/2671
        if (container[0].currentStyle) {
            lineHeight = container[0].currentStyle.lineHeight;
        } else {
            lineHeight = container.css("line-height");
        }
        
        return lineHeight;
    };
    
    // Interprets browser returned "line-height" value, either a string "normal", a number with "px" suffix or "undefined" 
    // into a numeric value in em. 
    // Return 0 when the given "lineHeight" argument is "undefined" (http://issues.fluidproject.org/browse/FLUID-4500).
    fluid.uiOptions.enactor.lineSpacer.numerizeLineHeight = function (lineHeight, fontSize) {
        // Handel the given "lineHeight" argument is "undefined", which occurs when firefox detects 
        // "line-height" css value on a hidden container. (http://issues.fluidproject.org/browse/FLUID-4500)
        if (!lineHeight) {
            return 0;
        }

        // Needs a better solution. For now, "line-height" value "normal" is defaulted to 1.2em
        // according to https://developer.mozilla.org/en/CSS/line-height
        if (lineHeight === "normal") {
            return 1.2;
        }
        
        // Continuing the work-around of jQuery + IE bug - http://bugs.jquery.com/ticket/2671
        if (lineHeight.match(/[0-9]$/)) {
            return lineHeight;
        }
        
        return Math.round(parseFloat(lineHeight) / fontSize * 100) / 100;
    };

    fluid.uiOptions.enactor.lineSpacer.set = function (times, that) {
        // Calculating the initial size here rather than using a members expand because the "line-height"
        // cannot be detected on hidden containers such as fat paenl iframe.
        if (!that.initialSize) {
            that.initialSize = that.numerizeLineHeight();
        }
        
        // that.initialSize === 0 when the browser returned "lineHeight" css value is undefined,
        // which occurs when firefox detects "line-height" value on a hidden container.
        // @ See numerizeLineHeight() & http://issues.fluidproject.org/browse/FLUID-4500
        if (that.initialSize) {
            var targetLineSpacing = times * that.initialSize;
            that.container.css("line-height", targetLineSpacing);
        }
    };
    
    fluid.uiOptions.enactor.lineSpacer.finalInit = function (that) {
        that.applier.modelChanged.addListener("value", function (newModel) {
            that.set(newModel.value);
        });
    };
    
    /*******************************************************************************
     * tableOfContents
     *
     * To create and show/hide table of contents
     *******************************************************************************/
    
    // Note that the implementors need to provide the container for this view component
    fluid.defaults("fluid.uiOptions.enactor.tableOfContentsEnactor", {
        gradeNames: ["fluid.viewComponent", "fluid.uiOptions.enactor", "autoInit"],
        tocTemplate: null,  // must be supplied by implementors
        components: {
            tableOfContents: {
                type: "fluid.tableOfContents",
                container: "{tableOfContentsEnactor}.container",
                createOnEvent: "onCreateTOCReady",
                options: {
                    components: {
                        levels: {
                            type: "fluid.tableOfContents.levels",
                            options: {
                                resources: {
                                    template: {
                                        forceCache: true,
                                        url: "{tableOfContentsEnactor}.options.tocTemplate"
                                    }
                                }
                            } 
                        }
                    },
                    listeners: {
                        afterRender: "{tableOfContentsEnactor}.events.afterTocRender"
                    }
                }
            }
        },
        invokers: {
            applyToc: {
                funcName: "fluid.uiOptions.enactor.tableOfContentsEnactor.applyToc",
                args: ["{arguments}.0", "{that}"]
            }
        },
        events: {
            onCreateTOCReady: null,
            afterTocRender: null,
            onLateRefreshRelay: null
        },
        listeners: {
            onCreate: {
                listener: "{that}.applyToc",
                args: "{that}.model.value"
            }
        }
    });
    
    fluid.uiOptions.enactor.tableOfContentsEnactor.applyToc = function (value, that) {
        var async = false;
        if (value) {
            if (that.tableOfContents) {
                that.tableOfContents.show();
            } else {
                that.events.onCreateTOCReady.fire();
                async = true;
            }
        } else {
            if (that.tableOfContents) {
                that.tableOfContents.hide();
            }
        }
        if (!async) {
            that.events.onLateRefreshRelay.fire(that);
        }
    };
    
    fluid.uiOptions.enactor.tableOfContentsEnactor.finalInit = function (that) {
        that.applier.modelChanged.addListener("value", function (newModel) {
            that.applyToc(newModel.value);
        });
    };
    
    /*******************************************************************************
     * Browser type and version detection.                                         *
     *                                                                             *
     * Add type tags of IE and browser version into static environment for the     * 
     * spcial handling on IE6.                                                     *
     *******************************************************************************/
    
    fluid.registerNamespace("fluid.browser.version");

    fluid.browser.msie = function () {
        var isIE = ($.browser.msie);
        return isIE ? fluid.typeTag("fluid.browser.msie") : undefined;
    };

    fluid.browser.majorVersion = function () {
    // From http://www.useragentstring.com/pages/Internet%20Explorer/ several variants are possible
    // for IE6 - and in general we probably just want to detect major versions
        var version = $.browser.version;
        var dotpos = version.indexOf(".");
        var majorVersion = version.substring(0, dotpos);
        return fluid.typeTag("fluid.browser.majorVersion." + majorVersion);
    };

    var features = {
        browserIE: fluid.browser.msie(),
        browserMajorVersion: fluid.browser.majorVersion()
    };
    
    fluid.merge(null, fluid.staticEnvironment, features);
    
    // Temporary solution pending revised IoC system in 1.5
    
    fluid.hasFeature = function (tagName) {
        return fluid.find_if(fluid.staticEnvironment, function (value) {
            return value && value.typeName === tagName;
        });
    };

    /********************************************************************************************
     * setIE6ColorInversion
     * 
     * Remove the instances of fl-inverted-color when the default theme is selected. 
     * This prevents a bug in IE6 where the default theme will have elements styled 
     * with the theme color.
     *
     * Caused by:
     * http://thunderguy.com/semicolon/2005/05/16/multiple-class-selectors-in-internet-explorer/
     ********************************************************************************************/

    // Note that the implementors need to provide the container for this view component
    fluid.defaults("fluid.uiOptions.enactor.IE6ColorInversion", {
        gradeNames: ["fluid.viewComponent", "fluid.uiOptions.enactor", "autoInit"],
        selectors: {
            colorInversion: ".fl-inverted-color"
        },
        styles: {
            colorInversionClass: "fl-inverted-color"
        },
        invokers: {
            setIE6ColorInversion: {
                funcName: "fluid.uiOptions.enactor.IE6ColorInversion.setIE6ColorInversion",
                args: ["{arguments}.0", "{that}"]
            }
        },
        listeners: {
            onCreate: {
                listener: "{that}.setIE6ColorInversion",
                args: ["{that}.model.value"]
            }
        }
    });
    
    fluid.uiOptions.enactor.IE6ColorInversion.setIE6ColorInversion = function (value, that) {
        if (fluid.hasFeature("fluid.browser.msie") && fluid.hasFeature("fluid.browser.majorVersion.6") && value === "default") {
            that.locate("colorInversion").removeClass(that.options.styles.colorInversionClass);
        }
    };
    
    fluid.uiOptions.enactor.IE6ColorInversion.finalInit = function (that) {
        that.applier.modelChanged.addListener("value", function (newModel) {
            that.setIE6ColorInversion(newModel.value);
        });
    };

})(jQuery, fluid_1_5);
