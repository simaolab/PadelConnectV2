<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'login' => [
                'required',
                'string',
                //If is email we validate it like one, else we validate it like a username
                $this->isEmailLogin() ? 'email' : 'alpha_num',
            ],
            'password' => ['required', 'string', 'min:8'],
            'remember' => ['boolean'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials using either email or username.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        //Verifies if the user is not 'blocked'
        $this->ensureIsNotRateLimited();

        //Verifies if we want to use the credential email or username
        $credentials = [
            $this->isEmailLogin() ? 'email' : 'username' => $this->input('login'),
            'password' => $this->input('password')
        ];

        // Attempts to log in with the provided credentials and 'remember' status.
        if (!Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            // Throw a validation exception if authentication fails, with a failed login message.
            throw ValidationException::withMessages([
                'login' => __('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    // Check if the login input is email or username
    private function isEmailLogin(): bool
    {
        // filter_var is a PHP function that verifies if the login input is a valid email
        // filter_var returns false, then lets suppose that user inputs a username
        // filter_var is email then returns email
        return filter_var($this->input('login'), FILTER_VALIDATE_EMAIL) !== false;
    }

    /**
     * Ensure the login request is not rate limited.
     */
    public function ensureIsNotRateLimited(): void
    {
        // Check if the user has exceeded the allowed login attempts (in this case, 5).
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        // Trigger a Lockout event if the user has exceeded login attempts.
        event(new Lockout($this));

        // Calculate the remaining lockout time in seconds.
        $seconds = RateLimiter::availableIn($this->throttleKey());

        // Throw a validation exception to notify the user they are locked out, including the time left.
        throw ValidationException::withMessages([
            'login' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        // Creates a unique key for each user based on their login (email/username) and IP address.
        // This helps track login attempts per user and device for rate-limiting purposes.
        return Str::transliterate(Str::lower($this->input('login')).'|'.$this->ip());
    }
}
