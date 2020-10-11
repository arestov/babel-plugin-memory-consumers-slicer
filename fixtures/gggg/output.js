define(function (require) {
  'use strict'

  class MSlice_Array__code_line_34_column_51__initLoadableListBase extends Array {}

  function MSlice_Object__code_line_47_column_9(arg0, arg1, arg2, arg3, arg4) {
    this['$needs_load'] = arg0
    this['list_loading'] = arg1
    this['can_load_data'] = arg2
    this['can_load_more'] = arg3
    this['more_load_available'] = arg4
  }

  function MSlice_Object__code_line_127_column_11__getPagingInfo(arg0, arg1, arg2, arg3, arg4) {
    this.current_length = arg0
    this.has_pages = arg1
    this.page_limit = arg2
    this.remainder = arg3
    this.next_page = arg4
  }

  class MSlice_Array__code_line_161_column_21__insertDataAsSubitems extends Array {}

  class MSlice_Array__code_line_201_column_19__getRelativeRequestsGroups extends Array {}

  function MSlice_Object__code_line_219_column_30__dataListChange() {}

  function MSlice_Object__code_line_256_column_28__addDataItem() {}

  class MSlice_Array__code_line_259_column_44__addDataItem extends Array {}

  function MSlice_Object__code_line_310_column_28__getMainlist() {}

  class MSlice_Array__code_line_313_column_51__getMainlist extends Array {}

  function MSlice_Object__code_line_336_column_29__makeItemByData(arg0, arg1, arg2) {
    this.by = arg0
    this.init_version = arg1
    this.states = arg2
  }

  function MSlice_Object__code_line_345_column_38__makeItemByData(arg0) {
    this.network_states = arg0
  }

  class MSlice_Array__code_line_364_column_83__injectExcessDataItem extends Array {}

  function MSlice_Object__code_line_370_column_33__injectExcessDataItem() {}

  class MSlice_Array__code_line_373_column_49__injectExcessDataItem extends Array {}

  function MSlice_Object__code_line_385_column_28__injectExcessDataItem() {}

  function MSlice_Object__code_line_410_column_11__convertNamed(arg0) {
    this.states = arg0
  }

  function MSlice_Object__code_line_417_column_16__convertNamed(arg0) {
    this.states = arg0
  }

  function MSlice_Object__code_line_430_column_17__convertToNestings() {}

  function MSlice_Object__code_line_442_column_9__convertToNestings(arg0, arg1) {
    this.nestings = arg0
    this.nestings_sources = arg1
  }

  function MSlice_Object__code_line_468_column_3(arg0) {
    this.handling_v2_init = arg0
  }

  var BrowseMap = require('./BrowseMap')

  var spv = require('spv')

  var pv = require('../provoda')

  var cloneObj = spv.cloneObj

  var pushToRoute = require('../structure/pushToRoute')

  var initDeclaredNestings = require('../initDeclaredNestings')

  var getSPByPathTemplateAndData = initDeclaredNestings.getSPByPathTemplateAndData
  var pvUpdate = pv.update
  var getPath = pv.pathExecutor(function (chunkName, app, data) {
    return data && data[chunkName]
  })
  var getRelativeRequestsGroups = BrowseMap.Model.prototype.getRelativeRequestsGroups
  var LoadableListBase = spv.inh(
    BrowseMap.Model,
    {
      strict: true,
      naming: function (fn) {
        return function LoadableListBase(opts, data, params, more, states) {
          fn(this, opts, data, params, more, states)
        }
      },
      init: function initLoadableListBase(self) {
        self.excess_data_items = null
        self.loaded_nestings_items = null
        self.loadable_lists = null //self.loadable_lists[ self.main_list_name ] = [];

        if (self.legacy_rel_helpers) {
          pv.updateNesting(
            self,
            self.main_list_name,
            new MSlice_Array__code_line_34_column_51__initLoadableListBase(),
          )
        }

        var has_loader = !!(self._nest_reqs && self._nest_reqs[self.main_list_name])

        if (has_loader) {
          pv.update(self, 'has_data_loader', true)
        }

        self.bindStaCons()
      },
    },
    {
      handling_v2_init: true,
      attrs: new MSlice_Object__code_line_47_column_9(
        [
          'compx',
          ['more_load_available', 'mp_has_focus'],
          function (can_more, focus) {
            return Boolean(focus && can_more)
          },
        ],
        [
          'compx',
          ['main_list_loading', 'preview_loading', 'id_searching'],
          function (main_list_loading, prevw_loading, id_searching) {
            return main_list_loading || prevw_loading || id_searching
          },
        ],
        [
          'compx',
          ['has_data_loader', 'loader_disallowed', 'has_no_access'],
          function (has_data_loader, loader_disallowed, has_no_access) {
            return has_data_loader && !loader_disallowed && !has_no_access
          },
        ],
        [
          'compx',
          ['can_load_data', 'all_data_loaded'],
          function (can_load_data, all_data_loaded) {
            return can_load_data && !all_data_loaded
          },
        ],
        [
          'compx',
          ['can_load_more', 'list_loading'],
          function (can_load_more, list_loading) {
            return can_load_more && !list_loading
          },
        ],
      ),
      hndCheckPreviews: function (e) {
        if (!e.skip_report) {
          pv.updateNesting(this, this.preview_mlist_name, e.value)
        }
      },
      'stch-$needs_load': function (target, state) {
        if (state) {
          target.preloadStart()
        }
      },
      bindStaCons: function () {
        if (!this.legacy_rel_helpers) {
          return
        }

        if (!this.manual_previews) {
          this.on('child_change-' + this.main_list_name, this.hndCheckPreviews)
        }
      },
      handleNetworkSideData: function (target, source_name, ns, data) {
        target.app.handleNetworkSideData(source_name, ns, data, target)
      },
      main_list_name: 'lists_list',
      preview_mlist_name: 'preview_list',
      preview_nesting_source: null,
      getMainListChangeOpts: function () {},
      page_limit: 30,
      getPagingInfo: function (nesting_name, limit) {
        var page_limit = limit || this.page_limit || this.map_parent.page_limit
        var length = this.getLength(nesting_name)
        var has_pages = Math.floor(length / page_limit)
        var remainder = length % page_limit
        var next_page = has_pages + 1
        return new MSlice_Object__code_line_127_column_11__getPagingInfo(
          length,
          has_pages,
          page_limit,
          remainder,
          next_page,
        )
      },
      preloadStart: function () {
        this.loadStart()
      },
      getLength: function (nesting_name) {
        if (!nesting_name) {
          throw new Error('provide nesting_name')
        }

        return (this.loaded_nestings_items && this.loaded_nestings_items[nesting_name]) || 0
      },
      loadStart: function () {
        if (this.state('more_load_available') && !this.getLength(this.main_list_name)) {
          this.requestMoreData()
        }
      },
      requestMoreData: function (nesting_name) {
        nesting_name = nesting_name || this.main_list_name

        if (this._nest_reqs && this._nest_reqs[nesting_name]) {
          this.requestNesting(this._nest_reqs[nesting_name], nesting_name)
        }
      },
      insertDataAsSubitems: function (target, nesting_name, data_list, opts, source_name) {
        var items_list = new MSlice_Array__code_line_161_column_21__insertDataAsSubitems()

        if (!data_list || !data_list.length) {
          return items_list
        }

        var mlc_opts = target.getMainListChangeOpts()
        var splitItemData = target['nest_rq_split-' + nesting_name]

        for (var i = 0; i < data_list.length; i++) {
          var splited_data =
            splitItemData &&
            splitItemData(data_list[i], target.getNestingSource(nesting_name, target.app))
          var cur_data = splited_data ? splited_data[0] : data_list[i],
            cur_params = splited_data && splited_data[1]

          if (target.isDataItemValid && !target.isDataItemValid(cur_data)) {
            continue
          }

          var item = target.addItemToDatalist(cur_data, true, cur_params, nesting_name)

          if (source_name && item && item._network_source === null) {
            item._network_source = source_name
          }

          items_list.push(item)
        }

        target.dataListChange(mlc_opts, items_list, nesting_name)
        return items_list
      },
      getRelativeRequestsGroups: function (space) {
        var main_models = this.getNesting(this.main_list_name)

        if (!main_models || !main_models.length) {
          return
        } else {
          main_models = main_models.slice()
          var more_models = getRelativeRequestsGroups.call(this, space, true)

          if (more_models) {
            main_models = main_models.concat(more_models)
          }

          var clean_array = spv.getArrayNoDubs(main_models)
          var groups = new MSlice_Array__code_line_201_column_19__getRelativeRequestsGroups()

          for (var i = 0; i < clean_array.length; i++) {
            var reqs = clean_array[i].getModelImmediateRequests(space)

            if (reqs && reqs.length) {
              groups.push(reqs)
            }
          }

          return groups
        }
      },
      dataListChange: function (mlc_opts, items, nesting_name) {
        nesting_name = nesting_name || this.main_list_name
        var array = this.loadable_lists && this.loadable_lists[nesting_name]

        if (this.beforeReportChange) {
          array = this.beforeReportChange(array, items)

          if (!this.loadable_lists) {
            this.loadable_lists = new MSlice_Object__code_line_219_column_30__dataListChange()
          }

          this.loadable_lists[nesting_name] = array
        }

        pv.updateNesting(this, nesting_name, array, mlc_opts)
      },
      compareItemWithObj: function (item, data) {
        if (!this.items_comparing_props) {
          return
        }

        for (var i = 0; i < this.items_comparing_props.length; i++) {
          var cur = this.items_comparing_props[i]
          var item_value = spv.getTargetField(item, cur[0])
          var data_value = spv.getTargetField(data, cur[1])

          if (item_value !== data_value) {
            return false
          }
        }

        return true
      },
      compareItemsWithObj: function (array, omo, soft) {
        for (var i = 0; i < array.length; i++) {
          if (this.compareItemWithObj(array[i], omo, soft)) {
            return array[i]
          }
        }
      },
      addItemToDatalist: function (obj, silent, item_params, nesting_name) {
        return this.addDataItem(obj, silent, nesting_name, item_params)
      },
      addDataItem: function (obj, skip_changes, nesting_name, item_params) {
        nesting_name = nesting_name || this.main_list_name

        if (!this.loadable_lists) {
          this.loadable_lists = new MSlice_Object__code_line_256_column_28__addDataItem()
        }

        if (!this.loadable_lists[nesting_name]) {
          this.loadable_lists[
            nesting_name
          ] = new MSlice_Array__code_line_259_column_44__addDataItem()
        }

        var item,
          work_array = this.loadable_lists[nesting_name],
          ml_ch_opts = !skip_changes && this.getMainListChangeOpts()
        var excess_items = this.excess_data_items && this.excess_data_items[nesting_name]

        if (excess_items && excess_items.length) {
          var matched = this.compareItemsWithObj(excess_items, obj)
          /*
        задача этого кода - сделать так, что бы при вставке новых данных всё что лежит в массиве
        "излишек" должно оставаться в конце массива
        */
          //excess_items = this.excess_data_items[ nesting_name ];

          if (matched) {
            item = matched
            /*если совпадает с предполагаемыми объектом, то ставим наш элемент в конец рабочего массива
          и удаляем из массива "излишков", а сами излишки в самый конец */

            work_array = spv.arrayExclude(work_array, excess_items)
            excess_items = spv.arrayExclude(excess_items, matched)
            work_array.push(matched)
            work_array = work_array.concat(excess_items)
          } else {
            /* если объект не совпадает ни с одним элементом, то извлекаем все излишки,
          вставляем объект, вставляем элементы обратно */
            work_array = spv.arrayExclude(work_array, excess_items)
            work_array.push((item = this.makeItemByData(obj, item_params, nesting_name)))
            work_array = work_array.concat(excess_items)
          }

          this.excess_data_items[nesting_name] = excess_items
        } else {
          work_array.push((item = this.makeItemByData(obj, item_params, nesting_name)))
        }

        this.loadable_lists[nesting_name] = work_array

        if (!skip_changes) {
          if (this.beforeReportChange) {
            work_array = this.beforeReportChange(work_array, [item])
            this.loadable_lists[nesting_name] = work_array
          }

          pv.updateNesting(this, nesting_name, work_array, ml_ch_opts)
        }

        return item
      },
      getMainlist: function () {
        if (!this.loadable_lists) {
          this.loadable_lists = new MSlice_Object__code_line_310_column_28__getMainlist()
        }

        if (!this.loadable_lists[this.main_list_name]) {
          this.loadable_lists[
            this.main_list_name
          ] = new MSlice_Array__code_line_313_column_51__getMainlist()
        }

        return this.loadable_lists[this.main_list_name]
      },
      makeItemByData: function (data, item_params, nesting_name) {
        var mentioned = this._nest_rqc[nesting_name]
        var md = this

        if (!mentioned) {
          throw new Error('cant make item')
        }

        var created = pushToRoute(md, nesting_name, data)

        if (created) {
          return created
        }

        var best_constr = this._all_chi[mentioned.key]
        var network_data_as_states = best_constr.prototype.network_data_as_states

        if (best_constr.prototype.handling_v2_init) {
          var v2_data = cloneObj(
            new MSlice_Object__code_line_336_column_29__makeItemByData('LoadableList', 2, data),
            convertToNestings(item_params),
          )
          return this.initSi(best_constr, v2_data)
        }

        if (network_data_as_states) {
          return this.initSi(
            best_constr,
            new MSlice_Object__code_line_345_column_38__makeItemByData(data),
            item_params,
          )
        } else {
          return this.initSi(best_constr, data, item_params)
        }
      },
      findMustBePresentDataItem: function (obj, nesting_name) {
        nesting_name = nesting_name || this.main_list_name
        var list = this.getNesting(nesting_name)
        var matched = list && this.compareItemsWithObj(this.getNesting(nesting_name), obj)
        return matched || this.injectExcessDataItem(obj, nesting_name)
      },
      injectExcessDataItem: function (obj, nesting_name) {
        nesting_name = nesting_name || this.main_list_name

        if (this.isDataInjValid && !this.isDataInjValid(obj)) {
          return
        }

        var work_array =
            (this.loadable_lists && this.loadable_lists[nesting_name]) ||
            new MSlice_Array__code_line_364_column_83__injectExcessDataItem(),
          ml_ch_opts = this.getMainListChangeOpts(),
          item = this.makeItemByData(obj, false, nesting_name)

        if (!this.cant_find_dli_pos) {
          if (!this.excess_data_items) {
            this.excess_data_items = new MSlice_Object__code_line_370_column_33__injectExcessDataItem()
          }

          if (!this.excess_data_items[nesting_name]) {
            this.excess_data_items[
              nesting_name
            ] = new MSlice_Array__code_line_373_column_49__injectExcessDataItem()
          }

          this.excess_data_items[nesting_name].push(item)
          work_array.push(item)
        } else {
          work_array.unshift(item)
        }

        if (this.beforeReportChange) {
          work_array = this.beforeReportChange(work_array, [item])
        }

        if (!this.loadable_lists) {
          this.loadable_lists = new MSlice_Object__code_line_385_column_28__injectExcessDataItem()
        }

        this.loadable_lists[nesting_name] = work_array
        pv.updateNesting(this, nesting_name, work_array, ml_ch_opts)
        return item
      },
      //auth things:
      authInit: function () {
        var _this = this

        if (this.map_parent) {
          this.switchPmd(false)
          this.map_parent.on('state_change-mp_has_focus', function (e) {
            if (!e.value) {
              _this.switchPmd(false)
            }
          })
        }
      },
    },
  )

  function convertNamed(list) {
    if (!Array.isArray(list)) {
      return new MSlice_Object__code_line_410_column_11__convertNamed(list)
    }

    var result = new Array(list.length)

    for (var i = 0; i < list.length; i++) {
      result[i] = new MSlice_Object__code_line_417_column_16__convertNamed(list[i])
    }

    return result
  }

  function convertToNestings(params) {
    if (!params || !params.subitems) {
      return null
    }

    var nestings = new MSlice_Object__code_line_430_column_17__convertToNestings()

    for (var nesting_name in params.subitems) {
      if (!params.subitems.hasOwnProperty(nesting_name)) {
        continue
      }

      var cur = params.subitems[nesting_name]
      var result = convertNamed(cur)
      nestings[nesting_name] = result
    }

    return new MSlice_Object__code_line_442_column_9__convertToNestings(
      nestings,
      params.subitems_source_name,
    )
  }

  var LoadableList = spv.inh(
    LoadableListBase,
    {
      init: function (self, opts, data, params) {
        var init_v2 = data && data.init_version === 2

        if (init_v2) {
          return
        }

        if (!params || !params.subitems || !params.subitems[self.main_list_name]) {
          return
        }

        self.nextTick(
          self.insertDataAsSubitems,
          [
            self,
            self.main_list_name,
            params.subitems[self.main_list_name],
            null,
            params.subitems_source_name && params.subitems_source_name[self.main_list_name],
          ],
          true,
        )
      },
    },
    new MSlice_Object__code_line_468_column_3(true),
  )
  LoadableList.LoadableListBase = LoadableListBase
  return LoadableList
})
