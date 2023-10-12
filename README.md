## 1. Setup your env
> To not polute our system-wide env with this python trash we're using venv.
> TODO: We should probably even use a `.devcontainer` or a pure docker just to keep
python as far away from the bare-metal as possible.

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
