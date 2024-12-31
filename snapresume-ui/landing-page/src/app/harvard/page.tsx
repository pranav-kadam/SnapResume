"use client"
import { useState } from "react";

const Home = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    github: "",
    linkedin: "",
    education: [
      {
        university: "",
        location: "",
        degree: "",
        graduationDate: "",
        gpa: "",
        coursework: "",
      },
    ],
    skills: {
      programmingLanguages: "",
      technologies: "",
      tools: "",
      databases: "",
    },
    experience: [
      {
        company: "",
        location: "",
        position: "",
        duration: "",
        achievements: [""],
      },
    ],
    projects: [
      {
        name: "",
        technologies: "",
        link: "",
        description: [""],
      },
    ],
    responsibilities: [
      {
        title: "",
        duration: "",
        description: "",
      },
    ],
    achievements: [""],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    path: string
  ) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const obj: any = { ...prev };
      keys.reduce((acc, key, idx) => {
        if (idx === keys.length - 1) {
          acc[key] = e.target.value;
        }
        return acc[key];
      }, obj);
      return obj;
    });
  };

  const handleArrayChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    path: string,
    index: number
  ) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const obj: any = { ...prev };
      keys.reduce((acc, key, idx) => {
        if (idx === keys.length - 1) {
          acc[key][index] = e.target.value;
        }
        return acc[key];
      }, obj);
      return obj;
    });
  };

  const handleAdd = (path: string, newItem: any) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const obj: any = { ...prev };
      keys.reduce((acc, key, idx) => {
        if (idx === keys.length - 1) {
          acc[key].push(newItem);
        }
        return acc[key];
      }, obj);
      return obj;
    });
  };

  const handleRemove = (path: string, index: number) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const obj: any = { ...prev };
      keys.reduce((acc, key, idx) => {
        if (idx === keys.length - 1) {
          acc[key].splice(index, 1);
        }
        return acc[key];
      }, obj);
      return obj;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:8000/generate-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        // Get the PDF as a blob
        const blob = await response.blob();
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = 'resume.pdf'; // Set the download filename
        
        // Append to document, click, and cleanup
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Cleanup the URL
        window.URL.revokeObjectURL(url);
        
        alert("Resume downloaded successfully!");
      } else {
        const errorText = await response.text();
        console.error("Server error:", errorText);
        alert("Error generating resume. Please try again.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Failed to generate resume. Please check if the server is running and try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Resume Generator</h1>

      {/* Personal Details */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Personal Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange(e, "fullName")}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange(e, "email")}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange(e, "phone")}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium">GitHub</label>
            <input
              type="url"
              value={formData.github}
              onChange={(e) => handleChange(e, "github")}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block font-medium">LinkedIn</label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => handleChange(e, "linkedin")}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Skills</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-medium">Programming Languages</label>
            <input
              type="text"
              value={formData.skills.programmingLanguages}
              onChange={(e) => handleChange(e, "skills.programmingLanguages")}
              className="w-full p-2 border rounded"
              placeholder="e.g., Python, JavaScript, Java"
            />
          </div>
          <div>
            <label className="block font-medium">Technologies</label>
            <input
              type="text"
              value={formData.skills.technologies}
              onChange={(e) => handleChange(e, "skills.technologies")}
              className="w-full p-2 border rounded"
              placeholder="e.g., React, Node.js, Docker"
            />
          </div>
          <div>
            <label className="block font-medium">Tools</label>
            <input
              type="text"
              value={formData.skills.tools}
              onChange={(e) => handleChange(e, "skills.tools")}
              className="w-full p-2 border rounded"
              placeholder="e.g., Git, VS Code, Jira"
            />
          </div>
          <div>
            <label className="block font-medium">Databases</label>
            <input
              type="text"
              value={formData.skills.databases}
              onChange={(e) => handleChange(e, "skills.databases")}
              className="w-full p-2 border rounded"
              placeholder="e.g., MongoDB, PostgreSQL, MySQL"
            />
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Education</h2>
        {formData.education.map((edu, index) => (
          <div key={index} className="mb-4 border p-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">University</label>
                <input
                  type="text"
                  value={edu.university}
                  onChange={(e) => handleChange(e, `education.${index}.university`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Location</label>
                <input
                  type="text"
                  value={edu.location}
                  onChange={(e) => handleChange(e, `education.${index}.location`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Degree</label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => handleChange(e, `education.${index}.degree`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Graduation Date</label>
                <input
                  type="text"
                  value={edu.graduationDate}
                  onChange={(e) => handleChange(e, `education.${index}.graduationDate`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">GPA</label>
                <input
                  type="text"
                  value={edu.gpa}
                  onChange={(e) => handleChange(e, `education.${index}.gpa`)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-medium">Coursework</label>
              <textarea
                value={edu.coursework}
                onChange={(e) => handleChange(e, `education.${index}.coursework`)}
                className="w-full p-2 border rounded"
                rows={3}
              ></textarea>
            </div>
            <button
              type="button"
              onClick={() => handleRemove("education", index)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Education
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            handleAdd("education", {
              university: "",
              location: "",
              degree: "",
              graduationDate: "",
              gpa: "",
              coursework: "",
            })
          }
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Education
        </button>
      </div>

      {/* Experience */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Experience</h2>
        {formData.experience.map((exp, index) => (
          <div key={index} className="mb-4 border p-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => handleChange(e, `experience.${index}.company`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Location</label>
                <input
                  type="text"
                  value={exp.location}
                  onChange={(e) => handleChange(e, `experience.${index}.location`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Position</label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => handleChange(e, `experience.${index}.position`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Duration</label>
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) => handleChange(e, `experience.${index}.duration`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-medium">Achievements</label>
              {exp.achievements.map((achievement, achievementIndex) => (
                <div key={achievementIndex} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={achievement}
                    onChange={(e) =>
                      handleArrayChange(
                        e,
                        `experience.${index}.achievements`,
                        achievementIndex
                      )
                    }
                    className="flex-1 p-2 border rounded"
                    placeholder="Enter achievement"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(`experience.${index}.achievements`, achievementIndex)
                    }
                    className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleAdd(`experience.${index}.achievements`, "")
                }
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Add Achievement
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleRemove("experience", index)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Experience
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            handleAdd("experience", {
              company: "",
              location: "",
              position: "",
              duration: "",
              achievements: [""],
            })
          }
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Experience
        </button>
      </div>

      {/* Projects */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Projects</h2>
        {formData.projects.map((project, index) => (
          <div key={index} className="mb-4 border p-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Project Name</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => handleChange(e, `projects.${index}.name`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Technologies Used</label>
                <input
                  type="text"
                  value={project.technologies}
                  onChange={(e) => handleChange(e, `projects.${index}.technologies`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
              <label className="block font-medium">Project Link</label>
                <input
                  type="url"
                  value={project.link}
                  onChange={(e) => handleChange(e, `projects.${index}.link`)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-medium">Description Points</label>
              {project.description.map((desc, descIndex) => (
                <div key={descIndex} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) =>
                      handleArrayChange(
                        e,
                        `projects.${index}.description`,
                        descIndex
                      )
                    }
                    className="flex-1 p-2 border rounded"
                    placeholder="Enter project description"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleRemove(`projects.${index}.description`, descIndex)
                    }
                    className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
                  >
                    -
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  handleAdd(`projects.${index}.description`, "")
                }
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Add Description Point
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleRemove("projects", index)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Project
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            handleAdd("projects", {
              name: "",
              technologies: "",
              link: "",
              description: [""],
            })
          }
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Project
        </button>
      </div>

      {/* Responsibilities */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Responsibilities</h2>
        {formData.responsibilities.map((resp, index) => (
          <div key={index} className="mb-4 border p-4 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium">Title</label>
                <input
                  type="text"
                  value={resp.title}
                  onChange={(e) => handleChange(e, `responsibilities.${index}.title`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block font-medium">Duration</label>
                <input
                  type="text"
                  value={resp.duration}
                  onChange={(e) => handleChange(e, `responsibilities.${index}.duration`)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block font-medium">Description</label>
              <textarea
                value={resp.description}
                onChange={(e) => handleChange(e, `responsibilities.${index}.description`)}
                className="w-full p-2 border rounded"
                rows={3}
                required
              ></textarea>
            </div>
            <button
              type="button"
              onClick={() => handleRemove("responsibilities", index)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Remove Responsibility
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            handleAdd("responsibilities", {
              title: "",
              duration: "",
              description: "",
            })
          }
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Responsibility
        </button>
      </div>

      {/* Achievements */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Additional Achievements</h2>
        {formData.achievements.map((achievement, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={achievement}
              onChange={(e) => handleArrayChange(e, "achievements", index)}
              className="flex-1 p-2 border rounded"
              placeholder="Enter achievement"
            />
            <button
              type="button"
              onClick={() => handleRemove("achievements", index)}
              className="bg-red-500 text-white px-3 rounded hover:bg-red-600"
            >
              -
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAdd("achievements", "")}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Achievement
        </button>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Generate Resume
        </button>
      </div>
    </form>
  );
};

export default Home;