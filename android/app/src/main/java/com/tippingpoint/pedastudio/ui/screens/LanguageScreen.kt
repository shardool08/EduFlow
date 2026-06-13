package com.tippingpoint.pedastudio.ui.screens

import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tippingpoint.pedastudio.data.IndianLanguages
import com.tippingpoint.pedastudio.i18n.LocalAppStrings
import com.tippingpoint.pedastudio.ui.components.AppBrandHeader
import com.tippingpoint.pedastudio.ui.components.DropdownPicker
import com.tippingpoint.pedastudio.ui.components.OnboardingCard
import com.tippingpoint.pedastudio.ui.components.OnboardingScreenLayout
import com.tippingpoint.pedastudio.ui.components.PrimaryButton
import com.tippingpoint.pedastudio.ui.components.SimpleScreenScaffold
import com.tippingpoint.pedastudio.ui.theme.PrimaryDark

@Composable
fun LanguageScreen(
    selected: String,
    onSelectedChange: (String) -> Unit,
    onContinue: () -> Unit,
    fromProfile: Boolean = false,
    onBack: (() -> Unit)? = null,
) {
    val s = LocalAppStrings.current
    val languageOptions = remember {
        IndianLanguages.options.map { it.value to it.label }
    }

    if (fromProfile) {
        SimpleScreenScaffold(
            title = s.changeLanguage,
            subtitle = s.appLanguage,
            onBack = onBack,
            bottomBar = {
                Surface(color = Color.White, shadowElevation = 8.dp, tonalElevation = 2.dp) {
                    PrimaryButton(
                        text = s.saveProfile,
                        onClick = onContinue,
                        modifier = Modifier
                            .navigationBarsPadding()
                            .padding(horizontal = 20.dp, vertical = 12.dp),
                    )
                }
            },
        ) {
            OnboardingCard {
                DropdownPicker(
                    label = s.appLanguage,
                    options = languageOptions,
                    selectedValue = selected,
                    onSelect = onSelectedChange,
                    placeholder = s.selectLanguage,
                    searchable = true,
                )
                Text(
                    text = s.translationsComingSoon,
                    fontSize = 12.sp,
                    color = PrimaryDark.copy(alpha = 0.45f),
                    lineHeight = 16.sp,
                )
            }
        }
    } else {
        OnboardingScreenLayout {
            AppBrandHeader(subtitle = s.chooseLanguage)
            Spacer(Modifier.height(24.dp))
            OnboardingCard {
                DropdownPicker(
                    label = s.appLanguage,
                    options = languageOptions,
                    selectedValue = selected,
                    onSelect = onSelectedChange,
                    placeholder = s.selectLanguage,
                    searchable = true,
                )
            }
            Spacer(Modifier.height(20.dp))
            PrimaryButton(text = s.continueBtn, onClick = onContinue)
            Text(
                text = s.translationsComingSoon,
                modifier = Modifier.padding(top = 12.dp),
                fontSize = 11.sp,
                color = PrimaryDark.copy(alpha = 0.45f),
                textAlign = TextAlign.Center,
            )
        }
    }
}
