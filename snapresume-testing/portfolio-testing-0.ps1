# Define the API endpoint
$apiUrl = "http://127.0.0.1:8000/generate"

# Define the JSON payload
$jsonPayload = @"
{
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "(555) 123-4567",
    "github": "johndoe",
    "linkedin": "johndoe",
    "experience": [
        {
            "company": "TechCorp",
            "location": "San Francisco, CA",
            "position": "Senior Developer",
            "duration": "Jan 2016 - May 2020",
            "achievements": [
                "Led the migration of legacy systems to modern cloud-based architecture",
                "Reduced server costs by 40% through efficient system optimizations",
                "Mentored a team of 10 junior developers, enhancing their technical skills"
            ]
        },
        {
            "company": "SoftSolutions",
            "location": "Austin, TX",
            "position": "Full Stack Developer",
            "duration": "Jun 2020 - Present",
            "achievements": [
                "Developed a customer analytics dashboard, increasing client retention by 20%",
                "Streamlined REST API development, reducing response times by 50%",
                "Integrated third-party payment systems, handling $10M+ in transactions annually"
            ]
        }
    ],
    "projects": [
        {
            "name": "E-Commerce Platform",
            "technologies": "Python, Django, PostgreSQL",
            "link": "https://github.com/johndoe/ecommerce-platform",
            "description": [
                "Built a fully functional e-commerce platform with advanced filtering options",
                "Implemented a secure payment gateway and order tracking system"
            ]
        },
        {
            "name": "Weather Forecasting App",
            "technologies": "Java, Spring Boot, MySQL",
            "link": "https://github.com/johndoe/weather-app",
            "description": [
                "Created a mobile-friendly weather app with real-time updates",
                "Integrated data from multiple APIs for accurate predictions"
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
