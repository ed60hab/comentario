
import os
import re

# Base directory
BASE_DIR = "/Users/ed60hab/Dev/Bible"
TEMPLATE_FILE = os.path.join(BASE_DIR, "genesis.html")
INDEX_FILE = os.path.join(BASE_DIR, "index.html")

def extract_books_from_index():
    books = []
    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Regex to find books in the index
    # Pattern looks for: <a href="file.html" class="book-card"> ... <div class="original-text">HEBREW</div> ... <div class="book-title">TITLE</div> ... <div class="chapter-count">XX capítulos</div>
    pattern = re.compile(r'<a href="([^"]+)" class="book-card">\s*<div class="original-text">([^<]+)</div>\s*<div class="book-title">([^<]+)</div>\s*<div class="chapter-count">(\d+) capítulos?</div>', re.DOTALL)
    
    matches = pattern.findall(content)
    
    for filename, hebrew_greek, title, chapters in matches:
        books.append({
            "filename": filename,
            "original": hebrew_greek.strip(),
            "title": title.strip(),
            "chapters": int(chapters)
        })
    
    return books

def generate_book_pages(books):
    with open(TEMPLATE_FILE, 'r', encoding='utf-8') as f:
        template = f.read()

    # Split template to isolate the dynamic parts
    # We want to keep the header, style, and structure, but replace:
    # 1. Title <title>Comentarios - Génesis</title>
    # 2. Main Title <h1 class="book-title">GÉNESIS</h1>
    # 3. Subtitle <div class="book-subtitle">בְּרֵאשִׁית</div>
    # 4. Chapter Grid
    # 5. Content (Clear old content)

    for book in books:
        if book['filename'] == 'genesis.html':
            continue # Skip Genesis as it is the template

        print(f"Generating {book['filename']}...")
        
        new_content = template
        
        # 1. Replace Title Tag
        new_content = re.sub(r'<title>Comentarios - .*?</title>', f'<title>Comentarios - {book["title"]}</title>', new_content)
        
        # 2. Replace Main Title
        new_content = re.sub(r'<h1 class="book-title">.*?</h1>', f'<h1 class="book-title">{book["title"].upper()}</h1>', new_content)
        
        # 3. Replace Subtitle
        new_content = re.sub(r'<div class="book-subtitle">.*?</div>', f'<div class="book-subtitle">{book["original"]}</div>', new_content)
        
        # 4. Generate Chapter Grid Links
        # <a href="#1" class="ch-link">1</a>
        grid_html = ""
        for i in range(1, book['chapters'] + 1):
            grid_html += f'<a href="#{i}" class="ch-link">{i}</a>\n                '
        
        # Replace grid content using markers
        new_content = re.sub(
            r'(<!-- START CHAPTER GRID -->).*?(<!-- END CHAPTER GRID -->)', 
            f'\\1\n                {grid_html}\\2', 
            new_content, 
            flags=re.DOTALL
        )

        # 5. Reset Content Area
        # Use markers to replace the entire chapter content area
        
        # Generate placeholder verse links (e.g. 1-20)
        verse_links = ""
        for v in range(1, 21):
             verse_links += f'<a href="#1.{v}" class="v-link">{v}</a>\\n                    '

        placeholder = f'''
        <div class="chapter-container" id="1">
            <h2 class="chapter-title">Capítulo 1</h2>
            
            <nav class="verse-nav mb-4">
                <span class="verse-nav-title">Versículos</span>
                <div class="verse-grid">
                    {verse_links}
                </div>
            </nav>

            <div class="verse-block" id="1.1">
                <span class="verse-ref">1:1</span>
                <p class="verse-text">Texto bíblico de {book["title"]} 1:1...</p>
                <div class="commentary">
                    <p>Espacio para comentarios del libro de {book["title"]}.</p>
                </div>
            </div>
            
            <div class="return-top">
                <a href="#top">↑ Volver Arriba</a>
            </div>
        </div>
        '''
        
        new_content = re.sub(
            r'(<!-- START CHAPTER CONTENT -->).*?(<!-- END CHAPTER CONTENT -->)', 
            f'\\1\n{placeholder}\n\\2', 
            new_content, 
            flags=re.DOTALL
        )

        # Write file
        output_path = os.path.join(BASE_DIR, book['filename'])
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

if __name__ == "__main__":
    extracted_books = extract_books_from_index()
    print(f"Found {len(extracted_books)} books.")
    generate_book_pages(extracted_books)
