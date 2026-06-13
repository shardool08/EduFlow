package com.tippingpoint.pedastudio.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.School
import androidx.compose.material3.AssistChip
import androidx.compose.material3.AssistChipDefaults
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tippingpoint.pedastudio.data.CurriculumRepository
import com.tippingpoint.pedastudio.data.IndiaStates
import com.tippingpoint.pedastudio.data.IndianLanguages
import com.tippingpoint.pedastudio.data.LessonItem
import com.tippingpoint.pedastudio.data.PlanProgressHelper
import com.tippingpoint.pedastudio.data.PlanRef
import com.tippingpoint.pedastudio.data.PlanStorage
import com.tippingpoint.pedastudio.data.UserPreferences
import com.tippingpoint.pedastudio.i18n.AppStrings
import com.tippingpoint.pedastudio.i18n.LocalAppLanguage
import com.tippingpoint.pedastudio.i18n.LocalAppStrings
import com.tippingpoint.pedastudio.ui.components.HighlightLessonCard
import com.tippingpoint.pedastudio.ui.components.InfoBannerCard
import com.tippingpoint.pedastudio.ui.components.PrimaryButton
import com.tippingpoint.pedastudio.ui.components.ProfileActionRow
import com.tippingpoint.pedastudio.ui.components.ProfileChip
import com.tippingpoint.pedastudio.ui.components.ProfileHeroHeader
import com.tippingpoint.pedastudio.ui.components.ProfileInfoRow
import com.tippingpoint.pedastudio.ui.components.ProfileSectionCard
import com.tippingpoint.pedastudio.ui.components.profileInitials
import com.tippingpoint.pedastudio.ui.theme.AccentTeal
import com.tippingpoint.pedastudio.ui.theme.BgTint
import com.tippingpoint.pedastudio.ui.theme.NavBg
import com.tippingpoint.pedastudio.ui.theme.PrimaryDark
import com.tippingpoint.pedastudio.ui.theme.PrimarySteel
import com.tippingpoint.pedastudio.ui.theme.SeasideBorder
import com.tippingpoint.pedastudio.ui.theme.WarmPeach

private enum class HomeTab { HOME, ROADMAP, PROFILE }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainHomeScreen(
    prefs: UserPreferences,
    curriculum: CurriculumRepository,
    planStorage: PlanStorage,
    plansRevision: Int = 0,
    onEditProfile: () -> Unit,
    onQuickPlan: (String, Int) -> Unit,
    onFlashcards: (String) -> Unit,
    onViewPlan: (String, Int) -> Unit,
    onOpenLesson: (String) -> Unit,
    onChangeLanguage: () -> Unit,
    onLessonSelected: () -> Unit,
    onSignOut: () -> Unit,
) {
    var tab by remember { mutableStateOf(HomeTab.HOME) }
    var selectedGrade by remember { mutableIntStateOf(prefs.getTeacherGrades().firstOrNull() ?: 1) }
    var selectedSubject by remember { mutableStateOf(prefs.getTeacherSubjects().firstOrNull() ?: "english") }
    var pickCurrent by remember { mutableStateOf(false) }

    val lessons = remember(selectedGrade, selectedSubject, prefs.medium) {
        curriculum.getLessons(selectedGrade, selectedSubject, prefs.medium)
    }
    val available = curriculum.isAvailable(selectedGrade, selectedSubject)
    val currentId = prefs.getCurrentLesson(selectedGrade, selectedSubject)
    val currentLesson = lessons.find { it.id == currentId }
    val currentIndex = lessons.indexOfFirst { it.id == currentId }
    val nextLesson = if (currentIndex >= 0 && currentIndex + 1 < lessons.size) lessons[currentIndex + 1] else null
    val lang = LocalAppLanguage.current
    val s = LocalAppStrings.current
    val teacherFallback = when (lang) {
        "mr" -> "शिक्षक"
        "hi" -> "शिक्षक"
        "ur" -> "استاد"
        else -> "Teacher"
    }

    Scaffold(
        containerColor = NavBg,
        topBar = {
            TopAppBar(
                title = {
                    if (tab == HomeTab.PROFILE) {
                        Text(s.profileTitle, fontWeight = FontWeight.Bold)
                    } else {
                        Column {
                            Text("PedaStudio", fontWeight = FontWeight.Bold)
                            Text(
                                s.helloTeacher.format(prefs.teacherName.ifBlank { teacherFallback }),
                                fontSize = 12.sp,
                                color = PrimaryDark.copy(alpha = 0.6f),
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = if (tab == HomeTab.PROFILE) NavBg else Color.White,
                ),
            )
        },
        bottomBar = {
            NavigationBar(
                modifier = Modifier.navigationBarsPadding(),
                containerColor = Color.White,
            ) {
                NavigationBarItem(selected = tab == HomeTab.HOME, onClick = { tab = HomeTab.HOME }, icon = { Icon(Icons.Default.Home, null) }, label = { Text(s.navHome, fontSize = 11.sp) })
                NavigationBarItem(selected = tab == HomeTab.ROADMAP, onClick = { tab = HomeTab.ROADMAP }, icon = { Icon(Icons.Default.List, null) }, label = { Text(s.navRoadmap, fontSize = 11.sp) })
                NavigationBarItem(selected = tab == HomeTab.PROFILE, onClick = { tab = HomeTab.PROFILE }, icon = { Icon(Icons.Default.Person, null) }, label = { Text(s.navProfile, fontSize = 11.sp) })
            }
        },
    ) { padding ->
        Column(modifier = Modifier.fillMaxSize().padding(padding)) {
            if (tab != HomeTab.PROFILE) {
                GradeSubjectBar(
                    grades = prefs.getTeacherGrades(),
                    subjects = prefs.getTeacherSubjects(),
                    selectedGrade = selectedGrade,
                    selectedSubject = selectedSubject,
                    onGrade = { selectedGrade = it },
                    onSubject = { selectedSubject = it },
                )
            }

            when (tab) {
                HomeTab.HOME -> HomeTabContent(
                    s = s,
                    available = available,
                    currentLesson = currentLesson,
                    nextLesson = nextLesson,
                    lang = lang,
                    planStorage = planStorage,
                    savedPlanDay = remember(plansRevision, currentLesson) {
                        currentLesson?.let { planStorage.firstSavedDay(it.id, it.days) }
                    },
                    recentPlans = remember(plansRevision) { planStorage.listLocalPlans().take(5) },
                    onPickLesson = { tab = HomeTab.ROADMAP; pickCurrent = true },
                    onQuickPlan = { id, day -> onQuickPlan(id, day) },
                    onFlashcards = { id -> onFlashcards(id) },
                    onViewPlan = { id, day -> onViewPlan(id, day) },
                    onOpenLesson = onOpenLesson,
                )
                HomeTab.ROADMAP -> RoadmapTabContent(
                    s = s,
                    lessons = lessons,
                    available = available,
                    currentId = currentId,
                    pickCurrent = pickCurrent,
                    lang = lang,
                    planStorage = planStorage,
                    plansRevision = plansRevision,
                    onSelectCurrent = { id ->
                        prefs.setCurrentLesson(selectedGrade, selectedSubject, id)
                        pickCurrent = false
                        tab = HomeTab.HOME
                        onLessonSelected()
                    },
                    onOpenLesson = onOpenLesson,
                )
                HomeTab.PROFILE -> ProfileTabContent(
                    prefs = prefs,
                    onEditProfile = onEditProfile,
                    onChangeLanguage = onChangeLanguage,
                    onSignOut = onSignOut,
                )
            }
        }
    }
}

@Composable
private fun GradeSubjectBar(
    grades: List<Int>,
    subjects: List<String>,
    selectedGrade: Int,
    selectedSubject: String,
    onGrade: (Int) -> Unit,
    onSubject: (String) -> Unit,
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = BorderStroke(1.dp, SeasideBorder),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                grades.forEach { g ->
                    FilterChip(
                        selected = g == selectedGrade,
                        onClick = { onGrade(g) },
                        label = { Text(if (g == 0) "KG" else g.toString(), fontSize = 13.sp) },
                    )
                }
            }
            if (selectedGrade != 0 && subjects.isNotEmpty()) {
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    subjects.forEach { sub ->
                        FilterChip(
                            selected = sub == selectedSubject,
                            onClick = { onSubject(sub) },
                            label = { Text(sub.replaceFirstChar { it.uppercase() }, fontSize = 13.sp) },
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun HomeTabContent(
    s: AppStrings,
    available: Boolean,
    currentLesson: LessonItem?,
    nextLesson: LessonItem?,
    lang: String,
    planStorage: PlanStorage,
    savedPlanDay: Int?,
    recentPlans: List<PlanRef>,
    onPickLesson: () -> Unit,
    onQuickPlan: (String, Int) -> Unit,
    onFlashcards: (String) -> Unit,
    onViewPlan: (String, Int) -> Unit,
    onOpenLesson: (String) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(NavBg)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        if (!available) {
            InfoBannerCard(s.comingSoon, s.comingSoonBody)
        } else if (currentLesson == null) {
            InfoBannerCard(s.setCurrentLesson, s.setCurrentLessonBody)
            PrimaryButton(text = s.goToRoadmap, onClick = onPickLesson)
        } else {
            HighlightLessonCard(
                label = s.current,
                title = currentLesson.title(lang),
                subtitle = "${currentLesson.id} · ${currentLesson.en}",
                meta = "${s.unitLabel} ${currentLesson.unit} · ${s.pagesLabel} ${currentLesson.pages} · ${currentLesson.days} ${s.daysLabel}",
                highlight = true,
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                PrimaryButton(
                    text = s.planLesson,
                    onClick = {
                        val day = currentLesson.let {
                            PlanProgressHelper.getFirstUnplannedDay(it.id, it.days, planStorage) ?: 1
                        }
                        onQuickPlan(currentLesson.id, day)
                    },
                    modifier = Modifier.weight(1f),
                )
                Button(
                    onClick = { onFlashcards(currentLesson.id) },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = PrimaryDark),
                ) {
                    Text(s.flashcardsBtn, fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }
            }
            if (savedPlanDay != null) {
                TextButton(onClick = { onViewPlan(currentLesson.id, savedPlanDay) }, modifier = Modifier.fillMaxWidth()) {
                    Text(s.viewPlan, color = AccentTeal, fontWeight = FontWeight.Medium)
                }
            }
            TextButton(onClick = { onOpenLesson(currentLesson.id) }, modifier = Modifier.fillMaxWidth()) {
                Text(s.viewLessonProgress, color = AccentTeal, fontWeight = FontWeight.Medium)
            }
            if (recentPlans.isNotEmpty()) {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, SeasideBorder),
                ) {
                    Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(s.myPlans, fontWeight = FontWeight.SemiBold, color = PrimarySteel, fontSize = 14.sp)
                        recentPlans.forEach { ref ->
                            TextButton(
                                onClick = { onViewPlan(ref.lessonId, ref.day) },
                                modifier = Modifier.fillMaxWidth(),
                            ) {
                                Text(
                                    "${ref.lessonId} · ${s.dayLabel} ${ref.day}",
                                    color = PrimaryDark,
                                    fontSize = 13.sp,
                                    modifier = Modifier.fillMaxWidth(),
                                )
                            }
                        }
                    }
                }
            }
            nextLesson?.let {
                HighlightLessonCard(
                    label = s.upNext,
                    title = it.title(lang),
                    subtitle = "${it.id} · ${it.en}",
                    meta = "${s.unitLabel} ${it.unit} · ${s.pagesLabel} ${it.pages} · ${it.days} ${s.daysLabel}",
                    highlight = false,
                )
            }
        }
    }
}

@Composable
private fun RoadmapTabContent(
    s: AppStrings,
    lessons: List<LessonItem>,
    available: Boolean,
    currentId: String,
    pickCurrent: Boolean,
    lang: String,
    planStorage: PlanStorage,
    plansRevision: Int,
    onSelectCurrent: (String) -> Unit,
    onOpenLesson: (String) -> Unit,
) {
    if (!available) {
        InfoBannerCard(s.comingSoon, s.comingSoonBody, modifier = Modifier.padding(16.dp))
        return
    }
    if (pickCurrent) {
        InfoBannerCard(s.tapLessonNow, "", modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp))
    }
    LazyColumn(
        modifier = Modifier.fillMaxSize().background(NavBg),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        val units = lessons.map { it.unit }.distinct().sorted()
        units.forEach { unit ->
            item {
                Text(
                    "${s.unitLabel} $unit",
                    fontWeight = FontWeight.Bold,
                    fontSize = 12.sp,
                    color = PrimarySteel.copy(0.55f),
                    modifier = Modifier.padding(vertical = 4.dp, horizontal = 4.dp),
                )
            }
            items(lessons.filter { it.unit == unit }) { lesson ->
                val selected = lesson.id == currentId
                val lessonStatus = remember(lesson.id, plansRevision) {
                    PlanProgressHelper.getLessonStatus(lesson.id, lesson.days, planStorage)
                }
                Card(
                    modifier = Modifier.fillMaxWidth().clickable {
                        if (pickCurrent) onSelectCurrent(lesson.id) else onOpenLesson(lesson.id)
                    },
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = if (selected) AccentTeal else Color.White),
                    border = BorderStroke(1.dp, if (selected) AccentTeal else SeasideBorder),
                    elevation = CardDefaults.cardElevation(defaultElevation = if (selected) 0.dp else 1.dp),
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Text(lesson.title(lang), fontWeight = FontWeight.Bold, fontSize = 15.sp, color = if (selected) androidx.compose.ui.graphics.Color.White else PrimaryDark, modifier = Modifier.weight(1f))
                            Text(
                                PlanProgressHelper.lessonStatusIcon(lessonStatus),
                                fontSize = 16.sp,
                                color = if (selected) androidx.compose.ui.graphics.Color.White else PrimaryDark,
                            )
                        }
                        Text("${lesson.id} · ${lesson.en}", fontSize = 12.sp, color = if (selected) androidx.compose.ui.graphics.Color.White.copy(0.85f) else PrimaryDark.copy(0.55f))
                        Text("${s.unitLabel} ${lesson.unit} · ${s.pagesLabel} ${lesson.pages} · ${lesson.days} ${s.daysLabel}", fontSize = 11.sp, color = if (selected) androidx.compose.ui.graphics.Color.White.copy(0.7f) else PrimaryDark.copy(0.4f))
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ProfileTabContent(
    prefs: UserPreferences,
    onEditProfile: () -> Unit,
    onChangeLanguage: () -> Unit,
    onSignOut: () -> Unit,
) {
    val s = LocalAppStrings.current
    val lang = LocalAppLanguage.current
    val languageLabel = IndianLanguages.options.find { it.value == lang }?.label ?: lang
    val teacherFallback = when (lang) {
        "mr" -> "शिक्षक"
        "hi" -> "शिक्षक"
        "ur" -> "استاد"
        else -> "Teacher"
    }
    val displayName = prefs.teacherName.ifBlank { teacherFallback }
    val initials = profileInitials(displayName)
    val stateLabel = IndiaStates.all.find { it.value == prefs.state }?.label ?: prefs.state
    val locationLabel = when (prefs.location) {
        "urban" -> s.urban
        "semi_urban" -> s.semiUrban
        "rural" -> s.rural
        else -> prefs.location.ifBlank { "—" }
    }
    val comfortLabel = when (prefs.englishComfort) {
        "difficult" -> s.comfortLow
        "stumbling" -> s.comfortMed
        "comfortable" -> s.comfortHigh
        else -> prefs.englishComfort.ifBlank { "—" }
    }
    val mediumLabel = prefs.medium.replace('_', ' ').replaceFirstChar { it.uppercase() }
    val grades = prefs.getTeacherGrades()
    val subjects = prefs.getTeacherSubjects()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(NavBg),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(bottom = 24.dp),
    ) {
        item {
            ProfileHeroHeader(
                initials = initials,
                name = displayName,
                phone = prefs.phoneNumber,
                school = prefs.schoolName,
            )
        }

        item {
            ProfileSectionCard(title = s.whatYouTeach) {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(s.grades, fontSize = 12.sp, color = PrimarySteel.copy(0.7f), fontWeight = FontWeight.Medium)
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        grades.forEach { g ->
                            ProfileChip(text = if (g == 0) "KG" else g.toString())
                        }
                        if (grades.isEmpty()) ProfileChip(text = "—")
                    }
                    if (subjects.isNotEmpty()) {
                        Text(s.subjects, fontSize = 12.sp, color = PrimarySteel.copy(0.7f), fontWeight = FontWeight.Medium)
                        FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            subjects.forEach { sub ->
                                ProfileChip(text = sub.replaceFirstChar { it.uppercase() })
                            }
                        }
                    }
                    ProfileInfoRow(label = s.englishComfort, value = comfortLabel, showDivider = false)
                }
            }
        }

        item {
            ProfileSectionCard(title = s.whereYouWork) {
                ProfileInfoRow(label = s.labelState, value = stateLabel)
                ProfileInfoRow(label = s.labelDistrict, value = prefs.district.ifBlank { "—" })
                ProfileInfoRow(label = s.schoolMedium, value = mediumLabel, showDivider = false)
            }
        }

        item {
            ProfileSectionCard(title = s.schoolDetails) {
                ProfileInfoRow(label = s.labelSchool, value = prefs.schoolName.ifBlank { "—" })
                ProfileInfoRow(label = s.locationType, value = locationLabel)
                ProfileInfoRow(
                    label = s.pinCode,
                    value = prefs.pinCode.ifBlank { "—" },
                    showDivider = false,
                )
            }
        }

        item {
            ProfileSectionCard(title = s.accountSettings) {
                ProfileActionRow(
                    label = s.changeLanguage,
                    value = languageLabel,
                    icon = Icons.Default.Language,
                    onClick = onChangeLanguage,
                    showDivider = false,
                )
                ProfileActionRow(
                    label = s.editProfile,
                    icon = Icons.Default.Edit,
                    onClick = onEditProfile,
                )
            }
        }

        item {
            Spacer(Modifier.height(8.dp))
            TextButton(
                onClick = onSignOut,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
            ) {
                Icon(
                    Icons.AutoMirrored.Filled.Logout,
                    contentDescription = null,
                    tint = Color(0xFFC62828),
                    modifier = Modifier.size(18.dp),
                )
                Spacer(Modifier.width(8.dp))
                Text(s.signOut, color = Color(0xFFC62828), fontWeight = FontWeight.SemiBold)
            }
        }
    }
}
