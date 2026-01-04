// Copyright (c) 2026, jan and contributors
// For license information, please see license.txt

frappe.query_reports["Workforce Mobilization Report"] = {
	"filters": [
		{
			"fieldname": "from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"reqd": 0
		},
		{
			"fieldname": "to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"reqd": 0
		},
		{
			"fieldname": "status",
			"label": __("Status"),
			"fieldtype": "Select",
			"options": "\nActive\nStandby\nReleased\nCompleted\nWorking",
			"reqd": 0
		},
		{
			"fieldname": "customer",
			"label": __("Customer"),
			"fieldtype": "Link",
			"options": "Customer",
			"reqd": 0
		},
		{
			"fieldname": "supplier",
			"label": __("Supplier"),
			"fieldtype": "Link",
			"options": "Supplier",
			"reqd": 0
		},
		{
			"fieldname": "nationality",
			"label": __("Nationality"),
			"fieldtype": "Link",
			"options": "Country",
			"reqd": 0
		},
		{
			"fieldname": "designation",
			"label": __("Designation"),
			"fieldtype": "Link",
			"options": "Designation",
			"reqd": 0
		},
		{
			"fieldname": "staff_code",
			"label": __("Staff Code"),
			"fieldtype": "Link",
			"options": "Staff",
			"reqd": 0
		},
		{
			"fieldname": "employee_code",
			"label": __("Employee Code"),
			"fieldtype": "Link",
			"options": "Employee",
			"reqd": 0
		}
	]
};
