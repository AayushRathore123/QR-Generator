class RecordNotFound(Exception):
    def __init__(self, record_id, table_name):
        self.record_id = record_id
        self.table_name = table_name

    def __str__(self):
        return f'{self.table_name} record not found for id {self.record_id}'