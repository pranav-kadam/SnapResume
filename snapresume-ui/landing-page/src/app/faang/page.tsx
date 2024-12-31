"use client"
import React, { useState } from 'react';

interface Education {
  university: string;
  location: string;
  degree: string;
  graduationDate: string;
  gpa?: string;
  coursework?: string;
}

interface Skills {
  programmingLanguages: string;
  technologies: string;
  tools: string;
  databases: string;
}

interface Experience {
  company: string;
  location: string;
  position: string;
  duration: string;
  achievements: string[];
}

interface Project {
  name: string;
  technologies: string;
  link: string;
  description: string[];
}

interface Leadership {
  title: string;
  duration: string;
  description: string;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  education: Education[];
  skills: Skills;
  experience: Experience[];
  projects: Project[];
  responsibilities: Leadership[];
}

export default function ResumeForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    education: [{
      university: '',
      location: '',
      degree: '',
      graduationDate: '',
      gpa: '',
      coursework: ''
    }],
    skills: {
      programmingLanguages: '',
      technologies: '',
      tools: '',
      databases: ''
    },
    experience: [{
      company: '',
      location: '',
      position: '',
      duration: '',
      achievements: ['']
    }],
    projects: [{
      name: '',
      technologies: '',
      link: '',
      description: ['']
    }],
    responsibilities: [{
      title: '',
      duration: '',
      description: ''
    }]
  });

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...prev.education, {
        university: '',
        location: '',
        degree: '',
        graduationDate: '',
        gpa: '',
        coursework: ''
      }]
    }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        company: '',
        location: '',
        position: '',
        duration: '',
        achievements: ['']
      }]
    }));
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, {
        name: '',
        technologies: '',
        link: '',
        description: ['']
      }]
    }));
  };

  const addResponsibility = () => {
    setFormData(prev => ({
      ...prev,
      responsibilities: [...prev.responsibilities, {
        title: '',
        duration: '',
        description: ''
      }]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8000/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Error:', error);
      alert('Error generating resume. Please try again.');
    }
  };

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }));
  };

  return (
    <div className="bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Resume Generator</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.fullName}
                onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Full Name"
                className="border p-2 rounded"
                required
              />
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
                className="border p-2 rounded"
                required
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                value={formData.github}
                onChange={e => setFormData(prev => ({ ...prev, github: e.target.value }))}
                placeholder="GitHub Username"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                value={formData.linkedin}
                onChange={e => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="LinkedIn Username"
                className="border p-2 rounded"
                required
              />
            </div>
          </div>

          {/* Education */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="border p-4 rounded mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={edu.university}
                    onChange={e => updateEducation(index, 'university', e.target.value)}
                    placeholder="University"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={edu.location}
                    onChange={e => updateEducation(index, 'location', e.target.value)}
                    placeholder="Location"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={e => updateEducation(index, 'degree', e.target.value)}
                    placeholder="Degree"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={edu.graduationDate}
                    onChange={e => updateEducation(index, 'graduationDate', e.target.value)}
                    placeholder="Graduation Date"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={edu.gpa}
                    onChange={e => updateEducation(index, 'gpa', e.target.value)}
                    placeholder="GPA (optional)"
                    className="border p-2 rounded"
                  />
                  <input
                    type="text"
                    value={edu.coursework}
                    onChange={e => updateEducation(index, 'coursework', e.target.value)}
                    placeholder="Relevant Coursework"
                    className="border p-2 rounded"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addEducation}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Education
            </button>
          </div>

          {/* Skills */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>
            <div className="grid grid-cols-1 gap-4">
              <input
                type="text"
                value={formData.skills.programmingLanguages}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  skills: { ...prev.skills, programmingLanguages: e.target.value }
                }))}
                placeholder="Programming Languages"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                value={formData.skills.technologies}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  skills: { ...prev.skills, technologies: e.target.value }
                }))}
                placeholder="Technologies/Frameworks"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                value={formData.skills.tools}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  skills: { ...prev.skills, tools: e.target.value }
                }))}
                placeholder="Developer Tools"
                className="border p-2 rounded"
                required
              />
              <input
                type="text"
                value={formData.skills.databases}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  skills: { ...prev.skills, databases: e.target.value }
                }))}
                placeholder="Databases"
                className="border p-2 rounded"
                required
              />
            </div>
          </div>

          {/* Experience */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="border p-4 rounded mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={e => updateExperience(index, 'company', e.target.value)}
                    placeholder="Company"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={exp.location}
                    onChange={e => updateExperience(index, 'location', e.target.value)}
                    placeholder="Location"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={exp.position}
                    onChange={e => updateExperience(index, 'position', e.target.value)}
                    placeholder="Position"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={exp.duration}
                    onChange={e => updateExperience(index, 'duration', e.target.value)}
                    placeholder="Duration"
                    className="border p-2 rounded"
                    required
                  />
                </div>
                <div className="mt-4">
                  <textarea
                    value={exp.achievements.join('\n')}
                    onChange={e => updateExperience(index, 'achievements', e.target.value.split('\n'))}
                    placeholder="Achievements (one per line)"
                    className="border p-2 rounded w-full h-32"
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addExperience}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Experience
            </button>
          </div>

          {/* Projects */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>
            {formData.projects.map((project, index) => (
              <div key={index} className="border p-4 rounded mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={project.name}
                    onChange={e => updateProject(index, 'name', e.target.value)}
                    placeholder="Project Name"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={project.technologies}
                    onChange={e => updateProject(index, 'technologies', e.target.value)}
                    placeholder="Technologies Used"
                    className="border p-2 rounded"
                    required
                  />
                  <input
                    type="text"
                    value={project.link}
                    onChange={e => updateProject(index, 'link', e.target.value)}
                    placeholder="Project Link"
                    className="border p-2 rounded"
                    required
                  />
                </div>
                <div className="mt-4">
                  <textarea
                    value={project.description.join('\n')}
                    onChange={e => updateProject(index, 'description', e.target.value.split('\n'))}
                    placeholder="Project Description (one point per line)"
                    className="border p-2 rounded w-full h-32"
                    required
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addProject}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Project
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600">
            Generate Resume
          </button>
        </form>
      </div>
    </div>
  );
}