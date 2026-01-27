# Editor Improvements Plan

## Goal
Implement "Save" (Guardar) and "Save and Exit" (Guardar y Salir) buttons for the editor.
-   "Guardar": Saves changes to the file/GitHub but keeps the editor open.
-   "Guardar y Salir": Saves changes and redirects to the index (current behavior).

## Proposed Changes

### `editor.html`

#### [MODIFY] [editor.html](file:///Users/ed60hab/comentario/editor.html)
-   **HTML**:
    -   Modify the existing `publishBtn` to be "Guardar y Salir".
    -   Add a new button `saveKeepBtn` for "Guardar" next to it.
-   **JavaScript**:
    -   Update `saveCommentary(exit = true)` to accept an `exit` parameter.
    -   Update `updateBookFile(exit)` to accept `exit` parameter.
        -   If `exit` is false, do NOT redirect to `index.html`. instead show a success alert (or toast) and stay.
    -   Update `downloadHTML` (for new comments) if needed, though usually new comments are added via modal and then you are done. The user asked specifically for the window they are working in (Edit Mode).
    -   Update `loadVerseForEditing` to handle the visibility/text of both buttons.

## Verification Plan

### Manual Verification
1.  Open Editor with a book/verse (e.g. via the new Desktop shortcut or direct link).
2.  Make a change.
3.  Click "Guardar" (Save).
    -   **Expect**: Success message, page stays on editor, changes are saved (can verify by reloading page or checking file).
4.  Make another change.
5.  Click "Guardar y Salir" (Save & Exit).
    -   **Expect**: Success message, page redirects to `index.html`.
