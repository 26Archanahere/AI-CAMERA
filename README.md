# VisionAI

VisionAI is being built in stages. This first stage sets up a Next.js dashboard,
a separate FastAPI service, and a real frontend-to-backend health check. Image
uploads, webcam streaming, and YOLO inference are intentionally not implemented
yet.

## Architecture

```text
Browser
  └── Next.js + TypeScript + Tailwind CSS (http://localhost:3000)
        └── GET /api/health ──> FastAPI (http://localhost:8000)
                                  ├── OpenCV image decoding/preprocessing/drawing
                                  └── Ultralytics YOLO inference (next stage)
```

```text
AI CAMERA/
├── backend/
│   ├── app/
│   │   └── main.py               # FastAPI app and health endpoint
│   ├── .env.example              # Backend configuration template
│   └── requirements.txt          # Python runtime dependencies
├── frontend/
│   ├── src/app/
│   │   ├── globals.css           # Tailwind styles
│   │   ├── layout.tsx            # Root layout and page metadata
│   │   └── page.tsx              # Dashboard and backend connection check
│   ├── .env.example              # Browser-visible API base URL (not a secret)
│   ├── package.json
│   ├── postcss.config.js
│   └── tsconfig.json
└── README.md
```

## Compatibility choices

The workspace's Python 3.11 installation and package metadata support the
selected stack. The project pins a tested-compatible set: FastAPI 0.115.6,
Pydantic 2.10.3, OpenCV 4.11.0.86, and Ultralytics 8.3.57. Ultralytics 8.3
supports the YOLO11 model family; `yolo11n.pt` is the planned lightweight
pretrained detector. PyTorch and Torchvision are installed as Ultralytics
dependencies. The dashboard uses Next.js 16.4.2 (Node 20.9 or later), React 19,
and Tailwind CSS 4.3.3. The detected Node 24 runtime satisfies these
requirements.

The machine's system Python has conflicting installed FastAPI files, so the
backend should be run in the project virtual environment rather than the
system environment. A clean virtual environment avoids that pre-existing
conflict.

YOLO inference runs locally and does not require an external AI API key. The
first installation downloads PyTorch dependencies and can take time. The
pretrained model weights are downloaded by Ultralytics when inference is first
added; no model download is needed to run the health-check stage.

## Run on Windows (PowerShell)

Open two PowerShell terminals in the project directory.

### 1. Install and start the backend

```powershell
cd "C:\Users\rarch\OneDrive\Documents\AI CAMERA\backend"
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn app.main:app --reload --env-file .env
```

If PowerShell blocks virtual-environment activation, run this once in that
terminal, then activate again:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

Check the backend directly at <http://localhost:8000/api/health>. The
interactive API docs are at <http://localhost:8000/docs>.

### 2. Install and start the frontend

```powershell
cd "C:\Users\rarch\OneDrive\Documents\AI CAMERA\frontend"
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. The dashboard calls the FastAPI health endpoint
from the browser and displays whether the backend is reachable. If you change
the frontend port or backend URL, update `FRONTEND_ORIGIN` in
`backend\.env` and `NEXT_PUBLIC_API_BASE_URL` in `frontend\.env.local` to match.
Restart the corresponding server after changing environment variables.

## Current scope and next stages

This stage provides a working health endpoint and connection indicator only.
It does not claim to detect objects or people. Next, add validated image
upload/frame endpoints, OpenCV decoding and resizing, then run YOLO inference
and return structured labels, confidence values, and bounding boxes. Webcam
frames should be captured in the browser and sent at a controlled interval,
not streamed on every camera frame. Persistent history and Supabase
authentication can be considered after detection works.
