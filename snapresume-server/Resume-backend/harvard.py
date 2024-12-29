from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import subprocess
import os
from typing import Optional

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict to your domain for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Updated models
class Experience(BaseModel):
    company: str
    location: str
    position: str
    duration: str
    achievements: List[str]

class Project(BaseModel):
    name: str
    technologies: str
    link: str
    description: List[str]

class Skills(BaseModel):
    programmingLanguages: str
    technologies: str
    tools: str
    databases: str  # Added databases field

class Education(BaseModel):
    university: str
    location: str
    degree: str
    graduationDate: str
    gpa: Optional[str] = ""
    coursework: Optional[str] = ""

class Responsibility(BaseModel):
    title: str
    duration: str
    description: str

class ResumeData(BaseModel):
    fullName: str
    email: str
    phone: str
    github: str
    linkedin: str
    experience: List[Experience]
    projects: List[Project]
    skills: Skills
    education: List[Education]  # Changed to List
    responsibilities: List[Responsibility]
    achievements: List[str]

def escape_latex(text: str) -> str:
    chars = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\^{}',
        '\\': r'\textbackslash{}',
    }
    return ''.join(chars.get(c, c) for c in str(text))

def generate_latex(data: ResumeData) -> str:
    latex_content = r'''
\documentclass[a4paper,10pt]{article}
\usepackage[margin=1in]{geometry}
\usepackage{hyperref}
\usepackage{xcolor}
\usepackage{enumitem}
\setlength{\parindent}{0pt}
\setlength{\parskip}{6pt}

\begin{document}

% Name and Contact Information
\vspace*{-25mm}
\begin{center}
    {\huge \textbf{''' + escape_latex(data.fullName) + r'''}} \\
    ''' + escape_latex(data.email) + r''' $\cdot$ ''' + escape_latex(data.phone) + r''' $\cdot$ \href{https://github.com/''' + escape_latex(data.github) + r'''}{github.com/''' + escape_latex(data.github) + r'''} $\cdot$ \href{https://linkedin.com/in/''' + escape_latex(data.linkedin) + r'''}{linkedin.com/in/''' + escape_latex(data.linkedin) + r'''}
\end{center}

% Education Section
\vspace*{-7mm}
\section*{\centering Education}
\vspace*{-4mm}'''

    for edu in data.education:
        gpa = f", GPA: {escape_latex(edu.gpa)}" if edu.gpa else ""
        latex_content += r'''
\textbf{''' + escape_latex(edu.university) + r'''}''' + (r''', ''' + escape_latex(edu.location) if edu.location else '') + r''' \hfill \textit{''' + escape_latex(edu.graduationDate) + r'''}\\
''' + escape_latex(edu.degree) + gpa + r'''\\
Relevant Coursework: ''' + escape_latex(edu.coursework) + r'''
'''

    latex_content += r'''
% Technical Skills & Projects
\vspace*{-5mm}
\section*{\centering Technical Skills \& Projects}
\vspace*{-4mm}
\textbf{Programming Languages:} ''' + escape_latex(data.skills.programmingLanguages) + r'''\\
\textbf{Technologies/Frameworks:} ''' + escape_latex(data.skills.technologies) + r'''\\
\textbf{Databases:} ''' + escape_latex(data.skills.databases) + r'''\\
\textbf{Developer Tools:} ''' + escape_latex(data.skills.tools) + r'''
'''

    for project in data.projects:
        latex_content += r'''
\textbf{''' + escape_latex(project.name) + r''':}\\
''' + escape_latex(project.technologies) + r'''\\
''' + escape_latex(project.link) + r'''\\
\begin{itemize}[noitemsep, topsep=0pt]
'''
        for desc in project.description:
            latex_content += r'''\item ''' + escape_latex(desc) + r'''
'''
        latex_content += r'''\end{itemize}
'''

    latex_content += r'''
% Relevant Experience
\vspace*{-5mm}
\section*{\centering Relevant Experience}
\vspace*{-4mm}'''

    for exp in data.experience:
        latex_content += r'''
\textbf{''' + escape_latex(exp.company) + r'''}''' + (', ' + escape_latex(exp.location) if exp.location else '') + r''' \hfill \textit{''' + escape_latex(exp.duration) + r'''}\\
\textbf{''' + escape_latex(exp.position) + r'''}\\
\begin{itemize}[noitemsep, topsep=0pt]
'''
        for achievement in exp.achievements:
            latex_content += r'''\item ''' + escape_latex(achievement) + r'''
'''
        latex_content += r'''\end{itemize}
'''

    latex_content += r'''
% Leadership
\vspace*{-5mm}
\section*{\centering Leadership}
\vspace*{-4mm}'''

    for resp in data.responsibilities:
        latex_content += r'''
\textbf{''' + escape_latex(resp.title) + r'''} \hfill \textit{''' + escape_latex(resp.duration) + r'''}\\
\begin{itemize}[noitemsep, topsep=0pt]
\item ''' + escape_latex(resp.description) + r'''
\end{itemize}
'''

    latex_content += r'''
\end{document}'''

    return latex_content


@app.post("/generate-resume")
async def generate_resume(data: ResumeData):
    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            latex_content = generate_latex(data)
            
            tex_path = os.path.join(temp_dir, "resume.tex")
            with open(tex_path, "w", encoding="utf-8") as f:
                f.write(latex_content)
            
            for _ in range(2):
                process = subprocess.run(
                    ["pdflatex", "-interaction=nonstopmode", tex_path],
                    cwd=temp_dir,
                    capture_output=True,
                    text=True
                )
            
            if process.returncode != 0:
                error_message = f"LaTeX compilation failed: {process.stderr}"
                print(error_message)
                raise HTTPException(status_code=500, detail="PDF generation failed due to LaTeX errors.")
            
            pdf_path = os.path.join(temp_dir, "resume.pdf")
            
            if not os.path.exists(pdf_path):
                raise HTTPException(
                    status_code=500,
                    detail="PDF file was not generated"
                )
            
            with open(pdf_path, "rb") as f:
                pdf_content = f.read()
            
            temp_pdf = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
            temp_pdf.write(pdf_content)
            temp_pdf.close()
            
            return FileResponse(
                temp_pdf.name,
                media_type="application/pdf",
                filename="resume.pdf",
                background=None
            )
    
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
