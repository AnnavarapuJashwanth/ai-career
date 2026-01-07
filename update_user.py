from backend.utils.db import get_db

db = get_db()
result = db['users'].update_one(
    {'email': '231fa04651@gmail.com'}, 
    {'$set': {'name': 'sravanthi varikutii'}}
)

print(f'Modified count: {result.modified_count}')
print('Name updated successfully!')

# Verify
user = db['users'].find_one({'email': '231fa04651@gmail.com'}, {'name': 1, 'email': 1, '_id': 0})
print(f'Updated user: {user}')
