library(plumber)
library(jsonlite)
library(ggplot2)
library(base64enc)

# Source the correlation functions
source("../R/correlation_functions.R")

#* @apiTitle Correlation Analysis API
#* @apiDescription API endpoints for correlation analysis

#* Calculate correlation between two vectors
#* @param x A comma-separated list of numbers for x-axis
#* @param y A comma-separated list of numbers for y-axis
#* @param method Correlation method (pearson or spearman)
#* @post /calculate
function(x, y, method = "pearson") {
  # Parse input vectors
  vector_x <- as.numeric(strsplit(x, ",")[[1]])
  vector_y <- as.numeric(strsplit(y, ",")[[1]])
  
  # Check if vectors have the same length
  if (length(vector_x) != length(vector_y)) {
    return(list(error = "Vectors must have the same length"))
  }
  
  # Calculate correlation
  result <- correlation_calculate(vector_x, vector_y, method = method)
  
  return(result)
}

#* Generate a correlation plot between two vectors
#* @param x A comma-separated list of numbers for x-axis
#* @param y A comma-separated list of numbers for y-axis
#* @param method Correlation method (pearson or spearman)
#* @param title Plot title
#* @param xlab X-axis label
#* @param ylab Y-axis label
#* @param pointSize Size of points
#* @param width Plot width in pixels
#* @param height Plot height in pixels
#* @post /plot
function(x, y, method = "pearson", title = "Correlation Plot", 
         xlab = "X Values", ylab = "Y Values", pointSize = 3,
         width = 800, height = 600) {
  # Parse input vectors
  vector_x <- as.numeric(strsplit(x, ",")[[1]])
  vector_y <- as.numeric(strsplit(y, ",")[[1]])
  
  # Check if vectors have the same length
  if (length(vector_x) != length(vector_y)) {
    return(list(error = "Vectors must have the same length"))
  }
  
  # Generate correlation plot
  plot <- correlation_draw(
    vector_x, 
    vector_y, 
    method = method,
    title = title,
    xlab = xlab, 
    ylab = ylab,
    point_size = as.numeric(pointSize)
  )
  
  # Convert plot to base64-encoded PNG
  tmp <- tempfile(fileext = ".png")
  ggsave(tmp, plot, width = as.numeric(width)/100, height = as.numeric(height)/100, units = "in", dpi = 100)
  img <- readBin(tmp, "raw", file.info(tmp)$size)
  img_b64 <- base64enc::base64encode(img)
  unlink(tmp)
  
  # Calculate correlation statistics
  stats <- correlation_calculate(vector_x, vector_y, method = method)
  
  # Return base64-encoded image and correlation statistics
  return(list(
    image = paste0("data:image/png;base64,", img_b64),
    correlation = stats$correlation_coefficient,
    p_value = stats$p_value,
    method = method
  ))
}

#* Generate an example correlation plot
#* @param n Number of points
#* @param correlation Target correlation value
#* @param method Correlation method
#* @param width Plot width in pixels
#* @param height Plot height in pixels
#* @get /example
function(n = 50, correlation = 0.7, method = "pearson", width = 800, height = 600) {
  # Generate example data and plot
  example <- generate_example_correlation(
    n = as.numeric(n), 
    correlation = as.numeric(correlation),
    method = method
  )
  
  # Convert plot to base64-encoded PNG
  tmp <- tempfile(fileext = ".png")
  ggsave(tmp, example$plot, width = as.numeric(width)/100, height = as.numeric(height)/100, units = "in", dpi = 100)
  img <- readBin(tmp, "raw", file.info(tmp)$size)
  img_b64 <- base64enc::base64encode(img)
  unlink(tmp)
  
  # Return base64-encoded image, data and correlation statistics
  return(list(
    image = paste0("data:image/png;base64,", img_b64),
    data = example$data,
    correlation = round(cor(example$data$x, example$data$y, method = method), 3),
    method = method
  ))
}
