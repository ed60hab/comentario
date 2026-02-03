const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Usar la carpeta donde está el script como base
const REPO_PATH = __dirname;

// Servir archivos estáticos
app.use(express.static(REPO_PATH));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('<h1>Servidor Git de Comentarios Bíblicos</h1><p>Si ves esto, el servidor está funcionando. <a href="/editor.html">Abrir Editor</a></p>');
});

// Endpoint para actualizar archivos
app.post('/update-file', (req, res) => {
    const { filename, content, commitMessage } = req.body;
    console.log(`\n--- Update File Request: ${filename} ---`);
    console.time('Total Update Time');

    if (!filename || !content || !commitMessage) {
        console.timeEnd('Total Update Time');
        return res.status(400).json({
            success: false,
            error: 'Faltan parámetros requeridos'
        });
    }

    const filePath = path.join(REPO_PATH, filename);

    // Guardar archivo
    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            console.timeEnd('Total Update Time');
            return res.status(500).json({ success: false, error: err.message });
        }

        console.log(`File ${filename} saved locally.`);
        console.time('Git Sync');

        // Intentar git add, commit y push
        exec(`git add "${filename}" && git commit -m "${commitMessage || 'Update ' + filename}" && git push origin main`,
            { cwd: REPO_PATH },
            (gitErr, stdout, stderr) => {
                console.timeEnd('Git Sync');
                console.timeEnd('Total Update Time');
                if (gitErr) {
                    console.error('❌ Error en Git:', stderr);
                    // Return 200 OK because file WAS saved, but with gitError
                    return res.json({
                        success: true,
                        message: 'Archivo guardado localmente, pero falló la sincronización con GitHub',
                        gitError: stderr || gitErr.message,
                        output: stdout
                    });
                }

                console.log('✅ Cambios publicados exitosamente');
                console.log(stdout);

                res.json({
                    success: true,
                    message: 'Archivo actualizado y publicado en GitHub',
                    output: stdout
                });
            });
    });
});

// Endpoint para obtener texto bíblico (Proxy para evitar CORS)
const https = require('https');
app.get('/fetch-bible', (req, res) => {
    const { book, chapter, verse } = req.query;
    console.log(`\n--- Fetch Bible Request: ${book} ${chapter}:${verse} ---`);
    console.time('Total Fetch Time');

    if (!book || !chapter || !verse) {
        console.timeEnd('Total Fetch Time');
        return res.status(400).json({ error: 'Faltan parámetros' });
    }

    const bookMapping = {
        // Antiguo Testamento
        'génesis': 'genesis.html', 'genesis': 'genesis.html',
        'éxodo': 'exodo.html', 'exodo': 'exodo.html',
        'levítico': 'levitico.html', 'levitico': 'levitico.html',
        'números': 'numeros.html', 'numeros': 'numeros.html',
        'deuteronomio': 'deuteronomio.html',
        'josué': 'josue.html', 'josue': 'josue.html',
        'jueces': 'jueces.html',
        '1 samuel': '1samuel.html',
        '2 samuel': '2samuel.html',
        '1 reyes': '1reyes.html',
        '2 reyes': '2reyes.html',
        'isaías': 'isaias.html', 'isaias': 'isaias.html',
        'jeremías': 'jeremias.html', 'jeremias': 'jeremias.html',
        'ezequiel': 'ezequiel.html',
        'oseas': 'oseas.html',
        'joel': 'joel.html',
        'amós': 'amos.html', 'amos': 'amos.html',
        'abdías': 'abdias.html', 'abdias': 'abdias.html',
        'jonás': 'jonas.html', 'jonas': 'jonas.html',
        'miqueas': 'miqueas.html',
        'nahúm': 'nahum.html', 'nahum': 'nahum.html',
        'habacuc': 'habacuc.html',
        'sofonías': 'sofonias.html', 'sofonias': 'sofonias.html',
        'hageo': 'hageo.html',
        'zacarías': 'zacarias.html', 'zacarias': 'zacarias.html',
        'malaquías': 'malaquias.html', 'malaquias': 'malaquias.html',
        'salmos': 'salmos.html',
        'proverbios': 'proverbios.html',
        'job': 'job.html',
        'cantares': 'cantares.html',
        'rut': 'rut.html',
        'lamentaciones': 'lamentaciones.html',
        'eclesiastés': 'eclesiastes.html', 'eclesiastes': 'eclesiastes.html',
        'ester': 'ester.html',
        'daniel': 'daniel.html',
        'esdras': 'esdras.html',
        'nehemías': 'nehemias.html', 'nehemias': 'nehemias.html',
        '1 crónicas': '1cronicas.html', '1 cronicas': '1cronicas.html',
        '2 crónicas': '2cronicas.html', '2 cronicas': '2cronicas.html',
        // Nuevo Testamento
        'mateo': 'mateo.html', 'marcos': 'marcos.html', 'lucas': 'lucas.html', 'juan': 'juan.html',
        'hechos': 'hechos.html', 'romanos': 'romanos.html', '1 corintios': '1corintios.html',
        '2 corintios': '2corintios.html', 'gálatas': 'galatas.html', 'galatas': 'galatas.html',
        'efesios': 'efesios.html', 'filipenses': 'filipenses.html', 'colosenses': 'colosenses.html',
        '1 tesalonicenses': '1tesalonicenses.html', '2 tesalonicenses': '2tesalonicenses.html',
        '1 timoteo': '1timoteo.html', '2 timoteo': '2timoteo.html', 'tito': 'tito.html',
        'filemón': 'filemon.html', 'filemon': 'filemon.html', 'hebreos': 'hebreos.html',
        'santiago': 'santiago.html', '1 pedro': '1pedro.html', '2 pedro': '2pedro.html',
        '1 juan': '1juan.html', '2 juan': '2juan.html', '3 juan': '3juan.html',
        'judas': 'judas.html', 'apocalipsis': 'apocalipsis.html'
    };

    const fileName = bookMapping[book.toLowerCase()];
    if (!fileName) {
        return res.json({ text: `(Libro ${book} no soportado todavía)` });
    }

    const ntBooks = ['mateo', 'marcos', 'lucas', 'juan', 'hechos', 'romanos', '1corintios', '2corintios', 'galatas', 'efesios', 'filipenses', 'colosenses', '1tesalonicenses', '2tesalonicenses', '1timoteo', '2timoteo', 'tito', 'filemon', 'hebreos', 'santiago', '1pedro', '2pedro', '1juan', '2juan', '3juan', 'judas', 'apocalipsis'];
    const isNT = ntBooks.includes(fileName.replace('.html', ''));

    if (isNT) {
        const bibleBook = book.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const url = `https://www.biblegateway.com/passage/?search=${encodeURIComponent(bibleBook)}+${chapter}:${verse}&version=SBLGNT;LBLA`;
        const options = { headers: { 'User-Agent': 'Mozilla/5.0' } };
        console.log(`Fetching NT from BibleGateway: ${url}`);
        console.time('BibleGateway Download');

        https.get(url, options, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => {
                console.timeEnd('BibleGateway Download');
                console.time('BibleGateway Processing');
                const passageRegex = /<div class=["']passage-content[^"']*["']>([\s\S]*?)<\/div>/g;
                let versions = [];
                let match;
                while ((match = passageRegex.exec(data)) !== null) {
                    let rawHtml = match[1];

                    // 1. Limpieza agresiva de comentarios y basura de BibleGateway
                    rawHtml = rawHtml.replace(/<!--[\s\S]*?-->/g, '');
                    rawHtml = rawHtml.replace(/Read full chapter/gi, '');

                    // 2. Identificar inicio de metadatos (Footnotes / Cross references / etc)
                    const metaIndex = rawHtml.search(/(Footnotes|Cross references|Referencias Cruzadas|Notas al pie)/i);
                    let bodyHtml = rawHtml;
                    let metaHtml = '';

                    if (metaIndex !== -1) {
                        bodyHtml = rawHtml.substring(0, metaIndex);
                        metaHtml = rawHtml.substring(metaIndex);
                    }

                    // 3. Limpiar el cuerpo y el meta de etiquetas HTML no deseadas (excepto br y meta span)
                    const clean = (h, isMeta = false) => {
                        let text = h
                            .replace(/<sup[^>]*>.*?<\/sup>/g, '') // Quitar números internos
                            .replace(/<[^>]*>/g, (tag) => {
                                if (tag.startsWith('<br')) return '<br>';
                                return ' ';
                            })
                            .replace(/&nbsp;/g, ' ')
                            .replace(/\s+/g, ' ')
                            .replace(/<br>\s+/g, '<br>')
                            .trim();

                        return isMeta ? `<span class="bible-meta">${text}</span>` : text;
                    };

                    let finalVerse = clean(bodyHtml);
                    if (metaHtml) {
                        finalVerse += '<br>' + clean(metaHtml, true);
                    }

                    if (finalVerse) versions.push(finalVerse);
                }
                const gnt = versions[0] || "";
                const lbla = versions[1] || "";
                console.timeEnd('BibleGateway Processing');
                console.timeEnd('Total Fetch Time');
                res.json({ lbla, wlc: gnt, text: gnt ? `${gnt}\n${lbla}` : lbla });
            });
        }).on('error', (err) => {
            console.timeEnd('Total Fetch Time');
            res.status(500).json({ error: err.message });
        });
    } else {

        const url = `https://wlc.consoft.site/${fileName}`;
        const options = {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        };
        console.log(`Fetching OT from wlc.consoft.site: ${url}`);
        console.time('WLC Download');

        https.get(url, options, (response) => {
            let data = '';
            response.on('data', (chunk) => { data += chunk; });
            response.on('end', () => {
                console.timeEnd('WLC Download');
                console.time('WLC Processing');
                // 1. Isolar el capítulo de forma más eficiente
                const chapterRegex = new RegExp(`<div id=["']${chapter}["'] class=["']chapter[^"']*["']>([\\s\\S]*?)<div class=["']navigation[^"']*["']>`, 'i');
                const chapterMatch = data.match(chapterRegex);
                if (!chapterMatch) {
                    console.timeEnd('WLC Processing');
                    console.timeEnd('Total Fetch Time');
                    return res.json({ text: `(Capítulo ${chapter} no encontrado en ${book})` });
                }
                const chapterHtml = chapterMatch[1];

                // Helper para extraer versículo de una columna
                const getVerseFromColumn = (html, columnClass, vNum) => {
                    // El regex para columnas debe ser flexible con clases adicionales como p-3, etc.
                    const colRegex = new RegExp(`<div class=["']column ${columnClass}[^"']*["']>([\\s\\S]*?)</div>\\s*(<div class=["']column|<div class=["']navigation[^"']*["']|</div>\\s*</div>)`, 'i');
                    const colMatch = html.match(colRegex);
                    if (!colMatch) return null;

                    const verseRegex = new RegExp(`<div class=["']verse[^"']*["']>\\s*<span class=["']verse-number["']>${vNum}</span>\\s*<span class=["']verse-text[^"']*["']>([\\s\\S]*?)</span>\\s*</div>`, 'i');
                    const match = colMatch[1].match(verseRegex);
                    if (!match) return null;

                    // Limpieza inteligente: mantenemos espacios entre etiquetas y eliminamos etiquetas ruidosas
                    // pero dejamos etiquetas que puedan ser útiles o al menos no pegamos palabras.
                    return match[1]
                        .replace(/<link[^>]*>|<style[^>]*>|<script[^>]*>|<!--[\s\S]*?-->/gi, '') // Eliminar etiquetas peligrosas/ruidosas
                        .replace(/<\/?[a-z][^>]*>/gi, (tag) => {
                            // Reemplazar la mayoría de etiquetas por un espacio para evitar pegar palabras
                            // a menos que sean etiquetas de formato básicas que queramos intentar mantener (opcional)
                            return ' ';
                        })
                        .replace(/\s+/g, ' ') // Colapsar espacios múltiples
                        .trim();
                };

                const lblaText = getVerseFromColumn(chapterHtml, 'lbla', verse);
                const wlcText = getVerseFromColumn(chapterHtml, 'wlc', verse);

                if (!lblaText && !wlcText) {
                    console.timeEnd('WLC Processing');
                    console.timeEnd('Total Fetch Time');
                    return res.json({ text: `(Versículo ${chapter}:${verse} no encontrado)` });
                }

                console.timeEnd('WLC Processing');
                console.timeEnd('Total Fetch Time');
                res.json({ lbla: lblaText, wlc: wlcText, text: wlcText ? `${wlcText}\n${lblaText}` : lblaText });
            });
        }).on('error', (err) => {
            console.timeEnd('Total Fetch Time');
            res.status(500).json({ error: err.message });
        });
    }
});

// Endpoint para actualizar archivos y sincronizar con git
app.post('/update-file', (req, res) => {
    const { filename, content, commitMessage } = req.body;
    console.log(`\n--- Update File Request: ${filename} ---`);
    console.time('Total Update Time');

    if (!filename || !content || !commitMessage) {
        console.timeEnd('Total Update Time');
        return res.status(400).json({
            success: false,
            error: 'Faltan parámetros requeridos'
        });
    }

    const filePath = path.join(REPO_PATH, filename);

    // Guardar archivo
    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            console.timeEnd('Total Update Time');
            return res.status(500).json({ success: false, error: err.message });
        }

        console.log(`File ${filename} saved locally.`);
        console.time('Git Sync');

        // Intentar git add, commit y push
        exec(`git add "${filename}" && git commit -m "${commitMessage || 'Update ' + filename}" && git push origin main`,
            { cwd: REPO_PATH },
            (gitErr, stdout, stderr) => {
                console.timeEnd('Git Sync');
                console.timeEnd('Total Update Time');
                if (gitErr) {
                    console.error('❌ Error en Git:', stderr);
                    // Return 200 OK because file WAS saved, but with gitError
                    return res.json({
                        success: true,
                        message: 'Archivo guardado localmente, pero falló la sincronización con GitHub',
                        gitError: stderr || gitErr.message,
                        output: stdout
                    });
                }

                console.log('✅ Cambios publicados exitosamente');
                console.log(stdout);

                res.json({
                    success: true,
                    message: 'Archivo actualizado y publicado en GitHub',
                    output: stdout
                });
            });
    });
});

// Endpoint de depuración
app.get('/debug', (req, res) => {
    const commands = [
        `cd "${REPO_PATH}"`,
        `git rev-parse --show-toplevel`,
        `git remote -v`,
        `git status -s`,
        `git log -n 1 --oneline`,
        process.platform === 'win32' ? `dir /a .git` : `ls -la .git`
    ].join(' && ');

    exec(commands, (error, stdout, stderr) => {
        res.json({
            repoPath: REPO_PATH,
            workingDir: process.cwd(),
            stdout: stdout,
            stderr: stderr,
            error: error ? error.message : null
        });
    });
});

// Endpoint para listar los libros (NECESARIO para editor.html)
app.get('/list-books', (req, res) => {
    // Escaner el directorio para encontrar archivos HTML de la Biblia
    fs.readdir(REPO_PATH, (err, files) => {
        if (err) {
            console.error('❌ Error leyendo directorio:', err);
            return res.status(500).json({ error: 'Error al leer directorio' });
        }

        // Libros ordenados canónicamente (simplificado para coincidir con la lista dura por defecto si falla algo)
        // Por ahora devolvemos todos los .html que parezcan libros
        const books = [];
        const bibleOrder = [
            'genesis', 'exodo', 'levitico', 'numeros', 'deuteronomio', 'josue', 'jueces', 'rut', '1samuel', '2samuel', '1reyes', '2reyes', '1cronicas', '2cronicas', 'esdras', 'nehemias', 'ester', 'job', 'salmos', 'proverbios', 'eclesiastes', 'cantares', 'isaias', 'jeremias', 'lamentaciones', 'ezequiel', 'daniel', 'oseas', 'joel', 'amos', 'abdias', 'jonas', 'miqueas', 'nahum', 'habacuc', 'sofonias', 'hageo', 'zacarias', 'malaquias',
            'mateo', 'marcos', 'lucas', 'juan', 'hechos', 'romanos', '1corintios', '2corintios', 'galatas', 'efesios', 'filipenses', 'colosenses', '1tesalonicenses', '2tesalonicenses', '1timoteo', '2timoteo', 'tito', 'filemon', 'hebreos', 'santiago', '1pedro', '2pedro', '1juan', '2juan', '3juan', 'judas', 'apocalipsis'
        ];

        // Mapeo simple de nombres bonitos (podríamos mejorarlo)
        const formatTitle = (filename) => {
            const name = filename.replace('.html', '');
            return name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
        };

        files.forEach(file => {
            if (file.endsWith('.html') && !file.startsWith('index') && !file.startsWith('editor') && !file.startsWith('404')) {
                // Es un libro candidato
                books.push({
                    filename: file,
                    title: formatTitle(file), // Título provisional
                    chapters: 150 // Fallback genérico, idealmente leeríamos el archivo para contar capítulos
                });
            }
        });

        // Ordenar según orden bíblico si es posible
        books.sort((a, b) => {
            const nameA = a.filename.replace('.html', '').replace(/\d+/g, '').trim(); // quitar numeros para comparar base
            const nameB = b.filename.replace('.html', '').replace(/\d+/g, '').trim();
            // Esto es un sort muy básico. Mejor confiar en que el usuario tiene los archivos.
            // Para ser robustos, devolvemos la lista de archivos encontrados.
            return a.filename.localeCompare(b.filename);
        });

        // Para evitar problemas en el frontend, enviamos una lista de "todos conocidos" si existen
        res.json(books);
    });
});

// Endpoint de verificación
app.get('/status', (req, res) => {
    res.json({
        status: 'running',
        message: 'Servidor Git funcionando correctamente',
        repoPath: REPO_PATH
    });
});

const PORT = 3000;
console.log('Iniciando app.listen en puerto ' + PORT + '...');

server = app.listen(PORT, '0.0.0.0', () => {
    console.log('--------------------------------------------');
    console.log('   Servidor Git Automatico Iniciado         ');
    console.log('--------------------------------------------');
    console.log('');
    console.log('Servidor ejecutándose en: http://localhost:' + PORT);
    console.log('Repositorio: ' + REPO_PATH);
    console.log('');
    console.log('Listo para recibir actualizaciones');
    console.log('Manten esta ventana abierta mientras editas');
    console.log('');
    console.log('Presiona Ctrl+C para detener el servidor');
    console.log('--------------------------------------------');
});

server.on('error', (e) => {
    console.error('ERROR EN EL SERVIDOR:', e);
});

// Manejo elegante del cierre (Ctrl+C)
process.on('SIGINT', () => {
    console.log('\n🛑 Cerrando servidor...');
    server.close(() => {
        console.log('✅ Servidor cerrado correctamente.');
        process.exit(0);
    });
    // Forzar cierre si falla
    setTimeout(() => {
        console.log('⚠️ Forzando cierre...');
        process.exit(1);
    }, 1000);
});
