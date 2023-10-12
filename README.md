## 1. Setup your env
> To not pollute our system-wide env with this Python deps we're using venv.

```bash
# Debian/Alpine instructions.
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

## 2. Run the development server
```bash
flask --app app run --debug --port 3001
```
