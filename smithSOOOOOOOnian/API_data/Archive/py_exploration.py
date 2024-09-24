import pandas as pd
import json

# Function to convert JSON to DataFrame
def json_to_df(json_file):
    with open(json_file, 'r') as file:
        data = json.load(file)
    df = pd.DataFrame(data)
    return df

# Example usage
if __name__ == "__main__":
    json_file = 'data.json'  # Replace with your JSON file path
    df = json_to_df(json_file)
    print(df)