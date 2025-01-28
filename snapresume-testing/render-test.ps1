# Define the API endpoint
$apiUrl = "http://127.0.0.1:8000/generate"

# Define the JSON payload
$jsonPayload = @"
{
  "fullName": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "(123) 456-7890",
  "github": "janedoe",
  "linkedin": "janedoe",
  "experience": [
    {
      "position": "Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco, CA",
      "duration": "Jan 2020 - Present",
      "achievements": [
        "Developed scalable microservices.",
        "Improved system performance by 30%."
      ]
    }
  ],
  "projects": [
    {
      "name": "Project Alpha",
      "technologies": "Python, FastAPI, React",
      "description": [
        "Built a RESTful API.",
        "Implemented user authentication."
      ],
      "link": "https://github.com/janedoe/project-alpha"
    }
  ]
}
"@

# Set the headers for the request
$headers = @{
    "Content-Type" = "application/json"
}

# Check if the server is running first
try {
    $healthCheck = Invoke-RestMethod -Uri "http://127.0.0.1:8000/docs" -Method Get -TimeoutSec 5
    Write-Output "Server is running. Proceeding with the request..."
} catch {
    Write-Output "Error: Could not connect to the server. Make sure it's running on http://127.0.0.1:8000"
    exit 1
}

# Make the API call
try {
    Write-Output "`nSending JSON payload to $apiUrl..."
    Write-Output "----------------------------------------"
    Write-Output $jsonPayload
    Write-Output "----------------------------------------`n"

    $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Headers $headers -Body $jsonPayload
    
    Write-Output "API Response:"
    Write-Output "----------------------------------------"
    $response | ConvertTo-Json -Depth 10
    Write-Output "----------------------------------------"
    
    if ($response.github_pages_url) {
        Write-Output "`nPortfolio will be available at: $($response.github_pages_url)"
        Write-Output "Note: It may take a few minutes for the GitHub Pages site to be ready."
    }
} catch {
    Write-Output "`nError calling API:"
    Write-Output "Status Code: $($_.Exception.Response.StatusCode.value__)"
    Write-Output "Status Description: $($_.Exception.Response.StatusDescription)"
    
    # Try to get more detailed error message from the response
    try {
        $errorDetails = $_.ErrorDetails.Message
        if ($errorDetails) {
            Write-Output "Error Details: $errorDetails"
        }
    } catch {
        Write-Output "Could not retrieve detailed error message"
    }
}