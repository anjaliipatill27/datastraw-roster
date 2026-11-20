import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'datastraw_roster',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true
});

const q = async (sql, args = []) => {
  const [rows] = await pool.execute(sql, args);
  return rows;
};

// DATABASE CONNECTION CHECK
app.get('/api/health', async (req, res) => {
  try {
    await q('SELECT 1');

    res.json({
      ok: true,
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
});

// DASHBOARD
app.get('/api/dashboard', async (req, res) => {
  try {
    const [employees, brands, processes, pods, gaps] =
      await Promise.all([
        q('SELECT COUNT(*) count FROM employees WHERE active=1'),
        q('SELECT COUNT(*) count FROM brands'),
        q('SELECT COUNT(*) count FROM processes'),
        q('SELECT COUNT(*) count FROM pods'),
        q("SELECT COUNT(*) count FROM roster_entries WHERE status='WORKING'")
      ]);

    res.json({
      employees: employees[0].count,
      brands: brands[0].count,
      processes: processes[0].count,
      pods: pods[0].count,
      workingEntries: gaps[0].count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EMPLOYEES
app.get('/api/employees', async (req, res) => {
  try {
    res.json(await q(`
      SELECT e.*, p.name pod_name
      FROM employees e
      LEFT JOIN pods p ON p.id=e.pod_id
      ORDER BY e.id
    `));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const {
      name,
      email,
      pod_id,
      role = 'Associate',
      weekly_off = 'Sunday'
    } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Employee name is required'
      });
    }

    const result = await q(
      `INSERT INTO employees
       (name,email,pod_id,role,weekly_off)
       VALUES(?,?,?,?,?)`,
      [name, email || null, pod_id || null, role, weekly_off]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Employee added'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/employees/:id', async (req, res) => {
  try {
    const {
      name,
      email,
      pod_id,
      role,
      weekly_off,
      active
    } = req.body;

    await q(
      `UPDATE employees
       SET name=?, email=?, pod_id=?, role=?,
       weekly_off=?, active=?
       WHERE id=?`,
      [
        name,
        email || null,
        pod_id || null,
        role,
        weekly_off,
        active ? 1 : 0,
        req.params.id
      ]
    );

    res.json({ message: 'Employee updated' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/employees/:id', async (req, res) => {
  try {
    await q(
      'DELETE FROM employees WHERE id=?',
      [req.params.id]
    );

    res.json({ message: 'Employee removed' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// BRANDS
app.get('/api/brands', async (req, res) => {
  try {
    res.json(await q(`
      SELECT b.*,
      COUNT(DISTINCT p.id) process_count,
      COUNT(DISTINCT a.employee_id) employee_count
      FROM brands b
      LEFT JOIN processes p ON p.brand_id=b.id
      LEFT JOIN assignments a ON a.process_id=p.id
      GROUP BY b.id
      ORDER BY b.id
    `));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PROCESSES
app.get('/api/processes', async (req, res) => {
  try {
    res.json(await q(`
      SELECT p.*, b.name brand_name
      FROM processes p
      JOIN brands b ON b.id=p.brand_id
      ORDER BY b.name,p.name
    `));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PODS
app.get('/api/pods', async (req, res) => {
  try {
    res.json(await q('SELECT * FROM pods ORDER BY id'));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ASSIGNMENTS
app.get('/api/assignments', async (req, res) => {
  try {
    res.json(await q(`
      SELECT a.id,
      e.name employee_name,
      b.name brand_name,
      p.name process_name
      FROM assignments a
      JOIN employees e ON e.id=a.employee_id
      JOIN processes p ON p.id=a.process_id
      JOIN brands b ON b.id=p.brand_id
      ORDER BY b.name,e.name
    `));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LEAVE MANAGEMENT
app.get('/api/leave', async (req, res) => {
  try {
    res.json(await q(`
      SELECT t.*,e.name employee_name
      FROM time_off t
      JOIN employees e ON e.id=t.employee_id
      ORDER BY t.date DESC
    `));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/leave', async (req, res) => {
  try {
    const {
      employee_id,
      date,
      type = 'LEAVE',
      note = ''
    } = req.body;

    await q(`
      INSERT INTO time_off
      (employee_id,date,type,status,note)
      VALUES(?,?,?,'APPROVED',?)
      ON DUPLICATE KEY UPDATE
      type=VALUES(type),
      status='APPROVED',
      note=VALUES(note)
    `, [employee_id, date, type, note]);

    res.status(201).json({
      message: 'Time off saved'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// MONTHLY ROSTER GENERATOR
app.post('/api/roster/generate', async (req, res) => {
  const { month } = req.body;

  if (!/^\d{4}-\d{2}$/.test(month || '')) {
    return res.status(400).json({
      error: 'Choose month in YYYY-MM format'
    });
  }

  try {
    const start = `${month}-01`;

    const end = new Date(
      Number(month.slice(0, 4)),
      Number(month.slice(5, 7)),
      0
    ).getDate();

    const lastDate =
      `${month}-${String(end).padStart(2, '0')}`;

    await q(
      'DELETE FROM roster_entries WHERE work_date BETWEEN ? AND ?',
      [start, lastDate]
    );

    const [
      assignments,
      employees,
      leave,
      holidays
    ] = await Promise.all([
      q(`
        SELECT a.employee_id,a.process_id,
        p.operating_rule,p.min_staff,
        b.name brand_name,p.name process_name
        FROM assignments a
        JOIN processes p ON p.id=a.process_id
        JOIN brands b ON b.id=p.brand_id
        JOIN employees e ON e.id=a.employee_id
        WHERE e.active=1
      `),

      q('SELECT id,weekly_off FROM employees WHERE active=1'),

      q(`
        SELECT employee_id,
        DATE_FORMAT(date,'%Y-%m-%d') date,type
        FROM time_off
        WHERE status='APPROVED'
        AND date BETWEEN ? AND ?
      `, [start, lastDate]),

      q(`
        SELECT DATE_FORMAT(holiday_date,'%Y-%m-%d') date,name
        FROM public_holidays
        WHERE holiday_date BETWEEN ? AND ?
      `, [start, lastDate])
    ]);

    const empMap = new Map(
      employees.map(e => [e.id, e])
    );

    const leaveMap = new Map(
      leave.map(x => [
        `${x.employee_id}|${x.date}`,
        x.type
      ])
    );

    const holidayMap = new Map(
      holidays.map(x => [x.date, x.name])
    );

    const entries = [];
    const issues = [];

    const weekdays = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday'
    ];

    for (let day = 1; day <= end; day++) {
      const date =
        `${month}-${String(day).padStart(2, '0')}`;

      const dow = new Date(`${date}T00:00:00`).getDay();

      const coverage = new Map();

      for (const a of assignments) {
        const emp = empMap.get(a.employee_id);

        if (!emp) continue;

        const off =
          emp.weekly_off.toLowerCase() === weekdays[dow];

        const holiday = holidayMap.has(date);

        const operating =
          a.operating_rule === 'ALL_DAYS' ||
          (a.operating_rule === 'NO_HOLIDAYS' && !holiday) ||
          (a.operating_rule === 'WEEKDAYS' &&
            dow !== 0 && dow !== 6 && !holiday);

        let status = 'WORKING';
        let note = '';

        const absence = leaveMap.get(
          `${a.employee_id}|${date}`
        );

        if (absence) {
          status = absence === 'COMP_OFF'
            ? 'WEEKLY_OFF'
            : 'LEAVE';
          note = absence;
        } else if (off) {
          status = 'WEEKLY_OFF';
          note = 'Weekly off';
        } else if (holiday && a.operating_rule !== 'ALL_DAYS') {
          status = 'HOLIDAY';
          note = holidayMap.get(date);
        } else if (!operating) {
          status = 'HOLIDAY';
          note = 'Non-operating day';
        }

        entries.push([
          a.employee_id,
          a.process_id,
          date,
          status,
          note
        ]);

        if (operating && status === 'WORKING') {
          const key = a.process_id;

          coverage.set(
            key,
            (coverage.get(key) || 0) + 1
          );
        } else if (operating) {
          issues.push({
            date,
            brand: a.brand_name,
            process: a.process_name,
            employee: emp.name,
            message: `${emp.name} unavailable on an operating day`
          });
        }
      }

      for (const a of assignments) {
        const count = coverage.get(a.process_id) || 0;

        if (count < a.min_staff) {
          issues.push({
            date,
            brand: a.brand_name,
            process: a.process_name,
            message: `Coverage below minimum (${count}/${a.min_staff})`
          });
        }
      }
    }

    for (let i = 0; i < entries.length; i += 250) {
      const chunk = entries.slice(i, i + 250);

      const values = chunk
        .map(() => '(?,?,?,?,?)')
        .join(',');

      await q(`
        INSERT INTO roster_entries
        (employee_id,process_id,work_date,status,note)
        VALUES ${values}
      `, chunk.flat());
    }

    res.json({
      message: 'Roster generated',
      month,
      entries: entries.length,
      issues: issues.slice(0, 300),
      issueCount: issues.length
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

// VIEW MONTHLY ROSTER
app.get('/api/roster', async (req, res) => {
  try {
    const month = req.query.month;

    if (!month) {
      return res.status(400).json({
        error: 'month is required'
      });
    }

    res.json(await q(`
      SELECT r.*,
      e.name employee_name,
      b.name brand_name,
      p.name process_name
      FROM roster_entries r
      JOIN employees e ON e.id=r.employee_id
      JOIN processes p ON p.id=r.process_id
      JOIN brands b ON b.id=p.brand_id
      WHERE DATE_FORMAT(r.work_date,'%Y-%m')=?
      ORDER BY r.work_date,b.name,e.name
    `, [month]));

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// MANUAL ROSTER EDITING
app.patch('/api/roster/:id', async (req, res) => {
  try {
    const {
      status,
      note = 'Manual update'
    } = req.body;

    if (![
      'WORKING',
      'WEEKLY_OFF',
      'LEAVE',
      'HOLIDAY'
    ].includes(status)) {
      return res.status(400).json({
        error: 'Invalid status'
      });
    }

    await q(
      'UPDATE roster_entries SET status=?,note=? WHERE id=?',
      [status, note, req.params.id]
    );

    res.json({
      message: 'Roster updated. Regenerate/validate to review coverage.'
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('DataStraw API is running successfully!');
});

app.listen(port, () => {
  console.log(
    `DataStraw API running on http://localhost:${port}`
  );
});