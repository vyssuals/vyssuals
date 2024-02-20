import csv
import random

# Define the number of rows and columns
num_rows = 10
num_cols = 50

# Define the column headers
headers = [f'Column{i+1}' for i in range(num_cols)]

# Generate the data for each row
rows = [[random.randint(1, 100) for _ in range(num_cols)] for _ in range(num_rows)]

# Write the data to a CSV file
with open('dataset.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)