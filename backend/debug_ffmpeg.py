import os
import shutil
import imageio_ffmpeg
import subprocess
import sys

def debug_ffmpeg():
    print("--- FFmpeg Debug Info ---")
    
    # 1. Get location from imageio
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    print(f"1. Imageio FFmpeg Exe: {ffmpeg_exe}")
    print(f"   Exists? {os.path.exists(ffmpeg_exe)}")
    
    # 2. Check Parent Dir
    ffmpeg_dir = os.path.dirname(ffmpeg_exe)
    print(f"2. Parent Directory: {ffmpeg_dir}")
    if os.path.exists(ffmpeg_dir):
        print(f"   Files in dir: {os.listdir(ffmpeg_dir)}")
    else:
        print("   Parent directory does not exist!")

    # 3. Modify PATH
    print(f"3. Validating PATH modification...")
    current_path = os.environ["PATH"]
    if ffmpeg_dir not in current_path:
        print("   Adding to PATH...")
        os.environ["PATH"] += os.pathsep + ffmpeg_dir
    else:
        print("   Already in PATH.")

    # 4. Check shutil.which
    which_ffmpeg = shutil.which("ffmpeg")
    print(f"4. shutil.which('ffmpeg'): {which_ffmpeg}")

    # 5. Try Execution
    print("5. Attempting execution...")
    try:
        subprocess.run(["ffmpeg", "-version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("   SUCCESS: executed 'ffmpeg -version'")
    except Exception as e:
        print(f"   FAILURE: {e}")

    # 6. Try Execution with full path
    print("6. Attempting execution with FULL PATH...")
    try:
        subprocess.run([ffmpeg_exe, "-version"], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print("   SUCCESS: executed full path")
    except Exception as e:
        print(f"   FAILURE: {e}")

if __name__ == "__main__":
    debug_ffmpeg()
