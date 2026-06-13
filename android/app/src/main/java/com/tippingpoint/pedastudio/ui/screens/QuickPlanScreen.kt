package com.tippingpoint.pedastudio.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tippingpoint.pedastudio.api.PlanApiClient
import com.tippingpoint.pedastudio.auth.PhoneAuthController
import com.tippingpoint.pedastudio.data.CurriculumRepository
import com.tippingpoint.pedastudio.data.FirestoreRepository
import com.tippingpoint.pedastudio.data.LessonItem
import com.tippingpoint.pedastudio.data.PlanStorage
import com.tippingpoint.pedastudio.data.TlmResourceCatalog
import com.tippingpoint.pedastudio.data.UserPreferences
import com.tippingpoint.pedastudio.i18n.LocalAppLanguage
import com.tippingpoint.pedastudio.i18n.LocalAppStrings
import com.tippingpoint.pedastudio.ui.components.ChipMultiSelect
import com.tippingpoint.pedastudio.ui.components.ChipSingleSelect
import com.tippingpoint.pedastudio.ui.components.FormSectionCard
import com.tippingpoint.pedastudio.ui.components.InfoBannerCard
import com.tippingpoint.pedastudio.ui.components.OutlinedFormField
import com.tippingpoint.pedastudio.ui.components.RegisterScaffold
import com.tippingpoint.pedastudio.ui.theme.AccentTeal
import com.tippingpoint.pedastudio.ui.theme.PrimarySteel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

@Composable
fun QuickPlanScreen(
    lessonId: String,
    initialDay: Int = 1,
    prefs: UserPreferences,
    curriculum: CurriculumRepository,
    planStorage: PlanStorage,
    tlmCatalog: TlmResourceCatalog,
    firestore: FirestoreRepository,
    auth: PhoneAuthController,
    onBack: () -> Unit,
    onPlanReady: (String, Int) -> Unit,
) {
    val s = LocalAppStrings.current
    val lang = LocalAppLanguage.current
    val scope = rememberCoroutineScope()

    val lesson = remember(lessonId, prefs.medium) {
        curriculum.findLessonAnywhere(lessonId)
            ?: curriculum.getLessons(
                prefs.getTeacherGrades().firstOrNull() ?: 1,
                prefs.getTeacherSubjects().firstOrNull() ?: "english",
                prefs.medium,
            ).find { it.id == lessonId }
    }

    if (lesson == null) {
        Column(Modifier.padding(24.dp)) {
            InfoBannerCard(title = s.quickPlanTitle, body = "Lesson not found.")
        }
        return
    }

    var day by remember(initialDay) { mutableIntStateOf(initialDay) }
    var goal by remember(initialDay) { mutableStateOf(lesson.dayFocus(initialDay)?.focus ?: "") }
    var hook by remember { mutableStateOf("") }
    var teaching by remember { mutableStateOf("") }
    var practice by remember { mutableStateOf("") }
    var assessment by remember { mutableStateOf("") }
    var notes by remember { mutableStateOf("") }
    var selectedTlms by remember {
        mutableStateOf(
            prefs.getTeacherResources().toSet().ifEmpty { setOf("blackboard", "textbook", "notebook") },
        )
    }
    var error by remember { mutableStateOf("") }
    var loading by remember { mutableStateOf(false) }

    val dayOptions = (1..lesson.days).map { it.toString() to "${s.dayLabel} $it" }
    val hookOptions = QuickPlanOptions.hooksFor(lesson.type).map { it to it }
    val tlmOptions = remember(tlmCatalog) {
        tlmCatalog.all().map { it.id to "${it.emoji} ${it.label}" }
    }

    fun onDayChange(d: String) {
        val n = d.toIntOrNull() ?: return
        day = n
        goal = lesson.dayFocus(n)?.focus ?: goal
    }

    fun tlmLabels(): String = selectedTlms.map { tlmCatalog.labelFor(it) }.joinToString(", ")

    RegisterScaffold(
        title = s.quickPlanTitle,
        stepLabel = "${lesson.id} · ${lesson.title(lang)}",
        buttonText = if (loading) s.generatingPlan else s.generatePlan,
        canContinue = !loading &&
            selectedTlms.isNotEmpty() &&
            hook.isNotBlank() &&
            teaching.isNotBlank() &&
            practice.isNotBlank() &&
            assessment.isNotBlank() &&
            PlanApiClient.isConfigured,
        onBack = onBack,
        onContinue = {
            if (!PlanApiClient.isConfigured) {
                error = s.apiNotConfigured
                return@RegisterScaffold
            }
            loading = true
            error = ""
            scope.launch {
                val selections = mapOf(
                    "goal" to goal,
                    "hook" to hook,
                    "tlms" to tlmLabels(),
                    "teaching" to teaching,
                    "practice" to practice,
                    "assessment" to assessment,
                    "notes" to notes,
                )
                val result = withContext(Dispatchers.IO) {
                    val idToken = auth.getIdToken()
                    PlanApiClient.generatePlan(lesson, day, lesson.dayFocus(day), selections, prefs, idToken)
                }
                loading = false
                result.fold(
                    onSuccess = { plan ->
                        val planJson = plan.toString()
                        planStorage.savePlan(lesson.id, day, planJson, selections)
                        firestore.pushPlan(lesson.id, day, planJson, selections, planStorage)
                        onPlanReady(lesson.id, day)
                    },
                    onFailure = { e ->
                        error = e.message ?: s.planError
                    },
                )
            }
        },
    ) {
        if (!PlanApiClient.isConfigured) {
            Text(s.apiNotConfigured, color = Color.Red.copy(0.8f), fontSize = 13.sp, modifier = Modifier.padding(bottom = 8.dp))
        }

        LessonHeaderCard(lesson, lang, s)

        FormSectionCard(title = s.dayLabel, subtitle = null) {
            ChipSingleSelect(label = s.dayLabel, options = dayOptions, selected = day.toString(), onSelect = ::onDayChange)
            OutlinedFormField(value = goal, onValueChange = { goal = it }, label = s.goalLabel, singleLine = false)
        }

        FormSectionCard(title = s.teachingMaterials, subtitle = s.classroomResourcesSub) {
            ChipMultiSelect(
                label = s.teachingMaterials,
                options = tlmOptions,
                selected = selectedTlms,
                onToggle = { id ->
                    selectedTlms = if (id in selectedTlms) selectedTlms - id else selectedTlms + id
                },
            )
        }

        FormSectionCard(title = s.hookLabel, subtitle = null) {
            ChipSingleSelect(label = s.hookLabel, options = hookOptions, selected = hook, onSelect = { hook = it })
        }
        FormSectionCard(title = s.teachingLabel, subtitle = null) {
            ChipSingleSelect(label = s.teachingLabel, options = QuickPlanOptions.teaching.map { it to it }, selected = teaching, onSelect = { teaching = it })
        }
        FormSectionCard(title = s.practiceLabel, subtitle = null) {
            ChipSingleSelect(label = s.practiceLabel, options = QuickPlanOptions.practice.map { it to it }, selected = practice, onSelect = { practice = it })
        }
        FormSectionCard(title = s.assessmentLabel, subtitle = null) {
            ChipSingleSelect(label = s.assessmentLabel, options = QuickPlanOptions.assessment.map { it to it }, selected = assessment, onSelect = { assessment = it })
        }
        FormSectionCard(title = s.notesLabel, subtitle = null) {
            OutlinedFormField(value = notes, onValueChange = { notes = it }, label = s.notesLabel, singleLine = false)
        }

        if (loading) {
            CircularProgressIndicator(color = AccentTeal, modifier = Modifier.fillMaxWidth().padding(16.dp))
        }
        if (error.isNotBlank()) {
            Text(error, color = Color.Red, fontSize = 13.sp)
        }
    }
}

@Composable
private fun LessonHeaderCard(lesson: LessonItem, lang: String, s: com.tippingpoint.pedastudio.i18n.AppStrings) {
    FormSectionCard(title = lesson.title(lang), subtitle = lesson.en) {
        Text(
            text = "${s.unitLabel} ${lesson.unit} · ${s.pagesLabel} ${lesson.pages} · ${lesson.days} ${s.daysLabel}",
            fontSize = 13.sp,
            color = PrimarySteel.copy(0.7f),
        )
    }
}
