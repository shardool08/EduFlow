package com.tippingpoint.pedastudio.data

import android.content.Context
import org.json.JSONObject

data class FlashcardItem(
    val word: String,
    val emoji: String,
    val meaningMr: String,
    val meaningHi: String,
    val meaningUr: String,
    val type: String,
    val imageUrl: String = "",
) {
    fun meaning(lang: String): String = when (lang) {
        "mr" -> meaningMr.ifBlank { word }
        "hi" -> meaningHi.ifBlank { word }
        "ur" -> meaningUr.ifBlank { word }
        else -> word
    }
}

data class LessonFlashcards(val title: String, val cards: List<FlashcardItem>)

class FlashcardRepository(context: Context) {
    private val root = JSONObject(
        context.assets.open("flashcards.json").bufferedReader().use { it.readText() },
    )
    private val imageOverlays = mutableMapOf<String, Map<String, String>>()

    fun applyImageOverlay(lessonId: String, wordToUrl: Map<String, String>) {
        if (wordToUrl.isEmpty()) return
        imageOverlays[lessonId] = wordToUrl
    }

    fun getLessonFlashcards(lessonId: String): LessonFlashcards? {
        val o = root.optJSONObject(lessonId) ?: return null
        val overlay = imageOverlays[lessonId].orEmpty()
        val cardsArr = o.getJSONArray("cards")
        val cards = mutableListOf<FlashcardItem>()
        for (i in 0 until cardsArr.length()) {
            val c = cardsArr.getJSONObject(i)
            val word = c.getString("word")
            cards.add(
                FlashcardItem(
                    word = word,
                    emoji = c.optString("emoji", "📚"),
                    meaningMr = c.optString("meaningMr", c.getString("word")),
                    meaningHi = c.optString("meaningHi", c.getString("word")),
                    meaningUr = c.optString("meaningUr", c.getString("word")),
                    type = c.optString("type", "word"),
                    imageUrl = overlay[word].orEmpty().ifBlank { c.optString("imageUrl", "") },
                ),
            )
        }
        return LessonFlashcards(o.optString("title", lessonId), cards)
    }
}
