package com.tippingpoint.pedastudio

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.tippingpoint.pedastudio.auth.PhoneAuthController
import com.tippingpoint.pedastudio.data.CurriculumRepository
import com.tippingpoint.pedastudio.data.FirestoreRepository
import com.tippingpoint.pedastudio.data.FlashcardRepository
import com.tippingpoint.pedastudio.data.MaharashtraRepository
import com.tippingpoint.pedastudio.data.PlanStorage
import com.tippingpoint.pedastudio.data.TlmResourceCatalog
import com.tippingpoint.pedastudio.data.UserPreferences
import com.tippingpoint.pedastudio.i18n.AppLanguageProvider
import com.tippingpoint.pedastudio.navigation.Routes
import com.tippingpoint.pedastudio.ui.screens.EditProfileScreen
import com.tippingpoint.pedastudio.ui.screens.FlashcardsScreen
import com.tippingpoint.pedastudio.ui.screens.LanguageScreen
import com.tippingpoint.pedastudio.ui.screens.LessonDetailScreen
import com.tippingpoint.pedastudio.ui.screens.LoginScreen
import com.tippingpoint.pedastudio.ui.screens.MainHomeScreen
import com.tippingpoint.pedastudio.ui.screens.PlanViewScreen
import com.tippingpoint.pedastudio.ui.screens.QuickPlanScreen
import com.tippingpoint.pedastudio.ui.screens.RegisterStep2Screen
import com.tippingpoint.pedastudio.ui.screens.RegisterStep3Screen
import kotlinx.coroutines.launch

@Composable
fun PedaStudioApp(auth: PhoneAuthController) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val prefs = remember { UserPreferences(context.applicationContext) }
    val curriculum = remember { CurriculumRepository(context.applicationContext) }
    val maharashtra = remember { MaharashtraRepository(context.applicationContext) }
    val planStorage = remember { PlanStorage(context.applicationContext) }
    val flashcards = remember { FlashcardRepository(context.applicationContext) }
    val tlmCatalog = remember { TlmResourceCatalog(context.applicationContext) }
    val firestore = remember { FirestoreRepository(tlmCatalog) }
    val nav = rememberNavController()
    var language by remember { mutableStateOf(prefs.language) }
    var plansRevision by remember { mutableIntStateOf(0) }

    LaunchedEffect(auth.isLoggedIn) {
        if (auth.isLoggedIn) {
            firestore.ensureCatalogSeeded()
            firestore.pullProfile(prefs).onSuccess { pulled ->
                if (pulled) language = prefs.language
            }
            firestore.syncAllPlans(planStorage).onSuccess { plansRevision++ }
            firestore.loadTlmImageUrls().let { tlmCatalog.applyRemoteImageUrls(it) }
        }
    }

    val start = when {
        auth.isLoggedIn && prefs.profileComplete -> Routes.HOME
        auth.isLoggedIn -> Routes.REGISTER_STEP2
        else -> Routes.LANGUAGE
    }

    AppLanguageProvider(language = language) {
        NavHost(navController = nav, startDestination = start) {
            composable(Routes.LANGUAGE) {
                LanguageScreen(
                    selected = language,
                    onSelectedChange = {
                        language = it
                        prefs.language = it
                    },
                    onContinue = {
                        nav.navigate(Routes.LOGIN) {
                            popUpTo(Routes.LANGUAGE) { inclusive = true }
                        }
                    },
                )
            }
            composable(Routes.LOGIN) {
                val activity = context as MainActivity
                LoginScreen(
                    auth = auth,
                    onSendOtp = { phone -> auth.sendOtp(activity, phone) },
                    onVerifyOtp = { code -> auth.verifyOtp(code) },
                    onSuccess = { phone ->
                        if (phone != "verified") prefs.phoneNumber = phone.filter { it.isDigit() }.takeLast(10)
                        val dest = if (prefs.profileComplete) Routes.HOME else Routes.REGISTER_STEP2
                        nav.navigate(dest) {
                            popUpTo(Routes.LOGIN) { inclusive = true }
                        }
                    },
                )
            }
            composable(Routes.REGISTER_STEP2) {
                RegisterStep2Screen(prefs = prefs, maharashtra = maharashtra) {
                    nav.navigate(Routes.REGISTER_STEP3)
                }
            }
            composable(Routes.REGISTER_STEP3) {
                RegisterStep3Screen(
                    prefs = prefs,
                    maharashtra = maharashtra,
                    onBack = { nav.popBackStack() },
                ) {
                    scope.launch { firestore.pushProfile(prefs) }
                    nav.navigate(Routes.HOME) {
                        popUpTo(Routes.REGISTER_STEP2) { inclusive = true }
                    }
                }
            }
            composable(Routes.HOME) {
                MainHomeScreen(
                    prefs = prefs,
                    curriculum = curriculum,
                    planStorage = planStorage,
                    plansRevision = plansRevision,
                    onEditProfile = { nav.navigate(Routes.EDIT_PROFILE) },
                    onQuickPlan = { lessonId, day -> nav.navigate(Routes.quickPlan(lessonId, day)) },
                    onFlashcards = { lessonId -> nav.navigate(Routes.flashcards(lessonId)) },
                    onViewPlan = { lessonId, day -> nav.navigate(Routes.planView(lessonId, day)) },
                    onOpenLesson = { lessonId -> nav.navigate(Routes.lessonDetail(lessonId)) },
                    onChangeLanguage = { nav.navigate(Routes.CHANGE_LANGUAGE) },
                    onLessonSelected = { scope.launch { firestore.pushProfile(prefs) } },
                    onSignOut = {
                        auth.signOut()
                        val savedLang = prefs.language
                        prefs.clearSession()
                        prefs.language = savedLang
                        language = savedLang
                        nav.navigate(Routes.LANGUAGE) {
                            popUpTo(Routes.HOME) { inclusive = true }
                        }
                    },
                )
            }
            composable(Routes.EDIT_PROFILE) {
                EditProfileScreen(
                    prefs = prefs,
                    maharashtra = maharashtra,
                    onBack = { nav.popBackStack() },
                    onSaved = {
                        scope.launch { firestore.pushProfile(prefs) }
                        nav.popBackStack()
                    },
                )
            }
            composable(Routes.CHANGE_LANGUAGE) {
                LanguageScreen(
                    selected = language,
                    onSelectedChange = {
                        language = it
                        prefs.language = it
                    },
                    onContinue = {
                        scope.launch { firestore.pushProfile(prefs) }
                        nav.popBackStack()
                    },
                    fromProfile = true,
                    onBack = { nav.popBackStack() },
                )
            }
            composable(
                route = Routes.QUICK_PLAN,
                arguments = listOf(
                    navArgument("lessonId") { type = NavType.StringType },
                    navArgument("day") { type = NavType.IntType; defaultValue = 1 },
                ),
            ) { entry ->
                val lessonId = Routes.decodeLessonId(entry.arguments?.getString("lessonId")) ?: return@composable
                val day = entry.arguments?.getInt("day") ?: 1
                QuickPlanScreen(
                    lessonId = lessonId,
                    initialDay = day,
                    prefs = prefs,
                    curriculum = curriculum,
                    planStorage = planStorage,
                    tlmCatalog = tlmCatalog,
                    firestore = firestore,
                    auth = auth,
                    onBack = { nav.popBackStack() },
                    onPlanReady = { id, readyDay ->
                        plansRevision++
                        nav.navigate(Routes.planView(id, readyDay)) {
                            popUpTo(Routes.quickPlan(id, day)) { inclusive = true }
                        }
                    },
                )
            }
            composable(
                route = Routes.PLAN_VIEW,
                arguments = listOf(
                    navArgument("lessonId") { type = NavType.StringType },
                    navArgument("day") { type = NavType.IntType },
                ),
            ) { entry ->
                val lessonId = Routes.decodeLessonId(entry.arguments?.getString("lessonId")) ?: return@composable
                val day = entry.arguments?.getInt("day") ?: 1
                PlanViewScreen(
                    lessonId = lessonId,
                    day = day,
                    curriculum = curriculum,
                    planStorage = planStorage,
                    firestore = firestore,
                    tlmCatalog = tlmCatalog,
                    onBack = { nav.popBackStack() },
                    onProgressChanged = { plansRevision++ },
                    onOpenLessonProgress = { nav.navigate(Routes.lessonDetail(lessonId)) },
                )
            }
            composable(
                route = Routes.LESSON_DETAIL,
                arguments = listOf(navArgument("lessonId") { type = NavType.StringType }),
            ) { entry ->
                val lessonId = Routes.decodeLessonId(entry.arguments?.getString("lessonId")) ?: return@composable
                LessonDetailScreen(
                    lessonId = lessonId,
                    curriculum = curriculum,
                    planStorage = planStorage,
                    firestore = firestore,
                    plansRevision = plansRevision,
                    onBack = { nav.popBackStack() },
                    onQuickPlan = { id, day -> nav.navigate(Routes.quickPlan(id, day)) },
                    onViewPlan = { id, d -> nav.navigate(Routes.planView(id, d)) },
                    onProgressChanged = { plansRevision++ },
                )
            }
            composable(
                route = Routes.FLASHCARDS,
                arguments = listOf(navArgument("lessonId") { type = NavType.StringType }),
            ) { entry ->
                val lessonId = Routes.decodeLessonId(entry.arguments?.getString("lessonId")) ?: return@composable
                FlashcardsScreen(
                    lessonId = lessonId,
                    flashcards = flashcards,
                    firestore = firestore,
                    onBack = { nav.popBackStack() },
                )
            }
        }
    }
}
