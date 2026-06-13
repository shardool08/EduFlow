package com.tippingpoint.pedastudio.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val LightColors = lightColorScheme(
    primary = AccentTeal,
    onPrimary = Color.White,
    secondary = PrimarySteel,
    onSecondary = Color.White,
    background = Color.White,
    surface = BgTint,
    onBackground = PrimaryDark,
    onSurface = PrimaryDark,
    outline = SeasideBorder,
)

@Composable
fun PedaStudioTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = LightColors,
        content = content,
    )
}
