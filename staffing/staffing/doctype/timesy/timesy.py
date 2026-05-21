# # Copyright (c) 2021, jan and contributors
# # For license information, please see license.txt

# import frappe
# from frappe.model.document import Document
# from frappe.model.mapper import get_mapped_doc
# from datetime import *

# class Timesy(Document):

#     @frappe.whitelist()
#     def check_date(self, start_date, end_date):
#         condition = ""
#         if self.reference_type == 'Employee':
#             condition += " and employee_code='{0}' ".format(self.employee_code)
#         elif self.reference_type == 'Staff':
#             condition += " and staff_code='{0}' ".format(self.staff_code)

#         start_query = """
#                         SELECT * FROM `tabTimesy`
#                         WHERE %s BETWEEN start_date and end_date and docstatus=1 and reference_type=%s {0}""".format(condition)
#         end_query = """
#                               SELECT * FROM `tabTimesy`
#                               WHERE %s BETWEEN start_date and end_date and docstatus=1 and reference_type=%s {0}""".format(condition)
#         print(start_query)
#         check_timesy_start = frappe.db.sql(start_query, (start_date, self.reference_type), as_dict=1)
#         check_timesy_end = frappe.db.sql(end_query, (end_date, self.reference_type), as_dict=1)

#         if len(check_timesy_start) > 0 or len(check_timesy_end) > 0:
#             frappe.throw(""" There is already submitted time sheet with these dates """)

#     @frappe.whitelist()
#     def get_holiday(self):
#         if not self.holiday_list:
#             return

#         holidays = frappe.get_doc("Holiday List", self.holiday_list)

#         fridays = 0
#         holidays_count = 0
#         for i in holidays.holidays:
#             print(i.holiday_date)
#             if i.description == 'Friday' and datetime.strptime(str(i.holiday_date), '%Y-%m-%d') >= datetime.strptime(self.start_date, '%Y-%m-%d') and datetime.strptime(str(i.holiday_date), '%Y-%m-%d') <= datetime.strptime(self.end_date, '%Y-%m-%d'):
#                 fridays += 1
#             elif datetime.strptime(str(i.holiday_date), '%Y-%m-%d') >= datetime.strptime(self.start_date, '%Y-%m-%d') and datetime.strptime(str(i.holiday_date), '%Y-%m-%d') <= datetime.strptime(self.end_date, '%Y-%m-%d'):
#                 holidays_count += 1
#         print("HOLIIIIDAYS")
#         print(holidays_count)
#         print(fridays)
#         return holidays_count, fridays

#     @frappe.whitelist()
#     def validate(self):
#         if self.skip_timesheet:
#             for i in self.monthly_timesheet:
#                 if i.type in ['Working Days', 'Working Fridays', 'Working Holidays'] and (not i.working_hour or not i.number):
#                     frappe.throw("Working Hours and Working Days is mandatory for " + i.type)

#             self.status = 'Completed'
#         else:
#             self.status = 'In Progress'

#         self.check_date(self.start_date, self.end_date)

#         if not self.skip_timesheet:
#             for i in self.timesy_details:
#                 if i.working_hour == 0 and i.status == 'Working':
#                     frappe.throw("Working Hour must be greater than 0 for Working")

#     @frappe.whitelist()
#     def check_invoices(self):
#         si = frappe.db.sql(""" SELECT COUNT(*) as count FROM `tabSales Invoice` SI INNER JOIN `tabTimesy List` TL ON TL.parent = SI.name WHERE TL.timesy = %s and SI.docstatus=1""", self.name, as_dict=1)
#         pi = frappe.db.sql(""" SELECT COUNT(*) as count FROM `tabPurchase Invoice` PI INNER JOIN `tabTimesy List` TL ON TL.parent = PI.name WHERE TL.timesy = %s and PI.docstatus=1""", self.name, as_dict=1)

#         # Guard: only query Additional Salary if HRMS is installed
#         additional_salary_count = 0
#         if frappe.db.table_exists("Additional Salary"):
#             result = frappe.db.sql(""" SELECT COUNT(*) as count FROM `tabAdditional Salary` ADS INNER JOIN `tabTimesy List` TL ON TL.parent = ADS.name WHERE TL.timesy = %s and ADS.docstatus=1""", self.name, as_dict=1)
#             additional_salary_count = result[0].count

#         return si[0].count > 0, pi[0].count > 0, additional_salary_count > 0

#     @frappe.whitelist()
#     def change_status(self, status):
#         frappe.db.sql(""" UPDATE `tabTimesy` SET status=%s WHERE name=%s""", (status, self.name))
#         frappe.db.commit()

#     @frappe.whitelist()
#     def change_date(self):
#         condition = ""
#         if self.reference_type == "Employee":
#             condition += " and employee_code='{0}' ".format(self.employee_code)
#         if self.reference_type == "Staff":
#             condition += " and staff_code='{0}' ".format(self.staff_code)
#         query = """ UPDATE `tabStaffing Cost` SET demobilization_date='{0}', status='Expired' WHERE docstatus = 1 {1}""".format(self.demobilization_date, condition)
#         frappe.db.sql(query)
#         frappe.db.commit()


# @frappe.whitelist()
# def generate_as(source_name, target_doc=None):
#     timesy = frappe.get_doc("Timesy", source_name)
#     doc = get_mapped_doc("Timesy", source_name, {
#         "Timesy": {
#             "doctype": "Additional Salary",
#             "validation": {
#                 "docstatus": ["=", 1]
#             },
#             "field_map": {
#                 "employee_code": "employee",
#                 "total_overtime_hour": "amount",
#             }
#         }
#     }, ignore_permissions=True)

#     doc.append("timesy_list", {
#         "timesy": source_name
#     })
#     timesy_doc = doc.insert()
#     timesy_doc.submit()


# @frappe.whitelist()
# def generate_si(source_name, target_doc=None):
#     timesy = frappe.get_doc("Timesy", source_name)
#     doc = get_mapped_doc("Timesy", source_name, {
#         "Timesy": {
#             "doctype": "Sales Invoice",
#             "validation": {
#                 "docstatus": ["=", 1]
#             },
#             "field_map": {
#                 "start_date": "posting_date",
#                 "end_date": "due_date",
#             }
#         }
#     }, ignore_permissions=True)

#     doc.append("timesy_list", {
#         "timesy": source_name,
#         "staff_name": timesy.staff_name if timesy.reference_type == 'Staff' else timesy.employee_name,
#         "staffing_project": timesy.staffing_project,
#         "total_costing_rate": timesy.total_costing_hour,
#     })
#     doc.append("items", {
#         "item_code": timesy.item,
#         "rate": timesy.total_costing_hour
#     })
#     return doc


# @frappe.whitelist()
# def generate_pi(source_name, target_doc=None):
#     timesy = frappe.get_doc("Timesy", source_name)
#     doc = get_mapped_doc("Timesy", source_name, {
#         "Timesy": {
#             "doctype": "Purchase Invoice",
#             "validation": {
#                 "docstatus": ["=", 1]
#             },
#             "field_map": {
#                 "start_date": "posting_date",
#                 "end_date": "due_date",
#             }
#         }
#     }, ignore_permissions=True)

#     doc.append("timesy_list", {
#         "timesy": source_name,
#         "staff_name": timesy.staff_name if timesy.reference_type == 'Staff' else timesy.employee_name,
#         "staffing_project": timesy.staffing_project,
#         "total_costing_rate": timesy.total_costing_hour,
#     })
#     doc.append("items", {
#         "item_code": timesy.item,
#         "qty": 1,
#         "rate": timesy.total_billing_hour
#     })
#     return doc



# Copyright (c) 2021, jan and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.model.mapper import get_mapped_doc
from datetime import *

class Timesy(Document):

    @frappe.whitelist()
    def check_date(self, start_date, end_date):
        condition = ""
        if self.reference_type == 'Employee':
            condition += " and employee_code='{0}' ".format(self.employee_code)
        elif self.reference_type == 'Staff':
            condition += " and staff_code='{0}' ".format(self.staff_code)

        start_query = """
                        SELECT * FROM `tabTimesy`
                        WHERE %s BETWEEN start_date and end_date and docstatus=1 and reference_type=%s {0}""".format(condition)
        end_query = """
                              SELECT * FROM `tabTimesy`
                              WHERE %s BETWEEN start_date and end_date and docstatus=1 and reference_type=%s {0}""".format(condition)
        print(start_query)
        check_timesy_start = frappe.db.sql(start_query, (start_date, self.reference_type), as_dict=1)
        check_timesy_end = frappe.db.sql(end_query, (end_date, self.reference_type), as_dict=1)

        if len(check_timesy_start) > 0 or len(check_timesy_end) > 0:
            frappe.throw(""" There is already submitted time sheet with these dates """)

    @frappe.whitelist()
    def get_holiday(self):
        if not self.holiday_list:
            return

        holidays = frappe.get_doc("Holiday List", self.holiday_list)

        fridays = 0
        holidays_count = 0
        for i in holidays.holidays:
            print(i.holiday_date)
            if i.description == 'Friday' and datetime.strptime(str(i.holiday_date), '%Y-%m-%d') >= datetime.strptime(self.start_date, '%Y-%m-%d') and datetime.strptime(str(i.holiday_date), '%Y-%m-%d') <= datetime.strptime(self.end_date, '%Y-%m-%d'):
                fridays += 1
            elif datetime.strptime(str(i.holiday_date), '%Y-%m-%d') >= datetime.strptime(self.start_date, '%Y-%m-%d') and datetime.strptime(str(i.holiday_date), '%Y-%m-%d') <= datetime.strptime(self.end_date, '%Y-%m-%d'):
                holidays_count += 1
        return holidays_count, fridays

    @frappe.whitelist()
    def validate(self):
        if self.skip_timesheet:
            for i in self.monthly_timesheet:
                if i.type in ['Working Days', 'Working Fridays', 'Working Holidays'] and (not i.working_hour or not i.number):
                    frappe.throw("Working Hours and Working Days is mandatory for " + i.type)
            self.status = 'Completed'
        else:
            self.status = 'In Progress'

        self.check_date(self.start_date, self.end_date)

        if not self.skip_timesheet:
            for i in self.timesy_details:
                if i.working_hour == 0 and i.status == 'Working':
                    frappe.throw("Working Hour must be greater than 0 for Working")

    def on_save(self):
        if self.reference_type == 'Employee' and self.employee_code:
            self.sync_attendance()

    def on_submit(self):
        if self.reference_type == 'Employee' and self.employee_code:
            self.sync_attendance()

    def on_cancel(self):
        if self.reference_type == 'Employee' and self.employee_code:
            self.delete_all_attendance()

    def sync_attendance(self):
        status_map = {
    'Working':                      'Present',
    'Holiday Working':              'Present',
    'Friday Working':               'Present',
    'Standby Pay':                  'Present',
    'Holiday Working Full Overtime':'Present',
    'Friday Working Full Overtime': 'Present',
    'Absent':                       'Absent',
    'Release':                      'Absent',
    'Medical':                       'Absent',
    'Holiday':                       'On Leave',
    'Bad Weather':                   'On Leave',
    'Friday':                        'On Leave',
    'Standby':                       'On Leave',
    'Weekend':                       'On Leave',
    'On Leave':                      'On Leave'
    }

        # Get all dates in current timesy_details
        current_dates = set()
        for row in self.timesy_details:
            if row.date and row.status:
                current_dates.add(row.date)

        # Delete attendance for dates no longer in timesy_details
        existing_att = frappe.get_all('Attendance', filters={
            'employee':   self.employee_code,
            'custom_timesy': self.name,
            'docstatus':  ['!=', 2]
        }, fields=['name', 'attendance_date'])

        existing_dates = set()
        for att in existing_att:
            existing_dates.add(str(att.attendance_date))
            if str(att.attendance_date) not in current_dates:
                att_doc = frappe.get_doc('Attendance', att.name)
                if att_doc.docstatus == 1:
                    att_doc.cancel()
                frappe.delete_doc('Attendance', att.name, ignore_permissions=True)

        # Create or update attendance for each row
        for row in self.timesy_details:
            if not row.date or not row.status:
                continue

            att_status = status_map.get(row.status)
            if not att_status:
                continue

            date_str = str(row.date)

            # Check if attendance already exists for this date
            existing = frappe.db.get_value('Attendance', {
                'employee':      self.employee_code,
                'attendance_date': date_str,
                'custom_timesy': self.name,
                'docstatus':     ['!=', 2]
            }, 'name')

            if existing:
                # Update existing attendance
                att_doc = frappe.get_doc('Attendance', existing)
                was_submitted = att_doc.docstatus == 1
                if was_submitted:
                    att_doc.cancel()
                    frappe.db.commit()
                    # Get fresh doc after cancel
                    att_doc = frappe.get_doc('Attendance', existing)

                att_doc.status        = att_status
                att_doc.working_hours = row.working_hour or 0
                att_doc.custom_timesy = self.name
                att_doc.flags.ignore_permissions = True
                att_doc.save(ignore_permissions=True)
                att_doc.submit()
            else:
                # Create new attendance
                att_doc = frappe.new_doc('Attendance')
                att_doc.employee         = self.employee_code
                att_doc.employee_name    = self.employee_name or ''
                att_doc.attendance_date  = date_str
                att_doc.status           = att_status
                att_doc.working_hours    = row.working_hour or 0
                att_doc.company          = self.company if hasattr(self, 'company') and self.company else frappe.defaults.get_user_default('company')
                att_doc.custom_timesy    = self.name
                att_doc.insert(ignore_permissions=True)
                att_doc.submit()

    def delete_all_attendance(self):
        existing_att = frappe.get_all('Attendance', filters={
            'employee':      self.employee_code,
            'custom_timesy': self.name,
            'docstatus':     ['!=', 2]
        }, fields=['name'])

        for att in existing_att:
            att_doc = frappe.get_doc('Attendance', att.name)
            if att_doc.docstatus == 1:
                att_doc.cancel()
            frappe.delete_doc('Attendance', att.name, ignore_permissions=True)

    @frappe.whitelist()
    def check_invoices(self):
        si = frappe.db.sql(""" SELECT COUNT(*) as count FROM `tabSales Invoice` SI INNER JOIN `tabTimesy List` TL ON TL.parent = SI.name WHERE TL.timesy = %s and SI.docstatus=1""", self.name, as_dict=1)
        pi = frappe.db.sql(""" SELECT COUNT(*) as count FROM `tabPurchase Invoice` PI INNER JOIN `tabTimesy List` TL ON TL.parent = PI.name WHERE TL.timesy = %s and PI.docstatus=1""", self.name, as_dict=1)

        additional_salary_count = 0
        if frappe.db.table_exists("Additional Salary"):
            result = frappe.db.sql(""" SELECT COUNT(*) as count FROM `tabAdditional Salary` ADS INNER JOIN `tabTimesy List` TL ON TL.parent = ADS.name WHERE TL.timesy = %s and ADS.docstatus=1""", self.name, as_dict=1)
            additional_salary_count = result[0].count

        return si[0].count > 0, pi[0].count > 0, additional_salary_count > 0

    @frappe.whitelist()
    def change_status(self, status):
        frappe.db.sql(""" UPDATE `tabTimesy` SET status=%s WHERE name=%s""", (status, self.name))
        frappe.db.commit()

    @frappe.whitelist()
    def change_date(self):
        condition = ""
        if self.reference_type == "Employee":
            condition += " and employee_code='{0}' ".format(self.employee_code)
        if self.reference_type == "Staff":
            condition += " and staff_code='{0}' ".format(self.staff_code)
        query = """ UPDATE `tabStaffing Cost` SET demobilization_date='{0}', status='Expired' WHERE docstatus = 1 {1}""".format(self.demobilization_date, condition)
        frappe.db.sql(query)
        frappe.db.commit()


@frappe.whitelist()
def generate_as(source_name, target_doc=None):
    timesy = frappe.get_doc("Timesy", source_name)
    doc = get_mapped_doc("Timesy", source_name, {
        "Timesy": {
            "doctype": "Additional Salary",
            "validation": {
                "docstatus": ["=", 1]
            },
            "field_map": {
                "employee_code": "employee",
                "total_overtime_hour": "amount",
            }
        }
    }, ignore_permissions=True)

    doc.append("timesy_list", {
        "timesy": source_name
    })
    timesy_doc = doc.insert()
    timesy_doc.submit()


@frappe.whitelist()
def generate_si(source_name, target_doc=None):
    timesy = frappe.get_doc("Timesy", source_name)
    doc = get_mapped_doc("Timesy", source_name, {
        "Timesy": {
            "doctype": "Sales Invoice",
            "validation": {
                "docstatus": ["=", 1]
            },
            "field_map": {
                "start_date": "posting_date",
                "end_date": "due_date",
            }
        }
    }, ignore_permissions=True)

    doc.append("timesy_list", {
        "timesy": source_name,
        "staff_name": timesy.staff_name if timesy.reference_type == 'Staff' else timesy.employee_name,
        "staffing_project": timesy.staffing_project,
        "total_costing_rate": timesy.total_costing_hour,
    })
    doc.append("items", {
        "item_code": timesy.item,
        "rate": timesy.total_costing_hour
    })
    return doc


@frappe.whitelist()
def generate_pi(source_name, target_doc=None):
    timesy = frappe.get_doc("Timesy", source_name)
    doc = get_mapped_doc("Timesy", source_name, {
        "Timesy": {
            "doctype": "Purchase Invoice",
            "validation": {
                "docstatus": ["=", 1]
            },
            "field_map": {
                "start_date": "posting_date",
                "end_date": "due_date",
            }
        }
    }, ignore_permissions=True)

    doc.append("timesy_list", {
        "timesy": source_name,
        "staff_name": timesy.staff_name if timesy.reference_type == 'Staff' else timesy.employee_name,
        "staffing_project": timesy.staffing_project,
        "total_costing_rate": timesy.total_costing_hour,
    })
    doc.append("items", {
        "item_code": timesy.item,
        "qty": 1,
        "rate": timesy.total_billing_hour
    })
    return doc
@frappe.whitelist()
@frappe.whitelist()
def get_employee_holidays(employee_code):
    assignment = frappe.db.get_value(
        'Holiday List Assignment',
        {'assigned_to': employee_code, 'applicable_for': 'Employee'},
        'holiday_list'
    )
    if not assignment:
        return {'holidays': [], 'weekly_offs': []}
    
    holidays = frappe.db.sql("""
        SELECT holiday_date, weekly_off
        FROM `tabHoliday` 
        WHERE parent = %s
    """, assignment, as_dict=True)
    
    holiday_dates = []
    weekly_off_dates = []
    for h in holidays:
        if h.weekly_off:
            weekly_off_dates.append(str(h.holiday_date))
        else:
            holiday_dates.append(str(h.holiday_date))
    
    return {'holidays': holiday_dates, 'weekly_offs': weekly_off_dates}
@frappe.whitelist()
def mark_leave_as_absent(employee_code, from_date, to_date):
    # Mark Absent in Timesy Details
    timesy_list = frappe.db.get_all('Timesy', 
        filters={'employee_code': employee_code, 'docstatus': 0},
        fields=['name']
    )
    
    for timesy in timesy_list:
        details = frappe.db.get_all('Timesy Details',
            filters={'parent': timesy.name, 'date': ['between', [from_date, to_date]]},
            fields=['name']
        )
        for detail in details:
            frappe.db.set_value('Timesy Details', detail.name, {
                'status': 'Absent',
                'from_time': None,
                'to_time': None,
                'project': None
            })
        if details:
            frappe.db.commit()
@frappe.whitelist()
def get_employee_leaves(employee_code, from_date, to_date):
    leaves = frappe.db.sql("""
        SELECT from_date, to_date 
        FROM `tabLeave Application`
        WHERE employee = %s 
        AND status = 'Approved'
        AND docstatus = 1
        AND (
            (from_date BETWEEN %s AND %s)
            OR (to_date BETWEEN %s AND %s)
            OR (from_date <= %s AND to_date >= %s)
        )
    """, (employee_code, from_date, to_date, from_date, to_date, from_date, to_date), as_dict=True)
    
    leave_dates = []
    import datetime
    for leave in leaves:
        current = frappe.utils.getdate(leave.from_date)
        end = frappe.utils.getdate(leave.to_date)
        while current <= end:
            if frappe.utils.getdate(from_date) <= current <= frappe.utils.getdate(to_date):
                leave_dates.append(str(current))
            current += datetime.timedelta(days=1)
    
    return leave_dates


    # Mark Absent in Attendance
    import datetime
    from_date = frappe.utils.getdate(from_date)
    to_date = frappe.utils.getdate(to_date)
    current = from_date
    
    while current <= to_date:
        date_str = str(current)
        existing = frappe.db.get_value('Attendance', 
            {'employee': employee_code, 'attendance_date': date_str},
            'name'
        )
        if existing:
            frappe.db.set_value('Attendance', existing, 'status', 'Absent')
        else:
            att = frappe.new_doc('Attendance')
            att.employee = employee_code
            att.attendance_date = date_str
            att.status = 'Absent'
            att.flags.ignore_permissions = True
            att.insert()
            att.submit()
        current += datetime.timedelta(days=1)
    
    frappe.db.commit()
    return 'success'    