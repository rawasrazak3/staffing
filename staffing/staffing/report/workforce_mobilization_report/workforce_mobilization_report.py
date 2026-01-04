# Copyright (c) 2026, jan and contributors
# For license information, please see license.txt

import frappe
from frappe import _
from frappe.utils import date_diff, getdate


def execute(filters=None):
	columns = get_columns()
	data = get_data(filters)
	return columns, data


def get_columns():
	"""Return columns for the report"""
	columns = [
		{
			"label": _("Emp No"),
			"fieldname": "emp_no",
			"fieldtype": "Link",
			"options": "Workforce Mobilization",
			"width": 120
		},
		{
			"label": _("Employee Name"),
			"fieldname": "employee_name",
			"fieldtype": "Data",
			"width": 200
		},
		{
			"label": _("Iqama No"),
			"fieldname": "iqama_number",
			"fieldtype": "Data",
			"width": 150
		},
		{
			"label": _("Nationality"),
			"fieldname": "nationality",
			"fieldtype": "Link",
			"options": "Country",
			"width": 120
		},
		{
			"label": _("Profession"),
			"fieldname": "profession",
			"fieldtype": "Link",
			"options": "Designation",
			"width": 180
		},
		{
			"label": _("Supplier"),
			"fieldname": "supplier",
			"fieldtype": "Link",
			"options": "Supplier",
			"width": 190
		},
		{
			"label": _("Client"),
			"fieldname": "client",
			"fieldtype": "Link",
			"options": "Customer",
			"width": 300
		},
		{
			"label": _("Client Rate"),
			"fieldname": "client_rate",
			"fieldtype": "Currency",
			"width": 100
		},
		{
			"label": _("Work Location"),
			"fieldname": "work_location",
			"fieldtype": "Data",
			"width": 180
		},
		{
			"label": _("Mob. Date"),
			"fieldname": "mobilization_date",
			"fieldtype": "Date",
			"width": 120
		},
		{
			"label": _("De-Mob. Date"),
			"fieldname": "demobilization_date",
			"fieldtype": "Date",
			"width": 120
		},
		{
			"label": _("Total Days"),
			"fieldname": "total_days",
			"fieldtype": "Int",
			"width": 110
		},
		{
			"label": _("Status"),
			"fieldname": "status",
			"fieldtype": "Data",
			"width": 100
		}
	]
	return columns


def get_data(filters):
	"""Fetch data based on filters"""
	conditions = get_conditions(filters)
	
	data = frappe.db.sql("""
		SELECT 
			wm.name as emp_no,
			COALESCE(wm.staff_name, wm.employee_name) as employee_name,
			wm.iqama_number,
			wm.nationality,
			wm.designation as profession,
			wm.supplier,
			wm.customer_code as client,
			wm.client_rate,
			wm.work_location,
			wm.mobilization_date,
			wm.demobilization_date,
			wm.status
		FROM 
			`tabWorkforce Mobilization` wm
		WHERE 
			wm.docstatus = 1
			{conditions}
		ORDER BY 
			wm.mobilization_date DESC, wm.name
	""".format(conditions=conditions), filters, as_dict=1)
	
	# Calculate total days
	for row in data:
		if row.mobilization_date:
			if row.demobilization_date:
				row.total_days = date_diff(row.demobilization_date, row.mobilization_date)
			elif row.status in ["Active", "Working", "Standby"]:
				# Calculate days from mobilization to today for active records
				row.total_days = date_diff(getdate(), row.mobilization_date)
			else:
				row.total_days = 0
		else:
			row.total_days = 0
	
	return data


def get_conditions(filters):
	"""Build WHERE clause conditions based on filters"""
	conditions = ""
	
	# Only apply date filters if explicitly provided
	if filters.get("from_date") and filters.get("from_date") != "":
		conditions += " AND wm.mobilization_date >= %(from_date)s"
	
	if filters.get("to_date") and filters.get("to_date") != "":
		conditions += " AND wm.mobilization_date <= %(to_date)s"
	
	if filters.get("status"):
		conditions += " AND wm.status = %(status)s"
	
	if filters.get("customer"):
		conditions += " AND wm.customer_code = %(customer)s"
	
	if filters.get("supplier"):
		conditions += " AND wm.supplier = %(supplier)s"
	
	if filters.get("nationality"):
		conditions += " AND wm.nationality = %(nationality)s"
	
	if filters.get("designation"):
		conditions += " AND wm.designation = %(designation)s"
	
	if filters.get("staff_code"):
		conditions += " AND wm.staff_code = %(staff_code)s"
	
	if filters.get("employee_code"):
		conditions += " AND wm.employee_code = %(employee_code)s"
	
	return conditions
