# LIU-TDP003
Portfolio website built using python+flask as pseudo-backend with es6 and web-components powering the frontend logic.

## Quick-start guide

### 1. Setup your env
> To not pollute our system-wide env with this Python deps we're using venv.

```bash
# Debian/Alpine instructions.
python3 -m venv venv
. venv/bin/activate
pip install -r requirements.txt
```

### 2.A Run the development server
```bash
flask --app app run --debug --port 3001
```

### 2.B Generate docs
```bash
pdoc --output-dir doc app api
```