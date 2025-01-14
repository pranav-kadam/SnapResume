from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import shutil
import re
from github import Github
import base64
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Define the app
app = FastAPI()

ORIGINAL_FOLDER = "../../../snapresume-ui/portfolio-demos/templates/"
OUTPUT_FOLDER = "../../../snapresume-ui/portfolio-demos/samples/"
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')  # Add this to your .env file

# Initialize GitHub
g = Github(GITHUB_TOKEN)

# JSON Input Model
class UserData(BaseModel):
    fullName: str
    email: str
    phone: str
    github: str
    linkedin: str
    experience: list[dict]  # List of experience objects
    projects: list[dict]    # List of project objects

def create_github_repo(user_name: str, local_folder: str):
    """Create a new GitHub repository and upload files."""
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
                # Get the full path of the file
                file_path = os.path.join(root, file)
                
                # Calculate the relative path for GitHub
                relative_path = os.path.relpath(file_path, local_folder)
                
                # Read the file content
                with open(file_path, 'rb') as file_content:
                    content = file_content.read()
                
                # Convert binary content to base64
                content_encoded = base64.b64encode(content).decode()
                
                # Create or update file in the repository
                repo.create_file(
                    path=relative_path,
                    message=f"Add {relative_path}",
                    content=content_encoded,
                    branch="main"
                )

        return {
            "repo_url": repo.html_url,
            "git_url": repo.clone_url
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating GitHub repository: {e}")

# Function to replace placeholders in the HTML file
def update_html(json_data, file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        html_content = file.read()

    # Replace relevant placeholders with JSON data
    html_content = re.sub(r'John Doe', json_data.get("fullName", "John Doe"), html_content)
    html_content = re.sub(r'john.doe@example.com', json_data.get("email", "john.doe@example.com"), html_content)
    html_content = re.sub(r'\(555\) 123-4567', json_data.get("phone", "(555) 123-4567"), html_content)
    html_content = re.sub(r'github.com/johndoe', f'github.com/{json_data.get("github", "johndoe")}', html_content)
    html_content = re.sub(r'linkedin.com/in/johndoe', f'linkedin.com/in/{json_data.get("linkedin", "johndoe")}', html_content)

    # Replace experience section dynamically
    experience_html = ""
    for exp in json_data.get("experience", []):
        achievements = "".join(f"<li>{ach}</li>" for ach in exp["achievements"])
        experience_html += f"""
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-xl font-bold">{exp['position']}</h3>
                    <p class="text-gray-600">{exp['company']} - {exp['location']}</p>
                </div>
                <p class="text-gray-600">{exp['duration']}</p>
            </div>
            <ul class="mt-4 list-disc pl-5">{achievements}</ul>
        </div>
        """
    html_content = re.sub(r'(?s)<section id="experience".*?</section>',
                          f'<section id="experience" class="py-20"><div class="max-w-6xl mx-auto px-4"><h2 class="text-3xl font-bold mb-8 text-center">Experience</h2>{experience_html}</div></section>',
                          html_content)

    # Replace projects section dynamically
    projects_html = ""
    for project in json_data.get("projects", []):
        description = "".join(f"<li>{desc}</li>" for desc in project["description"])
        projects_html += f"""
        <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 class="text-xl font-bold mb-2">{project['name']}</h3>
            <p class="text-gray-600 mb-4">Technologies: {project['technologies']}</p>
            <ul class="list-disc pl-5 mb-4">{description}</ul>
            <a href="{project['link']}" target="_blank" class="text-blue-600 hover:text-blue-800">
                <i class="fab fa-github"></i> View on GitHub
            </a>
        </div>
        """
    html_content = re.sub(r'(?s)<section id="projects".*?</section>',
                          f'<section id="projects" class="py-20 bg-gray-50"><div class="max-w-6xl mx-auto px-4"><h2 class="text-3xl font-bold mb-8 text-center">Projects</h2>{projects_html}</div></section>',
                          html_content)

    # Save the updated HTML content back to the file
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(html_content)

# API Endpoint to process JSON data
@app.post("/generate")
def generate_portfolio(user_data: UserData):
    # Create a unique output folder for the user
    user_output_folder = os.path.join(OUTPUT_FOLDER, user_data.fullName.replace(" ", "_"))
    if os.path.exists(user_output_folder):
        shutil.rmtree(user_output_folder)
    shutil.copytree(ORIGINAL_FOLDER, user_output_folder)

    # Update index.html with user data
    index_path = os.path.join(user_output_folder, "index.html")
    try:
        update_html(user_data.dict(), index_path)
        
        # Create GitHub repository and upload files
        github_info = create_github_repo(user_data.fullName, user_output_folder)
        
        return {
            "message": "Portfolio generated successfully!",
            "folder": user_output_folder,
            "github_repo_url": github_info["repo_url"],
            "git_clone_url": github_info["git_url"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating portfolio: {e}")

# Run the server
# Use this command in terminal: uvicorn <filename>:app --reload