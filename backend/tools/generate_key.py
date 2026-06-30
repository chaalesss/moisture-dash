# This program generates a secret key for the SQL database and saves it to a dotenv file
from dotenv import set_key
import pathlib
from key_generator.key_generator import generate

env_file_path = (pathlib.Path(__file__).resolve().parent / "../../.env").resolve()

if not env_file_path.exists():
    env_file_path.touch(mode=0o600)

key = generate(seed = None).get_key()

print(f'Writing key: "{key}" to {env_file_path}')

set_key(dotenv_path=env_file_path,
        key_to_set='SECRET_KEY',
        value_to_set=key)

print('Done')