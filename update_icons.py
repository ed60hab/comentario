
import os
import glob

def update_files():
    # Get all html files in the current directory
    html_files = glob.glob('*.html')
    
    target = 'img/Saved_512.png'
    replacement = 'img/torah_scroll.png'
    
    count = 0
    for file_path in html_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if target in content:
                new_content = content.replace(target, replacement)
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {file_path}")
                count += 1
        except Exception as e:
            print(f"Error processing {file_path}: {e}")
            
    print(f"Total files updated: {count}")

if __name__ == "__main__":
    update_files()
