#' Calculate correlation between two vectors
#' 
#' @param vector_x Numeric vector for x values
#' @param vector_y Numeric vector for y values
#' @param method Correlation method, either "spearman" or "pearson"
#' @param ... Additional parameters passed to cor.test
#' @return A data frame with correlation coefficient and p-value
correlation_calculate <- function(vector_x, vector_y, method = "spearman", ...) {
  if (!method %in% c("spearman", "pearson")) {
    stop("Invalid method. Choose 'spearman' or 'pearson'.")
  }

  # Remove NA values from both vectors consistently
  valid_indices <- complete.cases(vector_x, vector_y)
  vector_x <- vector_x[valid_indices]
  vector_y <- vector_y[valid_indices]

  # Use cor.test to get correlation coefficient and p-value
  correlation_test <- cor.test(vector_x, vector_y, method = method, use = "complete.obs", ...)

  # Extract correlation coefficient and p-value
  result <- data.frame(
    correlation_coefficient = as.numeric(correlation_test$estimate),
    p_value = correlation_test$p.value
  )

  return(result)
}

#' Create a correlation plot between two vectors
#' 
#' @param vector_x Numeric vector for x values
#' @param vector_y Numeric vector for y values
#' @param method Correlation method, either "spearman" or "pearson"
#' @param color_palette Color palette to use
#' @param title Plot title
#' @param xlab X-axis label
#' @param ylab Y-axis label
#' @param point_size Size of the points
#' @param point_color Color of the points
#' @param point_stroke Stroke width for points
#' @param alpha Transparency of points
#' @param line_color Color of the regression line
#' @param line_type Type of the regression line
#' @param line_size Size of the regression line
#' @param ci_alpha Transparency of the confidence interval
#' @param title_size Size of the plot title
#' @param xlab_size Size of the x-axis label
#' @param ylab_size Size of the y-axis label
#' @param axis_text_size Size of the axis text
#' @param ... Additional parameters passed to correlation_calculate
#' @return A ggplot object
correlation_draw <- function(vector_x, vector_y, method = "spearman", color_palette = "npg",
                             title = "Correlation Plot", xlab = "Vector X", ylab = "Vector Y",
                             point_size = 1.5, point_color = "#BB7CD8", point_stroke = 1, alpha = 0.75,
                             line_color = "#BB7CD8", line_type = "dashed", line_size = 1.2,
                             ci_alpha = 0.2, title_size = 16, xlab_size = 14,
                             ylab_size = 14, axis_text_size = 14, ...) {

  # Calculate correlation
  correlation_result <- correlation_calculate(vector_x, vector_y, method = method, ...)
  correlation_coefficient <- round(correlation_result$correlation_coefficient, 3)
  p_value <- round(correlation_result$p_value, 3)

  # Create scatter plot with correlation coefficient and p-value annotation
  plot <- ggplot2::ggplot(data = data.frame(vector_x, vector_y), ggplot2::aes(x = vector_x, y = vector_y)) +
    ggplot2::geom_point(size = point_size, color = "black", fill = point_color, alpha = alpha, stroke = point_stroke, shape = 21) +
    ggplot2::geom_smooth(method = "lm", color = line_color, linetype = line_type,
                         size = line_size, se = TRUE, fill = line_color, alpha = ci_alpha) +  # Add confidence interval shading
    ggplot2::labs(title = title, x = xlab, y = ylab) +
    ggplot2::annotate(
      "text", x = Inf, y = Inf,
      label = paste("Correlation:", correlation_coefficient, "\nP-value:", p_value),
      hjust = 1.1, vjust = 1.2,
      size = 5, color = "black"
    ) +
    ggplot2::theme_classic() +
    ggplot2::theme(
      plot.title = ggplot2::element_text(size = title_size),
      axis.text = ggplot2::element_text(size = axis_text_size, color = "black"),
      axis.title.x = ggplot2::element_text(size = xlab_size, color = "black"),
      axis.title.y = ggplot2::element_text(size = ylab_size, color = "black"),
      axis.line = ggplot2::element_line(color = "black"),      # Set axis line color
      axis.ticks = ggplot2::element_line(color = "black"),     # Set axis ticks color
      panel.grid = ggplot2::element_blank()                    # Remove grid
    )

  # Return the plot
  return(plot)
}

#' Generate example correlation plot
#' 
#' @param n Number of points to generate
#' @param correlation Target correlation
#' @return A list containing the plot and the data
generate_example_correlation <- function(n = 50, correlation = 0.7, method = "pearson") {
  # Generate correlated data
  sigma <- matrix(c(1, correlation, correlation, 1), nrow = 2)
  data <- MASS::mvrnorm(n = n, mu = c(0, 0), Sigma = sigma)
  vector_x <- data[, 1]
  vector_y <- data[, 2]
  
  # Create plot
  plot <- correlation_draw(
    vector_x, 
    vector_y, 
    method = method,
    title = paste("Example", method, "Correlation"),
    xlab = "X Values", 
    ylab = "Y Values",
    point_size = 3
  )
  
  # Return both the plot and the data
  return(list(plot = plot, data = data.frame(x = vector_x, y = vector_y)))
}

# Example usage:
# vector_x <- c(10, 2, 3, 4, 5) # x-axis values
# vector_y <- c(5, 6, 7, 8, 7)  # y-axis values  
# correlation_draw(vector_x, vector_y, method = "pearson", point_size = 3)
