package com.tippingpoint.pedastudio.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tippingpoint.pedastudio.auth.LoginUiState
import com.tippingpoint.pedastudio.auth.PhoneAuthController
import com.tippingpoint.pedastudio.i18n.LocalAppStrings
import com.tippingpoint.pedastudio.ui.components.AppBrandHeader
import com.tippingpoint.pedastudio.ui.components.OnboardingCard
import com.tippingpoint.pedastudio.ui.components.OnboardingScreenLayout
import com.tippingpoint.pedastudio.ui.components.PrimaryButton
import com.tippingpoint.pedastudio.ui.theme.AccentTeal
import com.tippingpoint.pedastudio.ui.theme.PrimaryDark
import com.tippingpoint.pedastudio.ui.theme.SeasideBorder
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.foundation.shape.RoundedCornerShape

@Composable
fun LoginScreen(
    auth: PhoneAuthController,
    onSendOtp: (String) -> Unit,
    onVerifyOtp: (String) -> Unit,
    onSuccess: (String) -> Unit,
) {
    var phone by remember { mutableStateOf("") }
    var otp by remember { mutableStateOf("") }
    var otpSent by remember { mutableStateOf(false) }
    val state by auth.state.collectAsState()
    val s = LocalAppStrings.current

    LaunchedEffect(state) {
        if (state is LoginUiState.CodeSent) otpSent = true
    }

    LaunchedEffect(auth.isLoggedIn, state) {
        if (auth.isLoggedIn && state !is LoginUiState.Verifying && state !is LoginUiState.Sending) {
            onSuccess(phone)
        }
    }

    val fieldColors = OutlinedTextFieldDefaults.colors(
        focusedBorderColor = AccentTeal,
        unfocusedBorderColor = SeasideBorder,
        focusedLabelColor = AccentTeal,
        cursorColor = AccentTeal,
    )

    OnboardingScreenLayout {
        AppBrandHeader(subtitle = s.enterMobile)
        Spacer(Modifier.height(24.dp))

        OnboardingCard {
            if (!otpSent) {
                Text(
                    text = s.enterMobile,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = PrimaryDark,
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Text("+91", fontWeight = FontWeight.SemiBold, color = PrimaryDark, modifier = Modifier.padding(end = 8.dp))
                    OutlinedTextField(
                        value = phone,
                        onValueChange = { v ->
                            phone = v.filter { it.isDigit() }.take(10)
                            auth.resetError()
                        },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("9876543210") },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        singleLine = true,
                        shape = RoundedCornerShape(12.dp),
                        colors = fieldColors,
                    )
                }
            } else {
                Text(
                    text = "+91 $phone",
                    fontSize = 14.sp,
                    color = PrimaryDark.copy(alpha = 0.7f),
                )
                OutlinedTextField(
                    value = otp,
                    onValueChange = { v ->
                        otp = v.filter { it.isDigit() }.take(6)
                        auth.resetError()
                        if (otp.length == 6) onVerifyOtp(otp)
                    },
                    modifier = Modifier.fillMaxWidth(),
                    label = { Text(s.otpPlaceholder) },
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    colors = fieldColors,
                )
            }

            if (state is LoginUiState.Error) {
                Text(
                    text = (state as LoginUiState.Error).message,
                    color = Color(0xFFC62828),
                    fontSize = 13.sp,
                )
            }

            val loading = state is LoginUiState.Sending || state is LoginUiState.Verifying
            PrimaryButton(
                text = if (!otpSent) s.sendOtp else s.verifyOtp,
                onClick = { if (!otpSent) onSendOtp(phone) else onVerifyOtp(otp) },
                enabled = !loading && if (!otpSent) phone.length == 10 else otp.length == 6,
            )

            if (loading) {
                CircularProgressIndicator(
                    modifier = Modifier.width(24.dp).height(24.dp).align(Alignment.CenterHorizontally),
                    strokeWidth = 2.dp,
                    color = AccentTeal,
                )
            }
        }
    }
}
