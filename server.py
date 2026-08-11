"""
AI Subtitle Studio - Server
"""

from flask import Flask, request, Response
from faster_whisper import WhisperModel
import os
import tempfile
import datetime

app = Flask(__name__)

MODEL_SIZE = os.environ.get("MODEL_SIZE", "base")

print(f"Loading Whisper model ({MODEL_SIZE})...")
model = WhisperModel(MODEL_SIZE, device="cpu", compute_type="int8")
print("Model ready.")


def format_timestamp(seconds: float) -> str:
    td = datetime.timedelta(seconds=max(0, seconds))
    total_seconds = int(td.total_seconds())
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    secs = total_seconds % 60
    millis = int((seconds - int(seconds)) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


@app.route("/", methods=["GET"])
def home():
    return {"status": "ok", "message": "AI Subtitle Studio server is running"}


@app.route("/translate-audio", methods=["POST"])
def translate_audio():
    if "file" not in request.files:
        return Response("No audio file received (fieldName must be 'file')", status=400)

    audio_file = request.files["file"]

    temp_dir = tempfile.mkdtemp()
    input_path = os.path.join(temp_dir, "input_audio")
    audio_file.save(input_path)

    try:
        segments, info = model.transcribe(input_path, language=None, beam_size=5)
        print(f"Detected language: {info.language} ({info.language_probability:.2f})")

        srt_lines = []
        for i, segment in enumerate(segments, start=1):
            start = format_timestamp(segment.start)
            end = format_timestamp(segment.end)
            text = segment.text.strip()
            srt_lines.append(f"{i}\n{start} --> {end}\n{text}\n")

        srt_content = "\n".join(srt_lines)

        return Response(srt_content, status=200, mimetype="text/plain")

    except Exception as e:
        print(f"Error: {e}")
        return Response(f"Processing error: {e}", status=500)
    finally:
        try:
            os.remove(input_path)
        except Exception:
            pass


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
