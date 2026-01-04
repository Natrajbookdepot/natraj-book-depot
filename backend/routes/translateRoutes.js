const express = require('express');
const { translate } = require('google-translate-api-x');
const router = express.Router();

// Route: POST /api/translate
router.post('/', async (req, res) => {
    try {
        const { text, target = 'hi' } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        // Helper function for single string
        const doTranslate = async (str) => {
            try {
                const result = await translate(str, { to: target });
                return result.text;
            } catch (e) {
                console.error(`Failed to translate "${str}":`, e.message);
                return str; // Fallback to original
            }
        };

        let translated;
        if (Array.isArray(text)) {
            // Handle array of strings concurrently
            translated = await Promise.all(text.map(t => doTranslate(t)));
        } else {
            translated = await doTranslate(text);
        }

        return res.json({ translated });

    } catch (error) {
        console.error("Translation Server Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
