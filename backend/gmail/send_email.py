import os, re, cv2, numpy as np
from moviepy import VideoFileClip
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import whisper
import google.generativeai as genai
from deepface import DeepFace
from fpdf import FPDF

app = Flask(__name__)
CORS(app)

UPLOAD = os.path.join(os.getcwd(), 'uploads')
WEBM = os.path.join(UPLOAD, 'interview.webm')
MP4 = os.path.join(UPLOAD, 'interview.mp4')
PDF = os.path.join(UPLOAD, 'interview_report.pdf')
os.makedirs(UPLOAD, exist_ok=True)

genai.configure(api_key="YOUR_GEMINI_API_KEY")
gmodel = genai.GenerativeModel("gemini-1.5-flash")
wt = whisper.load_model('base')

def remove_md(t): return re.sub(r'\*+', '', t)

def allowed(fn): return fn.lower().endswith('.webm')

@app.route('/api/get-question', methods=['POST'])
def get_question():
    job, desc = request.json.get('jobTitle',''), request.json.get('description','')
    prompt = f"Generate one interview question for the job title '{job}'."
    if desc: prompt += f" Job description: {desc}"
    q = gmodel.generate_content(prompt).text
    return jsonify(question=remove_md(q.strip()))

@app.route('/api/upload-video', methods=['POST'])
def upload_video():
    if 'video' not in request.files: return jsonify(error='No video'), 400
    f = request.files['video']
    if f.filename == '' or not allowed(f.filename): return jsonify(error='Invalid'), 400
    f.save(WEBM)
    return jsonify(message='ok'), 200

@app.route('/api/run-interview', methods=['POST'])
def run_interview():
    job, desc = request.json.get('jobTitle',''), request.json.get('description','')
    if not os.path.exists(WEBM): return jsonify(error='Video not uploaded'), 400

    # Convert to MP4
    VideoFileClip(WEBM).write_videofile(MP4, codec='libx264', audio_codec='aac')

    # Transcribe audio
    txt = wt.transcribe(MP4).get('text','')

    # Emotion analysis
    cap = cv2.VideoCapture(MP4); fps = cap.get(cv2.CAP_PROP_FPS) or 1
    em = []; i=0
    while True:
        ret, fr = cap.read()
        if not ret: break
        if i % int(fps) == 0:
            try:
                a = DeepFace.analyze(fr, actions=['emotion'], enforce_detection=False)
                em.append(a[0]['emotion'])
            except:
                pass
        i+=1
    cap.release()
    avg = {k: round(np.mean([e[k] for e in em]), 2) for k in em[0]} if em else {}

    # Feedback
    prompt = (
        f"Job: {job}\n"
        f"{'Description: '+desc if desc else ''}\n"
        f"Transcript:\n{txt}\n\nFeedback tasks: Grade, feedback, fillers."
    )
    out = gmodel.generate_content(prompt).text
    grade = (re.search(r'Grade[:\-]?\s*([A-F])', out) or [None,'N/A'])[1]

    # PDF
    pdf = FPDF(); pdf.add_page(); pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 8,
      f"Job: {job}\nDesc: {desc}\n\nTranscript:\n{txt}\n\nFeedback:\n{out}\n\nEmotions Avg:\n{avg}")
    pdf.output(PDF)

    return jsonify(message='done', grade=grade, emotions=avg, reportPath=PDF)
