package com.tippingpoint.pedastudio.navigation

import android.net.Uri

object Routes {
    const val LANGUAGE = "language"
    const val LOGIN = "login"
    const val REGISTER_STEP2 = "register_step2"
    const val REGISTER_STEP3 = "register_step3"
    const val HOME = "home"
    const val EDIT_PROFILE = "edit_profile"
    const val QUICK_PLAN = "quick_plan/{lessonId}/{day}"
    const val PLAN_VIEW = "plan_view/{lessonId}/{day}"
    const val FLASHCARDS = "flashcards/{lessonId}"
    const val LESSON_DETAIL = "lesson/{lessonId}"
    const val CHANGE_LANGUAGE = "change_language"

    fun quickPlan(lessonId: String, day: Int = 1) = "quick_plan/${encode(lessonId)}/$day"
    fun planView(lessonId: String, day: Int) = "plan_view/${encode(lessonId)}/$day"
    fun flashcards(lessonId: String) = "flashcards/${encode(lessonId)}"
    fun lessonDetail(lessonId: String) = "lesson/${encode(lessonId)}"

    fun decodeLessonId(raw: String?): String? = raw?.let { Uri.decode(it) }

    private fun encode(lessonId: String): String = Uri.encode(lessonId)
}
