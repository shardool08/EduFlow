package com.tippingpoint.pedastudio.i18n

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.compositionLocalOf
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.LayoutDirection

val LocalAppStrings = compositionLocalOf<AppStrings> { Translations.EN }
val LocalAppLanguage = compositionLocalOf<String> { "en" }

@Composable
fun AppLanguageProvider(
    language: String,
    content: @Composable () -> Unit,
) {
    val strings = remember(language) { Translations.forCode(language) }
    val layoutDirection = if (language == "ur") LayoutDirection.Rtl else LayoutDirection.Ltr

    CompositionLocalProvider(
        LocalAppStrings provides strings,
        LocalAppLanguage provides language,
        LocalLayoutDirection provides layoutDirection,
    ) {
        content()
    }
}
