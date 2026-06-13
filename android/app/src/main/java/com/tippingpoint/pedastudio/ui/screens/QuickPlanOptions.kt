package com.tippingpoint.pedastudio.ui.screens

object QuickPlanOptions {
    val hooksByType = mapOf(
        "poem" to listOf("Recite with actions", "Listen & repeat", "Picture discussion", "Sing together"),
        "song" to listOf("Sing with actions", "Clap rhythm first", "Listen then join", "Dance along"),
        "story" to listOf("Show cover & predict", "Ask a question", "Act out a scene", "Show key picture"),
        "phonics" to listOf("Sound game", "Letter song", "Spot the letter", "Air writing"),
        "conversation" to listOf("Role-play starter", "Real-life question", "Show & tell", "Simon says game"),
        "picture-talk" to listOf("Show picture & ask", "I spy game", "Guess what's next", "Describe & draw"),
        "instructions" to listOf("Demonstrate first", "Step-by-step", "Students repeat", "Pair practice"),
        "writing" to listOf("Trace letters", "Copy from board", "Air writing", "Match letters"),
    )

    val defaultHooks = listOf("Ask a question", "Show picture", "Act it out", "Sing or chant")

    val teaching = listOf(
        "Show → Say → Repeat",
        "Tell a story around it",
        "Act out / TPR",
        "Picture walk & discuss",
        "Discovery — explore first",
        "Board work — write & explain",
    )

    val practice = listOf(
        "Whole class together",
        "Pair work",
        "Small groups (4-5)",
        "Individual practice",
        "Game / competition",
    )

    val assessment = listOf(
        "Oral questions",
        "Show me game",
        "Exit ticket",
        "Peer check",
        "Worksheet",
    )

    fun hooksFor(type: String): List<String> = hooksByType[type] ?: defaultHooks
}
