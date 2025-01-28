from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import shutil
import re
from github import Github
import base64
from dotenv import load_dotenv
import requests
import time

# Load environment variables
load_dotenv()

# Define the app
app = FastAPI()

ORIGINAL_FOLDER = "../../../snapresume-ui/portfolio-demos/templates/"
OUTPUT_FOLDER = "../../../snapresume-ui/portfolio-demos/samples/"
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

# Initialize GitHub
g = Github(GITHUB_TOKEN)

# JSON Input Model
class UserData(BaseModel):
    fullName: str
    email: str
    phone: str
    github: str
    linkedin: str
    experience: list[dict]
    projects: list[dict]

def deploy_to_github_pages(owner: str, repo_name: str):
    """Deploy repository to GitHub Pages using the GitHub API."""
    try:
        # GitHub API endpoint for Pages deployment
        url = f"https://api.github.com/repos/{owner}/{repo_name}/pages"
        
        headers = {
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {GITHUB_TOKEN}",
            "X-GitHub-Api-Version": "2022-11-28"
        }
        
        # First, configure GitHub Pages settings
        config_data = {
            "source": {
                "branch": "main",
                "path": "/"
            }
        }
        
        # Configure Pages settings
        response = requests.post(url, headers=headers, json=config_data)
        
        if response.status_code not in [201, 204]:
            raise Exception(f"Failed to configure GitHub Pages: {response.status_code} - {response.text}")
        
        # Wait for the configuration to take effect
        time.sleep(5)
        
        # Create deployment
        deploy_url = f"{url}/deployments"
        deploy_data = {
            "pages_build_version": "main",
            "environment": "github-pages"
        }
        
        deploy_response = requests.post(deploy_url, headers=headers, json=deploy_data)
        
        if deploy_response.status_code not in [200, 201]:
            raise Exception(f"Failed to create deployment: {deploy_response.status_code} - {deploy_response.text}")
        
        # Return the Pages URL
        return f"https://{owner}.github.io/{repo_name}"
    
    except Exception as e:
        raise Exception(f"Error deploying to GitHub Pages: {str(e)}")

def create_github_repo(user_name: str, local_folder: str):
    """Create a new GitHub repository, upload files, and enable GitHub Pages."""
    try:
        # Create a new repository
        user = g.get_user()
        repo_name = f"{user_name.replace(' ', '-').lower()}-portfolio"
        repo = user.create_repo(
            repo_name,
            description=f"Portfolio website for {user_name}",
            homepage="",
            private=False,
            has_issues=True,
            has_projects=True,
            has_wiki=True
        )

        # Upload all files from the local folder
        for root, dirs, files in os.walk(local_folder):
            for file in files:
                file_path = os.path.join(root, file)
                relative_path = os.path.relpath(file_path, local_folder)
                
                with open(file_path, 'rb') as file_content:
                    content = file_content.read()
                content_encoded = base64.b64encode(content).decode()
                
                repo.create_file(
                    path=relative_path,
                    message=f"Add {relative_path}",
                    content=content_encoded,
                    branch="main"
                )

        # Deploy to GitHub Pages
        pages_url = deploy_to_github_pages(user.login, repo_name)

        return {
            "repo_url": repo.html_url,
            "git_url": repo.clone_url,
            "pages_url": pages_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating GitHub repository: {str(e)}")

def update_html(json_data: dict, file_path: str):
    """Update HTML template with user data."""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            html_content = file.read()

        # Replace basic information
        replacements = {
            r'John Doe': json_data.get("fullName", "John Doe"),
            r'john.doe@example.com': json_data.get("email", "john.doe@example.com"),
            r'\(555\) 123-4567': json_data.get("phone", "(555) 123-4567"),
            r'github.com/johndoe': f'github.com/{json_data.get("github", "johndoe")}',
            r'linkedin.com/in/johndoe': f'linkedin.com/in/{json_data.get("linkedin", "johndoe")}'
        }

        for pattern, replacement in replacements.items():
            html_content = re.sub(pattern, replacement, html_content)

        # Generate experience section
        experience_html = ""
        for exp in json_data.get("experience", []):
            achievements = "".join(f"<li>{ach}</li>" for ach in exp.get("achievements", []))
            experience_html += f"""
            <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="text-xl font-bold">{exp.get('position', '')}</h3>
                        <p class="text-gray-600">{exp.get('company', '')} - {exp.get('location', '')}</p>
                    </div>
                    <p class="text-gray-600">{exp.get('duration', '')}</p>
                </div>
                <ul class="mt-4 list-disc pl-5">{achievements}</ul>
            </div>
            """

        # Replace experience section
        experience_section = f'''
        <section id="experience" class="py-20">
            <div class="max-w-6xl mx-auto px-4">
                <h2 class="text-3xl font-bold mb-8 text-center">Experience</h2>
                {experience_html}
            </div>
        </section>
        '''
        html_content = re.sub(
            r'(?s)<section id="experience".*?</section>',
            experience_section,
            html_content
        )

        # Generate projects section
        projects_html = ""
        for project in json_data.get("projects", []):
            description = "".join(f"<li>{desc}</li>" for desc in project.get("description", []))
            projects_html += f"""
            <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h3 class="text-xl font-bold mb-2">{project.get('name', '')}</h3>
                <p class="text-gray-600 mb-4">Technologies: {project.get('technologies', '')}</p>
                <ul class="list-disc pl-5 mb-4">{description}</ul>
                <a href="{project.get('link', '#')}" target="_blank" class="text-blue-600 hover:text-blue-800">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
            </div>
            """

        # Replace projects section
        projects_section = f'''
        <section id="projects" class="py-20 bg-gray-50">
            <div class="max-w-6xl mx-auto px-4">
                <h2 class="text-3xl font-bold mb-8 text-center">Projects</h2>
                {projects_html}
            </div>
        </section>
        '''
        html_content = re.sub(
            r'(?s)<section id="projects".*?</section>',
            projects_section,
            html_content
        )

        # Save the updated HTML content
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(html_content)

    except Exception as e:
        raise Exception(f"Error updating HTML: {str(e)}")

@app.post("/generate")
async def generate_portfolio(user_data: UserData):
    """Generate portfolio website and deploy to GitHub Pages."""
    try:
        # Create output folder
        user_output_folder = os.path.join(OUTPUT_FOLDER, user_data.fullName.replace(" ", "_"))
        if os.path.exists(user_output_folder):
            shutil.rmtree(user_output_folder)
        shutil.copytree(ORIGINAL_FOLDER, user_output_folder)

        # Update HTML template
        index_path = os.path.join(user_output_folder, "index.html")
        update_html(user_data.dict(), index_path)
        
        # Create GitHub repository and deploy
        github_info = create_github_repo(user_data.fullName, user_output_folder)
        
        return {
            "message": "Portfolio generated and deployed successfully!",
            "folder": user_output_folder,
            "github_repo_url": github_info["repo_url"],
            "git_clone_url": github_info["git_url"],
            "github_pages_url": github_info["pages_url"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating portfolio: {str(e)}")

# Run with: uvicorn main:app --reload