# Promptly AI
![title](images\image1.png)

## Inspiration
We’re a group of high school grads about to start university and we’ve already seen how brutal it is trying to land co-ops and side jobs. Everyone’s applying left and right, but in all that chaos, most forget to actually prepare for interviews. We realized it’s not just us, tons of students are going through the same cycle: apply, wait, repeat without ever improving their interview confidence or skills. That’s what inspired us to build Promptly, something to help people actually get better at interviews while applying for them.

## What it does
**Promptly: Artificial Interviews- Real Feedback.**

Users simply input a job title and optional description, and Promptly runs a full AI-powered mock interview. After it's done, here's what happens:

- 🎤 Gemini API analyzes verbal responses  
- 😐 DeepFace tracks facial expressions and confidence  
- 🛠️ MoviePy processes video/audio  
- 📩 Gmail API sends a polished PDF report  

The report includes a transcript, confidence/emotion breakdowns, a smart grade, and practical advice, even ideal answers based on the job role. It’s everything a candidate needs to improve and walk into interviews with confidence.

![choose plan](images\image2.jpg)

## How we built it
We used React.js and CSS to build a clean, responsive frontend. The backend runs on Python Flask, handling interview sessions, media processing, and API calls. For AI-driven feedback, we integrated the Gemini API to analyze verbal responses. The entire pipeline connects smoothly, from capturing user input to generating a report, thanks to Flask’s flexibility and React’s speed.

## Challenges we ran into
One of the biggest hurdles was getting the frontend and backend to actually talk to each other. We spent hours debugging because the video file just wouldn’t move through the pipeline. React and Flask weren’t syncing properly, and nothing was uploading the way it was supposed to. It felt like a dead end for a while, but with some late-night persistence and a lot of trial and error, we finally cracked it and got the entire flow working.

## Accomplishments that we're proud of
We came into this hackathon with zero clue about what we were going to build. Promptly was an idea we came up with right on the spot, and with barely any experience in React or Flask, it felt kind of insane at first. But we stuck with it. Honestly, the skill we improved the most was probably AI prompting 😅. That said, we’re super proud that we turned what felt like a wild idea into a working product in just a couple of days.

## What we learned
The power of friendship… just kidding (sort of). We actually learned a ton about Flask and React through this build, two technologies that are basically staples for any modern AI + web app project. On top of the technical growth, diving into the startup track also pushed us to think like founders. We explored product-market fit, pricing strategies, and how to pitch a technical product to real users and investors.

## What's next for Promptly
- Beta launch with universities + global language support  
- Expanding AI capabilities + investor outreach  
- Exploring both scalable B2C and B2B opportunities  
- Improving user experience based on early feedback if successful  
- Building integrations with career centers and HR platforms  

## Built With
- css3  
- deepface  
- gemini  
- gmailapi  
- moviepy  
- python  
- react  
- reportlab  