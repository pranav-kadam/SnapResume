# Define the API endpoint
$apiUrl = "http://127.0.0.1:8000/generate"

# Define the JSON payload
$jsonPayload = @"
{
    "fullName": "Jane Smith",
    "email": "jane.smith@example.com",
    "phone": "(555) 987-6543",
    "github": "janesmith",
    "linkedin": "janesmith",
    "experience": [
        {
            "company": "Innovatech",
            "location": "New York, NY",
            "position": "Software Engineer",
            "duration": "Aug 2018 - Dec 2022",
            "achievements": [
                "Developed a scalable e-commerce platform used by 500K+ customers",
                "Enhanced search functionality, increasing conversion rates by 25%",
                "Automated CI/CD pipelines, reducing deployment time by 30%"
            ]
        }
    ],
    "projects": [
        {
            "name": "Real-Time Chat Application",
            "technologies": "Node.js, WebSocket, React, MongoDB",
            "link": "https://github.com/janesmith/chat-app",
            "description": [
                "Designed and implemented a real-time chat application with user authentication",
                "Supported up to 10K concurrent users with zero downtime"
            ]
        }
    ]
}
"@

# Send the POST request
try {
    Write-Host "Sending POST request to API..." -ForegroundColor Green
    $response = Invoke-RestMethod -Uri $apiUrl -Method POST -Body $jsonPayload -ContentType "application/json"
    Write-Host "Response from API:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3
} catch {
    Write-Host "An error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Yellow
}
