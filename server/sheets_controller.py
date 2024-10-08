import json
import gspread
from oauth2client.service_account import ServiceAccountCredentials

class SheetsController:
    def __init__(self, spreadsheet_id: str):
        self.spreadsheet_id = spreadsheet_id
        
        self.keys_file = "./server/sheets_keys.json"
        self.scope = ['https://spreadsheets.google.com/feeds', 'https://www.googleapis.com/auth/drive']
        self.creds = ServiceAccountCredentials.from_json_keyfile_name(self.keys_file, self.scope)
        self.client = gspread.authorize(self.creds)
        self.spreadsheet = self.client.open_by_key(self.spreadsheet_id)

    def get_table_raw(self, worksheet_title):
        worksheet = self.spreadsheet.worksheet(worksheet_title)
        return worksheet.get_all_values()
    
    def get_table_as_dict(self, worksheet_title):
        data = self.get_table_raw(worksheet_title)
        return {item[0]: item[1] for item in data if len(item) == 2} 
    
    def get_table_as_dict_2d(self, worksheet_title):
        # Get the raw data from the worksheet
        data = self.get_table_raw(worksheet_title)
        
        # Extract the header row (first row)
        header = data[0]
        
        # Initialize an empty dictionary to hold the result
        table_dict = {}
        
        # Iterate over the rows in the data, starting from the second row
        for row in data[1:]:
            if len(row) == len(header):  # Ensure the row length matches the header length
                # The first column is the key
                key = row[0]
                # Create a dictionary for the values with header as keys
                value_dict = {header[i]: row[i] for i in range(1, len(header))}
                # Assign this dictionary to the corresponding key in the table_dict
                table_dict[key] = value_dict
        
        return table_dict
    
    def get_table_with_header(self, worksheet_title):
        data = self.get_table_raw(worksheet_title)
        keys = data[0]
        return [dict(zip(keys, values)) for values in data[1:]]

    def set_cell(self, worksheet_title, row, col, value):
        worksheet = self.spreadsheet.worksheet(worksheet_title)
        worksheet.update_cell(row, col, value)


    def add_row(self, worksheet_title, row_values):
        worksheet = self.spreadsheet.worksheet(worksheet_title)
        worksheet.append_row(row_values)
