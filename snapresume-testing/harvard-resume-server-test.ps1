# Test script for Resume Generator API

# Define the API endpoint
$uri = "http://localhost:8000/generate-resume"

# Create sample resume data
$resumeData = @{
    fullName = "John Doe"
    email = "john.doe@example.com"
    phone = "(555) 123-4567"
    github = "johndoe"
    linkedin = "johndoe"
    experience = @(
        @{
            company = "Tech Corp"
            location = "San Francisco, CA"
            position = "Senior Software Engineer"
            duration = "Jan 2020 - Present"
            achievements = @(
                "Led development of microservices architecture serving 1M+ users",
                "Improved system performance by 40% through optimization",
                "Mentored 5 junior developers"
            )
        }
    )
    projects = @(
        @{
            name = "AI-Powered Analytics Platform"
            technologies = "Python, TensorFlow, React, Docker"
            link = "github.com/johndoe/analytics-platform"
            description = @(
                "Built end-to-end analytics platform processing 1TB+ data daily",
                "Implemented machine learning models with 95% accuracy"
            )
        }
    )
    skills = @{
        programmingLanguages = "Python, JavaScript, Java, C++"
        technologies = "React, Node.js, Docker, Kubernetes"
        tools = "Git, JIRA, Jenkins, VS Code"
        databases = "PostgreSQL, MongoDB, Redis"
    }
    education = @(
        @{
            university = "Stanford University"
            location = "Stanford, CA"
            degree = "Master of Science in Computer Science"
            graduationDate = "May 2019"
            gpa = "3.9"
            coursework = "Machine Learning, Distributed Systems, Algorithm Design"
        }
    )
    responsibilities = @(
        @{
            title = "Tech Lead"
            duration = "2020 - Present"
            description = "Leading a team of 8 developers, managing project deadlines and technical decisions"
        }
    )
    achievements = @(
        "Published 2 papers in international conferences",
        "Won first place in University Hackathon 2018"
    )
}

# Convert the data to JSON
$jsonBody = $resumeData | ConvertTo-Json -Depth 10

# Set headers
$headers = @{
    "Content-Type" = "application/json"
}

try {
    # Make the POST request
    $response = Invoke-RestMethod -Uri $uri -Method Post -Body $jsonBody -Headers $headers -OutFile "generated_resume.pdf"
    Write-Host "Resume generated successfully! Saved as 'generated_resume.pdf'"
} catch {
    Write-Host "Error occurred while generating resume:"
    Write-Host "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Host "Status Description: $($_.Exception.Response.StatusDescription)"
    
    # Try to get more detailed error message from the response
    try {
        $errorDetails = $_.ErrorDetails.Message
        Write-Host "Error Details: $errorDetails"
    } catch {
        Write-Host "Could not retrieve detailed error message"
    }
}