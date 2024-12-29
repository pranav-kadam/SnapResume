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
    allow_origins=["*"],
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
    gpa: str
    coursework: str

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
\documentclass[11pt,a4paper]{article}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{hyperref}
\usepackage[usenames,dvipsnames]{color}
\usepackage{enumitem}
\usepackage[english]{babel}
\usepackage{tabularx}
\usepackage{fontawesome5}
\usepackage{multicol}
\usepackage{latexsym}
\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}

\titleformat{\section}{\vspace{-4pt}\scshape\raggedright\large}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\newcommand{\resumeItem}[1]{\item\small{{#1 \vspace{-2pt}}}}

\newcommand{\resumeSubheading}[4]{
    \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
        \textbf{#1} & #2 \\
        \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
        \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\responsibilityItem}[3]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
        \textbf{#1} & \textit{#2} \\
        \small#3 & \\
    \end{tabular*}\vspace{-7pt}
}

\begin{document}

% Personal Information
\begin{center}
    {\Huge \textbf{''' + escape_latex(data.fullName) + r'''}} \\
    \vspace{3pt}
    \small
    \faEnvelope\ \href{mailto:''' + escape_latex(data.email) + r'''}{''' + escape_latex(data.email) + r'''} $|$
    \faPhone\ ''' + escape_latex(data.phone) + r''' $|$
    \faGithub\ \href{https://github.com/''' + escape_latex(data.github) + r'''}{github.com/''' + escape_latex(data.github) + r'''} $|$
    \faLinkedin\ \href{https://linkedin.com/in/''' + escape_latex(data.linkedin) + r'''}{linkedin.com/in/''' + escape_latex(data.linkedin) + r'''}
\end{center}

% Experience Section
\section{Experience}
\begin{itemize}[leftmargin=*]'''

    for exp in data.experience:
        if exp.company and exp.position:
            latex_content += r'''
    \resumeSubheading
        {''' + escape_latex(exp.company) + r'''}{''' + escape_latex(exp.location) + r'''}
        {''' + escape_latex(exp.position) + r'''}{''' + escape_latex(exp.duration) + r'''}
    \begin{itemize}'''
            
            for achievement in exp.achievements:
                if achievement.strip():
                    latex_content += r'''
        \resumeItem{''' + escape_latex(achievement) + r'''}'''
            
            latex_content += r'''
    \end{itemize}'''

    latex_content += r'''
\end{itemize}

% Skills Section
\section{Skills}
\begin{itemize}[leftmargin=*]
    \item{
        \textbf{Programming Languages}: ''' + escape_latex(data.skills.programmingLanguages) + r'''
    }
    \item{
        \textbf{Technologies/Frameworks}: ''' + escape_latex(data.skills.technologies) + r'''
    }
    \item{
        \textbf{Databases}: ''' + escape_latex(data.skills.databases) + r'''
    }
    \item{
        \textbf{Developer Tools}: ''' + escape_latex(data.skills.tools) + r'''
    }
\end{itemize}

% Education Section
\section{Education}
\begin{itemize}[leftmargin=*]'''

    # Modified to handle multiple education entries
    for edu in data.education:
        latex_content += r'''
    \resumeSubheading
        {''' + escape_latex(edu.university) + r'''}{''' + escape_latex(edu.location) + r'''}
        {''' + escape_latex(edu.degree) + r'''}{''' + escape_latex(edu.graduationDate) + r'''}
    \resumeItem{GPA: ''' + escape_latex(edu.gpa) + r'''}
    \resumeItem{Relevant Coursework: ''' + escape_latex(edu.coursework) + r'''}'''

    latex_content += r'''
\end{itemize}'''

    # Projects Section
    if data.projects and any(p.name for p in data.projects):
        latex_content += r'''
\section{Technical Projects}
\begin{itemize}[leftmargin=*]'''
        
        for project in data.projects:
            if project.name:
                latex_content += r'''
    \resumeProjectHeading
        {\textbf{''' + escape_latex(project.name) + r'''} $|$ \emph{''' + escape_latex(project.technologies) + r'''}}
        {''' + escape_latex(project.link) + r'''}'''
                
                for desc in project.description:
                    if desc.strip():
                        latex_content += r'''
    \resumeItem{''' + escape_latex(desc) + r'''}'''
        
        latex_content += r'''
\end{itemize}'''

    # Responsibilities Section
    if data.responsibilities and any(r.title for r in data.responsibilities):
        latex_content += r'''
\section{Positions of Responsibility}
\begin{itemize}[leftmargin=*]'''
        
        for resp in data.responsibilities:
            if resp.title:
                latex_content += r'''
    \responsibilityItem
        {''' + escape_latex(resp.title) + r'''}{''' + escape_latex(resp.duration) + r'''}
        {''' + escape_latex(resp.description) + r'''}'''
        
        latex_content += r'''
\end{itemize}'''

    # Achievements Section
    if data.achievements and any(a.strip() for a in data.achievements):
        latex_content += r'''
\section{Achievements}
\begin{itemize}[leftmargin=*]'''
        
        for achievement in data.achievements:
            if achievement.strip():
                latex_content += r'''
    \resumeItem{''' + escape_latex(achievement) + r'''}'''
        
        latex_content += r'''
\end{itemize}'''

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
                print("LaTeX Error:", process.stderr)
                raise HTTPException(
                    status_code=500,
                    detail=f"PDF generation failed: {process.stderr}"
                )
            
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