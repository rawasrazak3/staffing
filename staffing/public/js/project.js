frappe.ui.form.on('Project', {

    refresh(frm) {
        toggle_overtime(frm);
        toggle_late_time(frm);
    },

    custom_allow_overtime(frm) {
        toggle_overtime(frm);
        if (!frm.doc.custom_allow_overtime) {
            frm.set_value('custom_overtime_type', null);
        }
    },

    custom_allow_late_time(frm) {
        toggle_late_time(frm);
        if (!frm.doc.custom_allow_late_time) {
            frm.set_value('custom_late_time_type', null);
        }
    }

});

function toggle_overtime(frm) {
    frm.toggle_display('custom_overtime_type', !!frm.doc.custom_allow_overtime);
    frm.toggle_reqd('custom_overtime_type', !!frm.doc.custom_allow_overtime);
}

function toggle_late_time(frm) {
    frm.toggle_display('custom_late_time_type', !!frm.doc.custom_allow_late_time);
    frm.toggle_reqd('custom_late_time_type', !!frm.doc.custom_allow_late_time);
}
