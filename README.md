#### Configuration
Create local.json to override default.json on /config

#### How to run
- Run the migration script on mysql db
- Run the program with `npm run start`

#### Route docs
All routes except login require Authorization header with token obtained after logging in

- Login:
    * POST /companies/login; email*, password*
    * POST /applicants/login; email*, password*
- Registration:
    * POST /companies; email*, password*, name*, category*, type*, size*, city*, description
    * POST /applicants: email*, password*, name*
- Company:
    * POST /jobs; name*, job_function*, job_type*, city*, min_salary, max_salary, min_experience, max_experience, vacancies, open, publish, description, requirement, responsibility, culture
    * PATCH /jobs/:id; fields same as above, will update fields that are provided
    * GET /companies/:id/jobs; q, city, job_type, min_salary, min_experience, page, company
    * GET /jobs/:id/applicants;
    * POST /job-applicants/:id/accept;
    * POST /job-applicants/:id/complete;
    * POST /job-applicants/:id/reject;
- Applicant:
    * POST /jobs/:id/apply; cv_url*, linkedin
- All:
    * GET /jobs; q, city, job_type, min_salary, min_experience, page, company