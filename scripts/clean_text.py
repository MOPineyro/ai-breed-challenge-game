import csv

def main():
    input_filename = 'list.txt'
    output_filename = 'output.csv'
    unique_names = set()

    try:
        with open(input_filename, 'r') as file:
            lines = file.readlines()

        total_lines = len(lines)
        print(f"Total lines to process: {total_lines}")

        for i, line in enumerate(lines):
            # Process line to extract the name, excluding the numeric identifier after the last underscore
            parts = line.strip().split('_')
            name = '_'.join(parts[:-1])  # Join all parts except the last
            unique_names.add(name)

            # Print progress
            print(f"Processing line {i + 1}/{total_lines}...")

        # Write to CSV file
        with open(output_filename, 'w', newline='') as csvfile:
            writer = csv.writer(csvfile)
            for name in sorted(unique_names):  # Write sorted unique names
                writer.writerow([name])

        print(f"CSV creation completed. Data written to {output_filename}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
