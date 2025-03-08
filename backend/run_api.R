library(plumber)

# Run the API
pr <- plumber::plumb("api/correlation_api.R")
pr$run(port = 8000, host = "0.0.0.0")
