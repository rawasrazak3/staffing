import frappe
from frappe import _
from frappe.utils import getdate


def execute(filters=None):
	filters = filters or {}
	columns = get_columns()
	data = get_data(filters)
	return columns, data


def get_columns():
	return [
		{
			"label": _("Employee"),
			"fieldname": "staff_name",
			"fieldtype": "Data",
			"width": 160
		},
		{
			"label": _("Date"),
			"fieldname": "date",
			"fieldtype": "Date",
			"width": 100
		},
		{
			"label": _("From Time"),
			"fieldname": "from_time",
			"fieldtype": "Time",
			"width": 90
		},
		{
			"label": _("To Time"),
			"fieldname": "to_time",
			"fieldtype": "Time",
			"width": 90
		},
		{
			"label": _("Project"),
			"fieldname": "project",
			"fieldtype": "Link",
			"options": "Project",
			"width": 160
		},
		{
			"label": _("Status"),
			"fieldname": "custom_status",
			"fieldtype": "Data",
			"width": 100
		},
		{
			"label": _("Wk Hrs"),
			"fieldname": "working_hour",
			"fieldtype": "Float",
			"width": 80
		},
		{
			"label": _("OT Hrs"),
			"fieldname": "custom_ot_hour",
			"fieldtype": "Float",
			"width": 80
		},
		{
			"label": _("Late Hr"),
			"fieldname": "custom_late_working_hour",
			"fieldtype": "Float",
			"width": 80
		},
		{
			"label": _("Std Hr"),
			"fieldname": "custom_standard_working_hour",
			"fieldtype": "Float",
			"width": 80
		},
	]


def get_data(filters):
	conditions = get_conditions(filters)

	data = frappe.db.sql(
		"""
		SELECT
			t.staff_name,
			td.date,
			td.from_time,
			td.to_time,
			td.project,
			td.custom_status,
			td.working_hour,
			td.custom_ot_hour,
			td.custom_late_working_hour,
			td.custom_standard_working_hour
		FROM
			`tabTimesy Details` td
		INNER JOIN
			`tabTimesy` t ON t.name = td.parent
		WHERE
			t.docstatus != 2
			{conditions}
		ORDER BY
			t.staff_name, td.date, td.from_time
		""".format(conditions=conditions),
		filters,
		as_dict=1,
	)

	return data


def get_conditions(filters):
	conditions = ""

	if filters.get("employee"):
		conditions += " AND t.staff_name = %(employee)s"

	if filters.get("project"):
		conditions += " AND td.project = %(project)s"

	if filters.get("status"):
		conditions += " AND td.custom_status = %(status)s"

	if filters.get("year") and filters.get("month"):
		conditions += (
			" AND YEAR(td.date) = %(year)s"
			" AND MONTH(td.date) = %(month)s"
		)
	elif filters.get("year"):
		conditions += " AND YEAR(td.date) = %(year)s"
	elif filters.get("month"):
		conditions += " AND MONTH(td.date) = %(month)s"

	return conditions