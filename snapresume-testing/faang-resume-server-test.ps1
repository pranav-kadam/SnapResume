# Define the API endpoint
$apiUrl = "http://34.45.16.181:8000/generate-resume"
# Create the JSON payload
$jsonPayload = @{
    fullName = "John Doe"
    email = "johndoe@example.com"
    phone = "123-456-7890"
    github = "johndoe"
    linkedin = "johndoe-linkedin"
    experience = @(
        @{
            company = "ABC Corp"
            location = "New York, NY"
            position = "Software Engineer"
            duration = "Jan 2020 - Present"
            achievements = @("Developed an API system", "Improved response time by 30%")
        }
    )
    projects = @(
        @{
            name = "Project A"
            technologies = "Python, Flask"
            link = "http://example.com/project-a"
            description = @("Built a web app", "Optimized database queries")
        }
    )
    skills = @{
        programmingLanguages = "Python, JavaScript"
        technologies = "Flask, React"
        tools = "Git, Docker"
        databases = "PostgreSQL, MongoDB"
    }
    education = @(
        @{
            university = "XYZ University"
            location = "City, State"
            degree = "B.Sc. in Computer Science"
            graduationDate = "May 2020"
            gpa = "3.8/4.0"
            coursework = "Data Structures, Algorithms"
        }
    )
    responsibilities = @(
        @{
            title = "Team Lead"
            duration = "2021-2022"
            description = "Led a team of 5 engineers"
        }
    )
    achievements = @("Awarded Employee of the Month", "Certified AWS Developer")
} | ConvertTo-Json -Depth 10

# Send the POST request
$response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $jsonPayload -ContentType "application/json" -OutFile "resume.pdf"

# Check if the PDF was saved
if (Test-Path "resume.pdf") {
    # Open the PDF file
    Start-Process "resume.pdf"
} else {
    Write-Host "Failed to generate resume PDF"
}
