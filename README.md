# datastraw-roster
Smart Roster Management System <br>

1. How did you model employees, brands, processes, pods, and their relationships?

I designed the system using a relational database in MySQL.

- Employees: Store employee details, active status and weekly-off information.
- Brands: Store the different companies or brands supported by the organization.
- Processes: Each process belongs to a particular brand and contains its operating rule and minimum staffing requirement.
- Pods: Represent teams or operational groups used to organize employees.
- Assignments: Connect employees with the processes they are qualified or assigned to handle.
- Time Off: Stores approved employee leaves and other unavailable dates.
- Public Holidays: Stores holidays that affect roster planning.

I used primary keys and foreign keys to maintain relationships and data consistency.<br>

2. How does your system generate a roster and determine whether it satisfies the required constraints?

The system generates a monthly roster using employee assignments, weekly offs, approved leaves, public holidays and process operating rules.

The backend checks employee availability before assigning employees to working days.

After generating the roster, it validates:

- Employee availability.
- Weekly-off requirements.
- Approved leaves.
- Public holidays.
- Process operating rules.
- Minimum staffing requirements.

If a requirement cannot be satisfied, the system should report it as a roster conflict for review.<br>

3. How did you handle the difference between single-resource brands and brands with multiple employees?

I used process assignments and minimum staffing requirements to manage different staffing needs.

For a single-resource process, the system checks whether its assigned employee is available on the required working day.

For processes requiring multiple employees, the system checks whether the available assigned employees meet the minimum staffing requirement.

This approach makes staffing requirements configurable instead of using the same rule for every brand.<br>

4. What happens when an employee manages all processes for a brand but is unavailable on a required working day?

The system checks approved leaves, weekly offs and other unavailable dates before generating assignments.

If the employee is unavailable and no other eligible employee is assigned to cover the process, the system identifies insufficient coverage and reports a conflict.

The system should not silently assign an unavailable employee or generate a false confirmation of coverage.<br>

5. How does your system handle conflicting requirements or insufficient staffing?

The system uses validation checks to identify situations where staffing requirements cannot be fulfilled.

For example:

- An employee is on approved leave.
- A process requires one employee but none is available.
- A process requires multiple employees but fewer than the minimum are available.
- An employee is assigned to conflicting responsibilities.

These situations are reported as conflicts so that an administrator can review and take corrective action.<br>

6. Which parts of the process did you automate, and which did you leave under human control? Why?

I automated:

- Monthly roster generation.
- Employee availability checking.
- Weekly-off and leave consideration.
- Public holiday consideration.
- Minimum staffing validation.
- Conflict identification.

I kept the following under administrator control:

- Employee and brand management.
- Process configuration.
- Employee assignments.
- Manual roster modifications.
- Reviewing and resolving reported conflicts.

I chose this approach because automation reduces repetitive work, while human control allows administrators to handle exceptional situations and operational decisions.<br>

7. If the company doubled its team and brand count, what would you change about your solution?

If the system needed to support twice as many employees and brands, I would focus on scalability and performance.

I would:

- Add database indexes to frequently queried columns.
- Optimize SQL queries and reduce unnecessary database requests.
- Introduce pagination and filtering for large employee lists.
- Separate roster generation into background jobs.
- Improve logging and error monitoring.
- Add automated testing for roster-generation rules.

I would also consider caching frequently accessed configuration data.<br>

8. If you had one additional week to work on this, what would you improve first?

My first priority would be improving the roster-generation algorithm and conflict-resolution process.
I would focus on:
1. Improving the accuracy of employee availability checks.
2. Handling single-resource and multi-resource staffing more effectively.
3. Preventing duplicate or unnecessary conflict reports.
4. Improving manual roster editing and impact analysis.
5. Adding more test cases for leaves, holidays and insufficient staffing.
6. Improving the dashboard and deployment reliability.

My goal would be to make the system more reliable, easier to manage and suitable for real-world operational use.

Technology Stack: React.js, Node.js, Express.js, MySQL, HTML, CSS and JavaScript.
