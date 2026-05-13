frappe.query_reports["Timesy Report"] = {
	filters: [
		{
			fieldname: "employee",
			label: __("Employee Name"),
			fieldtype: "Data",
		},
		{
			fieldname: "year",
			label: __("Year"),
			fieldtype: "Select",
			options: get_year_options(),
			default: String(frappe.datetime.get_today().split("-")[0]),
		},
		{
			fieldname: "month",
			label: __("Month"),
			fieldtype: "Select",
			options: [
				{ value: "", label: __("All") },
				{ value: "1", label: __("January") },
				{ value: "2", label: __("February") },
				{ value: "3", label: __("March") },
				{ value: "4", label: __("April") },
				{ value: "5", label: __("May") },
				{ value: "6", label: __("June") },
				{ value: "7", label: __("July") },
				{ value: "8", label: __("August") },
				{ value: "9", label: __("September") },
				{ value: "10", label: __("October") },
				{ value: "11", label: __("November") },
				{ value: "12", label: __("December") },
			],
			default: String(frappe.datetime.get_today().split("-")[1]).replace(/^0/, ""),
		},
		{
			fieldname: "status",
			label: __("Status"),
			fieldtype: "Select",
			options: [
				"",
				"Present",
				"Absent",
				"Half Day",
				"Holiday",
				"Weekly Off",
			],
		},
		{
			fieldname: "project",
			label: __("Project"),
			fieldtype: "Link",
			options: "Project",
		},
	],
};

function get_year_options() {
	let current_year = new Date().getFullYear();
	let options = [""];
	for (let y = current_year; y >= current_year - 5; y--) {
		options.push(String(y));
	}
	return options.join("\n");
}