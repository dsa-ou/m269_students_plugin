define([
    'base/js/namespace',
    'base/js/events'
    ], function(Jupyter, events) {

      var unlock_cells = function() {
          var idx = 0;
          while (cell = Jupyter.notebook.get_cell(idx)) {
              if (cell.metadata['editable'] == false) {
                  cell.metadata['editable'] = true
              }
              idx++;
          }
          Jupyter.notebook.save_notebook();
          alert('unlocked');
      };
      var lock_cells = function() {
          var idx = 0;
          while (cell = Jupyter.notebook.get_cell(idx)) {
              if (cell.metadata['editable'] == true) {
                  cell.metadata['editable'] = false
              }
              idx++;
          }
          Jupyter.notebook.save_notebook();
          alert('locked');
      };      
      var add_notes = function() {
        var idx = Jupyter.notebook.get_selected_index();
        Jupyter.notebook.insert_cell_below('markdown',idx).set_text('<b>Notes:</b><br />');
        Jupyter.notebook.get_cell(idx+1).metadata['cellcol'] = 'notescell';
        Jupyter.notebook.get_cell(idx+1).execute();
        var ret = [];
        for(var i = 0; i < document.styleSheets.length; i++) {
            var rules = document.styleSheets[i].rules || document.styleSheets[i].cssRules;
            for(var x in rules) {
                if(typeof rules[x].selectorText == 'string') ret.push(rules[x].selectorText);
            }
        }
        console.log(ret);
        var exists = false;
        var selectors = ret;
        for(var i = 0; i < selectors.length; i++) {
            if(selectors[i] == '.notescell') exists = true;
        }
        if (exists) {
            Jupyter.notebook.get_cells().map(function(cell) {if (cell.metadata['cellcol']!= undefined) {cell.element.addClass(cell.metadata['cellcol']);}});
        } else {
            add_colors();
        }
      };
      var add_colors = function() {
        var head=document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        var css = '.notescell{background-color: #7ceb9a;}';
        head.appendChild(style);
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        Jupyter.notebook.get_cells().map(function(cell) {if (cell.metadata['cellcol']!= undefined) {cell.element.addClass(cell.metadata['cellcol']);}});
      }

      // Add total marks button
      var AddColors = function () {
          Jupyter.toolbar.add_buttons_group([
              Jupyter.keyboard_manager.actions.register ({
                  'help': 'Add Colours',
                  'icon' : 'fa-smile-o',
                  'handler': add_colors
              }, 'add-colors', 'M269')
          ])
      }
      //Lock cells button
      var LockCells = function() {
          Jupyter.toolbar.add_buttons_group([
              Jupyter.keyboard_manager.actions.register({
                  'help': 'Lock cells',
                  'icon' : 'fa-lock',
                  'handler': lock_cells
              }, 'lock-cells', 'M269')
          ])
      }
      //Unlock cells button
      var UnlockCells = function() {
          Jupyter.toolbar.add_buttons_group([
              Jupyter.keyboard_manager.actions.register({
                  'help': 'Unlock cells',
                  'icon' : 'fa-unlock',
                  'handler': unlock_cells
              }, 'unlock-cells', 'M269')
          ])
      }

      var AddNotes = function() {
        Jupyter.toolbar.add_buttons_group([
            Jupyter.keyboard_manager.actions.register({
                'help': 'Add notes',
                'icon': 'fa-sticky-note',
                'handler': add_notes
            }, 'add-notes', 'M269')
        ])
      }

      var OnPageLoad = function() {
        //alert("Loaded!");
        var config = IPython.notebook.config;

        if (config.data.hasOwnProperty('m269_student_set_single_tab')) {
            if (config.data.m269_student_set_single_tab == true) {
                console.log('single tab');
                $("a").each(function() {
                    if (this.rel == "nofollow") 
                    {
                        //console.log(this.rel);
                        //console.log(this.target);
                        this.target = "_self";
                        //console.log(this.target);
                    }
                });    
            } else {
                //alert('multi tab');
                console.log('multi tab');
            }
        }
     }

    // Run on start
    function load_ipython_extension() {
        UnlockCells();
        LockCells();
        AddNotes();
        AddColors();
        OnPageLoad();
    }
    return {
        load_ipython_extension: load_ipython_extension
    };
});

//jupyter contrib nbextension install --user
