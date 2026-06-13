package com.tippingpoint.pedastudio.data

enum class DayPlanStatus(val key: String) {
    NOT_STARTED("not_started"),
    PLANNED("planned"),
    COMPLETED("completed"),
    ;

    companion object {
        fun fromKey(key: String?): DayPlanStatus =
            entries.find { it.key == key } ?: NOT_STARTED
    }
}

enum class LessonProgressStatus {
    NOT_STARTED,
    PLANNED,
    IN_PROGRESS,
    COMPLETED,
}

enum class PlanFeedback(val key: String) {
    WENT_WELL("went_well"),
    SOME_STRUGGLED("some_struggled"),
    MOST_DIDNT_UNDERSTAND("most_didnt_understand"),
    COULDNT_FINISH("couldnt_finish"),
    READY_FOR_MORE("ready_for_more"),
    ;

    companion object {
        fun fromKey(key: String?): PlanFeedback? =
            key?.let { k -> entries.find { it.key == k } }
    }
}

data class DayPlanMeta(
    val status: DayPlanStatus,
    val feedback: PlanFeedback? = null,
    val savedAt: Long = 0L,
    val completedAt: Long = 0L,
)

data class NextPlanAction(
    val action: String,
    val label: String,
    val description: String,
    val lessonId: String,
    val day: Int,
)

object PlanProgressHelper {
    fun getLessonStatus(lessonId: String, totalDays: Int, planStorage: PlanStorage): LessonProgressStatus {
        var hasPlanned = false
        var hasCompleted = false
        var allCompleted = totalDays > 0
        for (d in 1..totalDays) {
            when (planStorage.getDayMeta(lessonId, d).status) {
                DayPlanStatus.PLANNED -> {
                    hasPlanned = true
                    allCompleted = false
                }
                DayPlanStatus.COMPLETED -> hasCompleted = true
                DayPlanStatus.NOT_STARTED -> allCompleted = false
            }
        }
        if (allCompleted) return LessonProgressStatus.COMPLETED
        if (hasCompleted) return LessonProgressStatus.IN_PROGRESS
        if (hasPlanned) return LessonProgressStatus.PLANNED
        return LessonProgressStatus.NOT_STARTED
    }

    fun getFirstUnplannedDay(lessonId: String, totalDays: Int, planStorage: PlanStorage): Int? {
        for (d in 1..totalDays) {
            if (planStorage.getDayMeta(lessonId, d).status == DayPlanStatus.NOT_STARTED) return d
        }
        return null
    }

    fun getNextAction(
        lessonId: String,
        day: Int,
        feedback: PlanFeedback,
        totalDays: Int,
    ): NextPlanAction = when (feedback) {
        PlanFeedback.WENT_WELL, PlanFeedback.READY_FOR_MORE -> {
            if (day < totalDays) {
                NextPlanAction(
                    action = "next_day",
                    label = "Continue to Day ${day + 1}",
                    description = "Students understood well. Move ahead.",
                    lessonId = lessonId,
                    day = day + 1,
                )
            } else {
                NextPlanAction(
                    action = "next_lesson",
                    label = "Move to next lesson",
                    description = "All days completed!",
                    lessonId = lessonId,
                    day = day,
                )
            }
        }
        PlanFeedback.SOME_STRUGGLED -> NextPlanAction(
            action = "practice",
            label = "Add a practice day",
            description = "Repeat with a different activity.",
            lessonId = lessonId,
            day = day,
        )
        PlanFeedback.MOST_DIDNT_UNDERSTAND -> NextPlanAction(
            action = "reteach",
            label = "Re-teach this day",
            description = "Try a simpler approach.",
            lessonId = lessonId,
            day = day,
        )
        PlanFeedback.COULDNT_FINISH -> NextPlanAction(
            action = "continue",
            label = "Continue same plan",
            description = "Pick up where you left off.",
            lessonId = lessonId,
            day = day,
        )
    }

    fun statusIcon(status: DayPlanStatus): String = when (status) {
        DayPlanStatus.NOT_STARTED -> "○"
        DayPlanStatus.PLANNED -> "📝"
        DayPlanStatus.COMPLETED -> "✅"
    }

    fun lessonStatusIcon(status: LessonProgressStatus): String = when (status) {
        LessonProgressStatus.NOT_STARTED -> "○"
        LessonProgressStatus.PLANNED -> "📝"
        LessonProgressStatus.IN_PROGRESS -> "▶"
        LessonProgressStatus.COMPLETED -> "✅"
    }
}
