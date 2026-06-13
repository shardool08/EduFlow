package com.tippingpoint.pedastudio

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.tippingpoint.pedastudio.auth.PhoneAuthController
import com.tippingpoint.pedastudio.ui.theme.PedaStudioTheme

class MainActivity : ComponentActivity() {
    private val phoneAuth = PhoneAuthController()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            PedaStudioTheme {
                Surface(modifier = Modifier.fillMaxSize()) {
                    PedaStudioApp(auth = phoneAuth)
                }
            }
        }
    }
}
