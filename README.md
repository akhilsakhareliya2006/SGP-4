Project Title
*
CampusHire – A Unified College–Company Hiring and Collaboration Platform
Domain of Project
*
Education Technology (EdTech),Campus Placement Management Systems
Problem Statement:
*
Traditional campus hiring in India suffers from fragmented communication between colleges, students, and companies. Job postings are often shared manually, approval workflows are unstructured, mentor assignment is inconsistent, and application tracking is prone to errors. There is no unified platform where:  companies can send collaboration or job requests,  colleges can approve and assign mentors,  students can apply seamlessly,  all stakeholders can track the hiring workflow.
Project Objectives and Scope:

*
Objectives:-
1.To build an integrated portal connecting companies, colleges, and students for internship and job hiring processes.

2.To automate workflows such as:

college–company collaboration requests,
job posting approval,
mentor assignment,
student applications,
interview scheduling,
final hiring and certificate issuance.

3.To enable students to onboard quickly through CSV-based bulk upload, profile completion

4.To ensure secure authentication and authorization across roles:
companyAdmin, collegeAdmin, mentor, employee, student.

Scope:-
1.Collaboration request workflow between colleges and companies.
2.Job posting, approval, and mentor assignment.
3.Student application submission and mentor review.
4.Interview scheduling and hiring decisions.
5.Skill–job matching for better recommendations.
Background Study of Existing System
*
Most Indian colleges rely on manual placement workflows, including:
-job postings shared via WhatsApp or email,
-student lists maintained on spreadsheets,
-mentor assignments done informally,
-no centralized application tracking system.

Existing portals like Internshala, Naukri, or college ERP systems do not provide:
-mentor-driven approval workflows,
-college-company collaboration logic,
-multi-role permission structures tailored to campus hiring,
-institution-controlled job approval flows.
Methodology and Approach:
*
1.Requirement Analysis
Identify workflows for each user type and convert them into APIs and database models.

2.System Design
ER diagrams, user role mapping, authorization trees.
Prisma-based relational schema (User, Mentor, Employee, Job, Application, Interview, Certificate, Collab, etc.).

3.Backend Development
Node.js + Express.js
JWT authentication (access + refresh tokens)
Strong role-based access control
Prisma ORM with PostgreSQL

4.Frontend Integration
Web dashboard for companies and colleges (React)
Innovation and Originality
*
1.Three-way hiring workflow: Student ⇄ College ⇄ Company
Unlike standard job portals, colleges have control over approvals and mentor assignment.

2.CSV-based student onboarding
Enables bulk user creation with auto-password generation and a profile-completion workflow.

3.Mentor-driven approval system
Applications pass through mentors before reaching companies.

4.Dynamic collaboration model
Companies must collaborate with colleges before posting jobs—unlike any existing platform.

5.Granular role-based permissions
Each user role has precise access boundaries, implementing security and real-world constraints.