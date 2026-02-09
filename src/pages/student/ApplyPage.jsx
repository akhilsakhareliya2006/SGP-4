import { useOutletContext } from "react-router-dom";

function ApplyPage() {
  const { student } = useOutletContext();

  const jobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "Tech Solutions Pvt Ltd",
      salary: "₹6 – 8 LPA",
      location: "Bangalore, India",
      dueDate: "30 Sep 2026",
    },
    {
      id: 2,
      title: "Backend Developer",
      company: "Innovate Labs",
      salary: "₹5 – 7 LPA",
      location: "Pune, India",
      dueDate: "15 Oct 2026",
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      salary: "₹7 – 10 LPA",
      location: "Remote",
      dueDate: "10 Oct 2026",
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      salary: "₹7 – 10 LPA",
      location: "Remote",
      dueDate: "10 Oct 2026",
    },
    {
      id: 3,
      title: "Full Stack Engineer",
      company: "CloudWorks",
      salary: "₹7 – 10 LPA",
      location: "Remote",
      dueDate: "10 Oct 2026",
    },
  ];

  return (
    <div className="apply-page">
      <h2 className="page-title">Apply for Jobs</h2>

      <div className="job-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card-gradient">
            {/* LEFT */}
            <div className="job-left">
              <h3 className="job-title">{job.title}</h3>
              <p className="job-company">{job.company}</p>

              <div className="job-info">
                <div className="info-row">
                  <span className="info-label">Salary:</span>
                  <span className="info-value">{job.salary}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Location:</span>
                  <span className="info-value">{job.location}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Last Date:</span>
                  <span className="info-value">{job.dueDate}</span>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="job-right">
              <button className="apply-btn-gradient">Apply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApplyPage;
