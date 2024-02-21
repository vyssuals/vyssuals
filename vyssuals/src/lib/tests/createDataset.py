import csv
import random

# Prompt for the number of columns
n = int(input("Enter the number of columns: "))

# Generate column headers
headers = [f'Column{i+1}' for i in range(n)]

# Generate some rows of random data
rows = [[random.randint(0, 100) for _ in range(n)] for _ in range(10)]

# Write the data to a CSV file
with open('output.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(headers)
    writer.writerows(rows)

print("CSV file has been generated.")