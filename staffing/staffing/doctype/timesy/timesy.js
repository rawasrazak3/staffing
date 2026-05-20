// // Copyright (c) 2021, jan and contributors
// // For license information, please see license.txt
// var has_si = false
// var has_pi = false
// var additional_salary = false
// var deleted_object = {}
// var type = ""

// // ─── GLOBAL HELPERS via frappe.provide ───────────────────────────────────────
// frappe.provide('staffing.timesy')

// staffing.timesy.pad = function(n) {
//     return String(Math.max(0, parseInt(n) || 0)).padStart(2, '0')
// }

// staffing.timesy.slots = (function() {
//     var s = []
//     for (var h = 0; h < 24; h++)
//         for (var m = 0; m < 60; m += 15)
//             s.push({ h: h, m: m })
//     return s
// })()

// staffing.timesy.dd     = null
// staffing.timesy.dd_cb  = null
// staffing.timesy.dd_box = null

// staffing.timesy.get_dd = function() {
//     var T = staffing.timesy
//     if (!T.dd) {
//         if (!document.getElementById('ts-style')) {
//             var st = document.createElement('style')
//             st.id = 'ts-style'
//             st.textContent = [
//                 '.ts-box{display:inline-flex;align-items:center;gap:3px;background:#fff;border:1.5px solid #d1d5db;border-radius:6px;padding:4px 8px;cursor:pointer;min-width:80px;}',
//                 '.ts-box:hover{border-color:#9CA3AF;}',
//                 '.ts-box.ts-open{border-color:#7C3AED;box-shadow:0 0 0 2px rgba(124,58,237,.15);}',
//                 '.ts-sep{font-size:16px;font-weight:700;color:#6B7280;user-select:none;}',
//                 '.ts-seg{width:30px;height:28px;font-size:14px;font-weight:600;font-family:monospace;text-align:center;border:none;outline:none;background:transparent;color:#111827;}',
//                 '.ts-dd{position:fixed;background:#fff;border:1px solid #e5e7eb;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,.13);width:120px;max-height:200px;overflow-y:auto;z-index:999999;display:none;}',
//                 '.ts-dd-i{padding:8px 12px;font-size:12px;font-family:monospace;font-weight:500;color:#111827;cursor:pointer;}',
//                 '.ts-dd-i:hover{background:#f3f4f6;}',
//                 '.ts-dd-i.ts-sel{background:#EEEDFE;color:#534AB7;}'
//             ].join('')
//             document.head.appendChild(st)
//         }
//         var dd = document.createElement('div')
//         dd.className = 'ts-dd'
//         T.slots.forEach(function(s) {
//             var item = document.createElement('div')
//             item.className = 'ts-dd-i'
//             item.dataset.h = s.h
//             item.dataset.m = s.m
//             item.textContent = T.pad(s.h) + ':' + T.pad(s.m)
//             item.addEventListener('mousedown', function(e) {
//                 e.preventDefault()
//                 e.stopPropagation()
//                 if (T.dd_cb) T.dd_cb(s.h, s.m)
//                 dd.style.display = 'none'
//                 if (T.dd_box) T.dd_box.classList.remove('ts-open')
//                 T.dd_box = null
//                 T.dd_cb  = null
//             })
//             dd.appendChild(item)
//         })
//         document.body.appendChild(dd)
//         document.addEventListener('mousedown', function(e) {
//             if (T.dd && T.dd.style.display !== 'none') {
//                 if (!T.dd_box || (!T.dd_box.contains(e.target) && !T.dd.contains(e.target))) {
//                     T.dd.style.display = 'none'
//                     if (T.dd_box) T.dd_box.classList.remove('ts-open')
//                     T.dd_box = null
//                     T.dd_cb  = null
//                 }
//             }
//         }, true)
//         T.dd = dd
//     }
//     return T.dd
// }

// staffing.timesy.open_dd = function(boxEl, hVal, mVal, cb) {
//     var T  = staffing.timesy
//     var dd = T.get_dd()
//     T.dd_cb = cb
//     if (T.dd_box && T.dd_box !== boxEl) T.dd_box.classList.remove('ts-open')
//     T.dd_box = boxEl
//     boxEl.classList.add('ts-open')
//     var rect = boxEl.getBoundingClientRect()
//     dd.style.left    = rect.left + 'px'
//     dd.style.top     = (rect.bottom + 4) + 'px'
//     dd.style.display = 'block'
//     dd.querySelectorAll('.ts-dd-i').forEach(function(it) {
//         it.classList.toggle('ts-sel', (+it.dataset.h === hVal && +it.dataset.m === mVal))
//     })
//     var sel = dd.querySelector('.ts-sel') || dd.querySelectorAll('.ts-dd-i')[hVal * 4]
//     if (sel) dd.scrollTop = Math.max(0, sel.offsetTop - 80)
// }

// staffing.timesy.make_box = function(hVal, mVal, onChange) {
//     var T   = staffing.timesy
//     var box = document.createElement('div')
//     box.className = 'ts-box'

//     var hInp = document.createElement('input')
//     hInp.type = 'text'; hInp.className = 'ts-seg'
//     hInp.maxLength = 2; hInp.placeholder = 'HH'
//     hInp.autocomplete = 'off'
//     hInp.value = (hVal !== null && hVal !== undefined) ? T.pad(hVal) : ''
//     hInp.style.cssText = 'width:30px;height:28px;font-size:14px;font-weight:600;font-family:monospace;text-align:center;border:none;outline:none;background:transparent;color:#111827;'

//     var sep = document.createElement('span')
//     sep.className = 'ts-sep'; sep.textContent = ':'

//     var mInp = document.createElement('input')
//     mInp.type = 'text'; mInp.className = 'ts-seg'
//     mInp.maxLength = 2; mInp.placeholder = 'MM'
//     mInp.autocomplete = 'off'
//     mInp.value = (mVal !== null && mVal !== undefined) ? T.pad(mVal) : ''
//     mInp.style.cssText = 'width:30px;height:28px;font-size:14px;font-weight:600;font-family:monospace;text-align:center;border:none;outline:none;background:transparent;color:#111827;'

//     box.appendChild(hInp); box.appendChild(sep); box.appendChild(mInp)

//     function open_picker() {
//         T.open_dd(box, parseInt(hInp.value) || 0, parseInt(mInp.value) || 0, function(h, m) {
//             hInp.value = T.pad(h)
//             mInp.value = T.pad(m)
//             if (onChange) onChange(h, m)
//         })
//     }

//     function stop(e) { e.stopPropagation() }

//     hInp.addEventListener('focus',     function(e) { stop(e); open_picker() })
//     mInp.addEventListener('focus',     function(e) { stop(e); open_picker() })
//     box.addEventListener('click',      function(e) { stop(e); open_picker() })
//     hInp.addEventListener('mousedown', stop)
//     mInp.addEventListener('mousedown', stop)
//     hInp.addEventListener('keydown',   function(e) { stop(e); e.stopImmediatePropagation() }, true)
//     mInp.addEventListener('keydown',   function(e) { stop(e); e.stopImmediatePropagation() }, true)
//     hInp.addEventListener('input', function() {
//         this.value = this.value.replace(/\D/g, '')
//         if (this.value.length === 2) mInp.focus()
//     })
//     mInp.addEventListener('input', function() {
//         this.value = this.value.replace(/\D/g, '')
//     })

//     box.get_time = function() {
//         var h = parseInt(hInp.value), m = parseInt(mInp.value)
//         if (isNaN(h) || isNaN(m)) return ''
//         return T.pad(h) + ':' + T.pad(m) + ':00'
//     }
//     box.set_time = function(timeStr) {
//         if (!timeStr) { hInp.value = ''; mInp.value = ''; return }
//         var parts  = timeStr.split(':')
//         hInp.value = T.pad(parseInt(parts[0]) || 0)
//         mInp.value = T.pad(parseInt(parts[1]) || 0)
//     }

//     return box
// }

// // ─── REPLACE GRID TIME CELLS ─────────────────────────────────────────────────
// staffing.timesy.replace_cells = function(frm) {
//     var T     = staffing.timesy
//     var $grid = $(frm.fields_dict.timesy_details.grid.wrapper)
//     $grid.find('.grid-row[data-name]').each(function() {
//         var $row    = $(this)
//         var rowName = $row.data('name')
//         if (!rowName) return
//         var docRow  = (frm.doc.timesy_details || []).find(function(r) { return r.name === rowName })

//         ;['from_time', 'to_time'].forEach(function(fieldname) {
//             var $col = $row.find('.col[data-fieldname="' + fieldname + '"]')
//             if (!$col.length) return

//             var currentVal  = docRow ? (docRow[fieldname] || '') : ''
//             var existingBox = $col.find('.ts-box')[0]

//             if (existingBox) {
//                 existingBox.set_time(currentVal)
//                 return
//             }

//             $col.find('.static-area, .field-area').hide()

//             var h = null, m = null
//             if (currentVal) {
//                 var parts = currentVal.split(':')
//                 h = parseInt(parts[0]) || 0
//                 m = parseInt(parts[1]) || 0
//             }

//             var box = T.make_box(h, m, function() {
//                 var val = box.get_time()
//                 frappe.model.set_value('Timesy Details', rowName, fieldname, val)
//                 setTimeout(function() {
//                     staffing.timesy.calculate_hours(frm, 'Timesy Details', rowName)
//                     // ✅ row-level refresh only after grid direct entry
//                     setTimeout(function() {
//                         staffing.timesy.refresh_row(frm, rowName)
//                     }, 200)
//                 }, 100)
//             })

//             $col[0].appendChild(box)
//         })
//     })
// }

// // ─── SMART ROW-LEVEL REFRESH ─────────────────────────────────────────────────
// // Updates only calculated cells in one row via direct DOM — never wipes grid
// staffing.timesy.refresh_row = function(frm, rowName) {
//     var $grid  = $(frm.fields_dict.timesy_details.grid.wrapper)
//     var $row   = $grid.find('.grid-row[data-name="' + rowName + '"]')
//     if (!$row.length) return

//     var docRow = (frm.doc.timesy_details || []).find(function(r) { return r.name === rowName })
//     if (!docRow) return

//     // Only update calculated numeric columns — never touch from_time / to_time
//     ;['working_hour', 'custom_ot_hour', 'custom_late_working_hour',
//       'overtime_hour', 'costing_hour', 'billing_hour', 'absent_hour',
//       'custom_standard_working_hour'].forEach(function(fieldname) {
//         var $col = $row.find('.col[data-fieldname="' + fieldname + '"]')
//         if (!$col.length) return
//         var val = docRow[fieldname] !== undefined ? docRow[fieldname] : 0
//         $col.find('.static-area').text(val)
//         $col.find('.field-area input').val(val)
//         $col.find('.like-disabled-input').text(val)
//         $col.find('.control-value').text(val)
//     })

//     // Re-inject ts-boxes — skips cols that already have a box (safe to call)
//     staffing.timesy.replace_cells(frm)
//     total_costing(frm)
// }

// // ─── INJECT TS-BOX INTO DIALOG TIME FIELDS ───────────────────────────────────
// staffing.timesy.inject_dialog_boxes = function() {
//     var T      = staffing.timesy
//     var $modal = $('.modal.show .modal-body')
//     if (!$modal.length) return

//     ;['from_time', 'to_time'].forEach(function(fieldname) {
//         var $wrapper = $modal.find('[data-fieldname="' + fieldname + '"]').first()
//         if (!$wrapper.length) return
//         if ($wrapper.find('.ts-box').length) return

//         $wrapper.find('.frappe-control').hide()
//         var box = T.make_box(null, null, null)
//         box.style.marginTop = '4px'
//         $wrapper.find('.form-group').append(box)
//     })
// }

// staffing.timesy.get_dialog_time = function(fieldname) {
//     var $modal   = $('.modal.show .modal-body')
//     var $wrapper = $modal.find('[data-fieldname="' + fieldname + '"]').first()
//     var box      = $wrapper.find('.ts-box')[0]
//     return box ? box.get_time() : ''
// }

// // ─── CORE CALCULATION — reads directly from a row object ─────────────────────
// staffing.timesy.calculate_hours_from_row = function(frm, row) {
//     if (!row.from_time || !row.to_time) return

//     var from_parts   = row.from_time.split(':')
//     var to_parts     = row.to_time.split(':')
//     var from_minutes = parseInt(from_parts[0]) * 60 + parseInt(from_parts[1])
//     var to_minutes   = parseInt(to_parts[0])   * 60 + parseInt(to_parts[1])

//     if (to_minutes < from_minutes) to_minutes += 24 * 60

//     var total_hours       = Math.round(((to_minutes - from_minutes) / 60) * 100) / 100
//     var std               = parseFloat(row.custom_standard_working_hour) || 0
//     var working_hour      = total_hours
//     var ot_hour           = 0
//     var late_working_hour = 0

//     if (std > 0) {
//         if (total_hours > std)      ot_hour           = Math.round((total_hours - std) * 100) / 100
//         else if (total_hours < std) late_working_hour = Math.round((std - total_hours) * 100) / 100
//     }

//     row.working_hour             = working_hour
//     row.custom_ot_hour           = ot_hour
//     row.custom_late_working_hour = late_working_hour

//     var cdt = row.doctype
//     var cdn = row.name

//     if (cdt && cdn && locals[cdt] && locals[cdt][cdn]) {
//         locals[cdt][cdn].working_hour             = working_hour
//         locals[cdt][cdn].custom_ot_hour           = ot_hour
//         locals[cdt][cdn].custom_late_working_hour = late_working_hour
//     }

//     // NO full grid refresh here — caller handles refresh_row
//     frappe.model.set_value(cdt, cdn, 'working_hour',             working_hour)
//     frappe.model.set_value(cdt, cdn, 'custom_ot_hour',           ot_hour)
//     frappe.model.set_value(cdt, cdn, 'custom_late_working_hour', late_working_hour)

//     // ── ADDED: recalculate parent totals live after every row calculation ──
//     setTimeout(function() {
//         var total_ot = 0, total_late = 0, total_wh = 0
//         ;(frm.doc.timesy_details || []).forEach(function(r) {
//             total_ot   += r.custom_ot_hour || 0
//             total_late += r.custom_late_working_hour || 0
//             total_wh   += r.working_hour || 0
//         })
//         frm.set_value('custom_total_overtime_working_hours', total_ot)
//         frm.set_value('custom_total_late_working_hours',     total_late)
//         frm.set_value('custom_total_working_hours',          total_wh)
//         frm.refresh_fields(['custom_total_overtime_working_hours', 'custom_total_late_working_hours', 'custom_total_working_hours'])
//     }, 300)
//     // ── END ADDED ──
// }

// // ─── CALCULATE via locals (for grid field triggers) ───────────────────────────
// staffing.timesy.calculate_hours = function(frm, cdt, cdn) {
//     var row = locals[cdt][cdn]
//     if (!row || !row.from_time || !row.to_time) return
//     staffing.timesy.calculate_hours_from_row(frm, row)
// }

// // ─── FORCE PROJECT FETCH + CALCULATION (via locals, for grid triggers) ────────
// staffing.timesy.fetch_and_calculate = function(frm, cdt, cdn) {
//     var row = locals[cdt][cdn]
//     if (!row) return

//     if (!row.project) {
//         staffing.timesy.calculate_hours(frm, cdt, cdn)
//         setTimeout(function() {
//             staffing.timesy.refresh_row(frm, cdn)
//         }, 300)
//         return
//     }

//     frappe.db.get_value('Project', row.project, 'custom_standard_working_hour')
//     .then(function(r) {
//         var swh = (r && r.message && r.message.custom_standard_working_hour) || 0
//         // Write to locals and doc row directly — more reliable than set_value for grid columns
//         row.custom_standard_working_hour = swh
//         if (locals[cdt] && locals[cdt][cdn]) {
//             locals[cdt][cdn].custom_standard_working_hour = swh
//         }
//         setTimeout(function() {
//             staffing.timesy.calculate_hours(frm, cdt, cdn)
//             // Full grid refresh so standard_working_hour column renders correctly
//             frm.refresh_field('timesy_details')
//             setTimeout(function() {
//                 staffing.timesy.replace_cells(frm)
//             }, 200)
//         }, 100)
//     })
// }

// // ─── BULK FETCH standard_working_hour FOR ALL ROWS WITH A PROJECT ────────────
// // Called on refresh/load to populate standard_working_hour for existing rows
// staffing.timesy.fetch_all_standard_hours = function(frm) {
//     var rows = (frm.doc.timesy_details || []).filter(function(r) { return r.project })
//     if (!rows.length) return

//     // Group unique projects to minimise DB calls
//     var project_map = {}
//     rows.forEach(function(r) {
//         if (!project_map[r.project]) project_map[r.project] = []
//         project_map[r.project].push(r)
//     })

//     var project_keys = Object.keys(project_map)
//     var completed    = 0

//     project_keys.forEach(function(project) {
//         frappe.db.get_value('Project', project, 'custom_standard_working_hour')
//         .then(function(res) {
//             var swh = (res && res.message && res.message.custom_standard_working_hour) || 0
//             project_map[project].forEach(function(row) {
//                 // Write into the doc row directly
//                 row.custom_standard_working_hour = swh
//                 // Write into locals so Frappe grid picks it up on refresh
//                 var cdt = row.doctype || 'Timesy Details'
//                 var cdn = row.name
//                 if (cdt && cdn) {
//                     if (!locals[cdt])      locals[cdt]      = {}
//                     if (!locals[cdt][cdn]) locals[cdt][cdn] = {}
//                     locals[cdt][cdn].custom_standard_working_hour = swh
//                 }
//             })
//             completed++
//             // After ALL project fetches are done, do ONE full grid refresh
//             if (completed === project_keys.length) {
//                 setTimeout(function() {
//                     frm.refresh_field('timesy_details')
//                     setTimeout(function() {
//                         staffing.timesy.replace_cells(frm)
//                     }, 200)
//                 }, 100)
//             }
//         })
//     })
// }

// // ─── PROJECT FETCH + CALCULATION working directly on a row object ─────────────
// staffing.timesy.fetch_and_calculate_row = function(frm, row) {
//     if (!row.project) {
//         staffing.timesy.calculate_hours_from_row(frm, row)
//         // ✅ row-level DOM update only — no full grid refresh
//         setTimeout(function() {
//             staffing.timesy.refresh_row(frm, row.name)
//         }, 300)
//         return
//     }

//     frappe.db.get_value('Project', row.project, 'custom_standard_working_hour')
//     .then(function(r) {
//         var swh = (r && r.message && r.message.custom_standard_working_hour) || 0
//         row.custom_standard_working_hour = swh
//         var cdt = row.doctype
//         var cdn = row.name
//         if (cdt && cdn && locals[cdt] && locals[cdt][cdn]) {
//             locals[cdt][cdn].custom_standard_working_hour = swh
//         }
//         setTimeout(function() {
//             staffing.timesy.calculate_hours_from_row(frm, row)
//             // ✅ row-level DOM update only — no full grid refresh
//             setTimeout(function() {
//                 staffing.timesy.refresh_row(frm, row.name)
//             }, 300)
//         }, 200)
//     })
// }

// // ─── MONTHLY TIMESHEET HANDLERS ──────────────────────────────────────────────
// frappe.ui.form.on('Monthly Timesheet', {
//     type: function(frm, cdt, cdn) {
//         var d              = locals[cdt][cdn]
//         var from_date      = new Date(cur_frm.doc.start_date)
//         var end_date       = new Date(cur_frm.doc.end_date)
//         var number_of_days = (new Date(end_date - from_date)).getDate()
//         if (d.type === 'Working Days') {
//             type = ""; deleted_object = {}
//             d.number = number_of_days
//             cur_frm.refresh_field("monthly_timesheet")
//         }
//     },
//     number: function(frm, cdt, cdn) {
//         var d              = locals[cdt][cdn]
//         var from_date      = new Date(cur_frm.doc.start_date)
//         var end_date       = new Date(cur_frm.doc.end_date)
//         var number_of_days = (new Date(end_date - from_date)).getDate()
//         if (d.type !== "Working Days") compute_working_days(cur_frm, number_of_days, d)
//     },
//     monthly_timesheet_remove: function(frm, cdt, cdn) {
//         var from_date      = new Date(cur_frm.doc.start_date)
//         var end_date       = new Date(cur_frm.doc.end_date)
//         var number_of_days = (new Date(end_date - from_date)).getDate()
//         cur_frm.refresh_field("monthly_timesheet")
//         if (type !== "Working Days") compute_working_days(cur_frm, number_of_days, deleted_object)
//     },
//     before_monthly_timesheet_remove: function(frm, cdt, cdn) {
//         var d = locals[cdt][cdn]
//         type = d.type; deleted_object = d
//     },
//     working_hour: function(frm, cdt, cdn) {
//         var d              = locals[cdt][cdn]
//         var from_date      = new Date(cur_frm.doc.start_date)
//         var end_date       = new Date(cur_frm.doc.end_date)
//         var number_of_days = (new Date(end_date - from_date)).getDate()
//         if (d.type === 'Working Days') compute_working_days(cur_frm, number_of_days, d)
//         else { d.working_hour = 0; cur_frm.refresh_field("monthly_timesheet") }
//     },
// })

// function compute_working_days(cur_frm, number_of_days, d) {
//     var fridays = 0, w_fridays = 0, absent = 0, h_working = 0
//     var holiday = 0, release = 0, bad_weather = 0
//     for (var x = 0; x < cur_frm.doc.monthly_timesheet.length; x++) {
//         var mt = cur_frm.doc.monthly_timesheet[x]
//         if      (mt.type === 'Fridays')          fridays     = mt.number
//         else if (mt.type === 'Working Fridays')  w_fridays   = mt.number
//         else if (mt.type === 'Absent')           absent      = mt.number
//         else if (mt.type === 'Working Holidays') h_working   = mt.number
//         else if (mt.type === 'Holiday')          holiday     = mt.number
//         else if (mt.type === 'Release')          release     = mt.number
//         else if (mt.type === 'Bad Weather')      bad_weather = mt.number
//     }
//     update_monthly_timesheet(number_of_days, fridays, w_fridays, absent, h_working, holiday, release, bad_weather, cur_frm, d)
// }

// function update_monthly_timesheet(working_days, fridays, w_fridays, absent, h_working, holiday, release, bad_weather, cur_frm, d) {
//     var friday_value = 0, normal_working_hour = 0, overtime_hour = 0
//     for (var x = 0; x < cur_frm.doc.monthly_timesheet.length; x++) {
//         var mt = cur_frm.doc.monthly_timesheet[x]
//         if (mt.type === 'Working Days') {
//             normal_working_hour += mt.working_hour
//             friday_value = w_fridays > 0 && fridays > 0 && (d.type && (d.type === "Fridays" || d.type === 'Working Fridays')) ? fridays - w_fridays : fridays
//             var workdays = holiday > 0
//                 ? (working_days - friday_value - absent - holiday - release - bad_weather) + h_working
//                 : (working_days - friday_value - absent - holiday - release - bad_weather)
//             mt.number = workdays
//             overtime_hour += mt.working_hour > (workdays * cur_frm.doc.normal_working_hour)
//                 ? mt.working_hour - (workdays * cur_frm.doc.normal_working_hour) : 0
//             cur_frm.refresh_field("monthly_timesheet")
//         } else if (mt.type === 'Fridays') {
//             mt.number = (d.type && (d.type === "Fridays" || d.type === 'Working Fridays')) ? fridays - w_fridays : fridays
//             cur_frm.refresh_field("monthly_timesheet")
//         } else if (mt.type === 'Working Fridays') {
//             normal_working_hour += mt.working_hour; overtime_hour += mt.working_hour
//             mt.number = w_fridays; cur_frm.refresh_field("monthly_timesheet")
//         } else if (mt.type === 'Absent')          { mt.number = absent;      cur_frm.refresh_field("monthly_timesheet") }
//         else if (mt.type === 'Release')            { mt.number = release;     cur_frm.refresh_field("monthly_timesheet") }
//         else if (mt.type === 'Bad Weather')        { mt.number = bad_weather; cur_frm.refresh_field("monthly_timesheet") }
//         else if (mt.type === 'Working Holidays')   {
//             overtime_hour += mt.working_hour; normal_working_hour += mt.working_hour
//             mt.number = h_working; cur_frm.refresh_field("monthly_timesheet")
//         } else if (mt.type === 'Holiday')          { mt.number = holiday;     cur_frm.refresh_field("monthly_timesheet") }
//     }
//     cur_frm.doc.overtime_hours            = overtime_hour
//     cur_frm.doc.total_overtime_hour_staff = overtime_hour
//     cur_frm.doc.total_working_hour        = normal_working_hour
//     cur_frm.refresh_fields(["overtime_hours", "total_working_hour", "total_overtime_hour_staff"])
//     compute_total_values(cur_frm, normal_working_hour, absent, overtime_hour)
// }

// function compute_total_values(cur_frm, normal_working_hour, absent, overtime_hour) {
//     frappe.db.get_doc("Staffing Cost", cur_frm.doc.staffing_cost).then(function(doc) {
//         cur_frm.doc.total_costing_hour  = (doc.default_cost_rate_per_hour    * normal_working_hour) - cur_frm.doc.total_absent_hour - cur_frm.doc.total_costing_rate_deduction
//         cur_frm.doc.total_billing_hour  = (doc.default_billing_rate_per_hour * normal_working_hour) - cur_frm.doc.total_absent_hour - cur_frm.doc.total_billing_rate_deduction
//         cur_frm.doc.total_overtime_hour = (overtime_hour * doc.default_overtime_rate) - cur_frm.doc.total_absent_hour
//         cur_frm.refresh_fields(["total_costing_hour", 'total_absent_hour', 'total_overtime_hour', 'total_billing_hour'])
//     })
// }

// // ─── AUTO GENERATE ROWS (1 per day) ──────────────────────────────────────────
// function generate_timesy_rows(frm) {
//     if (!frm.doc.start_date || !frm.doc.end_date) return
//     if (frm.doc.skip_timesheet) return
//     var start = frappe.datetime.str_to_obj(frm.doc.start_date)
//     var end   = frappe.datetime.str_to_obj(frm.doc.end_date)
//     if (end < start) { frappe.throw(__("End Date cannot be before Start Date")); return }
//     var existing_dates = {}
//     ;(frm.doc.timesy_details || []).forEach(function(row) {
//         if (row.date) existing_dates[row.date] = true
//     })
//     var current = new Date(start)
//     var added   = 0
//     while (current <= end) {
//         var date_str = frappe.datetime.obj_to_str(current)
//         if (!existing_dates[date_str]) {
//             var child    = frm.add_child("timesy_details")
//             child.date   = date_str
//             child.status = "Working"
//             added++
//         }
//         current.setDate(current.getDate() + 1)
//     }
//     if (added > 0) {
//         frm.refresh_field("timesy_details")
//         setTimeout(function() { staffing.timesy.replace_cells(frm) }, 400)
//     }
// }

// // ─── ADD PROJECT DIALOG ───────────────────────────────────────────────────────
// function show_add_project_dialog(frm) {
//     if (!frm.doc.start_date || !frm.doc.end_date) {
//         frappe.msgprint({ title: __("Missing Dates"), message: __("Please set Start Date and End Date first."), indicator: "orange" })
//         return
//     }

//     var seen = [], date_options = []
//     ;(frm.doc.timesy_details || []).forEach(function(row) {
//         if (row.date && !seen.includes(row.date)) {
//             seen.push(row.date)
//             var count = frm.doc.timesy_details.filter(function(r) { return r.date === row.date && r.project }).length
//             var label = frappe.datetime.str_to_user(row.date)
//             if (count > 0) label += '  (' + count + (count === 1 ? ' project' : ' projects') + ')'
//             date_options.push({ label: label, value: row.date })
//         }
//     })

//     if (date_options.length === 0) {
//         frappe.msgprint({ title: __("No Dates"), message: __("No dates found."), indicator: "orange" })
//         return
//     }

//     var d = new frappe.ui.Dialog({
//         title: __("Add Project Row"),
//         fields: [
//             { fieldname: "date",      fieldtype: "Select", label: __("Select Date"), options: date_options.map(function(o) { return o.label }), reqd: 1 },
//             { fieldname: "project",   fieldtype: "Link",   label: __("Project"),     options: "Project" },
//             { fieldname: "from_time", fieldtype: "Time",   label: __("From Time") },
//             { fieldname: "to_time",   fieldtype: "Time",   label: __("To Time") },
//             { fieldname: "status",    fieldtype: "Select", label: __("Status"),
//               options: "Working\nAbsent\nHoliday",
//               default: "Working", reqd: 1 }
//         ],
//         primary_action_label: __("Add Row"),
//         primary_action: function(values) {
//             var selected_option = date_options.find(function(o) { return o.label === values.date })
//             if (!selected_option) return
//             var selected_date = selected_option.value

//             var from_time = staffing.timesy.get_dialog_time('from_time') || values.from_time || ''
//             var to_time   = staffing.timesy.get_dialog_time('to_time')   || values.to_time   || ''

//             if (from_time && to_time && from_time >= to_time) {
//                 frappe.msgprint({ title: __("Invalid Time"), message: __("From Time must be earlier than To Time."), indicator: "red" })
//                 return
//             }

//             var existing_empty = null
//             for (var i = 0; i < frm.doc.timesy_details.length; i++) {
//                 var r = frm.doc.timesy_details[i]
//                 if (r.date === selected_date && !r.project && !r.from_time && !r.to_time) {
//                     existing_empty = r; break
//                 }
//             }

//             var target_row = null

//             if (existing_empty) {
//                 existing_empty.project   = values.project || ""
//                 existing_empty.from_time = from_time
//                 existing_empty.to_time   = to_time
//                 existing_empty.status    = values.status || "Working"

//                 var cdt = existing_empty.doctype
//                 var cdn = existing_empty.name
//                 if (cdt && cdn) {
//                     if (!locals[cdt])       locals[cdt]       = {}
//                     if (!locals[cdt][cdn])  locals[cdt][cdn]  = {}
//                     locals[cdt][cdn].from_time = from_time
//                     locals[cdt][cdn].to_time   = to_time
//                     locals[cdt][cdn].project   = values.project || ""
//                     locals[cdt][cdn].status    = values.status || "Working"
//                 }

//                 target_row = existing_empty

//             } else {
//                 var last_idx = -1
//                 for (var j = 0; j < frm.doc.timesy_details.length; j++) {
//                     if (frm.doc.timesy_details[j].date === selected_date) last_idx = j
//                 }

//                 var new_row       = frappe.model.add_child(frm.doc, "Timesy Details", "timesy_details")
//                 new_row.date      = selected_date
//                 new_row.status    = values.status || "Working"
//                 new_row.project   = values.project || ""
//                 new_row.from_time = from_time
//                 new_row.to_time   = to_time

//                 var cdt2 = new_row.doctype
//                 var cdn2 = new_row.name
//                 if (cdt2 && cdn2) {
//                     if (!locals[cdt2])       locals[cdt2]       = {}
//                     if (!locals[cdt2][cdn2]) locals[cdt2][cdn2] = {}
//                     locals[cdt2][cdn2].from_time             = from_time
//                     locals[cdt2][cdn2].to_time               = to_time
//                     locals[cdt2][cdn2].project               = values.project || ""
//                     locals[cdt2][cdn2].status                = values.status || "Working"
//                     locals[cdt2][cdn2].date                  = selected_date
//                     locals[cdt2][cdn2].name                  = cdn2
//                     locals[cdt2][cdn2].doctype               = cdt2
//                     locals[cdt2][cdn2].custom_standard_working_hour = 0
//                 }

//                 if (last_idx >= 0 && last_idx < frm.doc.timesy_details.length - 1) {
//                     frm.doc.timesy_details.splice(last_idx + 1, 0, frm.doc.timesy_details.pop())
//                     frm.doc.timesy_details.forEach(function(row, i) { row.idx = i + 1 })
//                 }

//                 target_row = new_row
//             }

//             // One-time full refresh to render new row in grid
//             frm.refresh_field("timesy_details")

//             // Re-inject ts-boxes after grid renders
//             setTimeout(function() {
//                 staffing.timesy.replace_cells(frm)
//             }, 300)

//             // Calculate then do row-level DOM refresh only — never wipes grid again
//             if (target_row && from_time && to_time) {
//                 setTimeout(function() {
//                     staffing.timesy.fetch_and_calculate_row(frm, target_row)
//                 }, 500)
//             }

//             d.hide()
//             frappe.show_alert({ message: __("Project row added for {0}", [frappe.datetime.str_to_user(selected_date)]), indicator: "green" })
//         }
//     })

//     d.show()

//     var attempts = 0
//     var inject_interval = setInterval(function() {
//         attempts++
//         var $modal       = $('.modal.show .modal-body')
//         var from_wrapper = $modal.find('[data-fieldname="from_time"]').first()
//         var to_wrapper   = $modal.find('[data-fieldname="to_time"]').first()
//         if (from_wrapper.length && to_wrapper.length) {
//             clearInterval(inject_interval)
//             ;[
//                 { wrapper: from_wrapper, fieldname: 'from_time' },
//                 { wrapper: to_wrapper,   fieldname: 'to_time'   }
//             ].forEach(function(item) {
//                 if (item.wrapper.find('.ts-box').length) return
//                 item.wrapper.find('.frappe-control').hide()
//                 // ✅ onChange updates hidden frappe dialog field so values object is correct
//                 var box = staffing.timesy.make_box(null, null, function(h, m) {
//                     var timeStr = staffing.timesy.pad(h) + ':' + staffing.timesy.pad(m) + ':00'
//                     d.set_value(item.fieldname, timeStr)
//                 })
//                 box.style.marginTop = '4px'
//                 item.wrapper.find('.form-group').append(box)
//             })
//         }
//         if (attempts > 20) clearInterval(inject_interval)
//     }, 100)
// }

// // ─── MAIN FORM HANDLERS ──────────────────────────────────────────────────────
// frappe.ui.form.on('Timesy', {
//     normal_working_hour: function(frm) {
//         var from_date      = new Date(cur_frm.doc.start_date)
//         var end_date       = new Date(cur_frm.doc.end_date)
//         var number_of_days = (new Date(end_date - from_date)).getDate()
//         if (cur_frm.doc.monthly_timesheet) {
//             for (var x = 0; x < cur_frm.doc.monthly_timesheet.length; x++) {
//                 compute_working_days(cur_frm, number_of_days, cur_frm.doc.monthly_timesheet[x])
//             }
//         }
//         total_costing(cur_frm)
//     },
//     skip_timesheet: function(frm, cdt, cdn) {
//         var d = locals[cdt][cdn]
//         if (cur_frm.doc.monthly_timesheet.length === 0 && cur_frm.doc.holiday_list) {
//             var from_date      = new Date(cur_frm.doc.start_date)
//             var end_date       = new Date(cur_frm.doc.end_date)
//             var number_of_days = (new Date(end_date - from_date)).getDate()
//             cur_frm.call({ doc: cur_frm.doc, method: 'get_holiday', args: {}, freeze: true, freeze_message: "Changing Date...", async: false,
//                 callback: function(r) {
//                     var data = ['Working Days', 'Fridays', 'Holiday']
//                     for (var x = 0; x < data.length; x++) {
//                         cur_frm.add_child("monthly_timesheet", { type: data[x], number: data[x] === "Working Days" ? number_of_days - r.message[0] - r.message[1] : data[x] === 'Holiday' ? r.message[0] : data[x] === 'Fridays' ? r.message[1] : 0 })
//                         cur_frm.refresh_field("monthly_timesheet")
//                     }
//                     compute_working_days(cur_frm, number_of_days, d)
//                 }
//             })
//         }
//     },
//     holiday_list: function(frm, cdt, cdn) {
//         var d = locals[cdt][cdn]
//         cur_frm.clear_table("monthly_timesheet")
//         cur_frm.refresh_field("monthly_timesheet")
//         if (cur_frm.doc.monthly_timesheet.length === 0 && cur_frm.doc.holiday_list) {
//             var from_date      = new Date(cur_frm.doc.start_date)
//             var end_date       = new Date(cur_frm.doc.end_date)
//             var number_of_days = (new Date(end_date - from_date)).getDate()
//             cur_frm.call({ doc: cur_frm.doc, method: 'get_holiday', args: {}, freeze: true, freeze_message: "Changing Date...", async: false,
//                 callback: function(r) {
//                     var data = ['Working Days', 'Fridays', 'Holiday']
//                     for (var x = 0; x < data.length; x++) {
//                         cur_frm.add_child("monthly_timesheet", { type: data[x], number: data[x] === "Working Days" ? number_of_days - r.message[0] - r.message[1] : data[x] === 'Holiday' ? r.message[0] : data[x] === 'Fridays' ? r.message[1] : 0 })
//                         cur_frm.refresh_field("monthly_timesheet")
//                     }
//                     compute_working_days(cur_frm, number_of_days, d)
//                 }
//             })
//         }
//     },
//     start_date: function(frm) {
//         if (cur_frm.doc.timesy_details.length > 0 && !cur_frm.doc.skip_timesheet) {
//             if (!cur_frm.doc.timesy_details[0].date) { cur_frm.doc.timesy_details[0].date = cur_frm.doc.start_date; cur_frm.refresh_field("timesy_details") }
//         }
//         if (cur_frm.doc.skip_timesheet) cur_frm.trigger("holiday_list")
//         if (cur_frm.doc.start_date && cur_frm.doc.end_date) {
//             cur_frm.call({ doc: cur_frm.doc, method: 'check_date', args: { start_date: cur_frm.doc.start_date, end_date: cur_frm.doc.end_date }, freeze: true, freeze_message: "Checking dates...", async: false,
//                 callback: function(r) { generate_timesy_rows(frm); setTimeout(function() { staffing.timesy.replace_cells(frm) }, 500) }
//             })
//         }
//     },
//     end_date: function(frm) {
//         if (cur_frm.doc.timesy_details.length > 0 && !cur_frm.doc.skip_timesheet) {
//             if (!cur_frm.doc.timesy_details[0].date) { cur_frm.doc.timesy_details[0].date = cur_frm.doc.start_date; cur_frm.refresh_field("timesy_details") }
//         }
//         if (cur_frm.doc.skip_timesheet) cur_frm.trigger("holiday_list")
//         if (cur_frm.doc.start_date && cur_frm.doc.end_date) {
//             cur_frm.call({ doc: cur_frm.doc, method: 'check_date', args: { start_date: cur_frm.doc.start_date, end_date: cur_frm.doc.end_date }, freeze: true, freeze_message: "Checking dates...", async: false,
//                 callback: function(r) { generate_timesy_rows(frm); setTimeout(function() { staffing.timesy.replace_cells(frm) }, 500) }
//             })
//         }
//     },
//     demobilization_date: function() {
//         if (cur_frm.doc.demobilization_date) {
//             frappe.confirm('Update Demobilization Date in Staffing Cost?', function() {
//                 cur_frm.call({ doc: cur_frm.doc, method: 'change_date', args: {}, freeze: true, freeze_message: "Changing Date...", async: false, callback: function(r) { cur_frm.save_or_update() } })
//             }, function() {})
//         }
//     },
//     refresh: function(frm) {
//         cur_frm.get_field("monthly_timesheet").grid.cannot_add_rows = true
//         cur_frm.refresh_field("monthly_timesheet")

//         if (cur_frm.is_new()) {
//             cur_frm.doc.status = 'In Progress'; cur_frm.refresh_field('status')
//             cur_frm.doc.normal_working_hour = 8; cur_frm.refresh_field('normal_working_hour')
//         }

//         if (!cur_frm.doc.skip_timesheet) {
//             cur_frm.add_custom_button(__('Add Project'), function() {
//                 show_add_project_dialog(frm)
//             }, __("Time Sheet"))
//         }

//         cur_frm.call({ doc: cur_frm.doc, method: 'check_invoices', args: {}, freeze: true, freeze_message: "Checking Sales Order...", async: false,
//             callback: function(r) { has_si = r.message[0]; has_pi = r.message[1]; additional_salary = r.message[2] }
//         })

//         if (cur_frm.doc.docstatus && cur_frm.doc.status === "In Progress" && !cur_frm.doc.skip_timesheet) {
//             cur_frm.add_custom_button(__('Completed'), function() {
//                 frappe.confirm('Are you sure you want to proceed?', function() {
//                     cur_frm.call({ doc: cur_frm.doc, method: 'change_status', args: { status: "Completed" }, freeze: true, freeze_message: "Changing Status...", async: false, callback: function(r) { cur_frm.reload_doc() } })
//                 }, function() {})
//             })
//         }
//         if (cur_frm.doc.docstatus && cur_frm.doc.reference_type === 'Staff' && cur_frm.doc.status === 'Completed') {
//             if (!has_si) { cur_frm.add_custom_button(__('Sales Invoice'),    function() { frappe.model.open_mapped_doc({ method: "staffing.staffing.doctype.timesy.timesy.generate_si", frm: cur_frm }) }) }
//             if (!has_pi) { cur_frm.add_custom_button(__('Purchase Invoice'), function() { frappe.model.open_mapped_doc({ method: "staffing.staffing.doctype.timesy.timesy.generate_pi", frm: cur_frm }) }) }
//         }
//         if (cur_frm.doc.docstatus && cur_frm.doc.reference_type === 'Employee' && cur_frm.doc.status === 'Completed') {
//             if (!has_si)            { cur_frm.add_custom_button(__('Sales Invoice'),     function() { frappe.model.open_mapped_doc({ method: "staffing.staffing.doctype.timesy.timesy.generate_si", frm: cur_frm }) }) }
//             if (!additional_salary) { cur_frm.add_custom_button(__('Additional Salary'), function() { frappe.call({ method: "staffing.staffing.doctype.timesy.timesy.generate_as", args: { source_name: cur_frm.doc.name }, async: false, callback: function() { cur_frm.reload_doc() } }) }) }
//         }

//         cur_frm.set_query("employee_code",                      () => ({ filters: { status: 'Active' } }))
//         cur_frm.set_query("staff_code",                         () => ({ filters: { status: 'Active' } }))
//         cur_frm.set_query("staffing_project", "timesy_details", () => ({ filters: { disabled: 0 } }))
//         cur_frm.set_query("reference_type",                     () => ({ filters: [["name", "in", ["Employee", "Staff"]]] }))

//         setTimeout(function() {
//             staffing.timesy.replace_cells(frm)
//             // Populate standard_working_hour for all existing rows that have a project
//             staffing.timesy.fetch_all_standard_hours(frm)
//         }, 400)
//     },
//     staff_code: function(frm) {
//         if (cur_frm.doc.staff_code) get_designation(cur_frm, { staff_code: cur_frm.doc.staff_code, docstatus: 1, status: "Active", reference_type: 'Staff' })
//         else { cur_frm.doc.designation = ""; cur_frm.refresh_field("designation") }
//     },
//     employee_code: function(frm) {
//         if (cur_frm.doc.employee_code) get_designation(cur_frm, { employee_code: cur_frm.doc.employee_code, docstatus: 1, reference_type: 'Employee', status: "Active" })
//         else {
//             cur_frm.doc.designation = ""; cur_frm.doc.staffing_type = ""; cur_frm.doc.staffing_cost = ""; cur_frm.doc.staffing_project = ""
//             cur_frm.refresh_fields(["designation", "staffing_type", "staffing_cost", "staffing_project"])
//         }
//     },
//     total_absent_hour: function(frm) {
//         frappe.db.get_doc("Staffing Cost", cur_frm.doc.staffing_cost).then(function(doc) {
//             cur_frm.doc.total_overtime_hour = (cur_frm.doc.overtime_hours * doc.default_overtime_rate) - cur_frm.doc.total_absent_hour
//             cur_frm.refresh_fields(['total_overtime_hour'])
//         })
//     },
//     total_costing_rate_deduction: function(frm) {
//         if (cur_frm.doc.skip_timesheet) { var fd = new Date(cur_frm.doc.start_date); var ed = new Date(cur_frm.doc.end_date); compute_working_days(cur_frm, (new Date(ed - fd)).getDate(), {}) }
//         else total_costing(cur_frm)
//     },
//     total_billing_rate_deduction: function(frm) {
//         if (cur_frm.doc.skip_timesheet) { var fd = new Date(cur_frm.doc.start_date); var ed = new Date(cur_frm.doc.end_date); compute_working_days(cur_frm, (new Date(ed - fd)).getDate(), {}) }
//         else total_costing(cur_frm)
//     },
//     after_save: function(frm) {
//         setTimeout(function() {
//             staffing.timesy.replace_cells(frm)
//             staffing.timesy.fetch_all_standard_hours(frm)
//         }, 400)
//     }
// })

// function get_designation(cur_frm, obj) {
//     frappe.db.count('Staffing Cost', obj).then(function(count) {
//         if (count > 0) {
//             frappe.db.get_value('Staffing Cost', obj, ["name", "staffing_project", "supplier", "customer", "supplier_name", "customer_name", "staffing_type"]).then(function(r) {
//                 var values = r.message
//                 cur_frm.doc.staffing_cost = values.name; cur_frm.doc.staffing_type = values.staffing_type; cur_frm.doc.staffing_project = values.staffing_project
//                 if (cur_frm.doc.reference_type === 'Staff') { cur_frm.doc.supplier = values.supplier; cur_frm.doc.supplier_name = values.supplier_name }
//                 cur_frm.doc.customer_name = values.customer_name; cur_frm.doc.customer = values.customer
//                 cur_frm.refresh_fields(["staffing_type", "staffing_project", "supplier", "customer", "supplier_name", "customer_name", "staffing_cost"])
//             })
//         }
//     })
// }

// // ─── CHILD TABLE EVENTS ──────────────────────────────────────────────────────
// frappe.ui.form.on('Timesy Details', {
//     timesy_details_add: function(frm, cdt, cdn) {
//         var d = locals[cdt][cdn]
//         frm.refresh_field(d.parentfield)
//         if (d.idx > 1) {
//             var prev = frm.doc.timesy_details[d.idx - 2]
//             d.date = prev ? prev.date : frm.doc.start_date
//         } else {
//             d.date = frm.doc.start_date
//         }
//         frm.refresh_field(d.parentfield)
//         setTimeout(function() { staffing.timesy.replace_cells(frm) }, 400)
//     },
//     timesy_details_remove: function(frm, cdt, cdn) {
//         total_costing(cur_frm)
//         setTimeout(function() { staffing.timesy.replace_cells(frm) }, 400)
//     },
//     from_time: function(frm, cdt, cdn) {
//         staffing.timesy.calculate_hours(frm, cdt, cdn)
//         setTimeout(function() { staffing.timesy.refresh_row(frm, cdn) }, 300)
//     },
//     to_time: function(frm, cdt, cdn) {
//         staffing.timesy.calculate_hours(frm, cdt, cdn)
//         setTimeout(function() { staffing.timesy.refresh_row(frm, cdn) }, 300)
//     },
//     project: function(frm, cdt, cdn) {
//         staffing.timesy.fetch_and_calculate(frm, cdt, cdn)
//     },
//     absent_hour: function(frm, cdt, cdn) { total_costing(cur_frm) },
//     working_hour: function(frm, cdt, cdn) {
//         var d = locals[cdt][cdn]
//         if (d.status === 'Friday') { d.working_hour = 0; cur_frm.refresh_field(d.parentfield); frappe.throw("Cannot add working hour if status is Friday") }
//         else if (cur_frm.doc.staffing_cost) compute_hours(d, cur_frm)
//     },
//     status: function(frm, cdt, cdn) {
//         var d = locals[cdt][cdn]
//         if (cur_frm.doc.staffing_cost) compute_hours(d, cur_frm)
//     },
// })

// var absent_deduction = 0
// function compute_hours(d, cur_frm) {
//     frappe.db.get_doc("Staffing Cost", cur_frm.doc.staffing_cost).then(function(doc) {
//         absent_deduction = doc.absent_deduction_per_hour
//         if (d.status === "Absent") {
//             d.working_hour = 0; d.costing_hour = 0; d.billing_hour = 0; d.absent_hour = doc.absent_deduction_per_hour; d.friday_hour = 0
//             d.overtime_hour = cur_frm.doc.reference_type === 'Employee' && d.working_hour > cur_frm.doc.normal_working_hour ? (d.working_hour - cur_frm.doc.normal_working_hour) * doc.default_overtime_rate : 0
//             cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
//         } else if (d.status === "Medical") {
//             d.working_hour = 0; d.costing_hour = doc.default_cost_rate_per_hour * d.working_hour; d.billing_hour = doc.default_billing_rate_per_hour * d.working_hour; d.absent_hour = 0; d.friday_hour = 0
//             d.overtime_hour = cur_frm.doc.reference_type === 'Employee' && d.working_hour > cur_frm.doc.normal_working_hour ? (d.working_hour - cur_frm.doc.normal_working_hour) * doc.default_overtime_rate : 0
//             cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
//         } else if (['Friday', 'Standby'].includes(d.status)) {
//             d.costing_hour = 0; d.billing_hour = 0; d.absent_hour = 0; d.friday_costing_hour = 0; d.overtime_hour = 0; d.working_hour = 0
//             cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
//         } else if (['Working', 'Holiday Working', 'Friday Working', 'Standby Pay'].includes(d.status)) {
//             d.costing_hour = doc.default_cost_rate_per_hour * d.working_hour; d.billing_hour = doc.default_billing_rate_per_hour * d.working_hour; d.absent_hour = 0; d.friday_hour = 0
//             d.overtime_hour = cur_frm.doc.reference_type === 'Employee' && d.working_hour > cur_frm.doc.normal_working_hour ? (d.working_hour - cur_frm.doc.normal_working_hour) * doc.default_overtime_rate : 0
//             cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
//         } else if (d.status === "Holiday") {
//             d.costing_hour = 0; d.billing_hour = 0; d.absent_hour = 0; d.friday_costing_hour = 0; d.overtime_hour = 0; d.working_hour = 0
//             cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
//         } else if (d.status === "Release") {
//             d.working_hour = 0; d.costing_hour = 0; d.billing_hour = 0; d.absent_hour = doc.absent_deduction_per_hour; d.friday_hour = 0
//             d.overtime_hour = cur_frm.doc.reference_type === 'Employee' && d.working_hour > cur_frm.doc.normal_working_hour ? (d.working_hour - cur_frm.doc.normal_working_hour) * doc.default_overtime_rate : 0
//             cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
//         } else if (d.status === "Bad Weather") {
//             d.costing_hour = 0; d.billing_hour = 0; d.absent_hour = 0; d.friday_costing_hour = 0; d.overtime_hour = 0; d.working_hour = 0
//             cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
//         } else if (d.status === "Holiday Working Full Overtime") {
//             d.costing_hour = doc.default_cost_rate_per_hour * d.working_hour; d.billing_hour = doc.default_billing_rate_per_hour * d.working_hour; d.absent_hour = 0; d.friday_hour = 0
//             d.overtime_hour = cur_frm.doc.reference_type === 'Employee' && d.working_hour ? d.working_hour * doc.default_overtime_rate : 0
//             cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
//         } else if (d.status === "Friday Working Full Overtime") {
//             d.costing_hour = doc.default_cost_rate_per_hour * d.working_hour; d.billing_hour = doc.default_billing_rate_per_hour * d.working_hour; d.absent_hour = 0; d.friday_hour = 0
//             d.overtime_hour = cur_frm.doc.reference_type === 'Employee' && d.working_hour ? d.working_hour * doc.default_overtime_rate : 0
//             cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
//         }
//     })
// }

// function total_costing(cur_frm) {
//     var total_costing_hour = 0, total_billing_hour = 0, total_absent_hour = 0, total_overtime_hour = 0, total_working_hour = 0
//     var total_ot_hours = 0, total_late_hours = 0  // ── ADDED
//     var from_date      = new Date(cur_frm.doc.start_date)
//     var end_date       = new Date(cur_frm.doc.end_date)
//     var number_of_days = (new Date(end_date - from_date)).getDate()
//     for (var x = 0; x < cur_frm.doc.timesy_details.length; x++) {
//         total_working_hour  += cur_frm.doc.timesy_details[x].working_hour
//         total_costing_hour  += cur_frm.doc.timesy_details[x].costing_hour
//         total_billing_hour  += cur_frm.doc.timesy_details[x].billing_hour
//         total_overtime_hour += cur_frm.doc.timesy_details[x].overtime_hour
//         total_absent_hour   += cur_frm.doc.timesy_details[x].absent_hour
//         total_ot_hours      += cur_frm.doc.timesy_details[x].custom_ot_hour || 0           // ── ADDED
//         total_late_hours    += cur_frm.doc.timesy_details[x].custom_late_working_hour || 0  // ── ADDED
//     }
//     cur_frm.doc.total_costing_hour        = total_costing_hour - total_absent_hour - cur_frm.doc.total_costing_rate_deduction
//     cur_frm.doc.total_billing_hour        = total_billing_hour - cur_frm.doc.total_billing_rate_deduction
//     cur_frm.doc.total_absent_hour         = total_absent_hour
//     cur_frm.doc.total_working_hour        = total_working_hour
//     cur_frm.doc.total_overtime_hour       = total_overtime_hour
//     cur_frm.doc.total_overtime_hour_staff = total_working_hour >= (cur_frm.doc.normal_working_hour * number_of_days)
//         ? total_working_hour - (cur_frm.doc.normal_working_hour * number_of_days) : 0
//     cur_frm.doc.custom_total_overtime_working_hours = total_ot_hours    // ── ADDED
//     cur_frm.doc.custom_total_late_working_hours     = total_late_hours  // ── ADDED
//     cur_frm.refresh_fields(['total_overtime_hour_staff', 'total_costing_hour', 'total_billing_hour', 'total_absent_hour', 'total_friday_hour', 'total_overtime_hour', 'total_working_hour',
//         'custom_total_overtime_working_hours', 'custom_total_late_working_hours'])  // ── ADDED
// }



// Copyright (c) 2021, jan and contributors
// For license information, please see license.txt

// Copyright (c) 2021, jan and contributors
// For license information, please see license.txt
// Copyright (c) 2021, jan and contributors
// For license information, please see license.txt

// Copyright (c) 2021, jan and contributors
// For license information, please see license.txt
// Copyright (c) 2021, jan and contributors
// For license information, please see license.txt

var has_si = false
var has_pi = false
var additional_salary = false
var deleted_object = {}
var type = ""

frappe.provide('staffing.timesy')

// ─── INJECT STYLES ────────────────────────────────────────────────────────────
staffing.timesy.inject_styles = function() {
    if (document.getElementById('timesy-ui-styles')) return
    var style = document.createElement('style')
    style.id = 'timesy-ui-styles'
    style.textContent = `
        .tsd-wrap { font-family: -apple-system, 'Segoe UI', sans-serif; margin: 0 0 24px 0; display: flex; flex-direction: column; gap: 12px; font-size: 13px; }
        .tsd-wrap *, .tsd-wrap *::before, .tsd-wrap *::after { box-sizing: border-box; }

        .tsd-section { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: #7a87a8; margin-bottom: 6px; }
        .tsd-card { background: #fff; border: 1px solid #e4e9f2; border-radius: 12px; padding: 14px 16px; }

        /* Stats */
        .tsd-stats { display: grid; grid-template-columns: repeat(, minmax(0, 1fr)); gap: 10px; }
        .tsd-stat { background: #fff; border: 1px solid #e4e9f2; border-radius: 12px; padding: 12px 14px; }
        .tsd-stat-lbl { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: #7a87a8; margin-bottom: 4px; }
        .tsd-stat-val { font-size: 26px; font-weight: 700; letter-spacing: -1px; line-height: 1; color: #1a1f36; }
        .tsd-stat-val.wh { color: #3b6cf8; } .tsd-stat-val.ot { color: #e67e22; } .tsd-stat-val.late { color: #f05252; }
        .tsd-stat-unit { font-size: 11px; color: #7a87a8; margin-left: 2px; font-weight: 400; }

        /* Attendance calendar */
        .tsd-cal-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .tsd-cal-title { font-size: 13px; font-weight: 700; color: #1a1f36; }
        .tsd-legend { display: flex; gap: 10px; flex-wrap: wrap; }
        .tsd-leg-item { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #7a87a8; font-weight: 500; }
        .tsd-leg-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .tsd-track-wrap { overflow-x: auto; padding-bottom: 4px; }
        .tsd-track { display: flex; gap: 6px; min-width: max-content; }
        .tsd-day { display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .tsd-dnum { font-size: 10px; font-weight: 600; color: #7a87a8; font-family: monospace; }
        .tsd-dnum.today { color: #f05252; }
        .tsd-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; cursor: default; transition: transform .12s; }
        .tsd-dot:hover { transform: scale(1.12); }
        .tsd-dot.present { background: #22c55e; color: #fff; }
        .tsd-dot.late    { background: #f59e0b; color: #fff; }
        .tsd-dot.absent  { background: #f05252; color: #fff; }
        .tsd-dot.holiday { background: #fef3c7; color: #f59e0b; border: 1px solid #fcd34d; }
        .tsd-dot.weekend { background: #f3f4f6; color: #9ca3af; border: 1px solid #e5e7eb; }
        .tsd-dot.ot      { background: #e67e22; color: #fff; }
        .tsd-dot.empty   { background: #f3f4f6; border: 1px dashed #d1d5db; }

        /* Doc info */
        .tsd-g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .tsd-g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
        .tsd-g4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
        .tsd-field { display: flex; flex-direction: column; gap: 4px; }
        .tsd-lbl { font-size: 11px; color: #7a87a8; font-weight: 600; }

        .tsd-ro { height: 30px; border: 1px solid #e4e9f2; border-radius: 6px; padding: 0 10px; font-size: 12px; background: #f8faff; color: #7a87a8; display: flex; align-items: center; }
        .tsd-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px; font-size: 11px; font-weight: 600; }
        .tsd-badge.progress  { background: #e8eeff; color: #3b6cf8; }
        .tsd-badge.completed { background: #dcfce7; color: #16a34a; }

        /* ── INTERACTIVE TABLE ── */
        .tsd-tbl-wrap { overflow-x: auto; }
        .tsd-tbl { width: 100%; border-collapse: collapse; font-size: 12px; table-layout: fixed; }
        .tsd-tbl thead tr { border-bottom: 2px solid #e4e9f2; }
        .tsd-tbl th {
            font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
            color: #7a87a8; padding: 7px 6px; text-align: left; white-space: nowrap;
            background: #f8faff; position: sticky; top: 0; z-index: 2;
        }
        .tsd-tbl td { padding: 4px 5px; border-bottom: 1px solid #f0f3fa; color: #1a1f36; vertical-align: middle; }
        .tsd-tbl tr:last-child td { border-bottom: none; }
        .tsd-tbl tr:hover td { background: #fafbff; }
        .tsd-tbl tr.tsd-row-new td { background: #f0fff4; }

        /* Date cell button */
        .tsd-cell-date {
            width: 100%; height: 28px; border: 1px solid transparent; border-radius: 5px;
            padding: 0 6px; font-size: 11px; font-family: monospace; background: transparent;
            color: #1a1f36; outline: none; transition: border-color .15s, background .15s;
            cursor: pointer;
        }
        .tsd-cell-date:hover { border-color: #c7d2fe; background: #fff; }
        .tsd-cell-date:focus { border-color: #3b6cf8; background: #fff; box-shadow: 0 0 0 2px rgba(59,108,248,.12); }

        /* Status select */
        .tsd-cell-select {
            width: 100%; height: 28px; border: 1px solid transparent; border-radius: 5px;
            padding: 0 4px; font-size: 11px; font-family: inherit; background: transparent;
            color: #1a1f36; outline: none; cursor: pointer; transition: border-color .15s;
            -webkit-appearance: none; appearance: none;
        }
        .tsd-cell-select:hover { border-color: #c7d2fe; background: #fff; }
        .tsd-cell-select:focus { border-color: #3b6cf8; background: #fff; }

        /* Project link input wrapper */
        .tsd-proj-wrap { position: relative; }
        .tsd-proj-input {
            width: 100%; height: 28px; border: 1px solid transparent; border-radius: 5px;
            padding: 0 6px; font-size: 11px; font-family: inherit; background: transparent;
            color: #1a1f36; outline: none; transition: border-color .15s;
        }
        .tsd-proj-input:hover { border-color: #c7d2fe; background: #fff; }
        .tsd-proj-input:focus { border-color: #3b6cf8; background: #fff; box-shadow: 0 0 0 2px rgba(59,108,248,.12); }
        .tsd-proj-dd {
            position: absolute; top: 100%; left: 0; right: 0; z-index: 9999;
            background: #fff; border: 1px solid #e4e9f2; border-radius: 8px;
            box-shadow: 0 6px 20px rgba(0,0,0,.12); max-height: 180px; overflow-y: auto;
            display: none; margin-top: 2px;
        }
        .tsd-proj-dd.open { display: block; }
        .tsd-proj-opt {
            padding: 7px 12px; font-size: 11.5px; cursor: pointer; color: #1a1f36;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .tsd-proj-opt:hover { background: #f0f4ff; }
        .tsd-proj-opt.selected { background: #e8eeff; color: #3b6cf8; font-weight: 600; }

        /* Read-only computed cells */
        .tsd-num-cell {
            font-family: monospace; font-size: 11.5px; text-align: right;
            padding: 0 6px; display: block; line-height: 28px;
        }

        /* Row action buttons */
        .tsd-row-del {
            width: 22px; height: 22px; border-radius: 50%; border: none; background: #fee2e2;
            color: #dc2626; cursor: pointer; font-size: 14px; font-weight: 700;
            display: flex; align-items: center; justify-content: center;
            line-height: 1; transition: background .15s; padding: 0;
        }
        .tsd-row-del:hover { background: #fecaca; }

        /* Add row button */
        .tsd-add-row-btn {
            display: inline-flex; align-items: center; gap: 6px;
            margin-top: 10px; padding: 7px 14px;
            background: #f0f4ff; color: #3b6cf8;
            border: 1.5px dashed #a5b4fc; border-radius: 8px;
            font-size: 12px; font-weight: 600; cursor: pointer;
            font-family: inherit; transition: background .15s;
        }
        .tsd-add-row-btn:hover { background: #e0e9ff; }

        /* Totals bar */
        .tsd-totals { display: flex; background: #f8faff; border: 1px solid #e4e9f2; border-radius: 10px; overflow: hidden; margin-top: 10px; flex-wrap: wrap; }
        .tsd-tot-item { flex: 1; min-width: 100px; padding: 10px 12px; border-right: 1px solid #e4e9f2; }
        .tsd-tot-item:last-child { border-right: none; }
        .tsd-tot-lbl { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: .07em; color: #7a87a8; margin-bottom: 2px; }
        .tsd-tot-val { font-size: 16px; font-weight: 700; font-family: monospace; letter-spacing: -.5px; color: #1a1f36; }
        .tsd-tot-val.wh { color: #3b6cf8; } .tsd-tot-val.ot { color: #e67e22; } .tsd-tot-val.late { color: #f05252; }

        /* ts-box (time picker) */
        .ts-box { display: inline-flex; align-items: center; gap: 2px; background: #fff; border: 1px solid #d1d5db; border-radius: 5px; padding: 3px 6px; cursor: pointer; min-width: 72px; height: 28px; }
        .ts-box:hover { border-color: #9CA3AF; }
        .ts-box.ts-open { border-color: #3b6cf8; box-shadow: 0 0 0 2px rgba(59,108,248,.15); }
        .ts-sep { font-size: 14px; font-weight: 700; color: #6B7280; user-select: none; }
        .ts-seg { width: 26px; height: 22px; font-size: 12px; font-weight: 600; font-family: monospace; text-align: center; border: none; outline: none; background: transparent; color: #111827; }
        .ts-dd { position: fixed; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,.13); width: 110px; max-height: 180px; overflow-y: auto; z-index: 999999; display: none; }
        .ts-dd-i { padding: 7px 10px; font-size: 11px; font-family: monospace; font-weight: 500; color: #111827; cursor: pointer; }
        .ts-dd-i:hover { background: #f3f4f6; }
        .ts-dd-i.ts-sel { background: #e8eeff; color: #3b6cf8; }

        /* Frappe datepicker popup for date cells */
        .tsd-date-picker-wrap { position: absolute; z-index: 99999; background: #fff; border: 1px solid #e4e9f2; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,.12); padding: 4px; display: none; }
        .tsd-date-picker-wrap.open { display: block; }

        /* Hide the native Frappe grid body — grid still exists for data/save */
        [data-fieldname="timesy_details"] .grid-body,
        [data-fieldname="timesy_details"] .grid-heading-row,
        [data-fieldname="timesy_details"] .grid-footer,
        [data-fieldname="timesy_details"] .btn-open-row,
        [data-fieldname="timesy_details"] .grid-toolbar { display: none !important; }
        [data-fieldname="timesy_details"] .frappe-control { overflow: visible; }
    `
    document.head.appendChild(style)
}

// ─── PROJECT NAME CACHE ───────────────────────────────────────────────────────
staffing.timesy._project_cache = {}

staffing.timesy.resolve_project_names = function(project_ids) {
    var cache  = staffing.timesy._project_cache
    var needed = project_ids.filter(function(id) { return id && !cache[id] })
    var unique = needed.filter(function(v, i, a) { return a.indexOf(v) === i })
    if (!unique.length) return Promise.resolve(cache)
    return frappe.db.get_list('Project', {
        filters: [['name', 'in', unique]],
        fields:  ['name', 'project_name'],
        limit:   unique.length + 10
    }).then(function(results) {
        ;(results || []).forEach(function(p) { cache[p.name] = p.project_name || p.name })
        unique.forEach(function(id) { if (!cache[id]) cache[id] = id })
        return cache
    }).catch(function() {
        unique.forEach(function(id) { if (!cache[id]) cache[id] = id })
        return cache
    })
}

// ─── DATE HELPERS (DD-MM-YYYY display) ───────────────────────────────────────
staffing.timesy.fmt_date = function(ymd) {
    if (!ymd) return ''
    var p = ymd.split('-')
    if (p.length !== 3) return ymd
    return p[2] + '-' + p[1] + '-' + p[0]
}
staffing.timesy.parse_date = function(dmy) {
    if (!dmy) return ''
    var p = dmy.split('-')
    if (p.length !== 3) return dmy
    if (p[0].length === 4) return dmy
    return p[2] + '-' + p[1] + '-' + p[0]
}

// ─── STATUS OPTIONS ───────────────────────────────────────────────────────────
staffing.timesy.STATUS_OPTIONS = ['Working', 'Holiday', 'Absent','Weekend','On Leave']

// ─── BUILD ONE INTERACTIVE ROW ────────────────────────────────────────────────
staffing.timesy.make_row = function(frm, row) {
    var T  = staffing.timesy
    var tr = document.createElement('tr')
    tr.dataset.rowname = row.name

    // ── 1. Index ──
    var tdIdx = document.createElement('td')
    tdIdx.style.cssText = 'color:#bbc3d4;font-size:11px;text-align:center;width:28px;'
    tdIdx.className = 'tsd-idx'
    tdIdx.textContent = row.idx || ''
    tr.appendChild(tdIdx)

    // ── 2. Date (Frappe native datepicker via flatpickr) ──
    var tdDate = document.createElement('td')
    tdDate.style.width = '100px'
    tdDate.style.position = 'relative'

    var dateBtn = document.createElement('input')
    dateBtn.type = 'text'
    dateBtn.className = 'tsd-cell-date'
    dateBtn.value = T.fmt_date(row.date || '')
    dateBtn.placeholder = 'DD-MM-YYYY'
    dateBtn.readOnly = true
    dateBtn.title = 'Click to pick date'

    // Use Frappe's own datepicker (flatpickr under the hood)
    dateBtn.addEventListener('click', function(e) {
        e.stopPropagation()

        // Destroy any existing picker on the page
        if (T._active_date_picker) {
            try { T._active_date_picker.destroy() } catch(ex) {}
            T._active_date_picker = null
        }

        // Create a hidden input for flatpickr to bind to
        var hiddenInp = document.createElement('input')
        hiddenInp.type = 'text'
        hiddenInp.style.cssText = 'position:absolute;opacity:0;width:0;height:0;pointer-events:none;'
        tdDate.appendChild(hiddenInp)

        // Use frappe's flatpickr if available
        if (typeof flatpickr !== 'undefined') {
            var fp = flatpickr(hiddenInp, {
                dateFormat: 'Y-m-d',
                defaultDate: row.date || null,
                appendTo: document.body,
                onReady: function(selectedDates, dateStr, instance) {
                    // Position near the button
                    var rect = dateBtn.getBoundingClientRect()
                    instance.calendarContainer.style.top  = (rect.bottom + window.scrollY + 4) + 'px'
                    instance.calendarContainer.style.left = rect.left + 'px'
                    instance.open()
                },
                onChange: function(selectedDates, dateStr) {
                    if (dateStr) {
                        row.date = dateStr
                        dateBtn.value = T.fmt_date(dateStr)
                        frappe.model.set_value('Timesy Details', row.name, 'date', dateStr)
                        if (locals['Timesy Details'] && locals['Timesy Details'][row.name])
                            locals['Timesy Details'][row.name].date = dateStr

                        // Check if this date is a holiday
                        staffing.timesy.apply_employee_holidays(frm, function() {
                            T.build_att_calendar(frm)
                            staffing.timesy.update_row_computed(frm, row.name)
                        })
                    }
                    fp.destroy()
                    if (hiddenInp.parentNode) hiddenInp.parentNode.removeChild(hiddenInp)
                    T._active_date_picker = null
                },
                onClose: function() {
                    setTimeout(function() {
                        if (T._active_date_picker === fp) {
                            try { fp.destroy() } catch(ex) {}
                            if (hiddenInp.parentNode) hiddenInp.parentNode.removeChild(hiddenInp)
                            T._active_date_picker = null
                        }
                    }, 200)
                }
            })
            T._active_date_picker = fp
        } else {
            // Fallback: use Frappe dialog with a Date field
            var dlg = new frappe.ui.Dialog({
                title: 'Select Date',
                fields: [{ fieldname: 'pick_date', fieldtype: 'Date', label: 'Date', default: row.date || '' }],
                primary_action_label: 'Set',
                primary_action: function(vals) {
                    if (vals.pick_date) {
                        row.date = vals.pick_date
                        dateBtn.value = T.fmt_date(vals.pick_date)
                        frappe.model.set_value('Timesy Details', row.name, 'date', vals.pick_date)
                        if (locals['Timesy Details'] && locals['Timesy Details'][row.name])
                            locals['Timesy Details'][row.name].date = vals.pick_date
                        T.build_att_calendar(frm)
                    }
                    dlg.hide()
                    if (hiddenInp.parentNode) hiddenInp.parentNode.removeChild(hiddenInp)
                }
            })
            dlg.show()
        }
    })

    tdDate.appendChild(dateBtn)
    tr.appendChild(tdDate)

    // ── 3. From Time (ts-box) ──
    var tdFrom = document.createElement('td')
    tdFrom.style.width = '84px'
    var h_from = null, m_from = null
    if (row.from_time) { var pf = row.from_time.split(':'); h_from = +pf[0]; m_from = +pf[1] }
    var fromBox = T.make_box(h_from, m_from, function(h, m) {
        var val = T.pad(h) + ':' + T.pad(m) + ':00'
        row.from_time = val
        if (locals['Timesy Details'] && locals['Timesy Details'][row.name])
            locals['Timesy Details'][row.name].from_time = val
        frappe.model.set_value('Timesy Details', row.name, 'from_time', val)
        setTimeout(function() {
            T.calculate_hours(frm, 'Timesy Details', row.name)
            setTimeout(function() { T.update_row_computed(frm, row.name) }, 200)
        }, 80)
    })
    tdFrom.appendChild(fromBox)
    tr.appendChild(tdFrom)

    // ── 4. To Time (ts-box) ──
    var tdTo = document.createElement('td')
    tdTo.style.width = '84px'
    var h_to = null, m_to = null
    if (row.to_time) { var pt = row.to_time.split(':'); h_to = +pt[0]; m_to = +pt[1] }
    var toBox = T.make_box(h_to, m_to, function(h, m) {
        var val = T.pad(h) + ':' + T.pad(m) + ':00'
        row.to_time = val
        if (locals['Timesy Details'] && locals['Timesy Details'][row.name])
            locals['Timesy Details'][row.name].to_time = val
        frappe.model.set_value('Timesy Details', row.name, 'to_time', val)
        setTimeout(function() {
            T.calculate_hours(frm, 'Timesy Details', row.name)
            setTimeout(function() { T.update_row_computed(frm, row.name) }, 200)
        }, 80)
    })
    tdTo.appendChild(toBox)
    tr.appendChild(tdTo)

    // ── 5. Project (searchable link) — FIX: results are in r.message ──
    var tdProj = document.createElement('td')
    tdProj.style.width = '130px'
    var projWrap = document.createElement('div')
    projWrap.className = 'tsd-proj-wrap'
    var projInp = document.createElement('input')
    projInp.type = 'text'
    projInp.className = 'tsd-proj-input'
    projInp.placeholder = '— project —'
    projInp.value = (T._project_cache[row.project] || row.project) || ''
    projInp.dataset.projId = row.project || ''
    var projDd = document.createElement('div')
    projDd.className = 'tsd-proj-dd'

    var projSearchTimer = null

    function doProjectSearch(q) {
        clearTimeout(projSearchTimer)
        projSearchTimer = setTimeout(function() {
            frappe.call({
                method: 'frappe.desk.search.search_link',
                args: {
                    txt: q,
                    doctype: 'Project',
                    ignore_user_permissions: 0,
                    reference_doctype: 'Timesy Details',
                    page_length: 20
                },
                callback: function(r) {
                    var results = []
                    if (r && r.message) {
                        if (Array.isArray(r.message)) {
                            results = r.message
                        } else if (r.message.results && Array.isArray(r.message.results)) {
                            results = r.message.results
                        }
                    }
                    projDd.innerHTML = ''
                    if (!results.length) { projDd.classList.remove('open'); return }
                    results.forEach(function(p) {
                        var id = p.value
                        var displayName = p.label || p.description || id
                        T._project_cache[id] = displayName
                        var opt = document.createElement('div')
                        opt.className = 'tsd-proj-opt' + (id === row.project ? ' selected' : '')
                        opt.textContent = displayName !== id ? displayName + ' (' + id + ')' : id
                        opt.title = id
                        opt.dataset.id = id
                        opt.addEventListener('mousedown', function(e) {
                            e.preventDefault()
                            projInp.value = displayName
                            projInp.dataset.projId = id
                            row.project = id
                            if (!locals['Timesy Details']) locals['Timesy Details'] = {}
                            if (!locals['Timesy Details'][row.name]) locals['Timesy Details'][row.name] = {}
                            locals['Timesy Details'][row.name].project = id
                            frappe.model.set_value('Timesy Details', row.name, 'project', id)
                            projDd.classList.remove('open')
                            T.fetch_and_calculate(frm, 'Timesy Details', row.name)
                        })
                        projDd.appendChild(opt)
                    })
                    projDd.classList.add('open')
                }
            })
        }, 250)
    }

    projInp.addEventListener('focus', function() {
        var rect = projInp.getBoundingClientRect()
        projDd.style.position = 'fixed'
        projDd.style.left  = rect.left + 'px'
        projDd.style.top   = (rect.bottom + 2) + 'px'
        projDd.style.width = rect.width + 'px'
        doProjectSearch(projInp.value.trim())
    })

    projInp.addEventListener('input', function() {
        var q = this.value.trim()
        if (!q) {
            projInp.dataset.projId = ''
            row.project = ''
            frappe.model.set_value('Timesy Details', row.name, 'project', '')
        }
        doProjectSearch(q)
    })

    projInp.addEventListener('blur', function() {
        setTimeout(function() { projDd.classList.remove('open') }, 200)
    })

    projWrap.appendChild(projInp)
    projWrap.appendChild(projDd)
    tdProj.appendChild(projWrap)
    tr.appendChild(tdProj)

    // ── 6. Status (select) ──
    var tdSt = document.createElement('td')
    tdSt.style.width = '110px'
    var stSel = document.createElement('select')
    stSel.className = 'tsd-cell-select'
    var defaultOpt = document.createElement('option')
    defaultOpt.value = ''; defaultOpt.textContent = '— select —'
    if (!row.status) defaultOpt.selected = true
    stSel.appendChild(defaultOpt)

    T.STATUS_OPTIONS.forEach(function(opt) {
        var o = document.createElement('option')
        o.value = opt; o.textContent = opt
        if (row.status && opt === row.status) o.selected = true
        stSel.appendChild(o)
    })
    var STATUS_COLORS = {
        'Working': '#22c55e',
        'Holiday': '#f59e0b',
        'Absent':  '#f05252',
        'Weekend': '#9ca3af',
        'On Leave': '#f05252'
    }

    function applyStatusColor(sel) {
        sel.style.background = ''
        sel.style.fontWeight = '600'
        sel.style.color = STATUS_COLORS[sel.value] || '#1a1f36'
    }

    applyStatusColor(stSel)

    stSel.addEventListener('change', function() {
        var newStatus  = this.value
      var hasTime    = (row.from_time && row.from_time !== '00:00:00' && row.from_time !== '') 
                      && (row.to_time   && row.to_time   !== '00:00:00' && row.to_time   !== '')
        var hasProject = (projInp.dataset.projId || '').trim() !== '' 
                      && (projInp.value || '').trim() !== ''

        // Validation 1: Cannot set Working if no time and no project
        if (newStatus === 'Working' && (!hasTime || !hasProject)) {
            frappe.show_alert({ message: 'Cannot set Working without From Time, To Time and Project', indicator: 'red' })
            this.value = row.status || 'Working'
            applyStatusColor(this)
            return
        }

        // Validation 2: Cannot set Absent/Holiday/Weekend if time or project is set
        if (['Absent', 'Holiday', 'Weekend'].includes(newStatus) && (hasTime || hasProject)) {
            frappe.show_alert({ message: 'Cannot set ' + newStatus + ' when Time or Project is selected. Please clear them first.', indicator: 'red' })
            this.value = row.status || 'Working'
            applyStatusColor(this)
            return
        }

        row.status = newStatus
        if (locals['Timesy Details'] && locals['Timesy Details'][row.name])
            locals['Timesy Details'][row.name].status = newStatus
        frappe.model.set_value('Timesy Details', row.name, 'status', newStatus)
        if (frm.doc.staffing_cost) compute_hours(row, frm)
        applyStatusColor(this)
        setTimeout(function() {
            T.update_row_computed(frm, row.name)
            T.build_att_calendar(frm)
        }, 300)
    })
    tdSt.appendChild(stSel)
    tr.appendChild(tdSt)

    // ── 7-14. Computed read-only columns ──
    var compCols = [
        { key: 'working_hour',                cls: 'wh',   color: '#3b6cf8' },
        { key: 'custom_ot_hour',              cls: 'ot',   color: '#e67e22' },
        { key: 'custom_late_working_hour',    cls: 'late', color: '#f05252' },
        { key: 'custom_standard_working_hour',cls: '',     color: '#7a87a8' },
        { key: 'costing_hour',                cls: '',     color: '#1a1f36' },
        { key: 'billing_hour',                cls: '',     color: '#1a1f36' },
    ]
    compCols.forEach(function(c) {
        var td = document.createElement('td')
        td.style.width = '62px'
        td.dataset.field = c.key
        var span = document.createElement('span')
        span.className = 'tsd-num-cell'
        span.style.color = c.color
        span.textContent = parseFloat(row[c.key] || 0).toFixed(2)
        td.appendChild(span)
        tr.appendChild(td)
    })

    // ── 15. Delete button — FIX #3 ──
    var tdDel = document.createElement('td')
    tdDel.style.cssText = 'width:32px;text-align:center;'
    var delBtn = document.createElement('button')
    delBtn.className = 'tsd-row-del'
    delBtn.title = 'Delete row'
    delBtn.innerHTML = '&times;'

    delBtn.addEventListener('click', function() {
        frappe.confirm('Delete this row?', function() {
            var T = staffing.timesy

            // 1. Remove from frm.doc array
            var idx = frm.doc.timesy_details.findIndex(function(r) { return r.name === row.name })
            if (idx !== -1) {
                frm.doc.timesy_details.splice(idx, 1)
                // Re-index remaining rows
                frm.doc.timesy_details.forEach(function(r, i) { r.idx = i + 1 })
            }

            // 2. Tell Frappe the child doc is deleted so it is removed on save
            try {
                frappe.model.clear_doc('Timesy Details', row.name)
            } catch(ex) {}

            // 3. Sync Frappe's hidden grid (needed for proper save)
            frm.refresh_field('timesy_details')

            // 4. Recalculate totals
            total_costing(frm)

            // 5. Remove only this TR from the custom table — no full rebuild flash
            var trEl = document.querySelector('#tsd-tbody tr[data-rowname="' + row.name + '"]')
            if (trEl) trEl.remove()

            // 6. If table is now empty show placeholder
            var tbody = document.getElementById('tsd-tbody')
            if (tbody && frm.doc.timesy_details.length === 0) {
                var empty = document.createElement('tr')
                empty.id = 'tsd-empty-row'
                empty.innerHTML = '<td colspan="15" style="text-align:center;color:#7a87a8;padding:20px">No rows yet — set dates to auto-generate</td>'
                tbody.appendChild(empty)
            }

            // 7. Re-number index column in remaining rows
            if (tbody) {
                tbody.querySelectorAll('tr[data-rowname]').forEach(function(r, i) {
                    var idxCell = r.querySelector('.tsd-idx')
                    if (idxCell) idxCell.textContent = i + 1
                })
            }

            // 8. Refresh counters and summary cards
            setTimeout(function() {
                T.refresh_totals_bar(frm)
                T.refresh_stat_cards(frm)
                T.build_att_calendar(frm)
                var rc = document.getElementById('tsd-row-count')
                if (rc) rc.textContent = frm.doc.timesy_details.length + ' row' + (frm.doc.timesy_details.length !== 1 ? 's' : '')
                var rt = document.getElementById('tsd-tot-rows')
                if (rt) rt.textContent = frm.doc.timesy_details.length
            }, 150)
        })
    })

    tdDel.appendChild(delBtn)
    tr.appendChild(tdDel)

    return tr
}

// ─── UPDATE COMPUTED CELLS IN ONE ROW (no full re-render) ─────────────────────
staffing.timesy.update_row_computed = function(frm, rowName) {
    var T      = staffing.timesy
    var docRow = (frm.doc.timesy_details || []).find(function(r) { return r.name === rowName })
    if (!docRow) return
    var tr = document.querySelector('#tsd-tbody tr[data-rowname="' + rowName + '"]')
    if (!tr) return

    var fieldColors = {
        working_hour: '#3b6cf8', custom_ot_hour: '#e67e22',
        custom_late_working_hour: '#f05252', custom_standard_working_hour: '#7a87a8',
        overtime_hour: '#e67e22', costing_hour: '#1a1f36',
        billing_hour: '#1a1f36', absent_hour: '#f05252'
    }
    tr.querySelectorAll('td[data-field]').forEach(function(td) {
        var f    = td.dataset.field
        var val  = parseFloat(docRow[f] || 0).toFixed(2)
        var span = td.querySelector('.tsd-num-cell')
        if (span) { span.textContent = val; span.style.color = fieldColors[f] || '#1a1f36' }
    })

    T.refresh_totals_bar(frm)
    T.refresh_stat_cards(frm)
    T.build_att_calendar(frm)
}

// ─── REFRESH JUST TOTALS BAR ──────────────────────────────────────────────────
staffing.timesy.refresh_totals_bar = function(frm) {
    var rows = frm.doc.timesy_details || []
    var wh=0, ot=0, late=0, cost=0, bill=0, absent=0
    rows.forEach(function(r) {
        wh     += r.working_hour              || 0
        ot     += r.custom_ot_hour            || 0
        late   += r.custom_late_working_hour  || 0
        cost   += r.costing_hour              || 0
        bill   += r.billing_hour              || 0
        absent += r.absent_hour               || 0
    })
    function s(id, v) { var e = document.getElementById(id); if (e) e.textContent = v }
    s('tsd-tot-wh',     wh.toFixed(2))
    s('tsd-tot-ot',     ot.toFixed(2))
    s('tsd-tot-late',   late.toFixed(2))
    s('tsd-tot-rows',   rows.length)
    s('tsd-tot-cost',   cost.toFixed(2))
    s('tsd-tot-bill',   bill.toFixed(2))
    s('tsd-tot-absent', absent.toFixed(2))
}

// ─── REFRESH STAT CARDS ───────────────────────────────────────────────────────
staffing.timesy.refresh_stat_cards = function(frm) {
    var rows = frm.doc.timesy_details || []
    var wh=0, ot=0, late=0
    rows.forEach(function(r) {
        wh   += r.working_hour             || 0
        ot   += r.custom_ot_hour           || 0
        late += r.custom_late_working_hour || 0
    })
    function s(id, v) { var e = document.getElementById(id); if (e) e.textContent = v }
    s('tsd-stat-wh',   wh.toFixed(2))
    s('tsd-stat-ot',   ot.toFixed(2))
    s('tsd-stat-late', late.toFixed(2))
    s('tsd-stat-std',  frm.doc.normal_working_hour || 8)
}

// ─── INJECT DASHBOARD (full build) ───────────────────────────────────────────
staffing.timesy.inject_dashboard = function(frm) {
    staffing.timesy.inject_styles()
    var old = document.querySelector('.tsd-wrap')
    if (old) old.remove()

    var T    = staffing.timesy
    var doc  = frm.doc
    var rows = doc.timesy_details || []

    var wh=0, ot=0, late=0, cost=0, bill=0, absent=0
    rows.forEach(function(r) {
        wh     += r.working_hour             || 0
        ot     += r.custom_ot_hour           || 0
        late   += r.custom_late_working_hour || 0
        cost   += r.costing_hour             || 0
        bill   += r.billing_hour             || 0
        absent += r.absent_hour              || 0
    })

    function fmt2(n) { return (parseFloat(n) || 0).toFixed(2) }

    var dashEl = document.createElement('div')
    dashEl.className = 'tsd-wrap'

    // ── STATS ──
    

    // ── ATTENDANCE CALENDAR ──
    var calCard = document.createElement('div')
    calCard.className = 'tsd-card'
    calCard.innerHTML = `
      <div class="tsd-cal-head">
        <div class="tsd-cal-title">Attendance calendar</div>
       <div class="tsd-legend">
          <div class="tsd-leg-item"><div class="tsd-leg-dot" style="background:#22c55e"></div>Present</div>
          <div class="tsd-leg-item"><div class="tsd-leg-dot" style="background:#f05252"></div>Absent</div>
          <div class="tsd-leg-item"><div class="tsd-leg-dot" style="background:#fef3c7;border:1px solid #fcd34d"></div>Holiday</div>
          <div class="tsd-leg-item"><div class="tsd-leg-dot" style="background:#f3f4f6;border:1px solid #e5e7eb"></div>Weekend</div>
        </div>
      </div>
      <div class="tsd-track-wrap"><div class="tsd-track" id="tsd-att-track"></div></div>`
    dashEl.appendChild(calCard)

    // ── INTERACTIVE TIME SHEET ──
    var tsCard = document.createElement('div')
    tsCard.className = 'tsd-card'
    tsCard.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
        <div class="tsd-section" style="margin-bottom:0">Time sheet</div>
        <span style="font-size:11px;color:#7a87a8" id="tsd-row-count">${rows.length} row${rows.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="tsd-tbl-wrap">
        <table class="tsd-tbl">
          <thead>
            <tr>
              <th style="width:28px">#</th>
              <th style="width:100px">Date</th>
              <th style="width:84px">From</th>
              <th style="width:84px">To</th>
              <th style="width:130px">Project</th>
              <th style="width:110px">Status</th>
              <th style="width:62px">Wk Hrs</th>
              <th style="width:62px">OT Hrs</th>
              <th style="width:62px">Late Hr</th>
              <th style="width:62px">Std Hr</th>
              <th style="width:62px">Cost Hr</th>
              <th style="width:62px">Bill Hr</th>
              <th style="width:32px"></th>
            </tr>
          </thead>
          <tbody id="tsd-tbody"></tbody>
        </table>
      </div>
      <button class="tsd-add-row-btn" id="tsd-add-row">&#xFF0B; Add Row</button>
     <div class="tsd-totals">
        <div class="tsd-tot-item"><div class="tsd-tot-lbl">Total working hrs</div><div class="tsd-tot-val wh" id="tsd-tot-wh">${fmt2(wh)}</div></div>
        <div class="tsd-tot-item"><div class="tsd-tot-lbl">Total OT hrs</div><div class="tsd-tot-val ot" id="tsd-tot-ot">${fmt2(ot)}</div></div>
        <div class="tsd-tot-item"><div class="tsd-tot-lbl">Total late hrs</div><div class="tsd-tot-val late" id="tsd-tot-late">${fmt2(late)}</div></div>
        <div class="tsd-tot-item"><div class="tsd-tot-lbl">Rows</div><div class="tsd-tot-val" id="tsd-tot-rows" style="color:#7a87a8">${rows.length}</div></div>
        <div class="tsd-tot-item"><div class="tsd-tot-lbl">Total costing hr</div><div class="tsd-tot-val" id="tsd-tot-cost">${fmt2(cost)}</div></div>
        <div class="tsd-tot-item"><div class="tsd-tot-lbl">Total billing hr</div><div class="tsd-tot-val" id="tsd-tot-bill">${fmt2(bill)}</div></div>
      </div>`
    dashEl.appendChild(tsCard)

    // ── Injection strategies ──
    var injected = false
    try {
        var gw = frm.fields_dict['timesy_details'] && frm.fields_dict['timesy_details'].grid && frm.fields_dict['timesy_details'].grid.wrapper
        if (gw) {
            var gel = gw instanceof HTMLElement ? gw : (gw[0] || (gw.get && gw.get(0)))
            if (gel && gel.parentNode) { gel.parentNode.insertBefore(dashEl, gel); injected = true }
        }
    } catch(e) {}
    if (!injected) {
        try {
            var lw = frm.layout && frm.layout.wrapper
            if (lw) {
                var le = lw instanceof HTMLElement ? lw : (lw[0] || (lw.get && lw.get(0)))
                if (le) { le.insertBefore(dashEl, le.firstChild); injected = true }
            }
        } catch(e) {}
    }
    if (!injected) {
        var fp2 = document.querySelector('.form-page') || document.querySelector('[data-fieldname="timesy_details"]')
        if (fp2) { fp2.insertBefore(dashEl, fp2.firstChild); injected = true }
    }
    if (!injected) { console.error('TSD: no injection point'); return }

    // ── Build interactive tbody ──
    var tbody = document.getElementById('tsd-tbody')
    if (tbody) {
        var projIds = rows.map(function(r) { return r.project || '' }).filter(Boolean)
        staffing.timesy.resolve_project_names(projIds).then(function(cache) {
            rows.forEach(function(r) {
                tbody.appendChild(staffing.timesy.make_row(frm, r))
            })
            if (!rows.length) {
                var empty = document.createElement('tr')
                empty.id = 'tsd-empty-row'
                empty.innerHTML = '<td colspan="15" style="text-align:center;color:#7a87a8;padding:20px">No rows yet — set dates to auto-generate</td>'
                tbody.appendChild(empty)
            }
            // After cache is populated, update all project inputs with display names
            tbody.querySelectorAll('tr[data-rowname]').forEach(function(tr) {
                var rowName = tr.dataset.rowname
                var docRow  = (frm.doc.timesy_details || []).find(function(r) { return r.name === rowName })
                if (!docRow || !docRow.project) return
                var inp = tr.querySelector('.tsd-proj-input')
                if (inp) inp.value = cache[docRow.project] || docRow.project
            })
        })
    }

    // ── Wire "Add Row" button ──
    var addBtn = document.getElementById('tsd-add-row')
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            staffing.timesy.add_new_row(frm)
        })
    }

    // ── Build calendar ──
    staffing.timesy.build_att_calendar(frm)
}

// ─── ADD NEW ROW INLINE ───────────────────────────────────────────────────────
staffing.timesy.add_new_row = function(frm) {
    var T     = staffing.timesy
    var tbody = document.getElementById('tsd-tbody')
    if (!tbody) return

    var emp = document.getElementById('tsd-empty-row')
    if (emp) emp.remove()

    var lastDate = frm.doc.start_date || ''
    var rows = frm.doc.timesy_details || []
    if (rows.length) lastDate = rows[rows.length - 1].date || lastDate

    var newChild       = frappe.model.add_child(frm.doc, 'Timesy Details', 'timesy_details')
    newChild.date      = lastDate
    newChild.status    = ''
    newChild.from_time = ''
    newChild.to_time   = ''

    var cdt = newChild.doctype, cdn = newChild.name
    if (!locals[cdt])      locals[cdt]      = {}
    if (!locals[cdt][cdn]) locals[cdt][cdn] = {}
    locals[cdt][cdn].date      = lastDate
    locals[cdt][cdn].status    = ''
    locals[cdt][cdn].name      = cdn
    locals[cdt][cdn].doctype   = cdt
    locals[cdt][cdn].custom_standard_working_hour = 0

    frm.doc.timesy_details.forEach(function(r, i) { r.idx = i + 1 })

    var tr = T.make_row(frm, newChild)
    tr.classList.add('tsd-row-new')
    tbody.appendChild(tr)

    T.refresh_totals_bar(frm)
    T.refresh_stat_cards(frm)
    T.build_att_calendar(frm)
    var rc = document.getElementById('tsd-row-count')
    if (rc) rc.textContent = frm.doc.timesy_details.length + ' rows'
    var rt = document.getElementById('tsd-tot-rows')
    if (rt) rt.textContent = frm.doc.timesy_details.length
    tr.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

    frm.refresh_field('timesy_details')
    setTimeout(function() { T.replace_cells(frm) }, 200)
}

// ─── REFRESH DASHBOARD (fast path — no full rebuild) ──────────────────────────
staffing.timesy.refresh_dashboard = function(frm) {
    if (!document.querySelector('.tsd-wrap')) {
        staffing.timesy.inject_dashboard(frm)
        return
    }
    staffing.timesy.refresh_stat_cards(frm)
    staffing.timesy.refresh_totals_bar(frm)
    staffing.timesy.build_att_calendar(frm)
}

// ─── BUILD ATTENDANCE CALENDAR ────────────────────────────────────────────────
staffing.timesy.build_att_calendar = function(frm) {
    var T     = staffing.timesy
    var track = document.getElementById('tsd-att-track')
    if (!track) return
    track.innerHTML = ''
    var cal_start = frm.doc.start_date
    var cal_end   = frm.doc.end_date
    if (!cal_start || !cal_end) {
        var dates = (frm.doc.timesy_details || []).map(function(r) { return r.date }).filter(Boolean).sort()
        if (!dates.length) return
        cal_start = dates[0]
        cal_end   = dates[dates.length - 1]
    }

    var start = frappe.datetime.str_to_obj(cal_start)
    var end   = frappe.datetime.str_to_obj(cal_end)
    var rows  = frm.doc.timesy_details || []
    var today = frappe.datetime.get_today()

    var statusMap = {}
    rows.forEach(function(r) {
        if (!r.date) return
        var st = r.status || ''
        if      (st === 'Absent' || st === 'Release' || st=== 'On Leave')       statusMap[r.date] = 'absent'
        else if (st === 'Holiday' || st === 'Bad Weather')  statusMap[r.date] = 'holiday'
        else if (st === 'Friday' || st === 'Standby' || st === 'Weekend') statusMap[r.date] = 'weekend'
        else if (st === 'Working' && r.from_time && r.to_time) statusMap[r.date] = 'present'
        else if (!st && r.from_time && r.to_time)              statusMap[r.date] = 'empty'
        else                                                 statusMap[r.date] = 'empty'
    })

    var icons = { present: '✓', late: '✓', absent: '✕', weekend: '—', ot: '↑', holiday: '★', empty: '' }
    var cur = new Date(start)
    while (cur <= end) {
        var ds  = frappe.datetime.obj_to_str(cur)
        var dow = cur.getDay()
        var day = cur.getDate()
        var t   = statusMap[ds] || (dow === 5 || dow === 6 ? 'weekend' : 'empty')
        var el  = document.createElement('div')
        el.className = 'tsd-day'
        el.title = T.fmt_date(ds) + ' — ' + t.charAt(0).toUpperCase() + t.slice(1)
        el.innerHTML = '<div class="tsd-dnum' + (ds === today ? ' today' : '') + '">' + String(day).padStart(2, '0') + '</div>'
                     + '<div class="tsd-dot ' + t + '">' + (icons[t] || '') + '</div>'
        track.appendChild(el)
        cur.setDate(cur.getDate() + 1)
    }
}

// ─── TIME PICKER HELPERS ──────────────────────────────────────────────────────
staffing.timesy.pad = function(n) {
    return String(Math.max(0, parseInt(n) || 0)).padStart(2, '0')
}
staffing.timesy.slots = (function() {
    var s = []
    for (var h = 0; h < 24; h++)
        for (var m = 0; m < 60; m += 15)
            s.push({ h: h, m: m })
    return s
})()
staffing.timesy.dd     = null
staffing.timesy.dd_cb  = null
staffing.timesy.dd_box = null

staffing.timesy.get_dd = function() {
    var T = staffing.timesy
    if (!T.dd) {
        var dd = document.createElement('div')
        dd.className = 'ts-dd'
        T.slots.forEach(function(sl) {
            var item = document.createElement('div')
            item.className  = 'ts-dd-i'
            item.dataset.h  = sl.h
            item.dataset.m  = sl.m
            item.textContent = T.pad(sl.h) + ':' + T.pad(sl.m)
            item.addEventListener('mousedown', function(e) {
                e.preventDefault(); e.stopPropagation()
                if (T.dd_cb) T.dd_cb(sl.h, sl.m)
                dd.style.display = 'none'
                if (T.dd_box) T.dd_box.classList.remove('ts-open')
                T.dd_box = null; T.dd_cb = null
            })
            dd.appendChild(item)
        })
        document.body.appendChild(dd)
        document.addEventListener('mousedown', function(e) {
            if (T.dd && T.dd.style.display !== 'none') {
                if (!T.dd_box || (!T.dd_box.contains(e.target) && !T.dd.contains(e.target))) {
                    T.dd.style.display = 'none'
                    if (T.dd_box) T.dd_box.classList.remove('ts-open')
                    T.dd_box = null; T.dd_cb = null
                }
            }
        }, true)
        T.dd = dd
    }
    return T.dd
}

staffing.timesy.open_dd = function(boxEl, hVal, mVal, cb) {
    var T  = staffing.timesy
    var dd = T.get_dd()
    T.dd_cb = cb
    if (T.dd_box && T.dd_box !== boxEl) T.dd_box.classList.remove('ts-open')
    T.dd_box = boxEl
    boxEl.classList.add('ts-open')
    var rect = boxEl.getBoundingClientRect()
    dd.style.left    = rect.left + 'px'
    dd.style.top     = (rect.bottom + 4) + 'px'
    dd.style.display = 'block'
    dd.querySelectorAll('.ts-dd-i').forEach(function(it) {
        it.classList.toggle('ts-sel', (+it.dataset.h === hVal && +it.dataset.m === mVal))
    })
    var sel = dd.querySelector('.ts-sel') || dd.querySelectorAll('.ts-dd-i')[hVal * 4]
    if (sel) dd.scrollTop = Math.max(0, sel.offsetTop - 80)
}

staffing.timesy.make_box = function(hVal, mVal, onChange) {
    var T   = staffing.timesy
    var box = document.createElement('div')
    box.className = 'ts-box'

    var hInp = document.createElement('input')
    hInp.type = 'text'; hInp.className = 'ts-seg'; hInp.maxLength = 2
    hInp.placeholder = 'HH'; hInp.autocomplete = 'off'
    hInp.value = (hVal !== null && hVal !== undefined) ? T.pad(hVal) : ''

    var sep = document.createElement('span')
    sep.className = 'ts-sep'; sep.textContent = ':'

    var mInp = document.createElement('input')
    mInp.type = 'text'; mInp.className = 'ts-seg'; mInp.maxLength = 2
    mInp.placeholder = 'MM'; mInp.autocomplete = 'off'
    mInp.value = (mVal !== null && mVal !== undefined) ? T.pad(mVal) : ''

    box.appendChild(hInp); box.appendChild(sep); box.appendChild(mInp)

    function open_picker() {
        T.open_dd(box, parseInt(hInp.value) || 0, parseInt(mInp.value) || 0, function(h, m) {
            hInp.value = T.pad(h); mInp.value = T.pad(m)
            if (onChange) onChange(h, m)
        })
    }
    function stop(e) { e.stopPropagation() }

    hInp.addEventListener('focus',    function(e) { stop(e); open_picker() })
    mInp.addEventListener('focus',    function(e) { stop(e); open_picker() })
    box.addEventListener('click',     function(e) { stop(e); open_picker() })
    hInp.addEventListener('mousedown', stop)
    mInp.addEventListener('mousedown', stop)
    hInp.addEventListener('keydown',  function(e) { stop(e); e.stopImmediatePropagation() }, true)
    mInp.addEventListener('keydown',  function(e) { stop(e); e.stopImmediatePropagation() }, true)
    hInp.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '')
        if (this.value.length === 2) mInp.focus()
    })
    mInp.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '')
    })

    box.get_time = function() {
        var h = parseInt(hInp.value), m = parseInt(mInp.value)
        if (isNaN(h) || isNaN(m)) return ''
        return T.pad(h) + ':' + T.pad(m) + ':00'
    }
    box.set_time = function(timeStr) {
        if (!timeStr) { hInp.value = ''; mInp.value = ''; return }
        var parts  = timeStr.split(':')
        hInp.value = T.pad(parseInt(parts[0]) || 0)
        mInp.value = T.pad(parseInt(parts[1]) || 0)
    }
    return box
}

// ─── REPLACE CELLS in hidden Frappe grid (for save compatibility) ─────────────
staffing.timesy.replace_cells = function(frm) {
    var T     = staffing.timesy
    var $grid = $(frm.fields_dict.timesy_details.grid.wrapper)
    $grid.find('.grid-row[data-name]').each(function() {
        var $row    = $(this)
        var rowName = $row.data('name')
        if (!rowName) return
        var docRow = (frm.doc.timesy_details || []).find(function(r) { return r.name === rowName })
        ;['from_time', 'to_time'].forEach(function(fieldname) {
            var $col = $row.find('.col[data-fieldname="' + fieldname + '"]')
            if (!$col.length) return
            var currentVal  = docRow ? (docRow[fieldname] || '') : ''
            var existingBox = $col.find('.ts-box')[0]
            if (existingBox) { existingBox.set_time(currentVal); return }
            $col.find('.static-area, .field-area').hide()
            var h = null, m = null
            if (currentVal) { var parts = currentVal.split(':'); h = parseInt(parts[0]) || 0; m = parseInt(parts[1]) || 0 }
            var box = T.make_box(h, m, function() {
                var val = box.get_time()
                frappe.model.set_value('Timesy Details', rowName, fieldname, val)
                setTimeout(function() {
                    T.calculate_hours(frm, 'Timesy Details', rowName)
                    setTimeout(function() { T.refresh_row(frm, rowName) }, 200)
                }, 100)
            })
            $col[0].appendChild(box)
        })
    })
}

// ─── SMART ROW REFRESH ────────────────────────────────────────────────────────
staffing.timesy.refresh_row = function(frm, rowName) {
    var T     = staffing.timesy
    var $grid = $(frm.fields_dict.timesy_details.grid.wrapper)
    var $row  = $grid.find('.grid-row[data-name="' + rowName + '"]')
    if ($row.length) {
        var docRow = (frm.doc.timesy_details || []).find(function(r) { return r.name === rowName })
        if (docRow) {
            ;['working_hour', 'custom_ot_hour', 'custom_late_working_hour', 'overtime_hour',
              'costing_hour', 'billing_hour', 'absent_hour', 'custom_standard_working_hour'].forEach(function(f) {
                var $col = $row.find('.col[data-fieldname="' + f + '"]')
                if (!$col.length) return
                var val = docRow[f] !== undefined ? docRow[f] : 0
                $col.find('.static-area').text(val)
                $col.find('.field-area input').val(val)
                $col.find('.like-disabled-input, .control-value').text(val)
            })
        }
    }
    T.replace_cells(frm)
    total_costing(frm)
    T.update_row_computed(frm, rowName)
}

// ─── DIALOG TIME BOXES ────────────────────────────────────────────────────────
staffing.timesy.get_dialog_time = function(fieldname) {
    var $modal   = $('.modal.show .modal-body')
    var $wrapper = $modal.find('[data-fieldname="' + fieldname + '"]').first()
    var box      = $wrapper.find('.ts-box')[0]
    return box ? box.get_time() : ''
}

// ─── CORE CALCULATION ─────────────────────────────────────────────────────────
staffing.timesy.calculate_hours_from_row = function(frm, row) {
    if (!row.from_time || !row.to_time) return
    var fp = row.from_time.split(':'), tp = row.to_time.split(':')
    var fm = parseInt(fp[0]) * 60 + parseInt(fp[1])
    var tm = parseInt(tp[0]) * 60 + parseInt(tp[1])
    if (tm < fm) tm += 24 * 60

    var total = Math.round(((tm - fm) / 60) * 100) / 100
    var std   = parseFloat(row.custom_standard_working_hour) || 0
    var wh    = total, ot = 0, late = 0

    if (std > 0) {
        if (total > std)      ot   = Math.round((total - std) * 100) / 100
        else if (total < std) late = Math.round((std - total) * 100) / 100
    }

    row.working_hour             = wh
    row.custom_ot_hour           = ot
    row.custom_late_working_hour = late

    var cdt = row.doctype, cdn = row.name
    if (cdt && cdn && locals[cdt] && locals[cdt][cdn]) {
        locals[cdt][cdn].working_hour             = wh
        locals[cdt][cdn].custom_ot_hour           = ot
        locals[cdt][cdn].custom_late_working_hour = late
    }

    frappe.model.set_value(cdt, cdn, 'working_hour',             wh)
    frappe.model.set_value(cdt, cdn, 'custom_ot_hour',           ot)
    frappe.model.set_value(cdt, cdn, 'custom_late_working_hour', late)

    setTimeout(function() {
        var tot_ot = 0, tot_late = 0, tot_wh = 0
        ;(frm.doc.timesy_details || []).forEach(function(r) {
            tot_ot   += r.custom_ot_hour           || 0
            tot_late += r.custom_late_working_hour || 0
            tot_wh   += r.working_hour             || 0
        })
        frm.set_value('custom_total_overtime_working_hours', tot_ot)
        frm.set_value('custom_total_late_working_hours',     tot_late)
        frm.set_value('custom_total_working_hours',          tot_wh)
        frm.refresh_fields(['custom_total_overtime_working_hours', 'custom_total_late_working_hours', 'custom_total_working_hours'])
        staffing.timesy.refresh_dashboard(frm)
    }, 300)
}

staffing.timesy.calculate_hours = function(frm, cdt, cdn) {
    var row = locals[cdt][cdn]
    if (!row || !row.from_time || !row.to_time) return
    staffing.timesy.calculate_hours_from_row(frm, row)
}

staffing.timesy.fetch_and_calculate = function(frm, cdt, cdn) {
    var row = locals[cdt][cdn]
    if (!row) return
    if (!row.project) {
        staffing.timesy.calculate_hours(frm, cdt, cdn)
        setTimeout(function() { staffing.timesy.refresh_row(frm, cdn) }, 300)
        return
    }
    staffing.timesy.resolve_project_names([row.project])
    frappe.db.get_value('Project', row.project, 'custom_standard_working_hour').then(function(r) {
        var swh = (r && r.message && r.message.custom_standard_working_hour) || 0
        row.custom_standard_working_hour = swh
        if (locals[cdt] && locals[cdt][cdn]) locals[cdt][cdn].custom_standard_working_hour = swh
        setTimeout(function() {
            staffing.timesy.calculate_hours(frm, cdt, cdn)
            frm.refresh_field('timesy_details')
            setTimeout(function() {
                staffing.timesy.replace_cells(frm)
                staffing.timesy.update_row_computed(frm, cdn)
                staffing.timesy.build_att_calendar(frm)
            }, 200)
        }, 100)
    })
}

staffing.timesy.fetch_all_standard_hours = function(frm) {
    var rows = (frm.doc.timesy_details || []).filter(function(r) { return r.project })
    if (!rows.length) return

    var all_ids = rows.map(function(r) { return r.project })
    staffing.timesy.resolve_project_names(all_ids)

    var project_map = {}, project_keys, completed = 0
    rows.forEach(function(r) {
        if (!project_map[r.project]) project_map[r.project] = []
        project_map[r.project].push(r)
    })
    project_keys = Object.keys(project_map)
    project_keys.forEach(function(project) {
        frappe.db.get_value('Project', project, 'custom_standard_working_hour').then(function(res) {
            var swh = (res && res.message && res.message.custom_standard_working_hour) || 0
            project_map[project].forEach(function(row) {
                row.custom_standard_working_hour = swh
                var cdt = row.doctype || 'Timesy Details', cdn = row.name
                if (cdt && cdn) {
                    if (!locals[cdt])      locals[cdt]      = {}
                    if (!locals[cdt][cdn]) locals[cdt][cdn] = {}
                    locals[cdt][cdn].custom_standard_working_hour = swh
                }
            })
            completed++
            if (completed === project_keys.length) {
                setTimeout(function() {
                    frm.refresh_field('timesy_details')
                    setTimeout(function() {
                        staffing.timesy.replace_cells(frm)
                        staffing.timesy.refresh_dashboard(frm)
                    }, 200)
                }, 100)
            }
        })
    })
}

staffing.timesy.fetch_and_calculate_row = function(frm, row) {
    if (!row.project) {
        staffing.timesy.calculate_hours_from_row(frm, row)
        setTimeout(function() { staffing.timesy.refresh_row(frm, row.name) }, 300)
        return
    }
    staffing.timesy.resolve_project_names([row.project])
    frappe.db.get_value('Project', row.project, 'custom_standard_working_hour').then(function(r) {
        var swh = (r && r.message && r.message.custom_standard_working_hour) || 0
        row.custom_standard_working_hour = swh
        var cdt = row.doctype, cdn = row.name
        if (cdt && cdn && locals[cdt] && locals[cdt][cdn])
            locals[cdt][cdn].custom_standard_working_hour = swh
        setTimeout(function() {
            staffing.timesy.calculate_hours_from_row(frm, row)
            setTimeout(function() {
                staffing.timesy.refresh_row(frm, row.name)
                staffing.timesy.update_row_computed(frm, row.name)
                staffing.timesy.build_att_calendar(frm)
            }, 300)
        }, 200)
    })
}

// ─── MONTHLY TIMESHEET HANDLERS ───────────────────────────────────────────────
frappe.ui.form.on('Monthly Timesheet', {
    type: function(frm, cdt, cdn) {
        var d  = locals[cdt][cdn]
        var fd = new Date(cur_frm.doc.start_date), ed = new Date(cur_frm.doc.end_date)
        var nod = (new Date(ed - fd)).getDate()
        if (d.type === 'Working Days') { type = ''; deleted_object = {}; d.number = nod; cur_frm.refresh_field('monthly_timesheet') }
    },
    number: function(frm, cdt, cdn) {
        var d  = locals[cdt][cdn]
        var fd = new Date(cur_frm.doc.start_date), ed = new Date(cur_frm.doc.end_date)
        var nod = (new Date(ed - fd)).getDate()
        if (d.type !== 'Working Days') compute_working_days(cur_frm, nod, d)
    },
    monthly_timesheet_remove: function(frm, cdt, cdn) {
        var fd = new Date(cur_frm.doc.start_date), ed = new Date(cur_frm.doc.end_date)
        cur_frm.refresh_field('monthly_timesheet')
        if (type !== 'Working Days') compute_working_days(cur_frm, (new Date(ed - fd)).getDate(), deleted_object)
    },
    before_monthly_timesheet_remove: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn]; type = d.type; deleted_object = d
    },
    working_hour: function(frm, cdt, cdn) {
        var d  = locals[cdt][cdn]
        var fd = new Date(cur_frm.doc.start_date), ed = new Date(cur_frm.doc.end_date)
        var nod = (new Date(ed - fd)).getDate()
        if (d.type === 'Working Days') compute_working_days(cur_frm, nod, d)
        else { d.working_hour = 0; cur_frm.refresh_field('monthly_timesheet') }
    },
})

function compute_working_days(cur_frm, number_of_days, d) {
    var fridays=0, w_fridays=0, absent=0, h_working=0, holiday=0, release=0, bad_weather=0
    for (var x = 0; x < cur_frm.doc.monthly_timesheet.length; x++) {
        var mt = cur_frm.doc.monthly_timesheet[x]
        if      (mt.type === 'Fridays')          fridays     = mt.number
        else if (mt.type === 'Working Fridays')  w_fridays   = mt.number
        else if (mt.type === 'Absent')           absent      = mt.number
        else if (mt.type === 'Working Holidays') h_working   = mt.number
        else if (mt.type === 'Holiday')          holiday     = mt.number
        else if (mt.type === 'Release')          release     = mt.number
        else if (mt.type === 'Bad Weather')      bad_weather = mt.number
    }
    update_monthly_timesheet(number_of_days, fridays, w_fridays, absent, h_working, holiday, release, bad_weather, cur_frm, d)
}

function update_monthly_timesheet(working_days, fridays, w_fridays, absent, h_working, holiday, release, bad_weather, cur_frm, d) {
    var friday_value=0, normal_working_hour=0, overtime_hour=0
    for (var x = 0; x < cur_frm.doc.monthly_timesheet.length; x++) {
        var mt = cur_frm.doc.monthly_timesheet[x]
        if (mt.type === 'Working Days') {
            normal_working_hour += mt.working_hour
            friday_value = w_fridays > 0 && fridays > 0 && (d.type && (d.type === 'Fridays' || d.type === 'Working Fridays'))
                ? fridays - w_fridays : fridays
            var workdays = holiday > 0
                ? (working_days - friday_value - absent - holiday - release - bad_weather) + h_working
                : (working_days - friday_value - absent - holiday - release - bad_weather)
            mt.number = workdays
            overtime_hour += mt.working_hour > (workdays * cur_frm.doc.normal_working_hour)
                ? mt.working_hour - (workdays * cur_frm.doc.normal_working_hour) : 0
            cur_frm.refresh_field('monthly_timesheet')
        } else if (mt.type === 'Fridays') {
            mt.number = (d.type && (d.type === 'Fridays' || d.type === 'Working Fridays')) ? fridays - w_fridays : fridays
            cur_frm.refresh_field('monthly_timesheet')
        } else if (mt.type === 'Working Fridays') {
            normal_working_hour += mt.working_hour; overtime_hour += mt.working_hour
            mt.number = w_fridays; cur_frm.refresh_field('monthly_timesheet')
        } else if (mt.type === 'Absent')          { mt.number = absent;      cur_frm.refresh_field('monthly_timesheet') }
        else if  (mt.type === 'Release')           { mt.number = release;     cur_frm.refresh_field('monthly_timesheet') }
        else if  (mt.type === 'Bad Weather')       { mt.number = bad_weather; cur_frm.refresh_field('monthly_timesheet') }
        else if  (mt.type === 'Working Holidays')  {
            overtime_hour += mt.working_hour; normal_working_hour += mt.working_hour
            mt.number = h_working; cur_frm.refresh_field('monthly_timesheet')
        } else if (mt.type === 'Holiday')          { mt.number = holiday;     cur_frm.refresh_field('monthly_timesheet') }
    }
    cur_frm.doc.overtime_hours            = overtime_hour
    cur_frm.doc.total_overtime_hour_staff = overtime_hour
    cur_frm.doc.total_working_hour        = normal_working_hour
    cur_frm.refresh_fields(['overtime_hours', 'total_working_hour', 'total_overtime_hour_staff'])
    compute_total_values(cur_frm, normal_working_hour, absent, overtime_hour)
}

function compute_total_values(cur_frm, normal_working_hour, absent, overtime_hour) {
    frappe.db.get_doc('Staffing Cost', cur_frm.doc.staffing_cost).then(function(doc) {
        cur_frm.doc.total_costing_hour  = (doc.default_cost_rate_per_hour    * normal_working_hour) - cur_frm.doc.total_absent_hour - cur_frm.doc.total_costing_rate_deduction
        cur_frm.doc.total_billing_hour  = (doc.default_billing_rate_per_hour * normal_working_hour) - cur_frm.doc.total_absent_hour - cur_frm.doc.total_billing_rate_deduction
        cur_frm.doc.total_overtime_hour = (overtime_hour * doc.default_overtime_rate) - cur_frm.doc.total_absent_hour
        cur_frm.refresh_fields(['total_costing_hour', 'total_absent_hour', 'total_overtime_hour', 'total_billing_hour'])
    })
}
// ─── FETCH EMPLOYEE HOLIDAYS AND APPLY ───────────────────────────────────────
staffing.timesy.apply_employee_holidays = function(frm, callback) {
    if (!frm.doc.employee_code) {
        ;(frm.doc.timesy_details || []).forEach(function(row) {
            if (row.status === 'Holiday' || row.status === 'Weekend') {
                row.status = ''
                var cdt = 'Timesy Details', cdn = row.name
                if (!locals[cdt]) locals[cdt] = {}
                if (!locals[cdt][cdn]) locals[cdt][cdn] = {}
                locals[cdt][cdn].status = ''
            }
        })
        frm.refresh_field('timesy_details')
        if (callback) callback([])
        return
    }

    frappe.call({
        method: 'staffing.staffing.doctype.timesy.timesy.get_employee_holidays',
        args: { employee_code: frm.doc.employee_code },
        callback: function(r) {
            var data = r.message || {}
            var holiday_dates = data.holidays || []
            var weekly_off_dates = data.weekly_offs || []

            ;(frm.doc.timesy_details || []).forEach(function(row) {
                var cdt = 'Timesy Details', cdn = row.name
                if (!locals[cdt]) locals[cdt] = {}
                if (!locals[cdt][cdn]) locals[cdt][cdn] = {}

                if (weekly_off_dates.includes(row.date)) {
                    row.status    = 'Weekend'
                    row.from_time = ''
                    row.to_time   = ''
                    row.project   = ''
                    locals[cdt][cdn].status    = 'Weekend'
                    locals[cdt][cdn].from_time = ''
                    locals[cdt][cdn].to_time   = ''
                    locals[cdt][cdn].project   = ''
                } else if (holiday_dates.includes(row.date)) {
                    row.status    = 'Holiday'
                    row.from_time = ''
                    row.to_time   = ''
                    row.project   = ''
                    locals[cdt][cdn].status    = 'Holiday'
                    locals[cdt][cdn].from_time = ''
                    locals[cdt][cdn].to_time   = ''
                    locals[cdt][cdn].project   = ''
                } else if (row.status === 'Holiday' || row.status === 'Weekend') {
                    row.status = ''
                    locals[cdt][cdn].status = ''
                }
            })

            frm.refresh_field('timesy_details')
            setTimeout(function() {
                staffing.timesy.inject_dashboard(frm)
                if (callback) callback(holiday_dates.concat(weekly_off_dates))
            }, 300)
        }
    })
}

staffing.timesy.apply_employee_leaves = function(frm, callback) {
    if (!frm.doc.employee_code || !frm.doc.start_date || !frm.doc.end_date) {
        if (callback) callback()
        return
    }

    frappe.call({
        method: 'staffing.staffing.doctype.timesy.timesy.get_employee_leaves',
        args: {
            employee_code: frm.doc.employee_code,
            from_date: frm.doc.start_date,
            to_date: frm.doc.end_date
        },
        callback: function(r) {
            var leave_dates = r.message || []
            if (!leave_dates.length) { if (callback) callback(); return }

            ;(frm.doc.timesy_details || []).forEach(function(row) {
                if (leave_dates.includes(row.date)) {
                    row.status    = 'Absent'
                    row.from_time = ''
                    row.to_time   = ''
                    row.project   = ''
                    var cdt = 'Timesy Details', cdn = row.name
                    if (!locals[cdt]) locals[cdt] = {}
                    if (!locals[cdt][cdn]) locals[cdt][cdn] = {}
                    locals[cdt][cdn].status    = 'Absent'
                    locals[cdt][cdn].from_time = ''
                    locals[cdt][cdn].to_time   = ''
                    locals[cdt][cdn].project   = ''
                }
            })

            frm.refresh_field('timesy_details')
            frappe.show_alert({ message: leave_dates.length + ' leave date(s) marked as Absent', indicator: 'orange' })
            if (callback) callback()
        }
    })
}
// ─── AUTO GENERATE ROWS ───────────────────────────────────────────────────────
function generate_timesy_rows(frm) {
    if (!frm.doc.start_date || !frm.doc.end_date) return
    if (frm.doc.skip_timesheet) return
    var start = frappe.datetime.str_to_obj(frm.doc.start_date)
    var end   = frappe.datetime.str_to_obj(frm.doc.end_date)
    if (end < start) { frappe.throw(__('End Date cannot be before Start Date')); return }

    // Build valid date range set
    var valid_dates = {}
    var temp = new Date(start)
    while (temp <= end) {
        valid_dates[frappe.datetime.obj_to_str(temp)] = true
        temp.setDate(temp.getDate() + 1)
    }

    // Remove rows outside new date range
    var to_remove = (frm.doc.timesy_details || []).filter(function(row) {
        return row.date && !valid_dates[row.date]
    })
    to_remove.forEach(function(row) {
        var idx = frm.doc.timesy_details.indexOf(row)
        if (idx !== -1) frm.doc.timesy_details.splice(idx, 1)
        try { frappe.model.clear_doc('Timesy Details', row.name) } catch(e) {}
    })

    // Add missing dates
    var existing_dates = {}
    ;(frm.doc.timesy_details || []).forEach(function(row) { if (row.date) existing_dates[row.date] = true })
    var current = new Date(start), added = 0
    while (current <= end) {
        var date_str = frappe.datetime.obj_to_str(current)
        if (!existing_dates[date_str]) {
            var child = frm.add_child('timesy_details')
            child.date = date_str; child.status = ''; added++
        }
        current.setDate(current.getDate() + 1)
    }
 // Sort by date
    frm.doc.timesy_details.sort(function(a, b) {
        return new Date(a.date) - new Date(b.date)
    })
    // Re-index
    frm.doc.timesy_details.forEach(function(row, i) { row.idx = i + 1 })
    frm.refresh_field('timesy_details')
    setTimeout(function() {
        staffing.timesy.replace_cells(frm)
        staffing.timesy.apply_employee_holidays(frm, function() {
            // Apply approved leaves as Absent
            staffing.timesy.apply_employee_leaves(frm, function() {
                staffing.timesy.inject_dashboard(frm)
            })
        })
    }, 400)
}

// ─── ADD PROJECT DIALOG ───────────────────────────────────────────────────────
function show_add_project_dialog(frm) {
    if (!frm.doc.start_date || !frm.doc.end_date) {
        frappe.msgprint({ title: __('Missing Dates'), message: __('Please set Start Date and End Date first.'), indicator: 'orange' })
        return
    }
    var seen = [], date_options = []
    ;(frm.doc.timesy_details || []).forEach(function(row) {
        if (row.date && !seen.includes(row.date)) {
            seen.push(row.date)
            var count = frm.doc.timesy_details.filter(function(r) { return r.date === row.date && r.project }).length
            var label = staffing.timesy.fmt_date(row.date)
            if (count > 0) label += '  (' + count + (count === 1 ? ' project' : ' projects') + ')'
            date_options.push({ label: label, value: row.date })
        }
    })
    if (!date_options.length) {
        frappe.msgprint({ title: __('No Dates'), message: __('No dates found.'), indicator: 'orange' })
        return
    }
    var d = new frappe.ui.Dialog({
        title: __('Add Project Row'),
        fields: [
            { fieldname: 'date',      fieldtype: 'Select', label: __('Select Date'),
              options: date_options.map(function(o) { return o.label }), reqd: 1 },
            { fieldname: 'project',   fieldtype: 'Link',   label: __('Project'), options: 'Project' },
            { fieldname: 'from_time', fieldtype: 'Time',   label: __('From Time') },
            { fieldname: 'to_time',   fieldtype: 'Time',   label: __('To Time') },
           { fieldname: 'status',    fieldtype: 'Select', label: __('Status'),
              options: 'Working\nHoliday\nAbsent\nWeekend', default: 'Working', reqd: 1 }
        ],
        primary_action_label: __('Add Row'),
        primary_action: function(values) {
            var selected_option = date_options.find(function(o) { return o.label === values.date })
            if (!selected_option) return
            var selected_date = selected_option.value
           var from_time = staffing.timesy.get_dialog_time('from_time') || values.from_time || ''
            var to_time   = staffing.timesy.get_dialog_time('to_time')   || values.to_time   || ''
            var hasTime    = from_time !== '' && to_time !== ''
            var hasProject = (values.project || '').trim() !== ''

            if (from_time && to_time && from_time >= to_time) {
                frappe.msgprint({ title: __('Invalid Time'), message: __('From Time must be earlier than To Time.'), indicator: 'red' })
                return
            }

            if (values.status === 'Working' && (!hasTime || !hasProject)) {
                frappe.msgprint({ title: __('Validation Error'), message: __('Cannot set Working without From Time, To Time and Project.'), indicator: 'red' })
                return
            }

            if (['Absent', 'Holiday', 'Weekend'].includes(values.status) && (hasTime || hasProject)) {
                frappe.msgprint({ title: __('Validation Error'), message: __('Cannot set ' + values.status + ' when Time or Project is selected. Please clear them first.'), indicator: 'red' })
                return
            }
            var existing_empty = null
            for (var i = 0; i < frm.doc.timesy_details.length; i++) {
                var r = frm.doc.timesy_details[i]
                if (r.date === selected_date && !r.project && !r.from_time && !r.to_time) { existing_empty = r; break }
            }
            var target_row = null
            if (existing_empty) {
                existing_empty.project   = values.project || ''
                existing_empty.from_time = from_time
                existing_empty.to_time   = to_time
                existing_empty.status    = values.status || 'Working'
                var cdt = existing_empty.doctype, cdn = existing_empty.name
                if (cdt && cdn) {
                    if (!locals[cdt])       locals[cdt]       = {}
                    if (!locals[cdt][cdn])  locals[cdt][cdn]  = {}
                    locals[cdt][cdn].from_time = from_time; locals[cdt][cdn].to_time = to_time
                    locals[cdt][cdn].project   = values.project || ''; locals[cdt][cdn].status = values.status || 'Working'
                }
                target_row = existing_empty
            } else {
                var last_idx = -1
                for (var j = 0; j < frm.doc.timesy_details.length; j++) {
                    if (frm.doc.timesy_details[j].date === selected_date) last_idx = j
                }
                var new_row = frappe.model.add_child(frm.doc, 'Timesy Details', 'timesy_details')
                new_row.date = selected_date; new_row.status = values.status || 'Working'
                new_row.project = values.project || ''; new_row.from_time = from_time; new_row.to_time = to_time
                var cdt2 = new_row.doctype, cdn2 = new_row.name
                if (cdt2 && cdn2) {
                    if (!locals[cdt2])       locals[cdt2]       = {}
                    if (!locals[cdt2][cdn2]) locals[cdt2][cdn2] = {}
                    locals[cdt2][cdn2].from_time = from_time; locals[cdt2][cdn2].to_time = to_time
                    locals[cdt2][cdn2].project   = values.project || ''; locals[cdt2][cdn2].status = values.status || 'Working'
                    locals[cdt2][cdn2].date = selected_date; locals[cdt2][cdn2].name = cdn2
                    locals[cdt2][cdn2].doctype = cdt2; locals[cdt2][cdn2].custom_standard_working_hour = 0
                }
                if (last_idx >= 0 && last_idx < frm.doc.timesy_details.length - 1) {
                    frm.doc.timesy_details.splice(last_idx + 1, 0, frm.doc.timesy_details.pop())
                    frm.doc.timesy_details.forEach(function(row, i) { row.idx = i + 1 })
                }
                target_row = new_row
            }
            if (values.project) staffing.timesy.resolve_project_names([values.project])
            frm.refresh_field('timesy_details')
            setTimeout(function() { staffing.timesy.replace_cells(frm) }, 300)
            if (target_row && from_time && to_time) {
                setTimeout(function() { staffing.timesy.fetch_and_calculate_row(frm, target_row) }, 500)
            }
            setTimeout(function() { staffing.timesy.inject_dashboard(frm) }, 700)
            d.hide()
            frappe.show_alert({ message: __('Project row added for {0}', [staffing.timesy.fmt_date(selected_date)]), indicator: 'green' })
        }
    })
    d.show()
    var attempts = 0
    var inject_interval = setInterval(function() {
        attempts++
        var $modal = $('.modal.show .modal-body')
        var fw = $modal.find('[data-fieldname="from_time"]').first()
        var tw = $modal.find('[data-fieldname="to_time"]').first()
        if (fw.length && tw.length) {
            clearInterval(inject_interval)
            ;[{ wrapper: fw, fieldname: 'from_time' }, { wrapper: tw, fieldname: 'to_time' }].forEach(function(item) {
                if (item.wrapper.find('.ts-box').length) return
                item.wrapper.find('.frappe-control').hide()
                var box = staffing.timesy.make_box(null, null, function(h, m) {
                    d.set_value(item.fieldname, staffing.timesy.pad(h) + ':' + staffing.timesy.pad(m) + ':00')
                })
                box.style.marginTop = '4px'
                item.wrapper.find('.form-group').append(box)
            })
        }
        if (attempts > 20) clearInterval(inject_interval)
    }, 100)
}

// ─── MAIN FORM HANDLERS ───────────────────────────────────────────────────────
frappe.ui.form.on('Timesy', {
    normal_working_hour: function(frm) {
        var fd  = new Date(cur_frm.doc.start_date), ed = new Date(cur_frm.doc.end_date)
        var nod = (new Date(ed - fd)).getDate()
        if (cur_frm.doc.monthly_timesheet) {
            for (var x = 0; x < cur_frm.doc.monthly_timesheet.length; x++)
                compute_working_days(cur_frm, nod, cur_frm.doc.monthly_timesheet[x])
        }
        total_costing(cur_frm)
        staffing.timesy.refresh_dashboard(frm)
    },
    skip_timesheet: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn]
        if (cur_frm.doc.monthly_timesheet.length === 0 && cur_frm.doc.holiday_list) {
            var fd = new Date(cur_frm.doc.start_date), ed = new Date(cur_frm.doc.end_date)
            var nod = (new Date(ed - fd)).getDate()
            cur_frm.call({ doc: cur_frm.doc, method: 'get_holiday', args: {}, freeze: true, freeze_message: 'Changing Date...', async: false,
                callback: function(r) {
                    var data = ['Working Days', 'Fridays', 'Holiday']
                    for (var x = 0; x < data.length; x++) {
                        cur_frm.add_child('monthly_timesheet', {
                            type:   data[x],
                            number: data[x] === 'Working Days' ? nod - r.message[0] - r.message[1]
                                  : data[x] === 'Holiday'      ? r.message[0]
                                  : data[x] === 'Fridays'      ? r.message[1] : 0
                        })
                        cur_frm.refresh_field('monthly_timesheet')
                    }
                    compute_working_days(cur_frm, nod, d)
                }
            })
        }
    },
    holiday_list: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn]
        cur_frm.clear_table('monthly_timesheet'); cur_frm.refresh_field('monthly_timesheet')
        if (cur_frm.doc.monthly_timesheet.length === 0 && cur_frm.doc.holiday_list) {
            var fd = new Date(cur_frm.doc.start_date), ed = new Date(cur_frm.doc.end_date)
            var nod = (new Date(ed - fd)).getDate()
            cur_frm.call({ doc: cur_frm.doc, method: 'get_holiday', args: {}, freeze: true, freeze_message: 'Changing Date...', async: false,
                callback: function(r) {
                    var data = ['Working Days', 'Fridays', 'Holiday']
                    for (var x = 0; x < data.length; x++) {
                        cur_frm.add_child('monthly_timesheet', {
                            type:   data[x],
                            number: data[x] === 'Working Days' ? nod - r.message[0] - r.message[1]
                                  : data[x] === 'Holiday'      ? r.message[0]
                                  : data[x] === 'Fridays'      ? r.message[1] : 0
                        })
                        cur_frm.refresh_field('monthly_timesheet')
                    }
                    compute_working_days(cur_frm, nod, d)
                }
            })
        }
    },
    start_date: function(frm) {
        if (cur_frm.doc.timesy_details.length > 0 && !cur_frm.doc.skip_timesheet) {
            if (!cur_frm.doc.timesy_details[0].date) {
                cur_frm.doc.timesy_details[0].date = cur_frm.doc.start_date
                cur_frm.refresh_field('timesy_details')
            }
        }
        if (cur_frm.doc.skip_timesheet) cur_frm.trigger('holiday_list')
        if (cur_frm.doc.start_date && cur_frm.doc.end_date) {
            cur_frm.call({ doc: cur_frm.doc, method: 'check_date',
                args: { start_date: cur_frm.doc.start_date, end_date: cur_frm.doc.end_date },
                freeze: true, freeze_message: 'Checking dates...', async: false,
                callback: function(r) {
                    generate_timesy_rows(frm)
                    setTimeout(function() { staffing.timesy.replace_cells(frm) }, 500)
                }
            })
        }
    },
    end_date: function(frm) {
        if (cur_frm.doc.timesy_details.length > 0 && !cur_frm.doc.skip_timesheet) {
            if (!cur_frm.doc.timesy_details[0].date) {
                cur_frm.doc.timesy_details[0].date = cur_frm.doc.start_date
                cur_frm.refresh_field('timesy_details')
            }
        }
        if (cur_frm.doc.skip_timesheet) cur_frm.trigger('holiday_list')
        if (cur_frm.doc.start_date && cur_frm.doc.end_date) {
            cur_frm.call({ doc: cur_frm.doc, method: 'check_date',
                args: { start_date: cur_frm.doc.start_date, end_date: cur_frm.doc.end_date },
                freeze: true, freeze_message: 'Checking dates...', async: false,
                callback: function(r) {
                    generate_timesy_rows(frm)
                    setTimeout(function() { staffing.timesy.replace_cells(frm) }, 500)
                }
            })
        }
    },
    demobilization_date: function() {
        if (cur_frm.doc.demobilization_date) {
            frappe.confirm('Update Demobilization Date in Staffing Cost?', function() {
                cur_frm.call({ doc: cur_frm.doc, method: 'change_date', args: {}, freeze: true,
                    freeze_message: 'Changing Date...', async: false,
                    callback: function(r) { cur_frm.save_or_update() }
                })
            }, function() {})
        }
    },
    refresh: function(frm) {
        frm.dashboard.data = {}
        frm.dashboard.transactions = []
        cur_frm.get_field('monthly_timesheet').grid.cannot_add_rows = true
        cur_frm.refresh_field('monthly_timesheet')

        if (cur_frm.is_new()) {
            cur_frm.doc.status = 'In Progress'; cur_frm.refresh_field('status')
            cur_frm.doc.normal_working_hour = 8; cur_frm.refresh_field('normal_working_hour')
        }

       if (!cur_frm.doc.skip_timesheet) {
            cur_frm.add_custom_button(__('Add Project'), function() {
                show_add_project_dialog(frm)
            }, __('Time Sheet'))
        }
        // New Leave Application button
        cur_frm.add_custom_button(__('Leave Application'), function() {

            frappe.new_doc('Leave Application', {
                employee: frm.doc.employee,
                custom_monthly_timesheet: frm.doc.name
            })

        }, __('Time Sheet'))

        cur_frm.call({ doc: cur_frm.doc, method: 'check_invoices', args: {}, freeze: true,
            freeze_message: 'Checking Sales Order...', async: false,
            callback: function(r) { has_si = r.message[0]; has_pi = r.message[1]; additional_salary = r.message[2] }
        })

        if (cur_frm.doc.docstatus && cur_frm.doc.status === 'In Progress' && !cur_frm.doc.skip_timesheet) {
            cur_frm.add_custom_button(__('Completed'), function() {
                frappe.confirm('Are you sure you want to proceed?', function() {
                    cur_frm.call({ doc: cur_frm.doc, method: 'change_status', args: { status: 'Completed' },
                        freeze: true, freeze_message: 'Changing Status...', async: false,
                        callback: function(r) { cur_frm.reload_doc() }
                    })
                }, function() {})
            })
        }
        if (cur_frm.doc.docstatus && cur_frm.doc.reference_type === 'Staff' && cur_frm.doc.status === 'Completed') {
            if (!has_si) cur_frm.add_custom_button(__('Sales Invoice'),    function() { frappe.model.open_mapped_doc({ method: 'staffing.staffing.doctype.timesy.timesy.generate_si', frm: cur_frm }) })
            if (!has_pi) cur_frm.add_custom_button(__('Purchase Invoice'), function() { frappe.model.open_mapped_doc({ method: 'staffing.staffing.doctype.timesy.timesy.generate_pi', frm: cur_frm }) })
        }
        if (cur_frm.doc.docstatus && cur_frm.doc.reference_type === 'Employee' && cur_frm.doc.status === 'Completed') {
            if (!has_si)            cur_frm.add_custom_button(__('Sales Invoice'),     function() { frappe.model.open_mapped_doc({ method: 'staffing.staffing.doctype.timesy.timesy.generate_si', frm: cur_frm }) })
            if (!additional_salary) cur_frm.add_custom_button(__('Additional Salary'), function() {
                frappe.call({ method: 'staffing.staffing.doctype.timesy.timesy.generate_as', args: { source_name: cur_frm.doc.name },
                    async: false, callback: function() { cur_frm.reload_doc() }
                })
            })
        }

        cur_frm.set_query('employee_code',                      function() { return { filters: { status: 'Active' } } })
        cur_frm.set_query('staff_code',                         function() { return { filters: { status: 'Active' } } })
        cur_frm.set_query('staffing_project', 'timesy_details', function() { return { filters: { disabled: 0 } } })
        cur_frm.set_query('reference_type',                     function() { return { filters: [['name', 'in', ['Employee', 'Staff']]] } })

        setTimeout(function() {
            staffing.timesy.replace_cells(frm)
            staffing.timesy.fetch_all_standard_hours(frm)
            staffing.timesy.apply_employee_holidays(frm, function() {
                staffing.timesy.inject_dashboard(frm)
            })
        }, 600)
    },
    staff_code: function(frm) {
        if (cur_frm.doc.staff_code)
            get_designation(cur_frm, { staff_code: cur_frm.doc.staff_code, docstatus: 1, status: 'Active', reference_type: 'Staff' })
        else { cur_frm.doc.designation = ''; cur_frm.refresh_field('designation') }
    },
    employee_code: function(frm) {
        if (cur_frm.doc.employee_code)
            get_designation(cur_frm, { employee_code: cur_frm.doc.employee_code, docstatus: 1, reference_type: 'Employee', status: 'Active' })
        else {
            cur_frm.doc.designation = ''; cur_frm.doc.staffing_type = ''
            cur_frm.doc.staffing_cost = ''; cur_frm.doc.staffing_project = ''
            cur_frm.refresh_fields(['designation', 'staffing_type', 'staffing_cost', 'staffing_project'])
        }
        // Force full dashboard rebuild when employee changes
        setTimeout(function() {
            var old = document.querySelector('.tsd-wrap')
            if (old) old.remove()
            staffing.timesy.apply_employee_holidays(frm, function() {
                staffing.timesy.inject_dashboard(frm)
            })
        }, 500)
        // Add Leave Application button when employee is selected
        if (cur_frm.doc.employee_code) {
            cur_frm.add_custom_button(__('Leave Application'), function() {
                frappe.db.get_value('Leave Application',
                    { employee: cur_frm.doc.employee_code },
                    'name',
                    function(r) {
                        if (r && r.name) {
                            frappe.set_route('Form', 'Leave Application', r.name)
                        } else {
                            frappe.new_doc('Leave Application', {
                                employee: cur_frm.doc.employee_code,
                                employee_name: cur_frm.doc.employee_name,
                                company: cur_frm.doc.company,
                            })
                            localStorage.setItem('leave_application_return_timesy', cur_frm.doc.name)
                        }
                    }
                )
            }, __('Time Sheet'))
        }

        // // Add Leave Allocation button when employee is selected
        // if (cur_frm.doc.employee_code) {
        //     cur_frm.add_custom_button(__('Leave Allocation'), function() {
        //         frappe.db.get_value('Leave Allocation',
        //             { employee: cur_frm.doc.employee_code },
        //             'name',
        //             function(r) {
        //                 if (r && r.name) {
        //                     frappe.set_route('Form', 'Leave Allocation', r.name)
        //                 } else {
        //                     frappe.new_doc('Leave Allocation', {
        //                         employee: cur_frm.doc.employee_code,
        //                         employee_name: cur_frm.doc.employee_name,
        //                         company: cur_frm.doc.company,
        //                     })
        //                     localStorage.setItem('leave_allocation_return_timesy', cur_frm.doc.name)
        //                 }
        //             }
        //         )
        //     }, __('Time Sheet'))
        // }
    },

    total_absent_hour: function(frm) {
        frappe.db.get_doc('Staffing Cost', cur_frm.doc.staffing_cost).then(function(doc) {
            cur_frm.doc.total_overtime_hour = (cur_frm.doc.overtime_hours * doc.default_overtime_rate) - cur_frm.doc.total_absent_hour
            cur_frm.refresh_fields(['total_overtime_hour'])
        })
    },
    total_costing_rate_deduction: function(frm) {
        if (cur_frm.doc.skip_timesheet) {
            var fd = new Date(cur_frm.doc.start_date), ed = new Date(cur_frm.doc.end_date)
            compute_working_days(cur_frm, (new Date(ed - fd)).getDate(), {})
        } else total_costing(cur_frm)
    },
    total_billing_rate_deduction: function(frm) {
        if (cur_frm.doc.skip_timesheet) {
            var fd = new Date(cur_frm.doc.start_date), ed = new Date(cur_frm.doc.end_date)
            compute_working_days(cur_frm, (new Date(ed - fd)).getDate(), {})
        } else total_costing(cur_frm)
    },
    after_save: function(frm) {
        setTimeout(function() {
            staffing.timesy.replace_cells(frm)
            staffing.timesy.fetch_all_standard_hours(frm)
            staffing.timesy.apply_employee_holidays(frm, function() {
                staffing.timesy.inject_dashboard(frm)
            })
        }, 400)
    },

    reference_type: function(frm) {
        setTimeout(function() {
            staffing.timesy.apply_employee_holidays(frm, function() {
                staffing.timesy.inject_dashboard(frm)
            })
        }, 300)
    },

    company: function(frm) {
        setTimeout(function() {
            staffing.timesy.inject_dashboard(frm)
        }, 300)
    },

    payroll_date: function(frm) {
        setTimeout(function() {
            staffing.timesy.inject_dashboard(frm)
        }, 300)
    }
})

function get_designation(cur_frm, obj) {
    frappe.db.count('Staffing Cost', obj).then(function(count) {
        if (count > 0) {
            frappe.db.get_value('Staffing Cost', obj,
                ['name', 'staffing_project', 'supplier', 'customer', 'supplier_name', 'customer_name', 'staffing_type']
            ).then(function(r) {
                var v = r.message
                cur_frm.doc.staffing_cost    = v.name
                cur_frm.doc.staffing_type    = v.staffing_type
                cur_frm.doc.staffing_project = v.staffing_project
                if (cur_frm.doc.reference_type === 'Staff') {
                    cur_frm.doc.supplier      = v.supplier
                    cur_frm.doc.supplier_name = v.supplier_name
                }
                cur_frm.doc.customer_name = v.customer_name
                cur_frm.doc.customer      = v.customer
                cur_frm.refresh_fields(['staffing_type', 'staffing_project', 'supplier', 'customer', 'supplier_name', 'customer_name', 'staffing_cost'])
            })
        }
    })
}

// ─── CHILD TABLE EVENTS ───────────────────────────────────────────────────────
frappe.ui.form.on('Timesy Details', {
    timesy_details_add: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn]
        frm.refresh_field(d.parentfield)
        d.date = d.idx > 1
            ? (frm.doc.timesy_details[d.idx - 2] ? frm.doc.timesy_details[d.idx - 2].date : frm.doc.start_date)
            : frm.doc.start_date
        frm.refresh_field(d.parentfield)
        setTimeout(function() { staffing.timesy.replace_cells(frm) }, 400)
    },
    timesy_details_remove: function(frm, cdt, cdn) {
        total_costing(cur_frm)
        setTimeout(function() {
            staffing.timesy.replace_cells(frm)
            staffing.timesy.refresh_dashboard(frm)
        }, 400)
    },
    from_time: function(frm, cdt, cdn) {
        staffing.timesy.calculate_hours(frm, cdt, cdn)
        setTimeout(function() { staffing.timesy.refresh_row(frm, cdn) }, 300)
    },
    to_time: function(frm, cdt, cdn) {
        staffing.timesy.calculate_hours(frm, cdt, cdn)
        setTimeout(function() { staffing.timesy.refresh_row(frm, cdn) }, 300)
    },
    project: function(frm, cdt, cdn) {
        staffing.timesy.fetch_and_calculate(frm, cdt, cdn)
        var row = locals[cdt][cdn]
        if (row && row.project) staffing.timesy.resolve_project_names([row.project])
    },
    absent_hour: function(frm) {
        total_costing(cur_frm)
        staffing.timesy.refresh_dashboard(frm)
    },
    working_hour: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn]
        if (d.status === 'Friday') {
            d.working_hour = 0; cur_frm.refresh_field(d.parentfield)
            frappe.throw('Cannot add working hour if status is Friday')
        } else if (cur_frm.doc.staffing_cost) {
            compute_hours(d, cur_frm)
        }
        staffing.timesy.refresh_dashboard(frm)
    },
    status: function(frm, cdt, cdn) {
        var d = locals[cdt][cdn]
        if (cur_frm.doc.staffing_cost) compute_hours(d, cur_frm)
        setTimeout(function() { staffing.timesy.refresh_dashboard(frm) }, 400)
    },
})

var absent_deduction = 0
function compute_hours(d, cur_frm) {
    frappe.db.get_doc('Staffing Cost', cur_frm.doc.staffing_cost).then(function(doc) {
        absent_deduction = doc.absent_deduction_per_hour
        var ref_emp = cur_frm.doc.reference_type === 'Employee'
        function ot_calc(wh) {
            return ref_emp && wh > cur_frm.doc.normal_working_hour
                ? (wh - cur_frm.doc.normal_working_hour) * doc.default_overtime_rate : 0
        }
        if (d.status === 'Absent') {
            d.working_hour=0; d.costing_hour=0; d.billing_hour=0
            d.absent_hour=doc.absent_deduction_per_hour; d.friday_hour=0
            d.overtime_hour=ot_calc(d.working_hour)
            cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
        } else if (d.status === 'Medical') {
            d.working_hour=0
            d.costing_hour=doc.default_cost_rate_per_hour*d.working_hour
            d.billing_hour=doc.default_billing_rate_per_hour*d.working_hour
            d.absent_hour=0; d.friday_hour=0; d.overtime_hour=ot_calc(d.working_hour)
            cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
        } else if (['Friday', 'Standby'].includes(d.status)) {
            d.costing_hour=0; d.billing_hour=0; d.absent_hour=0
            d.friday_costing_hour=0; d.overtime_hour=0; d.working_hour=0
            cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
        } else if (['Working', 'Holiday Working', 'Friday Working', 'Standby Pay'].includes(d.status)) {
            d.costing_hour=doc.default_cost_rate_per_hour*d.working_hour
            d.billing_hour=doc.default_billing_rate_per_hour*d.working_hour
            d.absent_hour=0; d.friday_hour=0; d.overtime_hour=ot_calc(d.working_hour)
            cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
        } else if (d.status === 'Holiday') {
            d.costing_hour=0; d.billing_hour=0; d.absent_hour=0
            d.friday_costing_hour=0; d.overtime_hour=0; d.working_hour=0
            cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
        } else if (d.status === 'Release') {
            d.working_hour=0; d.costing_hour=0; d.billing_hour=0
            d.absent_hour=doc.absent_deduction_per_hour; d.friday_hour=0
            d.overtime_hour=ot_calc(d.working_hour)
            cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
        } else if (d.status === 'Bad Weather') {
            d.costing_hour=0; d.billing_hour=0; d.absent_hour=0
            d.friday_costing_hour=0; d.overtime_hour=0; d.working_hour=0
            cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
        } else if (d.status === 'Holiday Working Full Overtime') {
            d.costing_hour=doc.default_cost_rate_per_hour*d.working_hour
            d.billing_hour=doc.default_billing_rate_per_hour*d.working_hour
            d.absent_hour=0; d.friday_hour=0
            d.overtime_hour=ref_emp && d.working_hour ? d.working_hour * doc.default_overtime_rate : 0
            cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
        } else if (d.status === 'Friday Working Full Overtime') {
            d.costing_hour=doc.default_cost_rate_per_hour*d.working_hour
            d.billing_hour=doc.default_billing_rate_per_hour*d.working_hour
            d.absent_hour=0; d.friday_hour=0
            d.overtime_hour=ref_emp && d.working_hour ? d.working_hour * doc.default_overtime_rate : 0
            cur_frm.refresh_field(d.parentfield); total_costing(cur_frm)
        }
    })
}

function total_costing(cur_frm) {
    var tc=0, tb=0, ta=0, tot=0, tw=0, tot_ot=0, tot_late=0
    var fd  = new Date(cur_frm.doc.start_date)
    var ed  = new Date(cur_frm.doc.end_date)
    var nod = (new Date(ed - fd)).getDate()
    for (var x = 0; x < cur_frm.doc.timesy_details.length; x++) {
        var r = cur_frm.doc.timesy_details[x]
        tw       += r.working_hour             || 0
        tc       += r.costing_hour             || 0
        tb       += r.billing_hour             || 0
        tot      += r.overtime_hour            || 0
        ta       += r.absent_hour              || 0
        tot_ot   += r.custom_ot_hour           || 0
        tot_late += r.custom_late_working_hour || 0
    }
    cur_frm.doc.total_costing_hour        = tc - ta - cur_frm.doc.total_costing_rate_deduction
    cur_frm.doc.total_billing_hour        = tb - cur_frm.doc.total_billing_rate_deduction
    cur_frm.doc.total_absent_hour         = ta
    cur_frm.doc.total_working_hour        = tw
    cur_frm.doc.total_overtime_hour       = tot
    cur_frm.doc.total_overtime_hour_staff = tw >= (cur_frm.doc.normal_working_hour * nod)
        ? tw - (cur_frm.doc.normal_working_hour * nod) : 0
    cur_frm.doc.custom_total_overtime_working_hours = tot_ot
    cur_frm.doc.custom_total_late_working_hours     = tot_late
    cur_frm.refresh_fields([
        'total_overtime_hour_staff', 'total_costing_hour', 'total_billing_hour',
        'total_absent_hour', 'total_friday_hour', 'total_overtime_hour', 'total_working_hour',
        'custom_total_overtime_working_hours', 'custom_total_late_working_hours'
    ])
    staffing.timesy.refresh_dashboard(cur_frm)
}