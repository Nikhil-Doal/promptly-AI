import os
import sys
import subprocess
from email.message import EmailMessage
import re
import whisper
import google.generativeai as genai
from moviepy import VideoFileClip
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from deepface import DeepFace
import cv2
import numpy as np

genai.configure(api_key="AIzaSyCMazzHaOeCXlv8P-78pJzdHLGi8syeYg0")
model = genai.GenerativeModel("gemini-1.5-flash")

VIDEO_PATH = r"backend\video.mp4"
AUDIO_PATH = "temp_audio.wav"
FILLER_WORDS = ["um", "uh", "like", "you know", "ah"]

def generate_interview_question(job, description=""):
    prompt = f"Generate one interview question for the job title '{job}'."
    if description:
        prompt += f" Job description: {description}"
    response = model.generate_content(prompt)
    question = response.text.strip()
    return remove_markdown(question)

def extract_audio(video_path, audio_path=AUDIO_PATH):
    print("[INFO] Extracting audio from video...")
    video = VideoFileClip(video_path)
    video.audio.write_audiofile(audio_path, logger=None)
    return audio_path

def transcribe_audio_whisper(audio_path):
    print("[INFO] Loading Whisper model...")
    model_w = whisper.load_model("base")
    print("[INFO] Transcribing audio...")
    result = model_w.transcribe(audio_path,
                                initial_prompt="This is a nervous person who says um and uh a lot.",
                                word_timestamps=True,
                                condition_on_previous_text=False,
                                fp16=False)
    return result["text"]

def highlight_fillers(transcript):
    def repl(match):
        return f'<font color="red"><b>{match.group(0)}</b></font>'
    pattern = re.compile(r'\b(' + '|'.join(map(re.escape, FILLER_WORDS)) + r')\b', flags=re.IGNORECASE)
    return pattern.sub(repl, transcript)

def extract_grade_from_text(text):
    match = re.search(r"3\.\s*Grade\s*[:\-]?\s*([A-Fa-f])", text)
    return match.group(1).upper() if match else None

def remove_markdown(text):
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"__(.+?)__", r"\1", text)
    text = text.replace('*', '')
    return text

def analyze_emotions_from_video(video_path, frame_interval_sec=1):
    print("[INFO] Analyzing emotions with DeepFace...")
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 1
    frame_interval = int(fps * frame_interval_sec)
    emotions_list = []
    frame_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_interval == 0:
            try:
                analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
                if isinstance(analysis, list):
                    emotions = analysis[0]['emotion']
                else:
                    emotions = analysis['emotion']
                emotions_list.append(emotions)
            except Exception as e:
                print(f"[WARN] DeepFace error: {e}")
        frame_count += 1

    cap.release()

    if not emotions_list:
        print("[WARN] No emotions detected.")
        return None

    avg_emotions = {}
    for key in emotions_list[0]:
        avg_emotions[key] = np.mean([em[key] for em in emotions_list])

    return avg_emotions

def generate_grading(job, description, question, transcript):
    prompt = f"""
You are an expert interview coach.

Job Title: {job}
{"Job Description: " + description if description else "No job description provided."}

Interview Question: "{question}"

Candidate's Response Transcript:
{transcript}

Your tasks:
1. Count the number of filler words (e.g., "um", "uh", "like", "you know").
2. Evaluate the candidate's answer for clarity, relevance, and confidence.
3. Assign a grade (A–F) based on communication and how well the answer fits the role.
4. Provide 5 specific, actionable feedback tips on improvements.
5. Quote any weak or awkward phrases and suggest better alternatives.

Please provide your answer as plain text with numbered points.
"""
    response = model.generate_content(prompt)
    return response.text.strip()

def save_report_pdf(job, description, question, transcript, grading_text, emotion_summary=None, emotion_scores=None, filename=r"backend\interview_report.pdf"):
    doc = SimpleDocTemplate(filename, pagesize=letter,
                            rightMargin=40, leftMargin=40,
                            topMargin=40, bottomMargin=40)
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle('TitleStyle', parent=styles['Heading1'], alignment=TA_CENTER, textColor=HexColor("#2E86C1"), fontSize=28, spaceAfter=30)
    header_style = ParagraphStyle('HeaderStyle', parent=styles['Heading2'], textColor=HexColor("#117A65"), spaceAfter=18)
    normal_style = ParagraphStyle('NormalStyle', parent=styles['BodyText'], fontSize=12, leading=18, alignment=TA_JUSTIFY, spaceAfter=14)

    grade = extract_grade_from_text(grading_text)
    grading_text_clean = re.sub(r"3\.\s*Grade\s*[:\-]?\s*[A-Fa-f]\s*\n?", "", grading_text)
    grading_text_clean = remove_markdown(grading_text_clean).strip()

    story = [
        Paragraph("Interview Practice Report", title_style),
        Paragraph(f"<b>Job Title:</b> {job}", normal_style),
    ]
    if description:
        story.append(Paragraph(f"<b>Job Description:</b> {description}", normal_style))

    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>Generated Interview Question:</b>", header_style))
    story.append(Paragraph(question, normal_style))

    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>Candidate's Transcript (filler words highlighted in red):</b>", header_style))
    story.append(Paragraph(highlight_fillers(transcript).replace('\n', '<br />'), normal_style))

    if emotion_summary:
        story.append(Spacer(1, 20))
        story.append(Paragraph("<b>Emotion Analysis Summary:</b>", header_style))
        story.append(Paragraph(emotion_summary, normal_style))
        if emotion_scores:
            emotion_text = "<br />".join([f"{k.title()}: {v:.2f}%" for k, v in emotion_scores.items()])
            story.append(Paragraph(emotion_text, normal_style))

    story.append(Spacer(1, 30))

    if grade:
        grade_colors = {'A': "#27AE60", 'B': "#2ECC71", 'C': "#F39C12", 'D': "#E67E22", 'F': "#E74C3C"}
        story.append(Paragraph(f"Final Grade: {grade}", ParagraphStyle('GradeStyle',
            parent=styles['Heading1'], alignment=TA_CENTER, fontSize=48, textColor=HexColor(grade_colors.get(grade, "#000000")), spaceAfter=30)))
    else:
        story.append(Paragraph("Final Grade: N/A", normal_style))

    story.append(Paragraph("<b>Detailed Evaluation and Feedback:</b>", header_style))
    for para in grading_text_clean.split('\n'):
        para = para.strip()
        if para:
            story.append(Paragraph(para, normal_style))

    doc.build(story)
    print(f"[INFO] Report saved as '{filename}'")

def main():
    print("=== Interview Practice Tool ===")
    job = input("Enter the job title: ").strip()
    description = input("Enter the job description (optional): ").strip()

    print("\nGenerating interview question...")
    question = generate_interview_question(job, description)
    print(f"Interview Question: {question}\n")

    if not os.path.exists(VIDEO_PATH):
        print(f"[ERROR] Video file not found at: {VIDEO_PATH}")
        return

    audio_path = extract_audio(VIDEO_PATH)
    transcript = transcribe_audio_whisper(audio_path)
    os.remove(audio_path)

    # Emotion Analysis
    emotions = analyze_emotions_from_video(VIDEO_PATH)
    emotion_summary = "Emotion analysis not available."
    emotion_scores = None
    if emotions:
        happiness = emotions.get("happy", 0)
        fear = emotions.get("fear", 0)
        emotion_summary = f"The candidate appeared {'confident and happy' if happiness > 50 and fear < 20 else 'nervous or lacking confidence'} based on average emotional expression."
        emotion_scores = emotions

    print("\n=== Transcript ===\n")
    print(transcript)

    print("\nGenerating grading and feedback from AI...")
    grading_text = generate_grading(job, description, question, transcript)

    print("\n=== Grading & Feedback ===\n")
    print(grading_text)

    save_report_pdf(job, description, question, transcript, grading_text, emotion_summary, emotion_scores)

    EMAIL_SCRIPT_PATH = r"backend\gmail\email_main.py"
    REPORT_FILE = "interview_report.pdf"
    PYTHON_EXEC = os.path.join(sys.prefix, "Scripts", "python.exe")

    try:
      subprocess.run([PYTHON_EXEC, EMAIL_SCRIPT_PATH, REPORT_FILE], check=True)
      print("[INFO] Email sent successfully.")
    except subprocess.CalledProcessError as e:
      print(f"[ERROR] Email script failed. Exit code: {e.returncode}")
    
if __name__ == "__main__":
    main()