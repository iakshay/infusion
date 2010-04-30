/*
Copyright 2008 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://source.fluidproject.org/svn/LICENSE.txt
*/

/*global jQuery*/
/*global fluid*/
/*global jqUnit*/

(function ($) {
    $(document).ready(function () {
        var tests = new jqUnit.TestCase("Reorder Layout Tests");
    
        tests.test("reorderLayout API", function () {
            var options = {
                selectors: {
                    columns: "[id^='c']",
                    modules: ".portlet"
                }
            };
            
            var layoutReorderer = fluid.reorderLayout(".reorderer_container", options);
            var item2 = fluid.utils.jById(portlet2id).focus();
            var item3 = fluid.utils.jById(portlet3id);
            var downArrow = fluid.testUtils.createEvtDownArrow(); 
            var ctrlDownArrow = fluid.testUtils.createEvtCtrlDownArrow();
            
            // Sniff test the reorderer that was created - keyboard selection and movement
    
            jqUnit.assertTrue("focus on item2", item2.hasClass("orderable-selected"));
            jqUnit.assertTrue("focus on item2 - item3 should be default", item3.hasClass("orderable-default"));
    
            layoutReorderer.handleDirectionKeyDown(downArrow);
            jqUnit.assertTrue("down arrow - item2 should be default", item2.hasClass("orderable-default"));
            jqUnit.assertTrue("down arrow - item3 should be selected", item3.hasClass("orderable-selected"));
    
            layoutReorderer.handleDirectionKeyDown(ctrlDownArrow);
    
            var items = jQuery(".portlet");
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3, 5, 6, 7, 8, 9", portlet1id, items[0].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3, 5, 6, 7, 8, 9", portlet2id, items[1].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3, 5, 6, 7, 8, 9", portlet4id, items[2].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3, 5, 6, 7, 8, 9", portlet3id, items[3].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3, 5, 6, 7, 8, 9", portlet5id, items[4].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3, 5, 6, 7, 8, 9", portlet6id, items[5].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3, 5, 6, 7, 8, 9", portlet7id, items[6].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3, 5, 6, 7, 8, 9", portlet8id, items[7].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3, 5, 6, 7, 8, 9", portlet9id, items[8].id);
        });
    
        tests.test("reorderLayout with optional styles", function () {
            var options = {
                selectors: {
                    columns: "[id^='c']",
                    modules: ".portlet"            
                },
                styles: {
                    defaultStyle: "myDefault",
                    selected: "mySelected"
                }
            };
    
            var layoutReorderer = fluid.reorderLayout(".reorderer_container", options);
            
            jqUnit.assertEquals("default class is myDefault", "myDefault", layoutReorderer.options.styles.defaultStyle);
            jqUnit.assertEquals("selected class is mySelected", "mySelected", layoutReorderer.options.styles.selected);
            jqUnit.assertEquals("dragging class is orderable-dragging", "orderable-dragging", layoutReorderer.options.styles.dragging);
            jqUnit.assertEquals("mouseDrag class is orderable-dragging", "orderable-dragging", layoutReorderer.options.styles.mouseDrag);
            
        });
        
        tests.test("reorderLayout with locked portlets", function () {
            var options = {
                selectors: {
                    columns: "[id^='c']",
                    modules: ".portlet",
                    lockedModules: ".locked"
                }
            };

            var layoutReorderer = fluid.reorderLayout(".reorderer_container", options);
            var item2 = fluid.utils.jById(portlet2id).focus();
            var item3 = fluid.utils.jById(portlet3id);
            var ctrlDownArrow = fluid.testUtils.createEvtCtrlDownArrow();

            // Sniff test the reorderer that was created - locked portlet shouldn't move
    
            jqUnit.assertTrue("focus on item2", item2.hasClass("orderable-selected"));
            layoutReorderer.handleDirectionKeyDown(ctrlDownArrow);

            var items = jQuery(".portlet");
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 3, 4", portlet1id, items[0].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 3, 4", portlet2id, items[1].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 3, 4", portlet3id, items[2].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 3, 4", portlet4id, items[3].id);

            item3.focus();
            jqUnit.assertTrue("focus on item3", item3.hasClass("orderable-selected"));
            layoutReorderer.handleDirectionKeyDown(ctrlDownArrow);

            items = jQuery(".portlet");
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3", portlet1id, items[0].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3", portlet2id, items[1].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3", portlet4id, items[2].id);
            jqUnit.assertEquals("after ctrl-down, expect order 1, 2, 4, 3", portlet3id, items[3].id);

        });
    });
})(jQuery);
