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
    <div className="min-h-screen bg-gray-50">
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Professional Resume Generator</h1>
          <p className="text-gray-600 mt-2">Fill in your details to create a well-formatted resume</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Personal Details */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-gray-800">Personal Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange(e, "fullName")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange(e, "email")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange(e, "phone")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">GitHub</label>
                <input
                  type="url"
                  value={formData.github}
                  onChange={(e) => handleChange(e, "github")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://github.com/username"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">LinkedIn</label>
                <input
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) => handleChange(e, "linkedin")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-1 bg-green-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-gray-800">Skills</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Programming Languages</label>
                <input
                  type="text"
                  value={formData.skills.programmingLanguages}
                  onChange={(e) => handleChange(e, "skills.programmingLanguages")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Python, JavaScript, Java"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Technologies</label>
                <input
                  type="text"
                  value={formData.skills.technologies}
                  onChange={(e) => handleChange(e, "skills.technologies")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="React, Node.js, Docker"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tools</label>
                <input
                  type="text"
                  value={formData.skills.tools}
                  onChange={(e) => handleChange(e, "skills.tools")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="Git, VS Code, Jira"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Databases</label>
                <input
                  type="text"
                  value={formData.skills.databases}
                  onChange={(e) => handleChange(e, "skills.databases")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="MongoDB, PostgreSQL"
                />
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-1 bg-purple-500 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-gray-800">Education</h2>
            </div>
            {formData.education.map((edu, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">University</label>
                    <input
                      type="text"
                      value={edu.university}
                      onChange={(e) => handleChange(e, `education.${index}.university`)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => handleChange(e, `education.${index}.location`)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => handleChange(e, `education.${index}.degree`)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Graduation Date</label>
                    <input
                      type="text"
                      value={edu.graduationDate}
                      onChange={(e) => handleChange(e, `education.${index}.graduationDate`)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">GPA</label>
                    <input
                      type="text"
                      value={edu.gpa}
                      onChange={(e) => handleChange(e, `education.${index}.gpa`)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Coursework</label>
                  <textarea
                    value={edu.coursework}
                    onChange={(e) => handleChange(e, `education.${index}.coursework`)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    rows={3}
                  ></textarea>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove("education", index)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
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
              className="w-full bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Add Education
            </button>
          </section>

      {/* Experience */}
            {/* Experience */}
            <section className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-orange-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-gray-800">Experience</h2>
              </div>
              {formData.experience.map((exp, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => handleChange(e, `experience.${index}.company`)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => handleChange(e, `experience.${index}.location`)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => handleChange(e, `experience.${index}.position`)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => handleChange(e, `experience.${index}.duration`)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        placeholder="e.g., Jan 2020 - Present"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">Achievements</label>
                    {exp.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex gap-3">
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
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholder="Describe your achievement..."
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(`experience.${index}.achievements`, achievementIndex)
                          }
                          className="bg-red-100 text-red-600 px-4 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        handleAdd(`experience.${index}.achievements`, "")
                      }
                      className="mt-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors"
                    >
                      Add Achievement
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove("experience", index)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
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
                className="w-full bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Experience
              </button>
            </section>

            {/* Projects */}
            <section className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-indigo-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-gray-800">Projects</h2>
              </div>
              {formData.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Project Name</label>
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => handleChange(e, `projects.${index}.name`)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Technologies Used</label>
                      <input
                        type="text"
                        value={project.technologies}
                        onChange={(e) => handleChange(e, `projects.${index}.technologies`)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="e.g., React, Node.js, MongoDB"
                        required
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-gray-700">Project Link</label>
                      <input
                        type="url"
                        value={project.link}
                        onChange={(e) => handleChange(e, `projects.${index}.link`)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">Description Points</label>
                    {project.description.map((desc, descIndex) => (
                      <div key={descIndex} className="flex gap-3">
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
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="Describe your project..."
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleRemove(`projects.${index}.description`, descIndex)
                          }
                          className="bg-red-100 text-red-600 px-4 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        handleAdd(`projects.${index}.description`, "")
                      }
                      className="mt-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      Add Description Point
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove("projects", index)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
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
                className="w-full bg-indigo-500 text-white px-4 py-3 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Add Project
              </button>
            </section>

            {/* Responsibilities */}
            <section className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-teal-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-gray-800">Responsibilities</h2>
              </div>
              {formData.responsibilities.map((resp, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        value={resp.title}
                        onChange={(e) => handleChange(e, `responsibilities.${index}.title`)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Duration</label>
                      <input
                        type="text"
                        value={resp.duration}
                        onChange={(e) => handleChange(e, `responsibilities.${index}.duration`)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={resp.description}
                      onChange={(e) => handleChange(e, `responsibilities.${index}.description`)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      rows={3}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove("responsibilities", index)}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
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
                className="w-full bg-teal-500 text-white px-4 py-3 rounded-lg hover:bg-teal-600 transition-colors"
              >
                Add Responsibility
              </button>
            </section>

            {/* Additional Achievements */}
            <section className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-pink-500 rounded-full"></div>
                <h2 className="text-2xl font-semibold text-gray-800">Additional Achievements</h2>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={achievement}
                      onChange={(e) => handleArrayChange(e, "achievements", index)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all"
                      placeholder="Enter your achievement..."
                    />
                    <button
                      type="button"
                      onClick={() => handleRemove("achievements", index)}
                      className="bg-red-100 text-red-600 px-4 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAdd("achievements", "")}
                  className="w-full bg-pink-500 text-white px-4 py-3 rounded-lg hover:bg-pink-600 transition-colors"
                >
                  Add Achievement
                </button>
              </div>
            </section>

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
    </div>
      </div>
    </div>
  );
};

export default Home;