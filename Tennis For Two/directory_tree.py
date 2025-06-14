# directory_tree.py
import os
from pathlib import Path

def print_color(text, color_code):
    """Print colored text in terminal"""
    print(f"\033[{color_code}m{text}\033[0m")

def generate_directory_tree(startpath, max_depth=3):
    """Generate a visual tree of the directory structure"""
    # Header
    print_color(f"\nDirectory structure for Tennis for Two", "1;34")  # Blue
    print(f"Root: {startpath}\n")
    
    # Walk through directory
    for root, dirs, files in os.walk(startpath):
        level = root.replace(startpath, '').count(os.sep)
        if level > max_depth:
            continue
            
        # Print directories
        indent = '    ' * level
        dir_name = os.path.basename(root)
        print_color(f"{indent}{dir_name}/", "1;32")  # Green
        
        # Print files with different colors
        file_indent = '    ' * (level + 1)
        for f in sorted(files):
            if f.endswith('.py'):
                print_color(f"{file_indent}{f}", "1;33")  # Yellow
            elif f.endswith('.wav'):
                print_color(f"{file_indent}{f}", "1;36")  # Cyan
            else:
                print(f"{file_indent}{f}")

def check_requirements():
    """Check if all required files are present"""
    print_color("\nRequirements Check:", "1;35")
    required = {
        'main.py': False,
        'ball.py': False,
        'paddle.py': False,
        'settings.py': False,
        'utils.py': False,
        'assets/paddle.wav': False,
        'assets/net.wav': False,
        'assets/score.wav': False,
        'assets/bounce.wav': False
    }
    
    for file in required.keys():
        if os.path.exists(file):
            required[file] = True
            
    for file, exists in required.items():
        status = "✓" if exists else "✗"
        color = "32" if exists else "31"
        print(f"\033[{color}m{status} {file}\033[0m")
    
    return all(required.values())

def main():
    project_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Generate tree
    generate_directory_tree(project_dir)
    
    # Check requirements
    all_ok = check_requirements()
    
    # Final message
    if all_ok:
        print_color("\nAll files present! You can run the game with 'python main.py'", "1;32")
    else:
        print_color("\nMissing some files! Please add the missing files before running.", "1;31")

if __name__ == "__main__":
    main()