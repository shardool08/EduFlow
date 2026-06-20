package com.tippingpoint.pedastudio.i18n

import kotlin.random.Random

object GeneratingQuotes {
    private val en = listOf(
        "Every great lesson starts with one thoughtful choice.",
        "You're not alone — we're building this with you.",
        "Small steps in class can change a child's day.",
        "Good teaching is preparation plus heart.",
        "Your students are lucky to have a teacher who plans.",
        "Balbharati in hand, creativity in mind.",
        "A clear plan frees you to connect with learners.",
        "Teaching is the art of making thinking visible.",
    )

    private val mr = listOf(
        "प्रत्येक छान पाठाची सुरुवात एका विचारपूर्ण निवडीने होते.",
        "तुम्ही एकटे नाही — ही योजना आपण मिळून तयार करत आहोत.",
        "वर्गातील छोटे पाऊल मुलाचा दिवस बदलू शकते.",
        "चांगले शिक्षण म्हणजे तयारी आणि मनाचा स्पर्श.",
        "योजना करणारे शिक्षक — तुमचे विद्यार्थी भाग्यवान.",
        "पाठ्यपुस्तक जवळ, कल्पकता मनात.",
        "स्पष्ट योजना म्हणजे विद्यार्थ्यांशी जास्त जोडणी.",
        "शिकवणे म्हणजे विचार सर्वांसाठी दृश्य करणे.",
    )

    private val hi = listOf(
        "हर अच्छे पाठ की शुरुआत एक सोच-समझ वाले फैसले से होती है.",
        "आप अकेले नहीं हैं — यह योजना आपके साथ बन रही है.",
        "कक्षा में छोटा कदम बच्चे का दिन बदल सकता है.",
        "अच्छा शिक्षण तैयारी और दिल से जुड़ा होता है.",
        "योजना बनाने वाले शिक्षक — आपके विद्यार्थी भाग्यशाली हैं.",
    )

    private val ur = listOf(
        "ہر اچھے سبق کی شروعات ایک سوچ سمجھ کے انتخاب سے ہوتی ہے.",
        "آپ اکیلے نہیں — یہ منصوبہ آپ کے ساتھ بن رہا ہے.",
        "جماعت میں چھوٹا قدم بچے کا دن بدل سکتا ہے.",
        "اچھا تدریس تیاری اور دل سے جڑا ہوتا ہے.",
    )

    fun forLanguage(lang: String): List<String> = when (lang) {
        "mr" -> mr
        "hi" -> hi
        "ur" -> ur
        else -> en
    }

    fun randomQuote(lang: String, random: Random = Random.Default): String {
        val pool = forLanguage(lang)
        return pool[random.nextInt(pool.size)]
    }
}
