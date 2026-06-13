package com.tippingpoint.pedastudio.auth

import android.app.Activity
import com.google.firebase.FirebaseException
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.PhoneAuthCredential
import com.google.firebase.auth.PhoneAuthOptions
import com.google.firebase.auth.PhoneAuthProvider
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.tasks.await
import java.util.concurrent.TimeUnit

sealed class LoginUiState {
    data object Idle : LoginUiState()
    data object Sending : LoginUiState()
    data object CodeSent : LoginUiState()
    data object Verifying : LoginUiState()
    data class Error(val message: String) : LoginUiState()
}

class PhoneAuthController {
    private val auth = FirebaseAuth.getInstance()
    private var verificationId: String? = null

    private val _state = MutableStateFlow<LoginUiState>(LoginUiState.Idle)
    val state: StateFlow<LoginUiState> = _state.asStateFlow()

    val userId: String? get() = auth.currentUser?.uid

    val isLoggedIn: Boolean get() = auth.currentUser != null

    suspend fun getIdToken(): String? = runCatching {
        auth.currentUser?.getIdToken(false)?.await()?.token
    }.getOrNull()

    fun sendOtp(activity: Activity, phoneDigits: String) {
        if (phoneDigits.length != 10) {
            _state.value = LoginUiState.Error("Enter a valid 10-digit mobile number")
            return
        }
        _state.value = LoginUiState.Sending
        val phone = "+91$phoneDigits"

        val callbacks = object : PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
            override fun onVerificationCompleted(credential: PhoneAuthCredential) {
                signInWithCredential(credential)
            }

            override fun onVerificationFailed(e: FirebaseException) {
                _state.value = LoginUiState.Error(friendlyMessage(e))
            }

            override fun onCodeSent(
                vid: String,
                token: PhoneAuthProvider.ForceResendingToken,
            ) {
                verificationId = vid
                _state.value = LoginUiState.CodeSent
            }
        }

        val options = PhoneAuthOptions.newBuilder(auth)
            .setPhoneNumber(phone)
            .setTimeout(60L, TimeUnit.SECONDS)
            .setActivity(activity)
            .setCallbacks(callbacks)
            .build()
        PhoneAuthProvider.verifyPhoneNumber(options)
    }

    fun verifyOtp(code: String) {
        val vid = verificationId
        if (vid.isNullOrBlank()) {
            _state.value = LoginUiState.Error("Request OTP again")
            return
        }
        if (code.length < 6) {
            _state.value = LoginUiState.Error("Enter 6-digit OTP")
            return
        }
        _state.value = LoginUiState.Verifying
        val credential = PhoneAuthProvider.getCredential(vid, code)
        signInWithCredential(credential)
    }

    private fun signInWithCredential(credential: PhoneAuthCredential) {
        auth.signInWithCredential(credential)
            .addOnSuccessListener {
                _state.value = LoginUiState.Idle
            }
            .addOnFailureListener { e ->
                _state.value = LoginUiState.Error(friendlyMessage(e))
            }
    }

    fun resetError() {
        if (_state.value is LoginUiState.Error) {
            _state.value = LoginUiState.Idle
        }
    }

    fun signOut() {
        auth.signOut()
        verificationId = null
        _state.value = LoginUiState.Idle
    }

    private fun friendlyMessage(e: Exception): String {
        return when {
            e.message?.contains("invalid-phone-number", true) == true ->
                "Invalid mobile number"
            e.message?.contains("too-many-requests", true) == true ->
                "Too many attempts. Wait and try again."
            e.message?.contains("invalid-verification-code", true) == true ->
                "Invalid OTP"
            e.message?.contains("quota-exceeded", true) == true ->
                "SMS limit reached"
            else -> e.message ?: "Could not sign in. Use Firebase test number 9876543210 / OTP 123456"
        }
    }
}
