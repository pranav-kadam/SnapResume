from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware
import tempfile
import subprocess
import os
import logging

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data Models
class Education(BaseModel):
    school: str
    location: str
    degree: str
    graduation_date: str
    gpa: Optional[str]
    coursework: Optional[str]
    additional_info: Optional[str]

class TechnicalSkill(BaseModel):
    programming_languages: str
    libraries_frameworks: str
    databases: str
    devops_cloud: str
    developer_tools: str

class Project(BaseModel):
    name: str
    description: str

class Experience(BaseModel):
    company: str
    location: str
    position: str
    duration: str
    description: str

class Leadership(BaseModel):
    organization: str
    location: str
    position: str
    duration: str
    description: str

class ResumeData(BaseModel):
    full_name: str
    location: str
    email: str
    phone: str
    github: str
    education: List[Education]
    technical_skills: TechnicalSkill
    projects: List[Project]
    experience: List[Experience]
    leadership: List[Leadership]

def escape_latex(text: str) -> str:
    """Escape special LaTeX characters."""
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
    """Generate LaTeX content from resume data."""
    latex_content = r'''\documentclass[a4paper,10pt]{article}
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
    {\huge \textbf{''' + escape_latex(data.full_name) + r'''}} \\
    ''' + escape_latex(data.location) + r''' $\cdot$ ''' + escape_latex(data.email) + r''' $\cdot$ ''' + escape_latex(data.phone) + r''' $\cdot$ \href{https://github.com/''' + escape_latex(data.github) + r'''}{github.com/''' + escape_latex(data.github) + r'''}
\end{center}

% Education Section
\vspace*{-7mm}
\section*{\centering \medium Education}
\vspace*{-4mm}'''

    # Add Education entries
    for edu in data.education:
        latex_content += r'''
\textbf{''' + escape_latex(edu.school) + r'''}, ''' + escape_latex(edu.location) + r''' \hfill \textit{''' + escape_latex(edu.graduation_date) + r'''}\\
''' + escape_latex(edu.degree)
        if edu.gpa:
            latex_content += r''', GPA: ''' + escape_latex(edu.gpa)
        latex_content += r'''\\'''
        if edu.coursework:
            latex_content += r'''
Relevant Coursework: ''' + escape_latex(edu.coursework) + r'''\\'''
        if edu.additional_info:
            latex_content += escape_latex(edu.additional_info) + r'''\\'''

    # Technical Skills & Projects
    latex_content += r'''
\vspace*{-5mm}
\section*{\centering \medium Technical Skills \& Projects}
\vspace*{-4mm}
\textbf{Programming Languages:} ''' + escape_latex(data.technical_skills.programming_languages) + r'''\\
\textbf{Libraries/Frameworks:} ''' + escape_latex(data.technical_skills.libraries_frameworks) + r'''\\
\textbf{Databases:} ''' + escape_latex(data.technical_skills.databases) + r'''\\
\textbf{DevOps/Cloud:} ''' + escape_latex(data.technical_skills.devops_cloud) + r'''\\
\textbf{Developer Tools:} ''' + escape_latex(data.technical_skills.developer_tools) + r'''\\'''

    # Add Projects
    for project in data.projects:
        latex_content += r'''
\textbf{''' + escape_latex(project.name) + r''':}\\
''' + escape_latex(project.description) + r'''\\'''

    # Relevant Experience
    latex_content += r'''
\vspace*{-5mm}
\section*{\centering \medium Relevant Experience}
\vspace*{-4mm}'''

    for exp in data.experience:
        latex_content += r'''
\textbf{''' + escape_latex(exp.company) + r'''}, ''' + escape_latex(exp.location) + r''' \hfill \textit{''' + escape_latex(exp.duration) + r'''}\\
\textbf{''' + escape_latex(exp.position) + r'''}\\
''' + escape_latex(exp.description) + r'''\\'''

    # Leadership
    latex_content += r'''
\vspace*{-5mm}
\section*{\centering \medium Leadership}
\vspace*{-4mm}'''

    for lead in data.leadership:
        latex_content += r'''
\textbf{''' + escape_latex(lead.organization) + r'''}, ''' + escape_latex(lead.location) + r''' \hfill \textit{''' + escape_latex(lead.duration) + r'''}\\
\textbf{''' + escape_latex(lead.position) + r'''}\\
''' + escape_latex(lead.description) + r'''\\'''

    # Close the document
    latex_content += r'''
\end{document}'''

    return latex_content

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
@app.post("/generate-resume")
async def generate_resume(data: ResumeData):
    try:
        temp_dir = r"C:\Users\Pranav\Desktop\PROJECT\tests\temp"  # Fixed string formatting
        os.makedirs(temp_dir, exist_ok=True)

        latex_content = generate_latex(data)
        
        tex_path = os.path.join(temp_dir, "resume.tex")
        try:
            with open(tex_path, "w", encoding="utf-8") as f:
                f.write(latex_content)
        except Exception as e:
            logger.error(f"Failed to write TEX file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to write TEX file: {str(e)}")
        
        for i in range(2):
            try:
                process = subprocess.run(
                    ["pdflatex", "-interaction=nonstopmode", tex_path],
                    cwd=temp_dir,
                    capture_output=True,
                    text=True,
                    check=True
                )
                logger.debug(f"PDFLaTeX run {i+1} output: {process.stdout}")
            except subprocess.CalledProcessError as e:
                logger.error(f"PDFLaTeX failed: {e.stderr}")
                raise HTTPException(status_code=500, detail=f"PDF generation failed: {e.stderr}")
            except FileNotFoundError:
                logger.error("pdflatex command not found")
                raise HTTPException(status_code=500, detail="pdflatex is not installed on the server")
        
        pdf_path = os.path.join(temp_dir, "resume.pdf")
        
        if not os.path.exists(pdf_path):
            logger.error("PDF file was not generated")
            raise HTTPException(status_code=500, detail="PDF file was not generated")
        
        try:
            with open(pdf_path, "rb") as f:
                pdf_content = f.read()
        except Exception as e:
            logger.error(f"Failed to read PDF file: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to read PDF file: {str(e)}")
        
        try:
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
            logger.error(f"Failed to create response: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to create response: {str(e)}")
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")